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
