"""Bounded external integrations for SummitOS JARVIS.

Every function returns observed API data or raises IntegrationUnavailable. Secrets
remain in Railway. Mutating functions are deliberately separate from reads so the
caller can require approval and idempotency before invoking them.
"""

from __future__ import annotations

import asyncio
import os
from datetime import datetime, timedelta, timezone
from typing import Any

import httpx


class IntegrationUnavailable(RuntimeError):
    pass


def integration_status() -> dict[str, dict[str, Any]]:
    google = all(os.getenv(k) for k in ("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"))
    return {
        "summitos": {"ready": bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_KEY")), "capabilities": ["brief", "clients", "agents", "leads"]},
        "ghl": {"ready": bool(os.getenv("GHL_PRIVATE_TOKEN") and os.getenv("GHL_LOCATION_ID")), "capabilities": ["contacts", "pipelines", "conversations"]},
        "web_research": {"ready": bool(os.getenv("FIRECRAWL_API_KEY")), "capabilities": ["search", "scrape"]},
        "google_calendar": {"ready": google, "capabilities": ["upcoming_events", "availability", "create_event"]},
        "gmail": {"ready": google, "capabilities": ["search", "read", "draft", "send"]},
        "google_drive": {"ready": google, "capabilities": ["search", "read"]},
        "slack": {"ready": bool(os.getenv("SLACK_BOT_TOKEN") or os.getenv("SLACK_WEBHOOK_URL")), "capabilities": ["read", "send"]},
        "local_computer": {"ready": True, "capabilities": ["files", "git", "processes", "approved_commands"]},
    }


async def _request_with_retry(method: str, url: str, **kwargs) -> httpx.Response:
    last: Exception | None = None
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=25) as client:
                response = await client.request(method, url, **kwargs)
            response.raise_for_status()
            return response
        except (httpx.HTTPError, TimeoutError) as exc:
            last = exc
            if attempt < 2:
                await asyncio.sleep(5)
    raise IntegrationUnavailable(f"API request failed after three attempts: {last.__class__.__name__ if last else 'unknown'}")


def _ghl_headers() -> dict[str, str]:
    token = os.getenv("GHL_PRIVATE_TOKEN", "")
    if not token:
        raise IntegrationUnavailable("GHL_PRIVATE_TOKEN is not configured")
    return {"Authorization": f"Bearer {token}", "Version": "2021-07-28", "Content-Type": "application/json"}


async def ghl_pipelines() -> dict:
    location = os.getenv("GHL_LOCATION_ID", "")
    response = await _request_with_retry("GET", "https://services.leadconnectorhq.com/opportunities/pipelines", headers=_ghl_headers(), params={"locationId": location})
    pipelines = response.json().get("pipelines", [])
    return {"pipelines": [{"id": p.get("id"), "name": p.get("name"), "stages": [{"id": s.get("id"), "name": s.get("name")} for s in p.get("stages", [])]} for p in pipelines]}


async def ghl_search_contacts(query: str, limit: int = 20) -> dict:
    location = os.getenv("GHL_LOCATION_ID", "")
    response = await _request_with_retry("GET", "https://services.leadconnectorhq.com/contacts/", headers=_ghl_headers(), params={"locationId": location, "query": query, "limit": min(max(limit, 1), 50)})
    contacts = response.json().get("contacts", [])
    return {"contacts": [{"id": c.get("id"), "name": c.get("contactName") or c.get("name"), "company": c.get("companyName"), "email": c.get("email"), "phone": c.get("phone"), "tags": c.get("tags", [])} for c in contacts]}


async def web_research(query: str, limit: int = 5) -> dict:
    key = os.getenv("FIRECRAWL_API_KEY", "")
    if not key:
        raise IntegrationUnavailable("FIRECRAWL_API_KEY is not configured")
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    response = await _request_with_retry("POST", "https://api.firecrawl.dev/v1/search", headers=headers, json={"query": query, "limit": min(max(limit, 1), 10)})
    payload = response.json()
    rows = payload.get("data", payload.get("results", []))
    return {"query": query, "results": [{"title": r.get("title"), "url": r.get("url"), "description": r.get("description") or r.get("markdown", "")[:800]} for r in rows]}


async def _google_access_token() -> str:
    required = (os.getenv("GOOGLE_CLIENT_ID"), os.getenv("GOOGLE_CLIENT_SECRET"), os.getenv("GOOGLE_REFRESH_TOKEN"))
    if not all(required):
        raise IntegrationUnavailable("Google offline OAuth is not connected to Railway")
    response = await _request_with_retry("POST", "https://oauth2.googleapis.com/token", data={"client_id": required[0], "client_secret": required[1], "refresh_token": required[2], "grant_type": "refresh_token"})
    return response.json()["access_token"]


async def google_calendar_upcoming(days: int = 7, limit: int = 20) -> dict:
    token = await _google_access_token()
    now = datetime.now(timezone.utc)
    response = await _request_with_retry("GET", "https://www.googleapis.com/calendar/v3/calendars/primary/events", headers={"Authorization": f"Bearer {token}"}, params={"timeMin": now.isoformat(), "timeMax": (now + timedelta(days=min(max(days, 1), 31))).isoformat(), "singleEvents": "true", "orderBy": "startTime", "maxResults": min(max(limit, 1), 50)})
    return {"events": [{"id": e.get("id"), "summary": e.get("summary"), "start": e.get("start"), "end": e.get("end"), "location": e.get("location"), "attendees": e.get("attendees", [])} for e in response.json().get("items", [])]}


async def gmail_search(query: str = "is:unread", limit: int = 10) -> dict:
    token = await _google_access_token(); headers = {"Authorization": f"Bearer {token}"}
    response = await _request_with_retry("GET", "https://gmail.googleapis.com/gmail/v1/users/me/messages", headers=headers, params={"q": query, "maxResults": min(max(limit, 1), 25)})
    items = response.json().get("messages", [])
    messages = []
    for item in items:
        detail = await _request_with_retry("GET", f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{item['id']}", headers=headers, params={"format": "metadata", "metadataHeaders": ["From", "Subject", "Date"]})
        data = detail.json(); meta = {h["name"].lower(): h["value"] for h in data.get("payload", {}).get("headers", [])}
        messages.append({"id": data.get("id"), "thread_id": data.get("threadId"), "from": meta.get("from"), "subject": meta.get("subject"), "date": meta.get("date"), "snippet": data.get("snippet")})
    return {"query": query, "messages": messages}


READ_TOOLS = {
    "integrations_status": lambda args: integration_status(),
    "ghl_pipelines": lambda args: ghl_pipelines(),
    "ghl_search_contacts": lambda args: ghl_search_contacts(str(args.get("query", "")), int(args.get("limit", 20))),
    "web_research": lambda args: web_research(str(args.get("query", "")), int(args.get("limit", 5))),
    "calendar_upcoming": lambda args: google_calendar_upcoming(int(args.get("days", 7)), int(args.get("limit", 20))),
    "gmail_search": lambda args: gmail_search(str(args.get("query", "is:unread")), int(args.get("limit", 10))),
}


async def execute_read_tool(name: str, arguments: dict) -> Any:
    fn = READ_TOOLS.get(name)
    if not fn:
        raise IntegrationUnavailable(f"Unknown integration tool: {name}")
    result = fn(arguments)
    return await result if hasattr(result, "__await__") else result
