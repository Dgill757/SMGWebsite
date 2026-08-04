import base64
import os
import pathlib
import unittest
from unittest.mock import AsyncMock, patch

import jarvis_integrations as ji


ROOT = pathlib.Path(__file__).resolve().parents[1]


class FakeResponse:
    def __init__(self, payload):
        self._payload = payload
    def json(self):
        return self._payload


class IntegrationContractTests(unittest.IsolatedAsyncioTestCase):
    def test_capabilities_are_truthful_and_no_permanent_delete(self):
        status = ji.integration_status()
        self.assertIn("trash", status["gmail"]["capabilities"])
        self.assertNotIn("permanent_delete", status["gmail"]["capabilities"])
        self.assertIn("twilio", status)
        self.assertIn("telegram", status)

    def test_gmail_body_prefers_plain_text(self):
        plain = base64.urlsafe_b64encode(b"plain answer").decode().rstrip("=")
        rich = base64.urlsafe_b64encode(b"<b>rich answer</b>").decode().rstrip("=")
        payload = {"parts": [{"mimeType": "text/html", "body": {"data": rich}}, {"mimeType": "text/plain", "body": {"data": plain}}]}
        self.assertEqual(ji._gmail_body(payload), "plain answer")

    async def test_draft_requires_complete_fields(self):
        with self.assertRaises(ji.IntegrationUnavailable):
            await ji.gmail_create_draft({"to": "missing@example.com", "subject": "", "body": "hello"})

    async def test_draft_builds_receipted_raw_message(self):
        request = AsyncMock(return_value=FakeResponse({"id": "draft-1", "message": {"id": "message-1"}}))
        with patch.object(ji, "_google_access_token", AsyncMock(return_value="token")), patch.object(ji, "_request_with_retry", request):
            result = await ji.gmail_create_draft({"to": "owner@example.com", "subject": "Meeting", "body": "Confirmed."})
        self.assertTrue(result["created"]); self.assertEqual(result["draft_id"], "draft-1")
        raw = request.await_args.kwargs["json"]["message"]["raw"]
        decoded = base64.urlsafe_b64decode(raw + "=" * (-len(raw) % 4)).decode()
        self.assertIn("To: owner@example.com", decoded); self.assertIn("Subject: Meeting", decoded)

    async def test_sms_rejects_non_allowlisted_destination_before_network(self):
        with patch.dict(os.environ, {"TWILIO_ACCOUNT_SID": "sid", "TWILIO_AUTH_TOKEN": "auth", "TWILIO_NUMBER": "+15550000000", "JARVIS_ALLOWED_SMS_RECIPIENTS": "+15551111111"}, clear=False):
            with self.assertRaises(ji.IntegrationUnavailable):
                await ji.twilio_send_sms({"to": "+15552222222", "message": "hello"})

    async def test_slack_requires_token_and_channel(self):
        with patch.dict(os.environ, {"SLACK_BOT_TOKEN": "", "SLACK_CHANNEL_ID": ""}, clear=False):
            with self.assertRaises(ji.IntegrationUnavailable):
                await ji.slack_history()


class SafetyAndFrontendTests(unittest.TestCase):
    def test_all_outreach_paths_are_paused(self):
        paths = [pathlib.Path(r"C:\Users\DanGi\outreach\daily_outreach.py"), pathlib.Path(r"C:\Users\DanGi\scripts\ghl_daily_outreach.py"), pathlib.Path(r"C:\Users\DanGi\scripts\ghl_followup.py")]
        for path in paths:
            self.assertIn("OUTREACH_PAUSED = True", path.read_text(encoding="utf-8-sig"), str(path))

    def test_lead_only_scraper_still_creates_contacts(self):
        source = pathlib.Path(r"C:\Users\DanGi\outreach\daily_outreach.py").read_text(encoding="utf-8-sig")
        self.assertIn("create_ghl_contact(lead, city, has_email)", source)
        self.assertIn("if has_email and not OUTREACH_PAUSED", source)

    @unittest.skip("Replaced by safe half-duplex regression below")
    def test_voice_has_neural_bridge_barge_in_and_hard_stop(self):
        html = (ROOT / "vercel_deploy" / "index.html").read_text(encoding="utf-8-sig")
        for contract in ("/voice/generate", "/voice/transcribe", "emergencyStopJarvis", "Echo ignored", "say “Jarvis” to interrupt", "event.key==='Escape'"):
            self.assertIn(contract, html)

    def test_browser_fallback_does_not_overlap_neural_voice(self):
        html = (ROOT / "vercel_deploy" / "index.html").read_text(encoding="utf-8-sig")
        neural_branch = html[html.index("function speakJarvis"):html.index("function jarvisAdd")]
        self.assertIn("return}browserSpeakJarvis(spoken)", neural_branch)

    def test_voice_is_single_flight_and_mic_suspends_during_playback(self):
        html = (ROOT / "vercel_deploy" / "index.html").read_text(encoding="utf-8-sig")
        for contract in ("_jarvisSpeechGeneration++", "_jarvisVoiceAbort.abort()", "stopLocalListening();var generation", "_jarvisRecorder||_jarvisSpeaking", "event.key==='Escape'"):
            self.assertIn(contract, html)

    def test_channel_routes_exist(self):
        source = (ROOT / "ava_demo_studio_api.py").read_text(encoding="utf-8-sig")
        for route in ('/jarvis/telegram/webhook', '/jarvis/sms/webhook', '/jarvis/phone/twiml', '/jarvis/phone/ws', '/jarvis/phone/call'):
            self.assertIn(route, source)

    def test_phone_brain_has_tool_intents_history_and_provider_failover(self):
        api = (ROOT / "ava_demo_studio_api.py").read_text(encoding="utf-8-sig")
        router = (ROOT / "jarvis_model_router.py").read_text(encoding="utf-8-sig")
        self.assertIn('"reach out" in lower', api)
        self.assertIn('tool_name == "calendar_upcoming"', api)
        self.assertIn('tool_name == "prospects_without_website"', api)
        self.assertIn('conversation_history', api)
        self.assertIn('provider == "openai"', router)
        self.assertIn('provider == "gemini"', router)
        self.assertIn('payload["max_completion_tokens"]', router)
        self.assertIn('event.get("type") == "dtmf"', api)
        self.assertIn('validator.validate(public_ws_url', api)

    def test_external_mutations_are_registered_as_write_tools(self):
        expected = {"calendar_create_event", "gmail_create_draft", "gmail_send_draft", "gmail_modify_message", "gmail_trash_message", "gmail_create_label", "slack_send_message", "twilio_send_sms"}
        self.assertTrue(expected.issubset(ji.WRITE_TOOLS))


if __name__ == "__main__":
    unittest.main()
