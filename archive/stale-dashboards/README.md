# Archived dashboards — DO NOT DEPLOY

These are old versions of the Summit OS dashboard. They are kept for history only.

**The live dashboard is `vercel_deploy/index.html`** (served at avastudio.summitvoiceai.com).
It routes all data through the Railway API with a server-side key. It is the only file that
should ever be deployed.

## Why these were archived (2026-07-20)

`index_v6_INSECURE.html` and several `summit_os_v*.html` copies contained a Supabase database
key and a plaintext login password (`ava2026`) directly in the page source, readable by anyone
via "View Source". `ava_studio_FINAL.html` contained a GoHighLevel private token.

Those credentials were **revoked and rotated** — but the files were archived so they can never
be deployed again by accident, and the root `vercel.json` was repointed at the secure file.

**These credentials are still in git history (commit 4e26cd0).** Archiving a file does not
remove it from history. That is why the keys had to be rotated, not just deleted.
