create extension if not exists pgcrypto;

create table if not exists public.guesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  guess_date date not null,
  code text not null,
  created_at timestamptz not null default now(),
  paid boolean not null default false,
  paid_at timestamptz null,
  -- Future payment fields (for later Stripe/PayPal upgrades)
  payment_provider text null,
  payment_id text null
);

alter table public.guesses enable row level security;

-- Allow everyone to read guesses (for displaying bet counts)
create policy "allow_select_all"
on public.guesses for select
using (true);

-- MVP uses service-role inserts via server action
-- If you want to allow anon insert in the future, uncomment this policy:
-- create policy "allow_insert_to_anon"
-- on public.guesses for insert to anon
-- with check (char_length(name) between 1 and 64);

