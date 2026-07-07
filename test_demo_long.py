import requests, time, sys

API = "https://ava-studio-api-production.up.railway.app"
import os
from dotenv import load_dotenv
load_dotenv()
KEY = os.getenv("AVA_API_KEY", "")

headers = {"Content-Type": "application/json", "X-API-Key": KEY}

print("Starting demo build...")
try:
    r = requests.post(f"{API}/demos/create", json={
        "website_url": "https://www.johnstonroofingcompany.com",
        "client_name": "Johnston Roofing",
        "send_delivery": False
    }, headers=headers, timeout=30)
except Exception as e:
    print(f"FAILED to create: {e}")
    sys.exit(1)

if r.status_code != 200:
    print(f"FAILED: {r.status_code} -- {r.text[:300]}")
    sys.exit(1)

data = r.json()
demo_id = data.get("demo_id") or data.get("id")
print(f"Demo ID: {demo_id}")
print(f"Initial response: {data}")
print("Polling for completion (up to 10 minutes)...")

for attempt in range(60):
    time.sleep(10)
    try:
        s = requests.get(f"{API}/demos/{demo_id}/status", headers=headers, timeout=15)
        if s.status_code == 200:
            sdata = s.json()
            status = sdata.get("status", "building")
            step = sdata.get("current_step", "")
            print(f"  [{attempt+1}] Status: {status} -- {step}")
            
            if status == "complete" and sdata.get("demo_url"):
                url = sdata["demo_url"]
                print(f"\nDEMO COMPLETE: {url}")
                with open("DEMO_TEST_RESULT.txt", "w") as f:
                    f.write(f"Demo URL: {url}\nCompany: Johnston Roofing\nBuilt: {time.strftime('%Y-%m-%d %H:%M')}\nStatus: SUCCESS\n")
                print("Saved to DEMO_TEST_RESULT.txt")
                sys.exit(0)
            
            elif status == "failed":
                err = sdata.get("error", "unknown error")
                print(f"\nDEMO FAILED: {err}")
                with open("DEMO_TEST_RESULT.txt", "w") as f:
                    f.write(f"Status: FAILED\nError: {err}\nTimestamp: {time.strftime('%Y-%m-%d %H:%M')}\n")
                sys.exit(1)
        else:
            print(f"  [{attempt+1}] Poll returned {s.status_code}")
    except requests.exceptions.Timeout:
        print(f"  [{attempt+1}] Still building (poll timeout OK)...")
    except Exception as e:
        print(f"  [{attempt+1}] Poll error: {e}")

print("\nTIMEOUT: Demo did not complete in 10 minutes")
with open("DEMO_TEST_RESULT.txt", "w") as f:
    f.write(f"Status: TIMEOUT\nDemoID: {demo_id}\nTimestamp: {time.strftime('%Y-%m-%d %H:%M')}\n")