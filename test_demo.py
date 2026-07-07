"""
Summit OS — Quick Demo Machine Test
Builds a demo and opens it in the browser when done.
Run after: railway login && railway up
"""
import time, webbrowser, sys
try:
    import requests
except ImportError:
    import subprocess; subprocess.run(["pip","install","requests","-q"])
    import requests

API = "https://ava-studio-api-production.up.railway.app"
TEST_URL  = "https://www.johnstonroofingcompany.com"
TEST_NAME = "Johnston Roofing"

print(f"=== Demo Machine Test ===")
print(f"Building demo for: {TEST_NAME}")
print(f"Website: {TEST_URL}\n")

# Health check
r = requests.get(f"{API}/health", timeout=10)
data = r.json()
print(f"Railway: {data.get('status','?')} — v{data.get('version','?')}")

# Kick off demo
r = requests.post(f"{API}/demos/create",
    json={"website_url": TEST_URL, "client_name": TEST_NAME, "send_delivery": False},
    timeout=15)
demo = r.json()
demo_id = demo.get("demo_id")
print(f"Demo ID: {demo_id}\n")

# Poll
steps = {
    1:"Scraping website",2:"Extracting brand",3:"Generating audit",
    4:"Building site",5:"Deploying to Vercel",6:"Voice widget",
    7:"Injecting widget",8:"Updating GHL",9:"Sending delivery",10:"Done"
}
last_step = 0
for attempt in range(60):
    time.sleep(5)
    r = requests.get(f"{API}/demos/{demo_id}/status", timeout=10)
    d = r.json()
    step = d.get("step", 0)
    status = d.get("status", "")
    msg = d.get("message", "")

    if step != last_step:
        print(f"  Step {step}/10 — {steps.get(step, msg)}")
        last_step = step

    if status == "done":
        url = d.get("demo_url")
        print(f"\n✓ Demo complete in {attempt*5}s")
        print(f"  URL: {url}")
        print(f"\nOpening in browser...")
        webbrowser.open(url)
        print("\nDoes the site look professional? (Barlow Condensed fonts, navy + orange)")
        print("If YES → template_cloner is working. Railway deploy successful.")
        print("If generic/plain → GITHUB_TOKEN not activated. Run: railway up")
        sys.exit(0)

    if status == "error":
        print(f"\n✗ Demo failed at step {step}: {msg}")
        if "line 1 column 1" in msg or "Expecting value" in msg:
            print("\nRoot cause: Railway is running OLD code (Firecrawl crash bug).")
            print("Fix: cd to this folder then run:  railway login && railway up")
        elif "GITHUB_TOKEN" in msg or "rate limit" in msg.lower():
            print("\nRoot cause: GitHub rate limit (GITHUB_TOKEN not active).")
            print("Fix: railway variables set GITHUB_TOKEN=your_token && railway up")
        else:
            print("Check Railway logs: https://railway.app → your project → Logs")
        sys.exit(1)

print("\n✗ Timeout — demo took too long")
sys.exit(1)
