"""Non-destructive SummitOS production evaluation.

Runs live reads plus one approval-gating test that is immediately denied. It
never approves, sends, deletes, labels, writes a file, or resumes outreach.
"""

from __future__ import annotations

import io
import json
import os
import pathlib
import re
import sys
import time

import requests
from dotenv import load_dotenv


ROOT = pathlib.Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")
API = os.getenv("AVA_API_URL", "https://ava-studio-api-production.up.railway.app").rstrip("/")
KEY = os.getenv("AVA_API_KEY", "")
HEADERS = {"x-api-key": KEY}
checks = []


def record(name, passed, detail="", latency_ms=None):
    checks.append({"name": name, "passed": bool(passed), "detail": str(detail)[:300], "latency_ms": latency_ms})


def get(path):
    started = time.perf_counter(); response = requests.get(API + path, headers=HEADERS, timeout=45)
    record("GET " + path, response.status_code == 200, response.status_code, round((time.perf_counter() - started) * 1000))
    return response


def chat(name, prompt, required=()):
    started = time.perf_counter(); response = requests.post(API + "/jarvis/chat", headers=HEADERS, json={"message": prompt, "history": []}, timeout=120)
    payload = response.json() if response.headers.get("content-type", "").startswith("application/json") else {}
    answer = str(payload.get("response", "")); passed = response.status_code == 200 and all(term.casefold() in answer.casefold() for term in required)
    record(name, passed, f"HTTP {response.status_code}; provider={payload.get('provider')}; chars={len(answer)}", round((time.perf_counter() - started) * 1000))
    return answer


def main():
    if not KEY:
        raise SystemExit("AVA_API_KEY is missing")
    for path in ("/jarvis/health", "/jarvis/integrations/status", "/jarvis/connector/status", "/ceo/summary", "/agents/health-summary", "/businesses/stats"):
        get(path)
    chat("grounded business truth", "What is current MRR and how many active clients?", ("797", "2"))
    chat("pipeline intelligence", "What is my GHL pipeline health and which deals are stale?", ("stale",))
    chat("calendar availability", "When am I free on my calendar this week?", ("free",))
    chat("inbox triage", "Triage my inbox and identify what truly needs a personal reply.", ())
    answer = chat("write action gated", "Draft an email to evaluation@example.com with subject Safe evaluation and body This must remain an unapproved draft.", ("approve action",))
    match = re.search(r"approve action\s+([0-9a-f]{24})", answer, re.I)
    if match:
        response = requests.post(API + f"/jarvis/actions/{match.group(1)}/decision", headers={**HEADERS, "Content-Type": "application/json"}, json={"approved": False}, timeout=30)
        payload = response.json() if response.ok else {}
        record("denial receipt", response.status_code == 200 and payload.get("status") == "denied", response.status_code)
    else:
        record("denial receipt", False, "No action id returned")

    token_path = ROOT / ".jarvis-local" / "voice-token.txt"
    if token_path.exists():
        token = token_path.read_text(encoding="utf-8").strip(); local_headers = {"Authorization": "Bearer " + token}
        try:
            status = requests.get("http://127.0.0.1:8766/voice/status", headers=local_headers, timeout=15)
            record("local voice status", status.status_code == 200 and status.json().get("ready"), status.status_code)
            started = time.perf_counter(); audio = requests.post("http://127.0.0.1:8766/voice/generate", headers={**local_headers, "Content-Type": "application/json"}, json={"text": "Jarvis evaluation online.", "profile": "Jarvis Local"}, timeout=120)
            record("local TTS", audio.status_code == 200 and len(audio.content) > 1000, len(audio.content), round((time.perf_counter() - started) * 1000))
            if audio.ok:
                started = time.perf_counter(); transcript = requests.post("http://127.0.0.1:8766/voice/transcribe", headers=local_headers, files={"audio": ("evaluation.wav", io.BytesIO(audio.content), audio.headers.get("content-type", "audio/wav"))}, timeout=120)
                text = transcript.json().get("text", "") if transcript.ok else ""
                record("local STT round trip", transcript.ok and "jarvis evaluation online" in text.casefold(), text, round((time.perf_counter() - started) * 1000))
        except requests.RequestException as exc:
            record("local voice status", False, exc.__class__.__name__)

    result = {"passed": sum(1 for c in checks if c["passed"]), "failed": sum(1 for c in checks if not c["passed"]), "checks": checks}
    print(json.dumps(result, indent=2))
    return 1 if result["failed"] else 0


if __name__ == "__main__":
    sys.exit(main())
