# SummitOS Slack owner setup

Use one public channel named `summit-os-command-center`. The bot responds to @mentions in that channel and keeps each thread as a separate conversation.

## Create the app

1. Open https://api.slack.com/apps and select **Create New App**.
2. Select **From an app manifest**, then choose your Summit workspace.
3. Select **YAML** and paste the entire contents of `docs/summitos-slack-app-manifest.yml`.
4. Create the app, open **OAuth & Permissions**, and select **Install to Workspace**.
5. Confirm the bot scopes: `app_mentions:read`, `channels:history`, `chat:write`, and `incoming-webhook`.

## Create and authorize the channel

1. In Slack, create the public channel `summit-os-command-center`.
2. Open the channel and invite the bot with `/invite @SummitOS Jarvis`.
3. Right-click the channel name, choose **View channel details**, and copy its channel ID. It starts with `C`.
4. Open your Slack profile, select **More**, then **Copy member ID**. It starts with `U`.

## Copy the five required values

- **OAuth & Permissions** -> Bot User OAuth Token: `SLACK_BOT_TOKEN` (`xoxb-...`).
- **Basic Information** -> App Credentials -> Signing Secret: `SLACK_SIGNING_SECRET`.
- The channel ID: both `SLACK_CHANNEL_ID` and `SLACK_ALLOWED_CHANNEL_IDS`.
- Your member ID: `SLACK_ALLOWED_USER_IDS`.
- **Incoming Webhooks** -> activate, then **Add New Webhook to Workspace** and choose `summit-os-command-center`: `SLACK_WEBHOOK_URL`.

Store those values in Railway's `ava-studio-api` service variables. Never paste them into source files, GitHub, screenshots, or chat.

For local scheduled reports, also add only `SLACK_WEBHOOK_URL` to the ignored local `.env` used by the SummitOS scripts. This lets the local reporting jobs post to the same channel. The bot token and signing secret should remain in Railway unless a local process explicitly needs them.

## Enable and test events

1. Return to **Event Subscriptions**. The request URL must be `https://ava-studio-api-production.up.railway.app/jarvis/slack/events` and show **Verified**.
2. Under **Subscribe to bot events**, confirm `app_mention` and `message.channels`.
3. Reinstall the app if Slack shows a banner saying scopes changed.
4. In the channel, send `@SummitOS Jarvis what should I focus on today?`
5. Jarvis should answer in a thread. Continue in that thread to preserve context.

The server validates Slack's signing secret, rejects requests older than five minutes, ignores duplicate events, and permits only the configured channel and member IDs.
