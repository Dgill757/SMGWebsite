"""Windows-local JARVIS sidecar.

Runs only on loopback. It provides Ollama chat, vault retrieval, read-only file
tools, and a durable approval queue for any mutating action. The cloud connector
uses outbound polling, so no port on Dan's computer needs to be exposed.
"""

from __future__ import annotations

import fnmatch
import asyncio
import hashlib
import json
import os
import re
import secrets
import sqlite3
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

import httpx
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

ROOT = Path(__file__).resolve().parent
VAULT = Path(os.getenv("OBSIDIAN_VAULT", r"C:\Users\DanGi\SummitVault")).resolve()
STATE_DIR = Path(os.getenv("JARVIS_LOCAL_STATE", ROOT / ".jarvis-local")).resolve()
STATE_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = STATE_DIR / "jarvis-local.db"
TOKEN_PATH = STATE_DIR / "connector-token.txt"
if not TOKEN_PATH.exists():
    TOKEN_PATH.write_text(secrets.token_urlsafe(32), encoding="utf-8")
CONNECTOR_TOKEN = os.getenv("JARVIS_CONNECTOR_TOKEN") or TOKEN_PATH.read_text(encoding="utf-8").strip()
VOICE_TOKEN_PATH = STATE_DIR / "voice-token.txt"
if not VOICE_TOKEN_PATH.exists():
    VOICE_TOKEN_PATH.write_text(secrets.token_urlsafe(24), encoding="utf-8")
VOICE_TOKEN = VOICE_TOKEN_PATH.read_text(encoding="utf-8").strip()

DEFAULT_ROOTS = [
    VAULT,
    Path(r"C:\Users\DanGi\Downloads\SummitVoiceAI").resolve(),
    Path(r"C:\Users\DanGi\outreach").resolve(),
    Path(r"C:\Users\DanGi\scripts").resolve(),
]
APPROVED_ROOTS = [
    Path(value).resolve()
    for value in os.getenv("JARVIS_APPROVED_ROOTS", "").split(";") if value.strip()
] or DEFAULT_ROOTS

app = FastAPI(title="SummitOS JARVIS Local Connector", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://avastudio.summitvoiceai.com", "http://127.0.0.1:8765"],
    allow_methods=["*"], allow_headers=["*"],
)


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def db() -> sqlite3.Connection:
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    con.execute("""CREATE TABLE IF NOT EXISTS approvals (
        id TEXT PRIMARY KEY, action TEXT NOT NULL, arguments TEXT NOT NULL,
        preview TEXT NOT NULL, status TEXT NOT NULL, result TEXT,
        created_at TEXT NOT NULL, decided_at TEXT
    )""")
    con.execute("""CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT NOT NULL,
        detail TEXT NOT NULL, created_at TEXT NOT NULL
    )""")
    con.commit()
    return con


def require_local_token(authorization: str = Header(default="")):
    if not secrets.compare_digest(authorization, f"Bearer {CONNECTOR_TOKEN}"):
        raise HTTPException(401, "Invalid local connector token")


def require_voice_token(authorization: str = Header(default="")):
    if not secrets.compare_digest(authorization, f"Bearer {VOICE_TOKEN}"):
        raise HTTPException(401, "Invalid voice bridge token")


def safe_path(raw: str, *, must_exist: bool = True) -> Path:
    path = Path(raw).expanduser().resolve()
    if not any(path == root or root in path.parents for root in APPROVED_ROOTS):
        raise HTTPException(403, "Path is outside approved roots")
    if must_exist and not path.exists():
        raise HTTPException(404, "Path does not exist")
    return path


def audit(event: str, detail: dict):
    clean = json.dumps(detail, default=str)[:12000]
    with db() as con:
        con.execute("INSERT INTO audit_log(event,detail,created_at) VALUES(?,?,?)", (event, clean, utcnow()))
    log = VAULT / "10-Logs" / f"{datetime.now():%Y-%m-%d}.md"
    log.parent.mkdir(parents=True, exist_ok=True)
    with log.open("a", encoding="utf-8") as handle:
        handle.write(f"\n- {datetime.now():%H:%M:%S} `{event}` {clean}\n")


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=8000)
    history: list[dict[str, str]] = []
    memory_context: str = Field(default="", max_length=24000)


class ToolRequest(BaseModel):
    tool: Literal["list_directory", "read_file", "search_files", "processes", "git_status"]
    arguments: dict = {}


class ActionRequest(BaseModel):
    action: Literal["write_file", "run_command"]
    arguments: dict


class DecisionRequest(BaseModel):
    approved: bool

class SpeakRequest(BaseModel):
    text: str = Field(min_length=1, max_length=8000)
    profile: str | None = None


async def voicebox_profiles(client: httpx.AsyncClient) -> list[dict]:
    response = await client.get("http://127.0.0.1:17493/profiles")
    response.raise_for_status()
    payload = response.json()
    return payload.get("profiles", []) if isinstance(payload, dict) else payload


async def default_voicebox_profile(client: httpx.AsyncClient, requested: str | None = None) -> dict:
    profiles = await voicebox_profiles(client)
    if requested:
        match = next((p for p in profiles if p.get("id") == requested or p.get("name") == requested), None)
        if match:
            return match
    match = next((p for p in profiles if p.get("name") == "Jarvis Local"), None)
    if not match:
        match = next((p for p in profiles if p.get("default_engine") == "kokoro"), None)
    if not match:
        raise HTTPException(503, "No ready Voicebox profile found")
    return match


def core_context() -> str:
    parts = []
    for relative in ("00-Jarvis/identity.md", "00-Jarvis/rules.md", "01-Business/offer.md"):
        path = VAULT / relative
        if path.exists():
            parts.append(path.read_text(encoding="utf-8")[:8000])
    return "\n\n".join(parts)


@app.get("/health", dependencies=[Depends(require_local_token)])
async def health():
    ollama = False
    try:
        async with httpx.AsyncClient(timeout=2) as client:
            ollama = (await client.get("http://127.0.0.1:11434/api/tags")).status_code == 200
    except Exception:
        pass
    return {
        "status": "online", "ollama": ollama, "vault": str(VAULT),
        "approved_roots": [str(p) for p in APPROVED_ROOTS], "paused": (STATE_DIR / "PAUSED").exists(),
    }


@app.post("/chat", dependencies=[Depends(require_local_token)])
async def chat(req: ChatRequest):
    system = core_context()
    if req.memory_context:
        system += "\n\nRETRIEVED SUMMITOS MEMORY (use only when relevant):\n" + req.memory_context
    messages = [{"role": "system", "content": system}]
    messages.extend(req.history[-10:])
    messages.append({"role": "user", "content": req.message})
    payload = {
        "model": os.getenv("JARVIS_OLLAMA_MODEL", "llama3.2:3b"),
        "messages": messages,
        "stream": False,
        "think": False,
        "options": {"num_predict": 900, "temperature": 0.2, "num_ctx": 8192},
    }
    try:
        async with httpx.AsyncClient(timeout=150) as client:
            response = await client.post("http://127.0.0.1:11434/api/chat", json=payload)
            response.raise_for_status()
        answer = response.json()["message"]["content"].strip()
        audit("local_chat", {"model": payload["model"], "message_sha256": hashlib.sha256(req.message.encode()).hexdigest()})
        return {"response": answer, "provider": "ollama", "model": payload["model"]}
    except Exception as exc:
        raise HTTPException(503, f"Local model unavailable: {exc.__class__.__name__}")


@app.get("/memory/search", dependencies=[Depends(require_local_token)])
async def search_memory(q: str, limit: int = 12):
    query = q.casefold().strip()
    if not query:
        return {"results": []}
    tokens = {token for token in re.findall(r"[a-z0-9]{3,}", query) if token not in {"what", "when", "where", "which", "with", "that", "this", "from", "about", "tell", "show"}}
    truth_terms = {"current", "mrr", "revenue", "clients", "client", "business", "today", "now"}
    results = []
    for path in VAULT.rglob("*.md"):
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        lowered, path_lower = text.casefold(), str(path.relative_to(VAULT)).casefold()
        exact = lowered.count(query) + path.name.casefold().count(query) * 3
        token_score = sum(min(lowered.count(token), 8) for token in tokens) + sum(4 for token in tokens if token in path.name.casefold())
        authority = 0
        if path.name.casefold() == "current-business-state.md":
            authority = 100 if tokens & truth_terms else 20
        elif path.name.casefold() in {"revenue-math.md", "claude.md"}:
            authority = 12
        normalized_path = path_lower.replace("\\", "/")
        if any(folder in normalized_path for folder in ("reports/", "analytics/weekly/")) and tokens & truth_terms:
            authority -= 8
        score = exact * 4 + token_score + authority
        if score:
            indices = [lowered.find(term) for term in [query, *tokens] if lowered.find(term) >= 0]
            index = min(indices) if indices else 0
            results.append({"path": str(path.relative_to(VAULT)), "score": score, "authority": authority, "excerpt": text[max(0,index-180):index+420]})
    results.sort(key=lambda item: item["score"], reverse=True)
    return {"results": results[:max(1, min(limit, 30))]}


@app.get("/voice/status", dependencies=[Depends(require_voice_token)])
async def voice_status():
    try:
        async with httpx.AsyncClient(timeout=3) as client:
            response = await client.get("http://127.0.0.1:17493/profiles")
            response.raise_for_status()
        payload = response.json()
        profiles = payload.get("profiles", []) if isinstance(payload, dict) and "profiles" in payload else payload
        if isinstance(profiles, dict):
            ready = bool(profiles.get("default_engine"))
        else:
            ready = any(bool(profile.get("default_engine")) for profile in profiles if isinstance(profile, dict))
        return {"online": True, "ready": ready, "profiles": payload}
    except Exception as exc:
        return {"online": False, "ready": False, "error": exc.__class__.__name__, "setup": "Open Voicebox and download Kokoro plus Whisper Turbo"}


@app.post("/voice/speak", dependencies=[Depends(require_voice_token)])
async def voice_speak(req: SpeakRequest):
    payload = {"text": req.text}
    if req.profile:
        payload["profile"] = req.profile
    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post("http://127.0.0.1:17493/speak", headers={"X-Voicebox-Client-Id": "summitos-jarvis"}, json=payload)
        if response.status_code >= 400:
            raise HTTPException(503, f"Voicebox speak failed: HTTP {response.status_code}")
    audit("voice_speak", {"characters": len(req.text), "profile": req.profile})
    return {"ok": True}


@app.post("/voice/generate", dependencies=[Depends(require_voice_token)])
async def voice_generate(req: SpeakRequest):
    """Generate local neural audio for browser playback so barge-in can stop it."""
    async with httpx.AsyncClient(timeout=120) as client:
        profile = await default_voicebox_profile(client, req.profile)
        generated = await client.post("http://127.0.0.1:17493/generate", json={
            "profile_id": profile["id"], "text": req.text, "language": "en",
            "engine": profile.get("default_engine") or "kokoro", "normalize": True,
        })
        generated.raise_for_status()
        generation_id = generated.json()["id"]
        for _ in range(120):
            status = await client.get(f"http://127.0.0.1:17493/history/{generation_id}")
            if status.status_code == 404:
                await asyncio.sleep(.1)
                continue
            status.raise_for_status()
            state = status.json()
            if state.get("status") == "completed":
                audio = await client.get(f"http://127.0.0.1:17493/audio/{generation_id}")
                audio.raise_for_status()
                audit("voice_generate", {"characters": len(req.text), "profile": profile.get("name")})
                return Response(content=audio.content, media_type=audio.headers.get("content-type", "audio/wav"))
            if state.get("status") in ("failed", "cancelled"):
                raise HTTPException(503, state.get("error") or "Voice generation failed")
            await asyncio.sleep(.1)
    raise HTTPException(504, "Voice generation timed out")


@app.post("/voice/transcribe", dependencies=[Depends(require_voice_token)])
async def voice_transcribe(audio: UploadFile = File(...)):
    content = await audio.read()
    if len(content) > 25_000_000:
        raise HTTPException(413, "Audio exceeds 25 MB")
    async with httpx.AsyncClient(timeout=180) as client:
        response = await client.post(
            "http://127.0.0.1:17493/transcribe",
            files={"file": (audio.filename or "speech.webm", content, audio.content_type or "audio/webm")},
            data={"model": os.getenv("JARVIS_WHISPER_MODEL", "base"), "language": "en"},
        )
        if response.status_code >= 400:
            raise HTTPException(503, f"Voicebox transcription failed: HTTP {response.status_code}")
    result = response.json()
    audit("voice_transcribe", {"characters": len(result.get("text", "")), "duration": result.get("duration")})
    return result


@app.get("/assistant/memory", dependencies=[Depends(require_voice_token)])
async def assistant_memory(q: str, limit: int = 6):
    return await search_memory(q, limit)


@app.post("/assistant/chat", dependencies=[Depends(require_voice_token)])
async def assistant_chat(req: ChatRequest):
    return await chat(req)


@app.post("/tools/read", dependencies=[Depends(require_local_token)])
async def run_read_tool(req: ToolRequest):
    args = req.arguments
    if req.tool == "list_directory":
        path = safe_path(args["path"])
        result = [{"name": p.name, "type": "directory" if p.is_dir() else "file", "size": p.stat().st_size if p.is_file() else None} for p in list(path.iterdir())[:500]]
    elif req.tool == "read_file":
        path = safe_path(args["path"])
        if path.stat().st_size > 2_000_000:
            raise HTTPException(413, "File exceeds 2 MB read limit")
        result = {"path": str(path), "content": path.read_text(encoding="utf-8", errors="replace")}
    elif req.tool == "search_files":
        root = safe_path(args["path"]); pattern = args.get("pattern", "*")
        result = [str(p) for p in root.rglob("*") if p.is_file() and fnmatch.fnmatch(p.name, pattern)][:1000]
    elif req.tool == "processes":
        output = subprocess.run(["powershell", "-NoProfile", "-Command", "Get-Process | Select-Object -First 200 Name,Id,CPU | ConvertTo-Json"], capture_output=True, text=True, timeout=15, check=True)
        result = json.loads(output.stdout or "[]")
    else:
        path = safe_path(args["path"])
        output = subprocess.run(["git", "status", "--short", "--branch"], cwd=path, capture_output=True, text=True, timeout=15, check=True)
        result = output.stdout
    audit("read_tool", {"tool": req.tool, "arguments": args})
    return {"tool": req.tool, "result": result}


@app.post("/actions/request", dependencies=[Depends(require_local_token)])
async def request_action(req: ActionRequest):
    if (STATE_DIR / "PAUSED").exists():
        raise HTTPException(423, "Local actions are paused")
    if req.action == "write_file":
        path = safe_path(req.arguments["path"], must_exist=False)
        preview = f"Write {len(req.arguments.get('content',''))} characters to {path}"
    else:
        cwd = safe_path(req.arguments["cwd"])
        command = str(req.arguments.get("command", ""))
        forbidden = ("remove-item", "format-", "diskpart", "shutdown", "restart-computer", "rm -rf", "git reset --hard")
        if any(token in command.casefold() for token in forbidden):
            raise HTTPException(403, "Command is blocked by local safety policy")
        preview = f"Run in {cwd}: {command}"
    action_id = secrets.token_hex(12)
    with db() as con:
        con.execute("INSERT INTO approvals(id,action,arguments,preview,status,created_at) VALUES(?,?,?,?,?,?)", (action_id, req.action, json.dumps(req.arguments), preview, "pending", utcnow()))
    audit("approval_requested", {"id": action_id, "preview": preview})
    return {"id": action_id, "status": "pending", "preview": preview}


@app.get("/actions/pending", dependencies=[Depends(require_local_token)])
async def pending_actions():
    with db() as con:
        rows = con.execute("SELECT * FROM approvals WHERE status='pending' ORDER BY created_at").fetchall()
    return {"actions": [dict(row) for row in rows]}


@app.post("/actions/{action_id}/decision", dependencies=[Depends(require_local_token)])
async def decide_action(action_id: str, req: DecisionRequest):
    with db() as con:
        row = con.execute("SELECT * FROM approvals WHERE id=?", (action_id,)).fetchone()
        if not row or row["status"] != "pending":
            raise HTTPException(404, "Pending action not found")
        if not req.approved:
            con.execute("UPDATE approvals SET status='denied',decided_at=? WHERE id=?", (utcnow(), action_id))
            audit("approval_denied", {"id": action_id})
            return {"id": action_id, "status": "denied"}
        args = json.loads(row["arguments"])
        if row["action"] == "write_file":
            path = safe_path(args["path"], must_exist=False); path.parent.mkdir(parents=True, exist_ok=True); path.write_text(args.get("content", ""), encoding="utf-8"); result = f"Wrote {path}"
        else:
            cwd = safe_path(args["cwd"]); completed = subprocess.run(["powershell", "-NoProfile", "-Command", args["command"]], cwd=cwd, capture_output=True, text=True, timeout=min(int(args.get("timeout", 60)), 300)); result = (completed.stdout + completed.stderr)[-12000:]
        con.execute("UPDATE approvals SET status='executed',result=?,decided_at=? WHERE id=?", (result, utcnow(), action_id))
    audit("approval_executed", {"id": action_id, "action": row["action"]})
    return {"id": action_id, "status": "executed", "result": result}


@app.post("/pause", dependencies=[Depends(require_local_token)])
async def set_pause(paused: bool = True):
    marker = STATE_DIR / "PAUSED"
    marker.write_text(utcnow(), encoding="utf-8") if paused else marker.unlink(missing_ok=True)
    audit("local_pause", {"paused": paused})
    return {"paused": paused}


async def _connector_poll_loop():
    cloud_url = os.getenv("JARVIS_CLOUD_URL", "https://ava-studio-api-production.up.railway.app").rstrip("/")
    cloud_token = os.getenv("JARVIS_CONNECTOR_CLOUD_TOKEN", "")
    if not cloud_token:
        return
    cloud_headers = {"Authorization": f"Bearer {cloud_token}"}
    local_headers = {"Authorization": f"Bearer {CONNECTOR_TOKEN}"}
    local_url = f"http://127.0.0.1:{os.getenv('JARVIS_LOCAL_PORT', '8766')}"
    while True:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                await client.post(f"{cloud_url}/jarvis/connector/heartbeat", headers=cloud_headers, json={"hostname": os.environ.get("COMPUTERNAME", "windows"), "ollama_model": os.getenv("JARVIS_OLLAMA_MODEL", "llama3.2:3b"), "paused": (STATE_DIR / "PAUSED").exists()})
                response = await client.get(f"{cloud_url}/jarvis/connector/tasks/next", headers=cloud_headers)
                if response.status_code == 200:
                    task = response.json(); task_id = task["id"]
                    try:
                        if task["tool"] in ("list_directory", "read_file", "search_files", "processes", "git_status"):
                            executed = await client.post(f"{local_url}/tools/read", headers=local_headers, json={"tool": task["tool"], "arguments": task.get("arguments", {})})
                            executed.raise_for_status(); result = executed.json().get("result")
                        elif task["tool"] in ("write_file", "run_command"):
                            requested = await client.post(f"{local_url}/actions/request", headers=local_headers, json={"action": task["tool"], "arguments": task.get("arguments", {})})
                            requested.raise_for_status(); local_id = requested.json()["id"]
                            executed = await client.post(f"{local_url}/actions/{local_id}/decision", headers=local_headers, json={"approved": True})
                            executed.raise_for_status(); result = executed.json().get("result")
                        else:
                            raise ValueError("Tool is not installed in the local connector")
                        await client.post(f"{cloud_url}/jarvis/connector/tasks/{task_id}/result", headers=cloud_headers, json={"status": "completed", "result": result})
                    except Exception as exc:
                        await client.post(f"{cloud_url}/jarvis/connector/tasks/{task_id}/result", headers=cloud_headers, json={"status": "failed", "error": f"{exc.__class__.__name__}: {str(exc)[:500]}"})
        except Exception:
            pass
        await asyncio.sleep(3)


@app.on_event("startup")
async def start_cloud_connector():
    app.state.cloud_poll_task = asyncio.create_task(_connector_poll_loop())


@app.on_event("shutdown")
async def stop_cloud_connector():
    task = getattr(app.state, "cloud_poll_task", None)
    if task:
        task.cancel()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=int(os.getenv("JARVIS_LOCAL_PORT", "8766")))
