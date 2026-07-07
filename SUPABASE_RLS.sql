-- ============================================================================
-- SUPABASE_RLS.sql  -  Summit OS security lockdown
-- Applied via Supabase MCP on 2026-07-06 (this file is the record; it is
-- also safe to re-run in the SQL Editor - statements are idempotent).
--
-- ARCHITECTURE AFTER THIS CHANGE:
--   Browser dashboard  ->  Railway API (/db/* proxy, password checked
--                          server-side)  ->  Supabase with SERVICE key
--   Local agent fleet  ->  Supabase with SERVICE key (from .env)
--   The anon key (public in HTML for months) has ZERO access.
--   service_role bypasses RLS, so no policies are required for it.
--
-- PREREQS ALREADY DEPLOYED (do not run this file before them):
--   1. Railway API with /db/{table} proxy + DASHBOARD_PASSWORDS auth
--   2. Dashboard with no Supabase key (avastudio.summitvoiceai.com)
--   3. scripts\daily_enrich_new.py + scripts\website_notifier.py switched
--      from hardcoded anon key to env SUPABASE_KEY (service role)
-- ============================================================================

-- STEP 1: enable RLS on the 10 previously-unprotected tables
-- (tested one table first - hot_leads - then the rest)
ALTER TABLE public.hot_leads            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraper_runs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_runs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghl_activity         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_status         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demos                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.morning_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_analysis    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_build_queue  ENABLE ROW LEVEL SECURITY;

-- STEP 2: remove the wide-open anon policies that made the other 6 tables
-- world-readable/writable despite RLS being "enabled"
DROP POLICY IF EXISTS anon_insert_clients      ON public.clients;
DROP POLICY IF EXISTS anon_select_clients      ON public.clients;
DROP POLICY IF EXISTS anon_update_clients      ON public.clients;
DROP POLICY IF EXISTS anon_delete_content      ON public.content_library;
DROP POLICY IF EXISTS anon_insert_content      ON public.content_library;
DROP POLICY IF EXISTS anon_select_content      ON public.content_library;
DROP POLICY IF EXISTS anon_update_content      ON public.content_library;
DROP POLICY IF EXISTS anon_all_demos_built     ON public.demos_built;
DROP POLICY IF EXISTS anon_all_expenses        ON public.expenses;
DROP POLICY IF EXISTS anon_all_free_sites      ON public.free_sites;
DROP POLICY IF EXISTS anon_insert_businesses   ON public.scraped_businesses;
DROP POLICY IF EXISTS anon_select_businesses   ON public.scraped_businesses;
DROP POLICY IF EXISTS anon_update_businesses   ON public.scraped_businesses;

-- RESULT: all 16 public tables have RLS on and no anon/authenticated
-- policies. Only the service_role key (Railway + local fleet) can touch data.
--
-- ROLLBACK (if something breaks and you need the old behavior temporarily):
--   CREATE POLICY anon_ro ON public.<table> FOR SELECT TO anon USING (true);
-- ...but fix the caller instead. Nothing legitimate uses the anon key now.
