-- Storage Buckets and Policies Migration Script
-- This script sets up Supabase Storage buckets for the application

-- 1. Create buckets if they don't exist
insert into storage.buckets (id, name, public)
values ('message-attachments', 'message-attachments', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('user-avatars', 'user-avatars', true)
on conflict (id) do nothing;

-- 2. Set up Storage Policies for 'message-attachments'
-- Drop existing policies if they exist to avoid errors
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated users can upload attachments" on storage.objects;
drop policy if exists "Users can delete their own attachments" on storage.objects;

-- Allow public access to read files
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'message-attachments' OR bucket_id = 'user-avatars' );

-- Allow authenticated users to upload files
create policy "Authenticated users can upload attachments"
on storage.objects for insert
with check (
  bucket_id = 'message-attachments' AND
  auth.role() = 'authenticated'
);

-- Allow users to delete their own files
create policy "Users can delete their own attachments"
on storage.objects for delete
using (
  bucket_id = 'message-attachments' AND
  (select auth.uid()) = owner
);

-- 3. Set up Storage Policies for 'user-avatars'
-- Drop existing policies if they exist
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;

-- Allow authenticated users to upload their own avatar
create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'user-avatars' AND
  auth.role() = 'authenticated'
);

-- Allow users to update their own avatar
create policy "Users can update their own avatar"
on storage.objects for update
using (
  bucket_id = 'user-avatars' AND
  (select auth.uid()) = owner
);

-- Script to add another user to the george-holmes space
-- First, find the space ID
do $$
declare
    v_space_id uuid;
    v_user_id uuid := '00000000-0000-0000-0000-000000000001'; -- New test user ID
begin
    select id into v_space_id from public.spaces where slug = 'george-holmes';
    
    if v_space_id is not null then
        -- We can't manually insert into profiles because of the foreign key to auth.users.
        -- In a real app, users are created via Supabase Auth.
        -- For testing purposes, we will just use a real user ID if you have one, 
        -- or you can manually create a user in the Supabase Auth dashboard.
        
        -- If you want to see the typing indicator, open the app in a second incognito window
        -- and log in with a different account.
        
        raise notice 'To test multi-user features, please log in with a second account in a new window.';
    end if;
end $$;
