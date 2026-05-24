-- GuestPulse initial schema
-- Run via: supabase db push   (or paste into the Supabase SQL editor)

create extension if not exists "pgcrypto";

create table if not exists public.hotels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  google_review_url text,
  tripadvisor_review_url text,
  alert_email text,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references public.hotels (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  department text not null default 'General',
  comment text not null default '',
  guest_name text not null default 'Anonymous guest',
  room text not null default '',
  resolved boolean not null default false,
  -- AI enrichment (nullable until analyze-feedback runs)
  urgency text check (urgency in ('high', 'medium', 'low')),
  ai_label text,
  ai_suggestion text,
  ai_summary text,
  alert_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists feedback_hotel_created_idx
  on public.feedback (hotel_id, created_at desc);
create index if not exists feedback_unresolved_idx
  on public.feedback (resolved) where resolved = false;

-- Row Level Security ---------------------------------------------------------
alter table public.hotels enable row level security;
alter table public.feedback enable row level security;

-- Guests (anon key) may submit feedback and read hotel branding, but may NOT
-- read other guests' feedback. Staff dashboards use authenticated/service access.
drop policy if exists "anon can read hotels" on public.hotels;
create policy "anon can read hotels"
  on public.hotels for select
  using (true);

drop policy if exists "anon can insert feedback" on public.feedback;
create policy "anon can insert feedback"
  on public.feedback for insert
  with check (true);

-- Demo-friendly read policy. For production, replace with an authenticated
-- staff check (e.g. using (auth.role() = 'authenticated')).
drop policy if exists "read feedback" on public.feedback;
create policy "read feedback"
  on public.feedback for select
  using (true);

drop policy if exists "update feedback resolution" on public.feedback;
create policy "update feedback resolution"
  on public.feedback for update
  using (true)
  with check (true);

-- Seed a default hotel matching the demo UI ---------------------------------
insert into public.hotels (name, slug, google_review_url, tripadvisor_review_url, alert_email)
values (
  'The Grand Hotel',
  'grand-hotel',
  'https://search.google.com/local/writereview?placeid=REPLACE_ME',
  'https://www.tripadvisor.com/UserReview-REPLACE_ME',
  'manager@example.com'
)
on conflict (slug) do nothing;
