"""Pre-deploy secret scanner. Fails the build if a deployable file contains
something that looks like a live credential. Patterns are generic on purpose -
we do NOT hardcode the real secret values here (that would leak them in a
tracked file). Run before any Vercel deploy: python security_check.py"""
import re, sys

files_to_check = ["vercel_deploy/index.html", "ava_demo_studio_api.py"]

# Generic patterns - match the SHAPE of a secret, never a specific value.
forbidden = [
    r"summit20\d\d",                 # legacy dashboard passwords
    r"ava20\d\d",
    r"pit-[a-z0-9\-]{20,}",          # GHL private token
    r"sk-ant-[a-zA-Z0-9\-]{30,}",    # Anthropic key
    r"eyJhbGciOiJIUz[A-Za-z0-9_\-]{10,}",  # Supabase/JWT
    r"cm9sZSI6ImFub24i",             # base64 of "role":"anon" (Supabase anon JWT payload)
    r"\b[0-9a-f]{32}\b",             # any 32-hex API key (e.g. the old AVA key)
    r"xox[bp]-[0-9A-Za-z\-]{10,}",   # Slack token
    r"fc-[0-9a-f]{20,}",             # Firecrawl key
]

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
    for v in violations:
        print(v)
    sys.exit(1)
print("Security check passed - safe to deploy")
