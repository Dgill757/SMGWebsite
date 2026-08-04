# Summit JARVIS launch

Date: 2026-08-04

## Shipped

- Added authenticated `GET /jarvis/health` and `POST /jarvis/chat` endpoints to the Railway FastAPI service.
- Jarvis receives live CEO summary, agent health, recent GHL replies, and the explicit paused-outreach state.
- Kept Jarvis read-only. It cannot send messages, deploy, delete, trigger demos, or resume outreach.
- Added the Jarvis tab to the live SummitOS dashboard with a responsive HUD, animated orb, persistent local conversation history, quick prompts, and live system panel.
- Added and installed a Windows desktop app-mode shortcut at `C:\Users\DanGi\OneDrive\Desktop\Summit JARVIS.lnk`.
- Deployed the frontend to Vercel and the API to Railway.

## Production verification

- `https://avastudio.summitvoiceai.com` serves the JARVIS Command Center.
- API `/health` returns HTTP 200.
- Missing authentication on `/demos/create` returns HTTP 401.
- Authenticated `/jarvis/health` returns online/read-only/outreach-paused.
- Authenticated `/jarvis/chat` returns a real live-data response in limited mode.
- No old `ava2026` password or embedded JWT appears in served frontend source.

## Confirmed blockers and data issues

- Anthropic API returns HTTP 400: credit balance too low. Jarvis therefore provides a live deterministic status response in limited mode until API credits are added.
- Production CEO data currently reports about $1,514 MRR and 4 clients, inconsistent with the business baseline of about $4,466 and 9 clients.
- Railway startup reports the Supabase `agent_status` table missing/broken (HTTP 400), so agent health shows zero reporting agents.

## Commits

- `3992953` feat(jarvis): add live command center and desktop launcher
- `f3b7dfc` fix(jarvis): show live limited mode when model credits are empty
