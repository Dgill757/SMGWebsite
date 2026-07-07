"""
AVA STUDIO — WEBSOCKET + REAL-TIME NOTIFICATIONS
=================================================
Add this to ava_demo_studio_api.py to enable real-time push to the dashboard.

The dashboard connects via WebSocket at /ws and receives JSON events.
When anything happens (positive reply, meeting booked, demo complete, etc.)
the dashboard gets an instant push notification without polling.

PASTE: Add these imports and code into ava_demo_studio_api.py
"""

# ── ADD TO IMPORTS ────────────────────────────────────────────────────────────
from fastapi import WebSocket, WebSocketDisconnect
from typing import Set
import asyncio

# ── ADD AFTER APP CREATION ────────────────────────────────────────────────────
# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active: Set[WebSocket] = set()

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.add(ws)

    def disconnect(self, ws: WebSocket):
        self.active.discard(ws)

    async def broadcast(self, event_type: str, data: dict):
        """Push an event to all connected dashboard tabs."""
        if not self.active:
            return
        payload = {"type": event_type, "data": data}
        dead = set()
        for ws in self.active:
            try:
                await ws.send_json(payload)
            except Exception:
                dead.add(ws)
        self.active -= dead

ws_manager = ConnectionManager()


# ── WEBSOCKET ENDPOINT ────────────────────────────────────────────────────────
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    The dashboard connects here on load.
    Stays connected for real-time push notifications.
    Heartbeat every 30s to keep connection alive.
    """
    await ws_manager.connect(websocket)
    try:
        # Send current status on connect
        await websocket.send_json({
            "type": "connected",
            "data": {
                "demos_active": len([d for d in demo_store.values() if isinstance(d, dict) and d.get("status") == "done"]),
                "timestamp": datetime.now().isoformat()
            }
        })
        # Keep alive with heartbeat
        while True:
            await asyncio.sleep(25)
            try:
                await websocket.send_json({"type": "ping", "data": {}})
            except Exception:
                break
    except WebSocketDisconnect:
        pass
    finally:
        ws_manager.disconnect(websocket)


# ── BROADCAST HELPERS (call these from your existing endpoints) ───────────────
async def notify_positive_reply(contact_id: str, company: str, snippet: str):
    """Call this when ghl_reply_monitor.py posts a hot lead."""
    await ws_manager.broadcast("positive_reply", {
        "contact_id": contact_id,
        "company": company,
        "snippet": snippet[:200],
        "timestamp": datetime.now().isoformat()
    })

async def notify_meeting_booked(company: str, time: str, contact_id: str = ""):
    """Call this from the GHL webhook when appointment is booked."""
    await ws_manager.broadcast("meeting_booked", {
        "company": company,
        "time": time,
        "contact_id": contact_id,
        "timestamp": datetime.now().isoformat()
    })

async def notify_demo_complete(company: str, demo_url: str, contact_id: str = ""):
    """Call this when a demo build finishes (status = done)."""
    await ws_manager.broadcast("demo_complete", {
        "company": company,
        "demo_url": demo_url,
        "contact_id": contact_id,
        "timestamp": datetime.now().isoformat()
    })

async def notify_build_progress(company: str, step: int, total: int, step_name: str, demo_id: str = ""):
    """Call this on each step of the demo build to show live progress overlay."""
    await ws_manager.broadcast("build_progress", {
        "company": company,
        "step": step,
        "total_steps": total,
        "step_name": step_name,
        "demo_id": demo_id
    })

async def notify_voice_agent_created(company: str, widget_key: str, website: str = ""):
    """Call this when Thinker automation creates a new voice agent."""
    await ws_manager.broadcast("voice_agent_created", {
        "company": company,
        "widget_key": widget_key,
        "website": website,
        "timestamp": datetime.now().isoformat()
    })

async def notify_website_built(company: str, url: str):
    """Call this when a new homepage is deployed to Vercel."""
    await ws_manager.broadcast("website_built", {
        "company": company,
        "url": url,
        "timestamp": datetime.now().isoformat()
    })

async def notify_scraper_complete(city: str, count: int, city_index: int = 0):
    """Call this after daily_outreach.py posts to /ingest/scraper-run."""
    await ws_manager.broadcast("scraper_complete", {
        "city": city,
        "count": count,
        "city_index": city_index,
        "timestamp": datetime.now().isoformat()
    })


# ── UPDATE EXISTING ENDPOINTS TO BROADCAST ────────────────────────────────────
# In build_demo_task(), add these calls at the right steps:

# After step 4 (homepage built):
#   await notify_build_progress(req.client_name, 5, 10, "Deploying to Vercel", demo_id)
#   await notify_website_built(brand.get("company_name", req.client_name), demo_url)

# After step 7 (voice agent created):
#   await notify_voice_agent_created(brand.get("company_name"), widget_key or "", req.website_url)

# When status = "done":
#   await notify_demo_complete(req.client_name, demo_url, req.contact_id or "")

# In ingest_replies():
#   for reply in payload.replies:
#       await notify_positive_reply(reply.contact_id, reply.company, reply.snippet)

# In ingest_scraper_run():
#   await notify_scraper_complete(payload.city, payload.scraped, payload.city_index or 0)


# ── UPDATED GHL WEBHOOK ENDPOINT ─────────────────────────────────────────────
@app.post("/webhooks/ghl")
async def ghl_webhook(request: Request):
    """
    Receives all GHL events and pushes them to the dashboard in real time.
    Configure in GHL: Settings → Integrations → Webhooks → POST to /webhooks/ghl
    """
    try:
        payload = await request.json()
    except Exception:
        return {"status": "error", "detail": "invalid json"}

    event_type = payload.get("type") or payload.get("event") or ""
    contact = payload.get("contact") or payload.get("data", {})

    # Store raw event in Supabase
    if os.getenv("SUPABASE_URL"):
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{os.getenv('SUPABASE_URL')}/rest/v1/ghl_activity",
                headers={
                    "apikey": os.getenv("SUPABASE_KEY", ""),
                    "Authorization": f"Bearer {os.getenv('SUPABASE_KEY', '')}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal",
                },
                json={
                    "event_type": event_type,
                    "contact_id": contact.get("id", ""),
                    "company_name": contact.get("companyName", ""),
                    "message_body": payload.get("message", {}).get("body", "") if "message" in payload else "",
                    "intent": "",
                    "raw_payload": payload,
                    "received_at": datetime.now().isoformat()
                }
            )

    # Route events to the right notification
    company = contact.get("companyName", contact.get("name", "Unknown"))
    contact_id = contact.get("id", "")

    if "InboundMessage" in event_type or "message" in event_type.lower():
        msg_body = payload.get("message", {}).get("body", "")
        if msg_body:
            # Push to dashboard — GHL AI Workflow 2 (Reply Router) will classify
            # For now push as unknown intent — the workflow will tag it
            await ws_manager.broadcast("inbound_message", {
                "company": company,
                "contact_id": contact_id,
                "message": msg_body[:200],
                "timestamp": datetime.now().isoformat()
            })

    if "AppointmentBooked" in event_type or "appointment" in event_type.lower():
        appt = payload.get("appointment", {})
        await notify_meeting_booked(
            company,
            appt.get("startTime", "check Calendly"),
            contact_id
        )

    if "TagAdded" in event_type:
        tag = payload.get("tag", {}).get("name", "")
        if "replied positive" in tag.lower() or "hot lead" in tag.lower():
            await notify_positive_reply(contact_id, company, "Positive reply — check GHL")

    if "OpportunityStageChanged" in event_type:
        stage = payload.get("opportunity", {}).get("stage", {}).get("name", "")
        if stage == "Won":
            await ws_manager.broadcast("client_won", {
                "company": company, "contact_id": contact_id,
                "timestamp": datetime.now().isoformat()
            })

    return {"status": "ok", "event": event_type}
