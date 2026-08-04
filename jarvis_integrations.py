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


async def prospects_without_website(limit: int = 10) -> dict:
    """Return high-signal uncontacted prospects from SummitOS, never send to them."""
    url, key = os.getenv("SUPABASE_URL", ""), os.getenv("SUPABASE_KEY", "")
    if not url or not key:
        raise IntegrationUnavailable("Supabase is not configured")
    headers = {"apikey": key, "Authorization": f"Bearer {key}"}
    params = {
        "select": "id,ghl_contact_id,company_name,owner_name,phone,email,city,state,website,has_website,review_count,review_rating,outreach_sent,status,scraped_at",
        "or": "(has_website.eq.false,website.is.null,website.eq.)",
        "outreach_sent": "eq.false",
        "order": "review_count.desc.nullslast,scraped_at.desc",
        "limit": str(min(max(limit, 1), 25)),
    }
    response = await _request_with_retry("GET", f"{url}/rest/v1/scraped_businesses", headers=headers, params=params)
    return {"outreach_paused": True, "prospects": response.json()}


async def prospect_company_brief(query: str) -> dict:
    """Combine SummitOS lead data, GHL contact data, and current public research."""
    if not query.strip():
        raise IntegrationUnavailable("A company or contact name is required")
    url, key = os.getenv("SUPABASE_URL", ""), os.getenv("SUPABASE_KEY", "")
    local_rows: list[dict] = []
    if url and key:
        headers = {"apikey": key, "Authorization": f"Bearer {key}"}
        response = await _request_with_retry("GET", f"{url}/rest/v1/scraped_businesses", headers=headers, params={"select": "*", "company_name": f"ilike.*{query.strip()}*", "limit": "5"})
        local_rows = response.json()
    ghl, research = await asyncio.gather(
        ghl_search_contacts(query, 10),
        web_research(f'"{query}" roofing company owner reviews services', 6),
        return_exceptions=True,
    )
    return {
        "query": query,
        "summitos_records": local_rows,
        "ghl": {"unavailable": str(ghl)} if isinstance(ghl, Exception) else ghl,
        "public_research": {"unavailable": str(research)} if isinstance(research, Exception) else research,
        "instruction": "Separate observed facts from sales-call hypotheses. Never invent an owner, revenue, or website status.",
    }


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


async def google_calendar_create_event(arguments: dict) -> dict:
    """Create one explicitly approved event and return Google's receipt."""
    token = await _google_access_token()
    summary = str(arguments.get("summary", "")).strip()
    start = str(arguments.get("start", "")).strip()
    end = str(arguments.get("end", "")).strip()
    if not summary or not start or not end:
        raise IntegrationUnavailable("Calendar event requires summary, start, and end")
    event: dict[str, Any] = {
        "summary": summary,
        "description": str(arguments.get("description", ""))[:4000],
        "start": {"dateTime": start, "timeZone": arguments.get("time_zone", "America/New_York")},
        "end": {"dateTime": end, "timeZone": arguments.get("time_zone", "America/New_York")},
        "reminders": {"useDefault": False, "overrides": [{"method": "popup", "minutes": int(arguments.get("reminder_minutes", 15))}]},
    }
    if arguments.get("location"):
        event["location"] = str(arguments["location"])
    attendees = [str(email).strip() for email in arguments.get("attendees", []) if "@" in str(email)]
    if attendees:
        event["attendees"] = [{"email": email} for email in attendees]
    response = await _request_with_retry(
        "POST", "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        params={"sendUpdates": "all" if attendees else "none"}, json=event,
    )
    created = response.json()
    return {"created": True, "id": created.get("id"), "summary": created.get("summary"), "start": created.get("start"), "end": created.get("end"), "html_link": created.get("htmlLink")}


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


async def google_drive_search(query: str, limit: int = 10) -> dict:
    token = await _google_access_token()
    safe_query = query.replace("'", "\\'").strip()
    params = {
        "q": f"trashed = false and fullText contains '{safe_query}'" if safe_query else "trashed = false",
        "pageSize": min(max(limit, 1), 25),
        "orderBy": "modifiedTime desc",
        "fields": "files(id,name,mimeType,modifiedTime,webViewLink,owners(displayName,emailAddress))",
    }
    response = await _request_with_retry("GET", "https://www.googleapis.com/drive/v3/files", headers={"Authorization": f"Bearer {token}"}, params=params)
    return {"query": query, "files": response.json().get("files", [])}


async def meeting_prep(query: str = "next meeting") -> dict:
    """Assemble one observed meeting dossier across the connected business systems."""
    calendar = await google_calendar_upcoming(30, 50)
    events = calendar.get("events", [])
    needle = query.casefold().replace("meeting brief", "").replace("meeting prep", "").strip(" :,.?")
    generic = not needle or needle in {"next", "next meeting", "my next meeting", "upcoming"}
    selected = None
    if generic:
        selected = events[0] if events else None
    else:
        selected = next((event for event in events if needle in str(event.get("summary", "")).casefold() or any(needle in str(a).casefold() for a in event.get("attendees", []))), None)
    if not selected:
        return {"query": query, "meeting": None, "calendar_events_checked": len(events), "message": "No matching upcoming calendar event was found."}
    attendee_emails = [a.get("email") for a in selected.get("attendees", []) if isinstance(a, dict) and a.get("email")]
    search_term = str(selected.get("summary") or needle or "").strip()
    gmail_query = f'newer_than:2y "{search_term}"' if search_term else "newer_than:30d"
    ghl_query = attendee_emails[0] if attendee_emails else search_term
    results = await asyncio.gather(
        gmail_search(gmail_query, 12),
        ghl_search_contacts(ghl_query, 10),
        google_drive_search(search_term, 10),
        prospect_company_brief(search_term),
        return_exceptions=True,
    )
    labels = ("gmail", "ghl", "drive", "company_intelligence")
    dossier = {label: ({"unavailable": str(value)} if isinstance(value, Exception) else value) for label, value in zip(labels, results)}
    return {
        "meeting": selected,
        "attendee_emails": attendee_emails,
        **dossier,
        "briefing_requirements": ["meeting objective", "relationship history", "open promises", "likely needs", "talking points", "objections", "next best action"],
    }


async def daily_executive_inputs() -> dict:
    """Return observed inputs for a revenue-first daily briefing."""
    results = await asyncio.gather(
        google_calendar_upcoming(2, 25),
        gmail_search("is:unread", 12),
        prospects_without_website(10),
        return_exceptions=True,
    )
    labels = ("calendar", "unread_email", "no_website_prospects")
    return {
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "outreach_paused": True,
        **{label: ({"unavailable": str(value)} if isinstance(value, Exception) else value) for label, value in zip(labels, results)},
    }


READ_TOOLS = {
    "integrations_status": lambda args: integration_status(),
    "ghl_pipelines": lambda args: ghl_pipelines(),
    "ghl_search_contacts": lambda args: ghl_search_contacts(str(args.get("query", "")), int(args.get("limit", 20))),
    "prospects_without_website": lambda args: prospects_without_website(int(args.get("limit", 10))),
    "prospect_company_brief": lambda args: prospect_company_brief(str(args.get("query", ""))),
    "web_research": lambda args: web_research(str(args.get("query", "")), int(args.get("limit", 5))),
    "calendar_upcoming": lambda args: google_calendar_upcoming(int(args.get("days", 7)), int(args.get("limit", 20))),
    "gmail_search": lambda args: gmail_search(str(args.get("query", "is:unread")), int(args.get("limit", 10))),
    "drive_search": lambda args: google_drive_search(str(args.get("query", "")), int(args.get("limit", 10))),
    "meeting_prep": lambda args: meeting_prep(str(args.get("query", "next meeting"))),
    "daily_executive_inputs": lambda args: daily_executive_inputs(),
}

WRITE_TOOLS = {
    "calendar_create_event": google_calendar_create_event,
}


async def execute_read_tool(name: str, arguments: dict) -> Any:
    fn = READ_TOOLS.get(name)
    if not fn:
        raise IntegrationUnavailable(f"Unknown integration tool: {name}")
    result = fn(arguments)
    return await result if hasattr(result, "__await__") else result


async def execute_write_tool(name: str, arguments: dict) -> Any:
    fn = WRITE_TOOLS.get(name)
    if not fn:
        raise IntegrationUnavailable(f"Unknown mutating integration tool: {name}")
    result = fn(arguments)
    return await result if hasattr(result, "__await__") else result
