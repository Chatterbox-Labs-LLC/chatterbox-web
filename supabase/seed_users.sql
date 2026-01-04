-- This script creates 3 dummy users in auth.users and their corresponding public.profiles.
-- Note: In a real Supabase environment, you should use the Auth UI or Admin API,
-- but this SQL works for local development or testing.

DO $$
DECLARE
    user1_id UUID := gen_random_uuid();
    user2_id UUID := gen_random_uuid();
    user3_id UUID := gen_random_uuid();
BEGIN
    -- 1. Insert into auth.users
    -- We use crypt() for passwords. Default password is 'password123'
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES 
        (user1_id, 'sarah@example.com', crypt('password123', gen_salt('bf')), now(), '{"full_name": "Sarah Chen", "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"}'::jsonb, now(), now(), 'authenticated', 'authenticated', ''),
        (user2_id, 'alex@example.com', crypt('password123', gen_salt('bf')), now(), '{"full_name": "Alex Rivera", "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"}'::jsonb, now(), now(), 'authenticated', 'authenticated', ''),
        (user3_id, 'jordan@example.com', crypt('password123', gen_salt('bf')), now(), '{"full_name": "Jordan Smith", "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan"}'::jsonb, now(), now(), 'authenticated', 'authenticated', '');

    -- 2. Profiles are handled automatically by the handle_new_user() trigger in profile.sql
    -- However, we'll log the IDs for the user's reference
    RAISE NOTICE 'Created users:';
    RAISE NOTICE 'Sarah: %', user1_id;
    RAISE NOTICE 'Alex: %', user2_id;
    RAISE NOTICE 'Jordan: %', user3_id;
END $$;
