import re, sys
files_to_check = ["vercel_deploy/index.html", "ava_demo_studio_api.py"]
forbidden = [r"summit2026", r"ava2026", r"pit-[a-z0-9\-]{30,}", r"sk-ant-[a-zA-Z0-9\-]{40,}",
             r"101226ee5ba8047ffa4881bed74016e0", r"cm9sZSI6ImFub24i"]
violations = []
for fname in files_to_check:
    try:
        with open(fname, encoding="utf-8", errors="ignore") as f:
            content = f.read()
        for pattern in forbidden:
            if re.search(pattern, content):
                violations.append(f"  FOUND /{pattern}/ in {fname}")
    except FileNotFoundError:
        pass
if violations:
    print("SECURITY VIOLATIONS - DO NOT DEPLOY:")
    for v in violations: print(v)
    sys.exit(1)
print("Security check passed - safe to deploy")
