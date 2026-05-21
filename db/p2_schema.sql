-- DeskPilot Academy — P2 schema (authentication + shared identity).
-- Run this in the Supabase SQL editor AFTER db/p1_schema.sql.
-- Idempotent: re-running is safe.
--
-- Operator setup that pairs with this schema (do in the Supabase/Google/
-- Cloudflare dashboards — not in code):
--   1. Google Cloud: create an OAuth 2.0 Web client. Authorized redirect URI:
--      https://<project-ref>.supabase.co/auth/v1/callback
--   2. Supabase -> Auth -> Providers -> Google: paste client ID + secret, enable.
--   3. Supabase -> Auth -> URL Configuration:
--        Site URL: https://www.deskpilot.academy
--        Redirect URLs: https://www.deskpilot.academy/auth/callback,
--                       https://deskpilot.academy/auth/callback,
--                       http://localhost:3000/auth/callback,
--                       https://*.vercel.app/auth/callback
--      (No SaaS-domain entries — the future SaaS domain is not locked yet.)
--   4. Cloudflare Turnstile: create a free widget; put the keys in
--      NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY (Vercel env).
--   5. Provision a founder: Auth -> Users -> "Invite user". The trigger below
--      auto-creates their profile row; then set their access via SQL editor
--      (service-role context):
--        update public.profiles
--          set products = '{academy}', founders_member = true
--          where email = 'founder@example.com';

----------------------------------------------------------------------
-- profiles
--   - 1:1 with auth.users. The shared-identity table for the unified
--     DeskPilot platform.
--   - products[] tracks per-product access ('academy', and future products).
--     A newly invited user has products = '{}' (NO academy access) until an
--     operator grants it. This powers the dashboard "no access yet" state.
--   - products[] and founders_member are ACCESS-CONTROL state: they are
--     service-role-only via column-level GRANTs below. Users cannot escalate
--     their own access. (This is enforced in P2, not deferred to P3.)
----------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  products text[] not null default '{}',
  founders_member boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Row policies: a user sees and may update only their own row.
drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles service role full access" on public.profiles;
create policy "profiles service role full access" on public.profiles
  for all using (auth.role() = 'service_role');

-- COLUMN-LEVEL privilege hardening. RLS gates WHICH ROW; these GRANTs gate
-- WHICH COLUMNS the authenticated role may write. Display fields only —
-- products[] and founders_member are intentionally excluded, so an
-- authenticated user attempting `update profiles set products = ...` is
-- rejected at the column-privilege layer ("permission denied for ... products").
-- service_role bypasses this entirely (admin provisioning still works).
revoke update on public.profiles from anon, authenticated;
grant update (email, full_name, avatar_url) on public.profiles to authenticated;

----------------------------------------------------------------------
-- handle_new_user trigger
--   - Auto-creates a profile row on signup.
--   - security definer + empty search_path is the hardened Supabase pattern
--     (prevents the SECURITY DEFINER search-path attack). All objects are
--     fully schema-qualified because search_path is empty.
--   - on conflict do nothing keeps it idempotent against re-runs / manual
--     "Add user" provisioning.
----------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

----------------------------------------------------------------------
-- Verification (run manually as needed)
--   - Column-level RLS proof: connect as an authenticated (non-service) user
--     and run — this MUST fail:
--       update public.profiles set products = '{academy,saas}' where id = auth.uid();
--     while this MUST succeed:
--       update public.profiles set full_name = 'Test' where id = auth.uid();
----------------------------------------------------------------------
