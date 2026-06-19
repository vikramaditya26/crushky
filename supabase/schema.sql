-- Crushky — initial schema (Sector 1, Step B.1)
-- Paste this whole file into Supabase → SQL Editor → New query → Run.

-- A profile row per user. Owned by the Supabase auth user (auth.uid()).
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  name         text,
  dob          date,
  gender       text,
  looking_for  text,
  height_ft    int,
  height_in    int,
  city         text,
  work         text,
  bio          text,
  instagram    text,
  spotify      text,
  interests    jsonb default '{}'::jsonb,   -- { music: [...], film: [...], books: [...] }
  prompts      jsonb default '{}'::jsonb,   -- { weekend: "...", ... }
  photos       jsonb default '[]'::jsonb,   -- selected photo indices / URLs
  ai_profile   jsonb default '{}'::jsonb,   -- extracted personality (filled later, Sector 3)
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Row Level Security: a user can only see and edit their own profile.
alter table public.profiles enable row level security;

drop policy if exists "own profile read"   on public.profiles;
drop policy if exists "own profile insert" on public.profiles;
drop policy if exists "own profile update" on public.profiles;

create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);
