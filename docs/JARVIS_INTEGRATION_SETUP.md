# JARVIS integration setup

## Already operational

- SummitOS / Supabase reporting and client data
- GoHighLevel contacts, pipelines, and conversations
- Firecrawl web research
- Authenticated local connector for approved Windows folders, Git, processes, and gated commands
- Telegram remote channel
- Groq/OpenRouter model failover
- Google Calendar, Gmail, and Drive offline OAuth (verified August 4, 2026)

## Activate durable Jarvis actions

Railway currently falls back to process memory because the operational tables have
not yet been created. Open the `ava-studio` Supabase project, choose SQL Editor, paste
the complete contents of `jarvis_supabase_migration.sql`, and run it once. The API
will automatically begin persisting approvals, queued actions, receipts, and traces.

Do not run this migration against Summit Finance OS, QualifyOS, or another project.

## Google Workspace: persistent offline access

The Google Workspace OAuth connection for `dangill@summitmarketinggroup.co` is live.
These are the recovery/setup steps if the refresh token is revoked or expires.

1. Open Google Cloud Console and create or select the SummitOS project.
2. Enable Gmail API, Google Calendar API, and Google Drive API.
3. Configure the OAuth consent screen for the Summit Marketing Group organization.
4. Create an OAuth 2.0 **Web application** client.
5. Grant only the required scopes initially:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.compose`
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/drive.readonly`
6. Complete a server-side authorization grant with `access_type=offline` and retain the refresh token.
7. Add these Railway variables without putting them in a file or Git:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`

Do not paste these secrets into chat. Add them directly in Railway.

## Slack: persistent Railway access

The Slack plugin is installed and authenticated to `SummitMarketingGroup` for Codex.
For always-on Jarvis access, create a Slack app/bot for that workspace and add either:

- `SLACK_BOT_TOKEN` for read/write channel tools, or
- `SLACK_WEBHOOK_URL` for send-only notifications.

Use the bot token when Jarvis must read channels, threads, and mentions. Invite the bot
only to approved channels initially, including `#ava-dispatch`.

## Safety model

- Reads: execute immediately and record observed results.
- Drafts: may be created without sending when explicitly requested.
- Sends, CRM changes, calendar changes, file writes, and commands: require explicit approval.
- Deletes, contact opt-outs, destructive shell commands, and outreach resumption remain blocked.
- Every external action must use an idempotency key and create an audit event.
