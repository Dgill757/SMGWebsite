# Dan's SummitOS / JARVIS owner checklist

Use this file only after Codex says the matching code deployment passed. Never paste credentials into this file, GitHub, Telegram, or a Jarvis chat. Secrets go in Railway only.

## 1. Remove the redundant outbound task

Open PowerShell **as Administrator** and run:

```powershell
Disable-ScheduledTask -TaskName "SummitVoiceAI-DailyOutreach"
```

Confirm:

```powershell
Get-ScheduledTask -TaskName "SummitVoiceAI-DailyOutreach","SummitVoiceAI-Followup","Summit RVM Drops","Summit Daily Agent" | Select-Object TaskName,State
```

Expected:

- `SummitVoiceAI-DailyOutreach`: Disabled
- `SummitVoiceAI-Followup`: Disabled
- `Summit RVM Drops`: Disabled
- `Summit Daily Agent`: Ready — keep this enabled because it scrapes leads and adds GHL contacts without messaging them

## 2. Upgrade Google authorization for full Gmail organization

Jarvis uses move-to-Trash rather than permanent deletion. Every draft, send, archive, label, mark-read, star, or trash action waits for approval.

1. Open Google Cloud Console and select **SummitOS Jarvis**.
2. Under **APIs & Services → Library**, confirm these are enabled:
   - Gmail API
   - Google Calendar API
   - Google Drive API
3. Open [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
4. Click the gear icon.
5. Enable **Use your own OAuth credentials**.
6. Enter the same client ID and client secret already stored in Railway. Retrieve them from Railway directly; do not copy them into this document.
7. In Step 1, enter and authorize all three scopes in the same consent:

```text
https://www.googleapis.com/auth/gmail.modify
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/drive.readonly
```

8. Approve access using Dan's business Google account.
9. Click **Exchange authorization code for tokens**.
10. Copy the new refresh token.
11. Open Railway → `ava-studio-api` → **Variables**.
12. Replace only `GOOGLE_REFRESH_TOKEN` with the new value.
13. Redeploy the Railway service.
14. Ask Jarvis: `check my Google OAuth scopes`.

Expected: calendar, Gmail modify, and Drive read-only all report `true` with no missing scopes.

### Gmail acceptance test

Run these one at a time:

1. `triage my inbox and show the three messages most likely to need a personal reply`
2. `draft an email to YOUR_SECOND_EMAIL with subject Jarvis test and body This is a draft-only test.`
3. Open the JARVIS Approvals card and approve it.
4. Verify the draft exists in Gmail and was not sent.
5. Tell Jarvis: `send Gmail draft DRAFT_ID`.
6. Approve the send and verify the receipt.
7. Use a disposable test message for archive, mark-read, label, star, and trash tests.

Do not test Trash using a business-critical email.

## 3. Connect Slack

1. Open [Slack API Apps](https://api.slack.com/apps).
2. Click **Create New App → From scratch**.
3. Name it `Summit JARVIS` and select the Summit workspace.
4. Open **OAuth & Permissions**.
5. Under **Bot Token Scopes**, add:
   - `chat:write`
   - `channels:history`
   - `channels:read`
   - Add `groups:history` only if the dispatch channel is private
6. Click **Install to Workspace** and approve it.
7. Copy the Bot User OAuth Token beginning with `xoxb-`.
8. In Slack, open the channel Jarvis should use, such as `#ava-dispatch`.
9. Invite the bot with `/invite @Summit JARVIS`.
10. Open the channel details and copy its Channel ID.
11. Add these Railway variables:

```text
SLACK_BOT_TOKEN=<xoxb token>
SLACK_CHANNEL_ID=<channel id>
```

12. Redeploy Railway.
13. Ask Jarvis: `show me recent Slack updates`.
14. Ask: `post to Slack: Jarvis Slack connection test`.
15. Approve the action and verify the message plus receipt.

## 4. Configure Twilio for private SMS and phone calls

This channel is private and allowlisted to Dan. Do not use it for prospect outreach.

### Configure a dependable Jarvis reasoning provider

The phone service cannot reach the PC's local Ollama server. Add at least one dependable cloud key in Railway. Recommended order:

1. OpenAI: create a project API key at `https://platform.openai.com/api-keys`, enable billing/credits, then add `OPENAI_API_KEY` in Railway. Optional: `JARVIS_OPENAI_MODEL=gpt-5-mini`.
2. Gemini: create a Gemini API key in Google AI Studio at `https://aistudio.google.com/app/apikey`, then add `GEMINI_API_KEY` in Railway. Optional: `JARVIS_GEMINI_MODEL=gemini-3.6-flash`.

Do not use the Google OAuth refresh token as a Gemini API key. Do not paste either key into chat or commit it to GitHub. SummitOS uses Gemini first for low-latency voice, OpenAI second for dependable reasoning fallback, then Groq, OpenRouter, and Anthropic.

1. Create or open a Twilio account.
2. Purchase a US number with **Voice** and **SMS** capabilities.
3. Complete Twilio ConversationRelay onboarding and accept its Predictive/Generative AI terms.
4. In Railway, add:

```text
TWILIO_ACCOUNT_SID=<Account SID>
TWILIO_AUTH_TOKEN=<Auth Token>
TWILIO_NUMBER=<Twilio number in E.164, for example +14105550100>
DAN_PHONE_NUMBER=<Dan's mobile number in E.164>
JARVIS_ALLOWED_CALLERS=<Dan's mobile number in E.164>
JARVIS_ALLOWED_SMS_RECIPIENTS=<Dan's mobile number in E.164>
JARVIS_PHONE_PIN=<a private four-digit PIN>
JARVIS_PHONE_WS_SECRET=<a random 64-character secret>
JARVIS_PUBLIC_URL=https://ava-studio-api-production.up.railway.app
JARVIS_PHONE_TTS_PROVIDER=ElevenLabs
JARVIS_PHONE_VOICE=UgBBYS2sOqTuMpoF3BR0-flash_v2_5-1.0_0.72_0.82
JARVIS_PHONE_STT_PROVIDER=Deepgram
```

Generate the WebSocket secret locally:

Windows PowerShell 5.1 compatible command:

```powershell
$bytes = New-Object byte[] 32
$rng = [Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$secret = ([BitConverter]::ToString($bytes)).Replace('-', '').ToLower()
$rng.Dispose()
$secret
```

The value is a secret. Store it only as `JARVIS_PHONE_WS_SECRET` in Railway.

5. In Twilio → Phone Numbers → Manage → Active Numbers → your Jarvis number:
   - **Messaging / A message comes in**: Webhook, `https://ava-studio-api-production.up.railway.app/jarvis/sms/webhook`, HTTP POST
   - **Voice / A call comes in**: Webhook, `https://ava-studio-api-production.up.railway.app/jarvis/phone/twiml`, HTTP POST
6. Save the number configuration.
7. Redeploy Railway.

### Exact ConversationRelay Console setup

1. In Twilio, open **Voice > Settings > Privacy & Security**.
2. Accept the **Predictive and Generative AI/ML Features Addendum** and save.
3. You do not need a separate TwiML App for SummitOS. Open **Phone Numbers > Manage > Active Numbers > your Jarvis number**.
4. Set **A call comes in** to **Webhook**, URL `https://ava-studio-api-production.up.railway.app/jarvis/phone/twiml`, method **HTTP POST**.
5. Set **A message comes in** to **Webhook**, URL `https://ava-studio-api-production.up.railway.app/jarvis/sms/webhook`, method **HTTP POST**.
6. Do not paste a WebSocket URL into the Console. The TwiML endpoint generates the authenticated `wss://` connection.
7. Save the number, redeploy Railway, and wait for **SUCCESS** before calling.

The default phone stack is ElevenLabs Flash 2.5 TTS plus Deepgram STT. This does not use the local Kokoro voice or require a separate ElevenLabs API key. To choose another phone voice later, copy its ConversationRelay voice ID into `JARVIS_PHONE_VOICE` and redeploy.

### SMS acceptance test

1. Text `what is current MRR and which GHL deals are stale?` to the Twilio number.
2. Confirm the response says $797 and uses live pipeline data.
3. Text a draft request and approve it using `/approve ACTION_ID`.

### Phone acceptance test

1. Call the Twilio number from the allowlisted Dan phone.
2. Say the four-digit PIN.
3. Ask: `What should I focus on today?`
4. Interrupt Jarvis while it speaks.
5. Ask a follow-up about a real meeting or prospect.
6. From the desktop, use the outbound-call command only after the inbound test passes.

## 5. Connect the visual browser tester

The Node ESM conflict is fixed. Codex still needs a connected browser instance.

1. Open Codex or ChatGPT Settings.
2. Open **Computer use**.
3. Install or enable the browser extension for Chrome or Edge.
4. Open `https://avastudio.summitvoiceai.com` in that browser.
5. Sign in to SummitOS.
6. Tell Codex: `browser is connected; run the SummitOS visual QA suite`.

Codex will capture desktop/mobile screenshots, console errors, network failures, approval behavior, and the main demo workflow.

## 6. Desktop neural voice calibration

1. Start Voicebox.
2. Confirm the server is Online at `http://127.0.0.1:17493`.
3. Confirm `Jarvis Local` exists and uses the preferred neural engine.
4. Start the `Summit OS — JARVIS Command Center` desktop shortcut.
5. Click **Pair local neural voice** only if it is not already paired.
6. Select the correct microphone, preferably a headset for the first duplex test.
7. Turn on **Always listening** and **Voice on**.
8. Say: `Jarvis, give me my executive brief.`
9. While Jarvis speaks, say: `Jarvis, stop. What is my next meeting?`
10. Confirm the first response stops and the second request is answered once.
11. Press Escape and confirm all audio stops immediately.

If speaker echo triggers false interruptions, use a headset and report the mic percentage shown during Jarvis speech so the VAD threshold can be calibrated to the room.

## 7. Telegram acceptance test

Telegram is already configured in Railway.

1. Send `integration status` to `@Summit_Jarvis_Bot`.
2. Send `triage my inbox`.
3. Send `draft an email to YOUR_SECOND_EMAIL with subject Telegram test and body Drafted from Telegram.`
4. Confirm Jarvis returns an action ID without sending anything.
5. Send `/approve ACTION_ID`.
6. Verify the Gmail draft and the Telegram receipt.

## 8. Final company-operating-system demo

Run this exact sequence without refreshing or repairing anything mid-demo:

1. `Give me my executive brief and rank today's three highest-cash-impact actions.`
2. `Which open opportunities are stale?`
3. `Who should I call first and why?`
4. `Research that company and prepare a cold-call brief.`
5. `Prepare me for my next meeting.`
6. `When am I free for a 30-minute follow-up?`
7. `Create the calendar event.` Approve it and verify the receipt.
8. `Triage my inbox.`
9. Create and approve a Gmail draft.
10. Post the summary to Slack after approval.
11. Repeat a read request through Telegram, SMS, and phone.
12. Interrupt desktop and phone speech successfully.
13. Confirm scraper contacts increased while outbound email/SMS remained zero.

Only after every item passes should the system be described as ready for a high-stakes external demo.
