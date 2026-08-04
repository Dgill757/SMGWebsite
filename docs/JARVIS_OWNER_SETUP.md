# JARVIS Owner Setup

This checklist contains only steps that require Dan's account access, phone, or a visible Windows installer.

## 1. Finish the local neural voice setup

Voicebox 0.5.0 is already installed from its hash-verified official Windows release and has been opened.

1. In Voicebox, finish any first-run prompt.
2. In Models, download **Kokoro** first. It is the smallest fast CPU voice engine.
3. Choose a natural British male preset and make it the default.
4. In transcription settings, download Whisper Turbo.
5. Leave Voicebox running. Its local API should answer at `http://127.0.0.1:17493`.

Do not start with Qwen3-TTS on this PC. Kokoro is substantially lighter and better suited to the available RAM/GPU.

## 2. Add one cloud reasoning provider

### Recommended: Groq

1. Sign in at https://console.groq.com/keys.
2. Create a key named `summitos-jarvis`.
3. In Railway, open project **ava-studio-api**, service **ava-studio-api**, then **Variables**.
4. Add `GROQ_API_KEY` with the key value.
5. Add `JARVIS_PROVIDER_ORDER` with `groq,openrouter,anthropic`.
6. Redeploy the service.

### Optional second provider: OpenRouter

1. Create a key at https://openrouter.ai/settings/keys.
2. Add it to Railway as `OPENROUTER_API_KEY`.
3. Add `JARVIS_OPENROUTER_MODEL` with the model identifier you want, or leave automatic routing enabled.

Never paste either key into the dashboard, Obsidian, GitHub, or a chat message.

## 3. Telegram

1. In Telegram, message the verified `@BotFather` account.
2. Send `/newbot` and finish the prompts.
3. Save the bot token into Railway as `TELEGRAM_BOT_TOKEN`.
4. Message `@userinfobot` and copy your numeric chat ID.
5. Add the ID to Railway as `TELEGRAM_ALLOWED_CHAT_IDS`.
6. Generate a private random webhook secret and add it as `TELEGRAM_WEBHOOK_SECRET`.
7. Set the webhook by opening this URL after substituting the values locally:
   `https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://ava-studio-api-production.up.railway.app/jarvis/telegram/webhook&secret_token=<WEBHOOK_SECRET>`
8. Send the bot `status` and confirm it responds.

## 4. Twilio phone calling

1. In Twilio, complete ConversationRelay onboarding and accept its AI/ML addendum.
2. Buy or select a voice-capable Twilio number.
3. Add these Railway variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_NUMBER` in E.164 form, for example `+14105551234`
   - `DAN_PHONE_NUMBER` in E.164 form
   - `JARVIS_ALLOWED_CALLERS` set to your number
   - `JARVIS_PHONE_PIN` set to a private four-digit PIN
   - `JARVIS_PHONE_WS_SECRET` set to a long random value
   - `JARVIS_PUBLIC_URL=https://ava-studio-api-production.up.railway.app`
4. In Twilio Console, open the number's Voice configuration.
5. For **A call comes in**, choose Webhook, method POST.
6. Set the URL to `https://ava-studio-api-production.up.railway.app/jarvis/phone/twiml`.
7. Save and call the number. JARVIS should ask for the PIN.

Outbound calls are restricted to numbers in `JARVIS_ALLOWED_CALLERS`.

## 5. Supabase repair

1. Open the SummitOS Supabase project.
2. Open **SQL Editor** and create a new query.
3. Paste the complete contents of `jarvis_supabase_migration.sql`.
4. Click **Run**.
5. Redeploy Railway and confirm its startup log no longer reports `agent_status` missing.

## 6. Daily use

- Desktop shortcut: `Summit JARVIS`.
- Click **Talk** once to enable always-listening mode. Click again to stop.
- Speak while JARVIS is talking to interrupt it.
- Automated outreach remains paused.
- Emergency local stop: POST `/pause?paused=true` to the local connector or stop the `jarvis_local_connector.py` process.
