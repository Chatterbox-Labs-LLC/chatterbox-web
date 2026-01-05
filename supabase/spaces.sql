-- 0. Cleanup existing objects to ensure a fresh, idempotent state
-- Use CASCADE to handle dependent policies and triggers automatically
drop table if exists public.messages cascade;
drop table if exists public.channels cascade;
drop table if exists public.space_members cascade;
drop table if exists public.spaces cascade;

-- Drop functions
drop function if exists public.handle_new_space() cascade;
drop function if exists public.check_is_space_member(uuid) cascade;
drop function if exists public.check_is_space_owner(uuid) cascade;
drop function if exists public.generate_invite_code() cascade;

-- 1. Create tables
create table public.spaces (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  slug text not null unique,
  description text,
  icon_url text,
  owner_id uuid references auth.users(id) on delete cascade not null,
  invite_code text unique not null,
  
  constraint name_length check (char_length(name) >= 2),
  constraint slug_length check (char_length(slug) >= 2),
  constraint invite_code_length check (char_length(invite_code) = 8)
);

create table public.space_members (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  space_id uuid references public.spaces(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'member' not null check (role in ('owner', 'admin', 'member')),

  unique(space_id, user_id)
);

create table public.channels (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  space_id uuid references public.spaces(id) on delete cascade not null,
  name text not null,
  slug text not null,
  description text,
  type text default 'text' not null check (type in ('text', 'voice', 'announcement')),
  is_private boolean default false,
  
  unique(space_id, slug)
);

-- 2. Enable RLS
alter table public.spaces enable row level security;
alter table public.space_members enable row level security;
alter table public.channels enable row level security;

-- 3. Create Security Definer functions to break recursion
-- These functions run with the privileges of the creator (bypass RLS)
create or replace function public.check_is_space_member(check_space_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.space_members
    where space_id = check_space_id
    and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

create or replace function public.check_is_space_owner(check_space_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.spaces
    where id = check_space_id
    and owner_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Function to generate a random 8-character alphanumeric invite code
create or replace function public.generate_invite_code()
returns text as $$
declare
  chars text := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
begin
  for i in 1..8 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

-- 4. Create Policies using the functions
-- Policies for spaces
drop policy if exists "Spaces are viewable by everyone for now." on public.spaces;
create policy "Spaces are viewable by everyone for now." on public.spaces
  for select using (true);

drop policy if exists "Owners can update their spaces." on public.spaces;
create policy "Owners can update their spaces." on public.spaces
  for update using (auth.uid() = owner_id);

drop policy if exists "Owners can delete their spaces." on public.spaces;
create policy "Owners can delete their spaces." on public.spaces
  for delete using (auth.uid() = owner_id);

drop policy if exists "Authenticated users can create spaces." on public.spaces;
create policy "Authenticated users can create spaces." on public.spaces
  for insert with check (auth.uid() = owner_id);

-- Policies for space_members
drop policy if exists "Anyone can view members for now." on public.space_members;
create policy "Anyone can view members for now." on public.space_members
  for select using (true);

drop policy if exists "System and owners can manage members." on public.space_members;
create policy "System and owners can manage members." on public.space_members
  for insert with check (true); -- Relaxed for now to allow the trigger and manual joins

drop policy if exists "Owners can delete members." on public.space_members;
create policy "Owners can delete members." on public.space_members
  for delete using (public.check_is_space_owner(space_id));

-- Policies for channels
drop policy if exists "Channels are viewable by everyone for now." on public.channels;
create policy "Channels are viewable by everyone for now." on public.channels
  for select using (true);

drop policy if exists "Owners can manage channels." on public.channels;
create policy "Owners can manage channels." on public.channels
  for all using (public.check_is_space_owner(space_id));

create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  space_id uuid references public.spaces(id) on delete cascade not null,
  channel_id uuid references public.channels(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  type text default 'message' not null check (type in ('message', 'question', 'decision')),
  thread_id uuid references public.messages(id) on delete cascade,
  is_edited boolean default false,
  metadata jsonb default '{}'::jsonb
);

-- Enable Realtime for relevant tables
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

-- Add tables to publication if they are not already there
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'spaces') then
    alter publication supabase_realtime add table public.spaces;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'channels') then
    alter publication supabase_realtime add table public.channels;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'space_members') then
    alter publication supabase_realtime add table public.space_members;
  end if;
end $$;

-- Enable RLS for messages
alter table public.messages enable row level security;

-- Policies for messages
drop policy if exists "Messages are viewable by everyone for now." on public.messages;
create policy "Messages are viewable by everyone for now." on public.messages
  for select using (true);

drop policy if exists "Anyone authenticated can insert messages for now." on public.messages;
create policy "Anyone authenticated can insert messages for now." on public.messages
  for insert with check (auth.uid() is not null);

drop policy if exists "Users can update their own messages." on public.messages;
create policy "Users can update their own messages." on public.messages
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own messages." on public.messages;
create policy "Users can delete their own messages." on public.messages
  for delete using (auth.uid() = user_id);

-- 5. Automation triggers
create or replace function public.handle_new_space()
returns trigger as $$
begin
  -- Add owner as member
  insert into public.space_members (space_id, user_id, role)
  values (new.id, new.owner_id, 'owner');
  
  -- Create default channels
  insert into public.channels (space_id, name, slug, description)
  values 
    (new.id, 'general', 'general', 'General discussion for everyone in the space'),
    (new.id, 'random', 'random', 'Random thoughts and off-topic chat');
    
  return new;
end;
$$ language plpgsql security definer;

create trigger on_space_created
  after insert on public.spaces
  for each row execute procedure public.handle_new_space();
