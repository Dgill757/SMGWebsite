"""
SUMMIT OS — Railway Redeploy Script
Reads credentials captured by other Playwright scripts,
pushes any missing Railway variables, then runs railway up.

Run AFTER: playwright_slack_setup.py and playwright_github_token.py (if used)
Run: python playwright_railway_deploy.py
"""
import os, subprocess, sys
from dotenv import dotenv_values

ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")

# Keys that must be in Railway for the system to work
REQUIRED_VARS = [
    "ANTHROPIC_API_KEY", "FIRECRAWL_API_KEY", "GHL_PRIVATE_TOKEN",
    "GHL_LOCATION_ID", "VERCEL_TOKEN", "SUPABASE_URL", "SUPABASE_KEY",
    "AVA_API_KEY", "GITHUB_TOKEN",
]
OPTIONAL_VARS = ["SLACK_WEBHOOK_URL", "SLACK_BOT_TOKEN", "HEYGEN_API_KEY",
                 "SLYBROADCAST_USER", "THINKER_EMAIL", "THINKER_PASSWORD"]


def railway_cmd(*args) -> tuple[int, str]:
    result = subprocess.run(["railway"] + list(args), capture_output=True, text=True)
    return result.returncode, (result.stdout + result.stderr).strip()


def railway_set(key: str, value: str) -> bool:
    code, out = railway_cmd("variables", "set", f"{key}={value}")
    ok = code == 0
    print(f"  {'✓' if ok else '✗'} {key} {'set' if ok else '— ' + out[:60]}")
    return ok


def main():
    print("=== Railway Deploy Script ===\n")

    # Check railway CLI is logged in
    code, out = railway_cmd("whoami")
    if code != 0 or "not logged in" in out.lower():
        print("⚠  Railway CLI not logged in.")
        print("   Run in your terminal: railway login")
        print("   Then re-run this script.\n")
        sys.exit(1)
    print(f"✓ Railway CLI: logged in as {out}\n")

    # Read .env
    env = dotenv_values(ENV_PATH) if os.path.exists(ENV_PATH) else {}

    # Set any missing vars from .env
    print("Syncing environment variables to Railway...")
    all_keys = REQUIRED_VARS + OPTIONAL_VARS
    set_count = 0
    for key in all_keys:
        val = env.get(key, "")
        if val and not val.startswith("YOUR_") and val != "":
            if railway_set(key, val):
                set_count += 1

    # Also check result files from other Playwright scripts
    for fname, key in [("SLACK_SETUP_RESULTS.txt", None),
                       ("GITHUB_TOKEN_RESULT.txt", "GITHUB_TOKEN")]:
        if os.path.exists(fname) and key:
            try:
                with open(fname) as f:
                    for line in f:
                        if line.startswith(f"{key}="):
                            val = line.strip().split("=", 1)[1]
                            if val:
                                railway_set(key, val)
            except Exception:
                pass

    print(f"\n{set_count} variables synced.")
    print("\nDeploying to Railway (railway up)...")

    code, out = railway_cmd("up")
    if code == 0:
        print("✓ Deploy started successfully")
        print("  Monitor at: https://railway.app/project/e81ac474-f5cb-4075-96d8-3895ca660237")
    else:
        print(f"✗ Deploy failed: {out[:200]}")
        print("\nTry manually:")
        print("  cd C:\\Users\\DanGi\\Downloads\\SummitVoiceAiWorkflowsandDemoMachine")
        print("  railway up")

    print("\n[VERIFY] Run after deploy completes (1-2 min):")
    print("  curl https://ava-studio-api-production.up.railway.app/health")


if __name__ == "__main__":
    main()
