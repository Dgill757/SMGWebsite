# JARVIS local wiring - 2026-08-04

- Replaced dashboard browser TTS path with interruptible Voicebox-generated Kokoro audio.
- Replaced paired dashboard microphone path with local Voicebox Whisper Turbo transcription and VAD.
- Added local Obsidian vault retrieval to dashboard prompts.
- Added local Ollama fallback when cloud model routing is unavailable.
- Changed desktop launcher to prefer standard Google Chrome over Edge/automation browsers.
- Reinstalled the desktop shortcut.
- Configured Telegram allowed chat ID and webhook secret in Railway; registered and tested the webhook.
- Deployed backend commit `d0c95c2` and the production Vercel dashboard.
- Verified local neural audio generation (HTTP 200, WAV), vault retrieval, production dashboard code, and Telegram webhook delivery.

Operational note: Ollama `llama3.2:3b` is installed, but the machine had only about 1.2 GB free RAM during the final test; the model requires about 2.3 GB. Cloud Groq remains the primary reasoner and local Ollama becomes available after closing memory-heavy apps.

## Follow-up repair

- Corrected the Voicebox transcription proxy field from `audio` to `file` and model name from `whisper-turbo` to `turbo`.
- Verified local Whisper end to end with HTTP 200 and the transcript `Whisper Bridge Test.`
- Lowered dashboard VAD threshold for normal speaking volume and added a 20-second utterance ceiling.
- Corrected Railway owner metrics to $797 MRR and 2 clients.
- Marked Broken Arrow Outdoors and ChimChimChuree as paused; Teo Roofing and Stonewall Roofing are the two active clients.
- Added a controlled local tool router shared by dashboard voice/text and Telegram.
- Verified a dashboard request created and completed a real `git_status` task on the PC connector.
- Verified the same local tool request was delivered through Telegram.
- Replaced threshold-triggered recording with continuous four-second Whisper capture segments after the live UI showed an open microphone but no recording events.
- Added a live microphone level percentage and selectable input-device control to the Jarvis panel.
- Replaced the obsolete `Read-only mode` badge/API mode with `Actions gated` / `controlled_actions`.
- Installed and authenticated the Slack Codex plugin to the `SummitMarketingGroup` workspace.
- Added the persistent Jarvis integration registry and Railway readiness endpoint.
- Added and live-tested native read adapters for GHL pipelines/contact search and Firecrawl web research.
- Verified Jarvis itself returned observed GHL pipeline stages and live web research through the controlled tool router.
- Confirmed Google Calendar and Drive Codex connections; Gmail requires reauthentication and Railway still needs dedicated offline Google OAuth credentials.
## Voice feedback-loop containment

- Stopped the runaway Voicebox processes, then restarted the desktop Voicebox service and verified its health endpoint.
- Added a visible emergency Stop control that aborts queued chat, voice generation, playback, capture, and transcription.
- Prevented simultaneous local neural and browser voices. Paired local voice failures now remain silent and report the error.
- Paused microphone capture while Jarvis is thinking or speaking and delayed restart after playback.
- Added transcript de-duplication, fuzzy self-echo rejection, a required `Jarvis` wake word, and a five-second follow-up window.
- Added `docs/JARVIS_EMPLOYEE_ARCHITECTURE_RESEARCH.md` with the revenue-first work-engine plan.

## Revenue tools and conversational follow-up

- Replaced fixed four-second audio batching with silence-ended segments (650 ms silence, eight-second safety cap), reducing dead time after speech.
- Extended the follow-up conversation window to 20 seconds because local transcription latency made the previous five-second window expire before the transcript arrived.
- Added a live SummitOS query for uncontacted roofing prospects with no website. It ranks useful candidates but never sends outreach.
- Added prospect/company briefs that combine SummitOS records, GHL contacts, and Firecrawl public research.
- Added natural-language Google Calendar event planning plus explicit approval and Google receipt handling.
- Production verification returned ten no-website prospects and a combined Teo Roofing brief. A test calendar proposal parsed tomorrow's 1–4 PM block correctly and was denied after verification, so no event was created.
- Imported ignored local reference repositories for OpenClaw, GAIA, BrowserOS, and CoWork OS. No third-party executor or credentials were installed.

## Deep research implementation

- Read all 660 lines of `Codex/deep-research-report.md` and mapped its layered architecture to the existing SummitOS stack.
- Verified production Google access: Calendar returned 11 upcoming events; Gmail returned 8 unread messages; Drive reports connected.
- Added meeting preparation across Calendar, Gmail, Drive, GHL, SummitOS, and Firecrawl.
- Added revenue-first daily executive briefing inputs across Calendar, Gmail, and uncontacted no-website prospects.
- Added a Supabase-compatible durable action store with actor, channel, trace ID, executor, idempotency key, approval/completion times, result receipts, and in-memory fallback.
- Expanded `jarvis_supabase_migration.sql`; the migration must still be run in the `ava-studio` Supabase SQL Editor.
- Installed and validated private Codex skills: `summit-daily-executive-brief`, `summit-meeting-prep`, `summit-ghl-sales-ops`, and `summit-durable-workflow`.
