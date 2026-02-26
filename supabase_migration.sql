-- 1) profiles table
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_pro boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2) scenarios table
create table public.scenarios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  inputs_json jsonb not null,
  outputs_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index scenarios_user_id_updated_at_idx on public.scenarios (user_id, updated_at desc);

-- 3) usage_monthly table
create table public.usage_monthly (
  user_id uuid not null references auth.users(id) on delete cascade,
  yyyymm text not null,   -- format "YYYY-MM" in UTC
  calc_count int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, yyyymm)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.scenarios enable row level security;
alter table public.usage_monthly enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = user_id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = user_id);

-- Scenarios policies
create policy "Users can CRUD own scenarios" on public.scenarios
  for all using (auth.uid() = user_id);

-- Usage monthly policies
create policy "Users can view own usage" on public.usage_monthly
  for select using (auth.uid() = user_id);
create policy "Users can update own usage" on public.usage_monthly
  for update using (auth.uid() = user_id);

-- Trigger to auto-create profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
