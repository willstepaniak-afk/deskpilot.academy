-- DeskPilot Academy — P1 schema.
-- Run this in the Supabase SQL editor before first deploy.
-- This file is idempotent: re-running is safe.
--
-- Tables created here capture pre-launch demand data. Auth, billing, and
-- the course player land in P2–P7.

----------------------------------------------------------------------
-- Extensions
----------------------------------------------------------------------
create extension if not exists "pgcrypto";

----------------------------------------------------------------------
-- waitlist
--   - Individual signups for launch notification + founders tier.
--   - founders_tier_interest = true means the row counts as a reservation
--     against the founders cohort. Decrement site_state on insert.
----------------------------------------------------------------------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null,
  founders_tier_interest boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

drop policy if exists "service role full access waitlist" on public.waitlist;
create policy "service role full access waitlist" on public.waitlist
  for all using (auth.role() = 'service_role');

----------------------------------------------------------------------
-- b2b_inquiries
--   - Dealer-group sales lead form.
--   - Decrement on founders_b2b_remaining is NOT performed by /api/inquiry.
--     A submitted inquiry is not a closed deal — decrementing on form
--     submission would let anyone manufacture fake scarcity. Decrement
--     manually via the Supabase dashboard (or P3 billing logic) when a
--     B2B founder deal actually closes.
----------------------------------------------------------------------
create table if not exists public.b2b_inquiries (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  dealer_group text not null,
  role text not null,
  rooftops int not null,
  estimated_seats int not null,
  message text,
  source text not null,
  created_at timestamptz not null default now()
);

alter table public.b2b_inquiries enable row level security;

drop policy if exists "service role full access b2b_inquiries" on public.b2b_inquiries;
create policy "service role full access b2b_inquiries" on public.b2b_inquiries
  for all using (auth.role() = 'service_role');

----------------------------------------------------------------------
-- resource_requests
--   - Lead magnet email captures. Same email + same slug is allowed
--     to repeat (no unique constraint) — we want to see redownload
--     intent.
----------------------------------------------------------------------
create table if not exists public.resource_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  resource_slug text not null,
  created_at timestamptz not null default now()
);

alter table public.resource_requests enable row level security;

drop policy if exists "service role full access resource_requests" on public.resource_requests;
create policy "service role full access resource_requests" on public.resource_requests
  for all using (auth.role() = 'service_role');

----------------------------------------------------------------------
-- campus_interest
--   - Per-campus "notify me" captures for coming-soon campuses.
--   - Unique on (email, campus_slug) so duplicate submissions no-op.
----------------------------------------------------------------------
create table if not exists public.campus_interest (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  campus_slug text not null,
  created_at timestamptz not null default now(),
  unique (email, campus_slug)
);

alter table public.campus_interest enable row level security;

drop policy if exists "service role full access campus_interest" on public.campus_interest;
create policy "service role full access campus_interest" on public.campus_interest
  for all using (auth.role() = 'service_role');

----------------------------------------------------------------------
-- site_state
--   - Single-row table holding scarcity counters.
--   - Scalar int columns (not JSONB) enable atomic
--     `UPDATE site_state SET col = col - 1 WHERE id = 1 RETURNING col`
--     under concurrent waitlist submissions — race-condition-free.
--   - Check constraint enforces single row (id = 1).
--   - Public-read policy so /api/counters can use anon client too.
----------------------------------------------------------------------
create table if not exists public.site_state (
  id int primary key default 1 check (id = 1),
  founders_individual_remaining int not null default 100,
  founders_b2b_remaining int not null default 10,
  updated_at timestamptz not null default now()
);

insert into public.site_state (id)
  values (1)
  on conflict (id) do nothing;

alter table public.site_state enable row level security;

drop policy if exists "public read site_state" on public.site_state;
create policy "public read site_state" on public.site_state
  for select using (true);

drop policy if exists "service role write site_state" on public.site_state;
create policy "service role write site_state" on public.site_state
  for all using (auth.role() = 'service_role');

----------------------------------------------------------------------
-- Index recommendations
----------------------------------------------------------------------
create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);
create index if not exists waitlist_founders_interest_idx on public.waitlist (founders_tier_interest) where founders_tier_interest = true;
create index if not exists b2b_inquiries_created_at_idx on public.b2b_inquiries (created_at desc);
create index if not exists resource_requests_email_idx on public.resource_requests (email);
create index if not exists campus_interest_campus_slug_idx on public.campus_interest (campus_slug);
