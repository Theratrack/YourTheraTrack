-- Phase 6: Supabase Auth + staff-only access
-- Run via: supabase db push   (or paste into the Supabase SQL editor)
--
-- Security model:
--   * Guests (anon) may INSERT feedback and READ hotel branding only.
--   * Guests may NOT read or update feedback.
--   * Only authenticated users listed in public.staff may read/update feedback.
--   * Edge Functions use the service role key and bypass RLS unchanged.

create table if not exists public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  hotel_id uuid references public.hotels (id) on delete cascade,
  full_name text,
  role text not null default 'staff',
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;

-- A staff member can read their own row (used by the client to load profile).
drop policy if exists "staff read own" on public.staff;
create policy "staff read own"
  on public.staff for select
  to authenticated
  using (user_id = auth.uid());

-- SECURITY DEFINER helper so feedback policies can check staff membership
-- without recursive RLS evaluation on public.staff.
create or replace function public.is_staff(target_hotel uuid default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff s
    where s.user_id = auth.uid()
      and (target_hotel is null or s.hotel_id = target_hotel)
  );
$$;

-- Replace the demo-open feedback read/update policies with staff-only ones.
drop policy if exists "read feedback" on public.feedback;
drop policy if exists "update feedback resolution" on public.feedback;

create policy "staff read feedback"
  on public.feedback for select
  to authenticated
  using (public.is_staff(hotel_id));

create policy "staff update feedback"
  on public.feedback for update
  to authenticated
  using (public.is_staff(hotel_id))
  with check (public.is_staff(hotel_id));

-- Guest submission stays public (anon + authenticated may insert).
drop policy if exists "anon can insert feedback" on public.feedback;
create policy "public can insert feedback"
  on public.feedback for insert
  to anon, authenticated
  with check (true);

-- hotels: public read is intentionally retained — guests need name/review URLs.

-- ---------------------------------------------------------------------------
-- Provisioning staff (admin step — no public signup grants access):
--   1. Create the user in Supabase Auth (Dashboard → Authentication → Users,
--      or `supabase auth admin create-user`).
--   2. Link them to the hotel:
--        insert into public.staff (user_id, hotel_id, full_name)
--        values (
--          '<auth-user-uuid>',
--          (select id from public.hotels where slug = 'grand-hotel'),
--          'Front Desk Manager'
--        );
-- ---------------------------------------------------------------------------
