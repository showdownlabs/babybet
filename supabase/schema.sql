create extension if not exists pgcrypto;

-- Status enum for babies
create type baby_status as enum ('active', 'inactive');

-- Babies table
create table if not exists public.babies (
  id uuid primary key default gen_random_uuid(),
  firstname text null,
  lastname text not null,
  status baby_status not null default 'active',
  url_path text not null unique,
  due_date date not null,
  window_start date not null,
  window_end date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint url_path_format check (url_path ~ '^[a-z0-9-]+$')
);

alter table public.babies enable row level security;

-- Allow everyone to read active babies
create policy "allow_select_active_babies"
on public.babies for select
using (status = 'active');

-- Guesses table
create table if not exists public.guesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  guess_date date not null,
  code text not null,
  created_at timestamptz not null default now(),
  paid boolean not null default false,
  paid_at timestamptz null,
  payment_provider text not null default 'venmo',
  payment_id text null,
  user_id uuid references auth.users(id) on delete set null,
  baby_id uuid not null references public.babies(id) on delete cascade,
  constraint payment_provider_check check (payment_provider in ('venmo', 'cash'))
);

create index idx_guesses_user_id on public.guesses(user_id);
create index idx_guesses_baby_id on public.guesses(baby_id);

alter table public.guesses enable row level security;

-- Allow reading guesses for active babies
create policy "allow_select_guesses_for_active_babies"
on public.guesses for select
using (
  baby_id is null or 
  exists (
    select 1 from public.babies 
    where babies.id = guesses.baby_id 
    and babies.status = 'active'
  )
);

-- Profiles table for user data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Allow users to read all profiles (for displaying avatars)
create policy "allow_select_all_profiles"
on public.profiles for select
using (true);

-- Allow users to insert their own profile
create policy "allow_insert_own_profile"
on public.profiles for insert
with check (auth.uid() = id);

-- Allow users to update their own profile
create policy "allow_update_own_profile"
on public.profiles for update
using (auth.uid() = id);

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

