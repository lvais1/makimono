-- Makimono schema
-- Run in Supabase SQL Editor. Idempotent: safe to re-run.

create extension if not exists "pgcrypto";

-- ============================================================
-- spaces: one row per couple
-- ============================================================
create table if not exists public.spaces (
  id uuid primary key default gen_random_uuid(),
  invite_token text not null unique,
  settings jsonb not null default jsonb_build_object(
    'language', 'he',
    'theme', 'light',
    'user1Name', 'אני',
    'user2Name', 'בת הזוג'
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists spaces_invite_token_idx on public.spaces (invite_token);

-- ============================================================
-- journal_entries
-- ============================================================
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists journal_entries_space_idx on public.journal_entries (space_id, created_at desc);

-- ============================================================
-- ratings
-- ============================================================
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ratings_space_idx on public.ratings (space_id, created_at desc);

-- ============================================================
-- shopping_items
-- ============================================================
create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shopping_items_space_idx on public.shopping_items (space_id, created_at asc);

-- ============================================================
-- completed_challenges
-- ============================================================
create table if not exists public.completed_challenges (
  space_id uuid not null references public.spaces(id) on delete cascade,
  challenge_id text not null,
  notes text,
  completed_at timestamptz not null default now(),
  primary key (space_id, challenge_id)
);

-- ============================================================
-- saved_rolls
-- ============================================================
create table if not exists public.saved_rolls (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists saved_rolls_space_idx on public.saved_rolls (space_id, created_at desc);

-- ============================================================
-- available_ingredients (simple join table)
-- ============================================================
create table if not exists public.available_ingredients (
  space_id uuid not null references public.spaces(id) on delete cascade,
  ingredient_id text not null,
  primary key (space_id, ingredient_id)
);

-- ============================================================
-- RLS: enable on all tables. No policies defined.
-- All app access goes through service_role key (bypasses RLS).
-- This keeps data inaccessible to anon/authenticated roles,
-- and enforces authorization at the application layer (via space cookie).
-- ============================================================
alter table public.spaces enable row level security;
alter table public.journal_entries enable row level security;
alter table public.ratings enable row level security;
alter table public.shopping_items enable row level security;
alter table public.completed_challenges enable row level security;
alter table public.saved_rolls enable row level security;
alter table public.available_ingredients enable row level security;

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists spaces_touch on public.spaces;
create trigger spaces_touch before update on public.spaces
  for each row execute function public.touch_updated_at();

drop trigger if exists journal_entries_touch on public.journal_entries;
create trigger journal_entries_touch before update on public.journal_entries
  for each row execute function public.touch_updated_at();

drop trigger if exists ratings_touch on public.ratings;
create trigger ratings_touch before update on public.ratings
  for each row execute function public.touch_updated_at();

drop trigger if exists shopping_items_touch on public.shopping_items;
create trigger shopping_items_touch before update on public.shopping_items
  for each row execute function public.touch_updated_at();
