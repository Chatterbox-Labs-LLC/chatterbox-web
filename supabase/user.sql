-- Migration to update profiles table with new fields
-- Run this in your Supabase SQL Editor

DO $$ 
BEGIN
    -- Add bio column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;

    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'location') THEN
        ALTER TABLE profiles ADD COLUMN location TEXT;
    END IF;

    -- Add status_emoji column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'status_emoji') THEN
        ALTER TABLE profiles ADD COLUMN status_emoji TEXT;
    END IF;

    -- Add status_text column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'status_text') THEN
        ALTER TABLE profiles ADD COLUMN status_text TEXT;
    END IF;

    -- Add organization column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'organization') THEN
        ALTER TABLE profiles ADD COLUMN organization TEXT;
    END IF;

    -- Add school column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'school') THEN
        ALTER TABLE profiles ADD COLUMN school TEXT;
    END IF;

    -- Add country column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'country') THEN
        ALTER TABLE profiles ADD COLUMN country TEXT;
    END IF;

    -- Add avatar_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'avatar_url') THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- Comment on columns for documentation
COMMENT ON COLUMN profiles.bio IS 'User personal biography';
COMMENT ON COLUMN profiles.location IS 'User physical location';
COMMENT ON COLUMN profiles.status_emoji IS 'User current status emoji';
COMMENT ON COLUMN profiles.status_text IS 'User current status message';
COMMENT ON COLUMN profiles.organization IS 'User current organization or company';
COMMENT ON COLUMN profiles.school IS 'User educational institution';
COMMENT ON COLUMN profiles.country IS 'User country of residence';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user profile picture';
