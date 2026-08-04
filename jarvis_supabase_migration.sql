-- JARVIS operational tables. Run once in Supabase SQL Editor.
create table if not exists public.agent_status (
  agent_id text primary key,
  agent_name text not null,
  department text not null,
  status text not null check (status in ('ok','error','blocked','running','offline')),
  last_run timestamptz,
  output_summary text default '',
  output_count integer default 0,
  next_run text default '',
  blockers jsonb default '[]'::jsonb,
  hot_items jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.jarvis_events (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  event_type text not null,
  provider text,
  model text,
  latency_ms integer,
  success boolean not null default true,
  error_class text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.jarvis_connector_tasks (
  id uuid primary key default gen_random_uuid(),
  tool text not null,
  arguments jsonb not null default '{}'::jsonb,
  risk text not null default 'read',
  status text not null default 'queued',
  preview text,
  result jsonb,
  error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.agent_status enable row level security;
alter table public.jarvis_events enable row level security;
alter table public.jarvis_connector_tasks enable row level security;

create index if not exists jarvis_events_created_at on public.jarvis_events(created_at desc);
create index if not exists jarvis_connector_tasks_status on public.jarvis_connector_tasks(status, created_at);
