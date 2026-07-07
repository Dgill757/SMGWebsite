import os
from dotenv import load_dotenv
load_dotenv()
import asyncio, httpx, json, time

GHL_TOKEN = __import__("os").getenv("GHL_PRIVATE_TOKEN", "")
SUPA_URL  = "https://omdpkeaqgtizakdfughq.supabase.co"
SUPA_KEY  = __import__("os").getenv("SUPABASE_ANON_KEY", "")

supa_h = {"apikey": SUPA_KEY, "Authorization": f"Bearer {SUPA_KEY}", "Content-Type": "application/json"}
ghl_h  = {"Authorization": f"Bearer {GHL_TOKEN}", "Version": "2021-07-28"}

async def run():
    async with httpx.AsyncClient(timeout=30) as c:
        # Get up to 500 unenriched records
        r = await c.get(f"{SUPA_URL}/rest/v1/scraped_businesses",
            headers=supa_h,
            params={"company_name": "is.null", "order": "scraped_at.desc", "limit": "500"})
        records = r.json() if r.status_code == 200 else []
        print(f"Found {len(records)} unenriched records")
        
        updated = 0
        errors  = 0
        for i, rec in enumerate(records):
            cid = rec.get("ghl_contact_id")
            if not cid:
                continue
            try:
                gr = await c.get(f"https://services.leadconnectorhq.com/contacts/{cid}", headers=ghl_h)
                if gr.status_code == 200:
                    ct = gr.json().get("contact", {})
                    patch = {
                        "company_name": ct.get("companyName") or ct.get("name") or "Unknown",
                        "phone": ct.get("phone", ""),
                        "email": ct.get("email", ""),
                        "website": ct.get("website", ""),
                        "city": ct.get("city", ""),
                        "state": ct.get("state", ""),
                    }
                    patch = {k: v for k, v in patch.items() if v}
                    if patch:
                        pr = await c.patch(
                            f"{SUPA_URL}/rest/v1/scraped_businesses?id=eq.{rec['id']}",
                            headers={**supa_h, "Prefer": "return=minimal"},
                            json=patch)
                        if pr.status_code in (200, 204):
                            updated += 1
                elif gr.status_code == 429:
                    print(f"Rate limited at record {i}, pausing...")
                    await asyncio.sleep(2)
                else:
                    errors += 1
            except Exception as e:
                errors += 1
            
            if (i+1) % 20 == 0:
                print(f"  Progress: {i+1}/{len(records)} | updated={updated} errors={errors}")
                await asyncio.sleep(0.3)  # throttle
        
        print(f"DONE: updated={updated}, errors={errors}")

asyncio.run(run())