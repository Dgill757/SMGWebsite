-- SummitOS Prospect Workbench. Run once in Supabase SQL Editor. Safe to rerun.
alter table growth_settings add column if not exists dial_to_conversation_rate numeric not null default .12;
alter table growth_settings add column if not exists conversation_to_booking_rate numeric not null default .20;
alter table growth_settings add column if not exists show_rate numeric not null default .80;
alter table growth_settings add column if not exists close_rate numeric not null default .25;

create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  run_id text unique not null,
  agent_id text not null,
  agent_name text,
  department text,
  status text not null default 'running',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_ms integer,
  provider text,
  model text,
  input_summary text,
  output_summary text,
  output_count integer default 0,
  artifacts jsonb default '[]'::jsonb,
  blockers jsonb default '[]'::jsonb,
  cost_usd numeric,
  error_class text,
  metadata jsonb default '{}'::jsonb
);
create index if not exists agent_runs_agent_time on agent_runs(agent_id, started_at desc);
alter table agent_runs enable row level security;
drop policy if exists service_role_all on agent_runs;
create policy service_role_all on agent_runs for all using (true) with check (true);

create table if not exists prospect_intelligence (
  business_id uuid primary key references scraped_businesses(id) on delete cascade,
  ghl_contact_id text,
  pagespeed jsonb not null default '{}'::jsonb,
  website_snapshot jsonb not null default '{}'::jsonb,
  sales_brief jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
create table if not exists prospect_notes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references scraped_businesses(id) on delete cascade,
  ghl_contact_id text,
  note text not null,
  outcome text not null default 'note',
  called boolean not null default false,
  created_at timestamptz default now()
);
create table if not exists prospect_call_list (
  id uuid primary key default gen_random_uuid(),
  list_name text not null default 'Today''s Call List',
  business_id uuid not null references scraped_businesses(id) on delete cascade,
  ghl_contact_id text,
  status text not null default 'queued',
  added_at timestamptz default now(),
  completed_at timestamptz,
  unique(list_name, business_id)
);
create index if not exists prospect_notes_business on prospect_notes(business_id, created_at desc);
create index if not exists prospect_call_list_name on prospect_call_list(list_name, status, added_at desc);
alter table prospect_intelligence enable row level security;
alter table prospect_notes enable row level security;
alter table prospect_call_list enable row level security;
drop policy if exists service_role_all on prospect_intelligence;
drop policy if exists service_role_all on prospect_notes;
drop policy if exists service_role_all on prospect_call_list;
create policy service_role_all on prospect_intelligence for all using (true) with check (true);
create policy service_role_all on prospect_notes for all using (true) with check (true);
create policy service_role_all on prospect_call_list for all using (true) with check (true);
