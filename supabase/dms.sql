-- Direct Messages Schema

-- 1. Create dm_conversations table
create table if not exists public.dm_conversations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_message_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create dm_conversation_participants table
create table if not exists public.dm_conversation_participants (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  conversation_id uuid references public.dm_conversations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  unique(conversation_id, user_id)
);

-- 3. Create dm_messages table
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

-- 4. Enable RLS
alter table public.dm_conversations enable row level security;
alter table public.dm_conversation_participants enable row level security;
alter table public.dm_messages enable row level security;

-- 5. Policies for dm_conversations
drop policy if exists "Users can view their own conversations" on public.dm_conversations;
create policy "Users can view their own conversations" on public.dm_conversations
  for select using (
    exists (
      select 1 from public.dm_conversation_participants
      where conversation_id = dm_conversations.id
      and user_id = auth.uid()
    )
  );

-- 6. Policies for dm_conversation_participants
drop policy if exists "Users can view participants of their conversations" on public.dm_conversation_participants;
create policy "Users can view participants of their conversations" on public.dm_conversation_participants
  for select using (
    exists (
      select 1 from public.dm_conversation_participants as sub
      where sub.conversation_id = dm_conversation_participants.conversation_id
      and sub.user_id = auth.uid()
    )
  );

drop policy if exists "Users can join conversations" on public.dm_conversation_participants;
create policy "Users can join conversations" on public.dm_conversation_participants
  for insert with check (auth.uid() = user_id);

-- 7. Policies for dm_messages
drop policy if exists "Users can view messages in their conversations" on public.dm_messages;
create policy "Users can view messages in their conversations" on public.dm_messages
  for select using (
    exists (
      select 1 from public.dm_conversation_participants
      where conversation_id = dm_messages.conversation_id
      and user_id = auth.uid()
    )
  );

drop policy if exists "Users can send messages to their conversations" on public.dm_messages;
create policy "Users can send messages to their conversations" on public.dm_messages
  for insert with check (
    sender_id = auth.uid() and
    exists (
      select 1 from public.dm_conversation_participants
      where conversation_id = dm_messages.conversation_id
      and user_id = auth.uid()
    )
  );

-- 8. Trigger to update last_message_at
drop trigger if exists on_dm_message_inserted on public.dm_messages;
create or replace function public.handle_dm_last_message_at()
returns trigger as $$
begin
  update public.dm_conversations
  set last_message_at = now()
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_dm_message_inserted
  after insert on public.dm_messages
  for each row execute procedure public.handle_dm_last_message_at();

-- 9. Enable Realtime
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
  
  -- Add tables to publication if they are not already there
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
