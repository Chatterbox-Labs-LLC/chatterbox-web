-- ==========================================
-- MAIN DATABASE SCHEMA CONSOLIDATION
-- This file contains all tables, policies, triggers, and functions.
-- It is designed to be idempotent (can be run multiple times).
-- ==========================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. TABLES & SCHEMA

-- PROFILES
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default now(),
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  first_name text,
  last_name text,
  bio text,
  location text,
  status_emoji text,
  status_text text,
  organization text,
  school text,
  country text,
  phone_number text,
  constraint username_length check (char_length(username) >= 3)
);

-- USER SETTINGS
create table if not exists public.user_settings (
  user_id uuid references auth.users on delete cascade not null primary key,
  theme text default 'system',
  email_notifications boolean default true,
  desktop_notifications boolean default true,
  compact_mode boolean default false,
  language text default 'en',
  timezone text default 'UTC',
  updated_at timestamp with time zone default now()
);

-- SPACES
create table if not exists public.spaces (
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

-- SPACE MEMBERS
create table if not exists public.space_members (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  space_id uuid references public.spaces(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'member' not null check (role in ('owner', 'admin', 'member')),
  unique(space_id, user_id)
);

-- CHANNELS
create table if not exists public.channels (
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

-- MESSAGES
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
  file_url text,
  file_type text,
  metadata jsonb default '{}'::jsonb
);

-- MESSAGE REACTIONS
create table if not exists public.message_reactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  message_id uuid references public.messages(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  emoji text not null,
  unique(message_id, user_id, emoji)
);

-- DIRECT MESSAGES
create table if not exists public.dm_conversations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_message_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.dm_conversation_participants (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  conversation_id uuid references public.dm_conversations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  unique(conversation_id, user_id)
);

create table if not exists public.dm_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  conversation_id uuid references public.dm_conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  is_edited boolean default false,
  file_url text,
  file_type text
);

-- STRIPE BILLING
create table if not exists public.plans (
  id text primary key,
  name text not null,
  description text,
  price_id text unique,
  amount integer not null,
  currency text default 'usd',
  interval text check (interval in ('month', 'year')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.subscriptions (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  status text not null,
  plan_id text references public.plans(id),
  cancel_at_period_end boolean default false,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. FUNCTIONS & TRIGGERS

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_full_name text;
  v_first_name text;
  v_last_name text;
begin
  -- Extract names from metadata
  v_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    ''
  );
  
  -- Try to split first and last name if not provided
  v_first_name := coalesce(
    new.raw_user_meta_data->>'first_name',
    split_part(v_full_name, ' ', 1)
  );
  
  v_last_name := coalesce(
    new.raw_user_meta_data->>'last_name',
    case 
      when position(' ' in v_full_name) > 0 then substring(v_full_name from position(' ' in v_full_name) + 1)
      else ''
    end
  );

  -- Create profile
  insert into public.profiles (id, full_name, avatar_url, first_name, last_name)
  values (
    new.id, 
    case when v_full_name = '' then null else v_full_name end,
    new.raw_user_meta_data->>'avatar_url',
    case when v_first_name = '' then null else v_first_name end,
    case when v_last_name = '' then null else v_last_name end
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    first_name = excluded.first_name,
    last_name = excluded.last_name;

  -- Create default settings
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger for handle_new_user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Space security functions
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

-- Function to generate invite code
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

-- Function to handle new space creation
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

-- Trigger for handle_new_space
drop trigger if exists on_space_created on public.spaces;
create trigger on_space_created
  after insert on public.spaces
  for each row execute procedure public.handle_new_space();

-- Function to handle DM last_message_at
create or replace function public.handle_dm_last_message_at()
returns trigger as $$
begin
  update public.dm_conversations
  set last_message_at = now()
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for handle_dm_last_message_at
drop trigger if exists on_dm_message_inserted on public.dm_messages;
create trigger on_dm_message_inserted
  after insert on public.dm_messages
  for each row execute procedure public.handle_dm_last_message_at();

-- 4. ROW LEVEL SECURITY (RLS)

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.spaces enable row level security;
alter table public.space_members enable row level security;
alter table public.channels enable row level security;
alter table public.messages enable row level security;
alter table public.message_reactions enable row level security;
alter table public.dm_conversations enable row level security;
alter table public.dm_conversation_participants enable row level security;
alter table public.dm_messages enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.customers enable row level security;

-- Profile policies
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Settings policies
drop policy if exists "Users can view their own settings." on user_settings;
create policy "Users can view their own settings." on user_settings for select using (auth.uid() = user_id);
drop policy if exists "Users can update their own settings." on user_settings;
create policy "Users can update their own settings." on user_settings for update using (auth.uid() = user_id);
drop policy if exists "Users can insert their own settings." on user_settings;
create policy "Users can insert their own settings." on user_settings for insert with check (auth.uid() = user_id);

-- Space policies
drop policy if exists "Spaces are viewable by everyone for now." on public.spaces;
create policy "Spaces are viewable by everyone for now." on public.spaces for select using (true);
drop policy if exists "Owners can update their spaces." on public.spaces;
create policy "Owners can update their spaces." on public.spaces for update using (auth.uid() = owner_id);
drop policy if exists "Owners can delete their spaces." on public.spaces;
create policy "Owners can delete their spaces." on public.spaces for delete using (auth.uid() = owner_id);
drop policy if exists "Authenticated users can create spaces." on public.spaces;
create policy "Authenticated users can create spaces." on public.spaces for insert with check (auth.uid() = owner_id);

-- Space Member policies
drop policy if exists "Anyone can view members for now." on public.space_members;
create policy "Anyone can view members for now." on public.space_members for select using (true);
drop policy if exists "System and owners can manage members." on public.space_members;
create policy "System and owners can manage members." on public.space_members for insert with check (true);
drop policy if exists "Owners can delete members." on public.space_members;
create policy "Owners can delete members." on public.space_members for delete using (public.check_is_space_owner(space_id));

-- Channel policies
drop policy if exists "Channels are viewable by everyone for now." on public.channels;
create policy "Channels are viewable by everyone for now." on public.channels for select using (true);
drop policy if exists "Owners can manage channels." on public.channels;
create policy "Owners can manage channels." on public.channels for all using (public.check_is_space_owner(space_id));

-- Message policies
drop policy if exists "Messages are viewable by everyone" on public.messages;
create policy "Messages are viewable by everyone" on public.messages for select using (true);
drop policy if exists "Authenticated users can insert messages" on public.messages;
create policy "Authenticated users can insert messages" on public.messages for insert with check (auth.uid() is not null);
drop policy if exists "Users can update their own messages" on public.messages;
create policy "Users can update their own messages" on public.messages for update using (auth.uid() = user_id);
drop policy if exists "Users can delete their own messages" on public.messages;
create policy "Users can delete their own messages" on public.messages for delete using (auth.uid() = user_id);

-- Reaction policies
drop policy if exists "Reactions are viewable by everyone" on public.message_reactions;
create policy "Reactions are viewable by everyone" on public.message_reactions for select using (true);
drop policy if exists "Authenticated users can add reactions" on public.message_reactions;
create policy "Authenticated users can add reactions" on public.message_reactions for insert with check (auth.uid() is not null);
drop policy if exists "Users can remove their own reactions" on public.message_reactions;
create policy "Users can remove their own reactions" on public.message_reactions for delete using (auth.uid() = user_id);

-- DM policies
drop policy if exists "Users can view their own conversations" on public.dm_conversations;
create policy "Users can view their own conversations" on public.dm_conversations for select using (exists (select 1 from public.dm_conversation_participants where conversation_id = dm_conversations.id and user_id = auth.uid()));
drop policy if exists "Users can view participants of their conversations" on public.dm_conversation_participants;
create policy "Users can view participants of their conversations" on public.dm_conversation_participants for select using (exists (select 1 from public.dm_conversation_participants as sub where sub.conversation_id = dm_conversation_participants.conversation_id and sub.user_id = auth.uid()));
drop policy if exists "Users can join conversations" on public.dm_conversation_participants;
create policy "Users can join conversations" on public.dm_conversation_participants for insert with check (auth.uid() = user_id);
drop policy if exists "Users can view messages in their conversations" on public.dm_messages;
create policy "Users can view messages in their conversations" on public.dm_messages for select using (exists (select 1 from public.dm_conversation_participants where conversation_id = dm_messages.conversation_id and user_id = auth.uid()));
drop policy if exists "Users can send messages to their conversations" on public.dm_messages;
create policy "Users can send messages to their conversations" on public.dm_messages for insert with check (sender_id = auth.uid() and exists (select 1 from public.dm_conversation_participants where conversation_id = dm_messages.conversation_id and user_id = auth.uid()));

-- Stripe policies
drop policy if exists "Allow public read access to plans" on public.plans;
create policy "Allow public read access to plans" on public.plans for select using (true);
drop policy if exists "Users can view their own subscription" on public.subscriptions;
create policy "Users can view their own subscription" on public.subscriptions for select using (auth.uid() = user_id);
drop policy if exists "Users can view their own customer data" on public.customers;
create policy "Users can view their own customer data" on public.customers for select using (auth.uid() = user_id);

-- 5. STORAGE BUCKETS & POLICIES

insert into storage.buckets (id, name, public)
values ('message-attachments', 'message-attachments', true), ('user-avatars', 'user-avatars', true)
on conflict (id) do nothing;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'message-attachments' OR bucket_id = 'user-avatars' );
drop policy if exists "Authenticated users can upload attachments" on storage.objects;
create policy "Authenticated users can upload attachments" on storage.objects for insert with check ( bucket_id = 'message-attachments' AND auth.role() = 'authenticated' );
drop policy if exists "Users can delete their own attachments" on storage.objects;
create policy "Users can delete their own attachments" on storage.objects for delete using ( bucket_id = 'message-attachments' AND (select auth.uid()) = owner );
drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar" on storage.objects for insert with check ( bucket_id = 'user-avatars' AND auth.role() = 'authenticated' );
drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar" on storage.objects for update using ( bucket_id = 'user-avatars' AND (select auth.uid()) = owner );

-- 6. REALTIME CONFIGURATION

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
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'message_reactions') then
    alter publication supabase_realtime add table public.message_reactions;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'dm_conversations') then
    alter publication supabase_realtime add table public.dm_conversations;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'dm_conversation_participants') then
    alter publication supabase_realtime add table public.dm_conversation_participants;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'dm_messages') then
    alter publication supabase_realtime add table public.dm_messages;
  end if;
end $$;

-- 7. INITIAL DATA

insert into public.plans (id, name, description, price_id, amount, interval)
values 
  ('free', 'Free', 'Up to 10 users, basic features', NULL, 0, 'month'),
  ('pro', 'Pro', '$5 per active user/month, unlimited everything', 'price_pro_placeholder', 500, 'month'),
  ('enterprise', 'Enterprise', 'Custom pricing for large organizations', 'price_enterprise_placeholder', 0, 'month')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  amount = excluded.amount;

-- 8. INDEXES

create index if not exists idx_messages_space_id on public.messages(space_id);
create index if not exists idx_messages_channel_id on public.messages(channel_id);
create index if not exists idx_messages_user_id on public.messages(user_id);
create index if not exists idx_messages_created_at on public.messages(created_at);
