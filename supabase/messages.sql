-- Messages Table Migration/Update Script
-- This script ensures the messages table exists with all necessary columns and policies

-- 1. Create table if not exists (or add missing columns)
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

-- 2. Create message_reactions table
create table if not exists public.message_reactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  message_id uuid references public.messages(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  emoji text not null,
  
  unique(message_id, user_id, emoji)
);

-- 3. Enable RLS for reactions
alter table public.message_reactions enable row level security;

create policy "Reactions are viewable by everyone" on public.message_reactions
  for select using (true);

create policy "Authenticated users can add reactions" on public.message_reactions
  for insert with check (auth.uid() is not null);

create policy "Users can remove their own reactions" on public.message_reactions
  for delete using (auth.uid() = user_id);

-- 4. Enable Realtime for reactions
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables 
      where pubname = 'supabase_realtime' 
      and schemaname = 'public' 
      and tablename = 'message_reactions'
    ) then
      alter publication supabase_realtime add table public.message_reactions;
    end if;
  end if;
end $$;

-- 5. Add is_edited column if it doesn't exist (for existing tables)
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='messages' and column_name='is_edited') then
    alter table public.messages add column is_edited boolean default false;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='messages' and column_name='file_url') then
    alter table public.messages add column file_url text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='messages' and column_name='file_type') then
    alter table public.messages add column file_type text;
  end if;
end $$;

-- 3. Enable RLS
alter table public.messages enable row level security;

-- 4. Recreate/Update policies
-- Drop existing policies to avoid conflicts and ensure naming consistency
drop policy if exists "Messages are viewable by everyone for now." on public.messages;
drop policy if exists "Anyone authenticated can insert messages for now." on public.messages;
drop policy if exists "Users can update their own messages." on public.messages;
drop policy if exists "Users can delete their own messages." on public.messages;
drop policy if exists "Messages are viewable by everyone" on public.messages;
drop policy if exists "Authenticated users can insert messages" on public.messages;
drop policy if exists "Users can update their own messages" on public.messages;
drop policy if exists "Users can delete their own messages" on public.messages;

-- Create fresh policies
create policy "Messages are viewable by everyone" on public.messages
  for select using (true);

create policy "Authenticated users can insert messages" on public.messages
  for insert with check (auth.uid() is not null);

create policy "Users can update their own messages" on public.messages
  for update using (auth.uid() = user_id);

create policy "Users can delete their own messages" on public.messages
  for delete using (auth.uid() = user_id);

-- 5. Enable Realtime
-- This ensures the messages table is part of the realtime publication
-- Note: Some Supabase projects use 'supabase_realtime' publication
do $$
begin
  -- Try to add to supabase_realtime publication if it exists
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables 
      where pubname = 'supabase_realtime' 
      and schemaname = 'public' 
      and tablename = 'messages'
    ) then
      alter publication supabase_realtime add table public.messages;
    end if;
  end if;
end $$;

-- 6. Add indexes for performance
create index if not exists idx_messages_space_id on public.messages(space_id);
create index if not exists idx_messages_channel_id on public.messages(channel_id);
create index if not exists idx_messages_user_id on public.messages(user_id);
create index if not exists idx_messages_created_at on public.messages(created_at);
