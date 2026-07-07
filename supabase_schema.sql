-- Ava Studio — Supabase Schema
-- Run this in Supabase SQL Editor (one paste, one run)

-- Leads table
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  ghl_contact_id text unique,
  company_name text not null,
  website text,
  phone text,
  email text,
  city text,
  state text,
  google_reviews integer default 0,
  segment text default 'A',
  pipeline_stage text,
  has_demo boolean default false,
  demo_url text,
  tags text[],
  scraped_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Demos table
create table if not exists demos (
  id text primary key,
  contact_id text,
  client_name text not null,
  website_url text,
  widget_key text,
  status text default 'queued',
  step integer default 0,
  total_steps integer default 10,
  demo_url text,
  brand_json jsonb,
  audit_text text,
  message text,
  viewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Voice agents table
create table if not exists voice_agents (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  website_url text,
  widget_key text unique,
  status text default 'active',
  thinker_agent_id text,
  created_at timestamptz default now()
);

-- Scraper runs table
create table if not exists scraper_runs (
  id uuid primary key default gen_random_uuid(),
  cities text[],
  leads_found integer default 0,
  leads_pushed_to_ghl integer default 0,
  status text default 'complete',
  started_at timestamptz default now(),
  completed_at timestamptz
);

-- Dispatch log table
create table if not exists dispatch_log (
  id uuid primary key default gen_random_uuid(),
  command text not null,
  triggered_by text default 'console',
  result jsonb,
  demo_id text,
  created_at timestamptz default now()
);

-- GHL activity cache (inbound messages + events)
create table if not exists ghl_activity (
  id uuid primary key default gen_random_uuid(),
  event_type text,
  contact_id text,
  company_name text,
  message_body text,
  intent text,
  pipeline_stage text,
  raw_payload jsonb,
  received_at timestamptz default now()
);

-- Indexes for performance
create index if not exists leads_ghl_contact_id on leads(ghl_contact_id);
create index if not exists leads_company on leads(company_name);
create index if not exists demos_contact_id on demos(contact_id);
create index if not exists demos_status on demos(status);
create index if not exists ghl_activity_contact on ghl_activity(contact_id);
create index if not exists ghl_activity_intent on ghl_activity(intent);
create index if not exists ghl_activity_time on ghl_activity(received_at desc);

-- Row-level security (optional but recommended)
alter table leads enable row level security;
alter table demos enable row level security;
alter table voice_agents enable row level security;
alter table dispatch_log enable row level security;
alter table ghl_activity enable row level security;

-- Allow service role full access (used by Railway backend)
create policy "service_role_all" on leads for all using (true);
create policy "service_role_all" on demos for all using (true);
create policy "service_role_all" on voice_agents for all using (true);
create policy "service_role_all" on dispatch_log for all using (true);
create policy "service_role_all" on ghl_activity for all using (true);

-- Done. Copy your project URL and service_role key from Supabase Settings → API
