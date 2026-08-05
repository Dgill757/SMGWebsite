import hashlib
import hmac
import os
import time
import unittest
from pathlib import Path
from unittest.mock import patch

import ava_demo_studio_api as api


class SlackEventSecurityTests(unittest.TestCase):
    def test_valid_signature_is_accepted(self):
        body = b'{"type":"event_callback"}'
        timestamp = str(int(time.time()))
        secret = "test-signing-secret"
        signature = "v0=" + hmac.new(secret.encode(), b"v0:" + timestamp.encode() + b":" + body, hashlib.sha256).hexdigest()
        with patch.dict(os.environ, {"SLACK_SIGNING_SECRET": secret}, clear=False):
            self.assertTrue(api._verify_slack_request(body, timestamp, signature))

    def test_invalid_or_stale_signature_is_rejected(self):
        with patch.dict(os.environ, {"SLACK_SIGNING_SECRET": "secret"}, clear=False):
            self.assertFalse(api._verify_slack_request(b"{}", str(int(time.time())), "v0=wrong"))
            self.assertFalse(api._verify_slack_request(b"{}", str(int(time.time()) - 601), "v0=wrong"))

    def test_manifest_and_event_router_use_mentions_only(self):
        root = Path(__file__).resolve().parents[1]
        manifest = (root / "docs" / "summitos-slack-app-manifest.yml").read_text(encoding="utf-8")
        source = (root / "ava_demo_studio_api.py").read_text(encoding="utf-8")
        self.assertIn("- app_mention", manifest)
        self.assertNotIn("- message.channels", manifest)
        self.assertIn('event.get("type") == "app_mention"', source)


if __name__ == "__main__":
    unittest.main()
