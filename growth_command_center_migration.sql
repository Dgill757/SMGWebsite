-- SummitOS Revenue Command Center
-- Run once in the Supabase SQL Editor. Safe to rerun.
create table if not exists growth_settings (
  id text primary key default 'owner',
  target_mrr numeric not null default 10000,
  target_date date not null,
  average_monthly_price numeric not null default 797,
  average_setup_fee numeric not null default 1500,
  workdays_per_week integer not null default 5,
  dials_goal integer not null default 120,
  conversations_goal integer not null default 15,
  meetings_booked_goal integer not null default 3,
  demos_held_goal integer not null default 2,
  proposals_goal integer not null default 1,
  followups_goal integer not null default 10,
  content_goal integer not null default 1,
  updated_at timestamptz default now()
);

create table if not exists daily_growth_activity (
  activity_date date primary key,
  dials integer not null default 0,
  conversations integer not null default 0,
  meetings_booked integer not null default 0,
  demos_held integer not null default 0,
  proposals integer not null default 0,
  followups integer not null default 0,
  content_published integer not null default 0,
  new_clients integer not null default 0,
  new_mrr numeric not null default 0,
  updated_at timestamptz default now()
);

alter table growth_settings enable row level security;
alter table daily_growth_activity enable row level security;
drop policy if exists service_role_all on growth_settings;
drop policy if exists service_role_all on daily_growth_activity;
create policy service_role_all on growth_settings for all using (true) with check (true);
create policy service_role_all on daily_growth_activity for all using (true) with check (true);

insert into growth_settings (id, target_mrr, target_date)
values ('owner', 10000, current_date + 30)
on conflict (id) do nothing;
