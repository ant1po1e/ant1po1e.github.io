-- Run this once in the Supabase SQL editor (or via `supabase db push`) on a
-- fresh project. It sets up the three tables and the storage bucket that
-- replace the old Google Sheets feeds and @vercel/blob storage.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- messages: contact form submissions (was the CONTACT_MESSAGES_FEED_URL
-- Google Sheet). Anyone can submit one; only the server (service role,
-- via the authenticated /api/messages GET route) can read them back.
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

drop policy if exists "public can submit messages" on public.messages;
create policy "public can submit messages"
  on public.messages for insert
  to anon
  with check (true);

-- No SELECT policy for anon/authenticated on purpose: only the service
-- role (used server-side in api/messages.ts) can read the inbox.

-- ---------------------------------------------------------------------
-- beatmaps: contributed beatmaps list (was the VITE_BEATMAP_FEED_URL
-- Google Sheet). Publicly readable — the client fetches this directly
-- with the anon key. Manage rows from the Supabase table editor, or wire
-- up an admin form later; there is no public write policy.
-- ---------------------------------------------------------------------
create table if not exists public.beatmaps (
  id uuid primary key default gen_random_uuid(),
  link text not null,
  title text not null,
  artist text not null,
  badges text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.beatmaps enable row level security;

drop policy if exists "public can read beatmaps" on public.beatmaps;
create policy "public can read beatmaps"
  on public.beatmaps for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------
-- shortlinks: the vault's link shortener (was a single JSON index blob).
-- Public SELECT is required so the redirect handler (used by the anon
-- client would need it) — but the app's redirect route actually runs
-- server-side with the service role key, so this policy is a convenience
-- rather than a requirement. Writes stay service-role-only.
-- ---------------------------------------------------------------------
create table if not exists public.shortlinks (
  slug text primary key,
  url text not null,
  clicks integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.shortlinks enable row level security;

drop policy if exists "public can read shortlinks" on public.shortlinks;
create policy "public can read shortlinks"
  on public.shortlinks for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------
-- Storage bucket for vault files (was @vercel/blob's "v/" prefix).
-- Public so uploaded files/images can be shared via a plain URL, same as
-- before. All writes (upload/delete) go through the authenticated
-- serverless functions using the service role key, which bypasses these
-- policies entirely — the public policy below only covers reads.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('vault', 'vault', true)
on conflict (id) do nothing;

drop policy if exists "public can read vault files" on storage.objects;
create policy "public can read vault files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'vault');
