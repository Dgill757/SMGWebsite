"""Durable Jarvis action store with an in-memory-compatible Supabase adapter."""

from __future__ import annotations

import os
from typing import Any

import httpx


def _config() -> tuple[str, str]:
    return os.getenv("SUPABASE_URL", "").rstrip("/"), os.getenv("SUPABASE_KEY", "")


def _headers(prefer: str = "") -> dict[str, str]:
    _, key = _config()
    headers = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    if prefer:
        headers["Prefer"] = prefer
    return headers


def _row(task: dict[str, Any]) -> dict[str, Any]:
    return {key: task.get(key) for key in (
        "id", "trace_id", "actor", "channel", "tool", "arguments", "risk", "executor",
        "idempotency_key", "status", "preview", "result", "error", "approved_at",
        "completed_at", "expires_at", "created_at", "updated_at",
    ) if task.get(key) is not None}


async def save_task(task: dict[str, Any]) -> bool:
    url, key = _config()
    if not url or not key:
        return False
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            response = await client.post(
                f"{url}/rest/v1/jarvis_connector_tasks",
                headers=_headers("resolution=merge-duplicates,return=minimal"),
                params={"on_conflict": "id"}, json=_row(task),
            )
        return response.status_code in (200, 201, 204)
    except Exception:
        return False


async def load_task(task_id: str) -> dict[str, Any] | None:
    url, key = _config()
    if not url or not key:
        return None
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            response = await client.get(
                f"{url}/rest/v1/jarvis_connector_tasks",
                headers=_headers(), params={"id": f"eq.{task_id}", "limit": "1"},
            )
        rows = response.json() if response.status_code == 200 else []
        return rows[0] if rows else None
    except Exception:
        return None


async def list_tasks(limit: int = 50, status: str | None = None) -> list[dict[str, Any]]:
    url, key = _config()
    if not url or not key:
        return []
    params = {"order": "created_at.desc", "limit": str(min(max(limit, 1), 200))}
    if status:
        params["status"] = f"eq.{status}"
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            response = await client.get(f"{url}/rest/v1/jarvis_connector_tasks", headers=_headers(), params=params)
        return response.json() if response.status_code == 200 else []
    except Exception:
        return []
