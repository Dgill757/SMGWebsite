import requests, os, sys
from dotenv import load_dotenv
load_dotenv()
API = "https://ava-studio-api-production.up.railway.app"
KEY = os.getenv("AVA_API_KEY", "")
H = {"Content-Type": "application/json", "X-API-Key": KEY}
tests = [
    ("GET", "/health", None, "status"),
    ("GET", "/analytics/summary", None, "mrr"),
    ("GET", "/clients", None, "clients"),
    ("GET", "/outreach/hot-leads?limit=5", None, None),
    ("GET", "/analytics/activity-feed?limit=10", None, None),
    ("GET", "/agents/status", None, "agents"),
    ("GET", "/ceo/summary", None, "mrr"),
    ("GET", "/businesses/stats", None, "total"),
    ("POST", "/dispatch", {"command": "status"}, "status"),
]
print("ENDPOINT TESTS\n" + "="*50)
passed = 0
for method, path, body, key in tests:
    try:
        r = requests.get(API+path, headers=H, timeout=15) if method=="GET" else requests.post(API+path, headers=H, json=body, timeout=15)
        ok = r.status_code == 200
        data = r.json() if ok else {}
        has = (key in data) if key else True
        status = "PASS" if ok and has else "FAIL"
        if ok and has: passed += 1
        print(f"{status}  {method} {path} -> {r.status_code}")
        if not ok: print(f"       {r.text[:100]}")
    except Exception as e:
        print(f"FAIL  {method} {path} -> {str(e)[:60]}")
print(f"\n{passed}/{len(tests)} passed")
sys.exit(0 if passed == len(tests) else 1)
