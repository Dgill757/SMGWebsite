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
