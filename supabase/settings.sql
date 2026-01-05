-- Settings and Profile Extension SQL
-- This file adds user settings and extends the profile information.

-- Create a table for user settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  theme TEXT DEFAULT 'system',
  email_notifications BOOLEAN DEFAULT true,
  desktop_notifications BOOLEAN DEFAULT true,
  compact_mode BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extend profiles table with additional info if it doesn't have it
-- Note: We use ALTER TABLE instead of re-creating to preserve data
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status_text TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status_emoji TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Enable RLS on user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policies for user_settings
DROP POLICY IF EXISTS "Users can view their own settings." ON user_settings;
CREATE POLICY "Users can view their own settings." ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own settings." ON user_settings;
CREATE POLICY "Users can update their own settings." ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own settings." ON user_settings;
CREATE POLICY "Users can insert their own settings." ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update the handle_new_user function to also create settings and handle OAuth metadata better
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_first_name TEXT;
  v_last_name TEXT;
BEGIN
  -- Extract names from metadata
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    ''
  );
  
  -- Try to split first and last name if not provided
  v_first_name := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    split_part(v_full_name, ' ', 1)
  );
  
  v_last_name := COALESCE(
    NEW.raw_user_meta_data->>'last_name',
    CASE 
      WHEN position(' ' in v_full_name) > 0 THEN substring(v_full_name from position(' ' in v_full_name) + 1)
      ELSE ''
    END
  );

  -- Create profile
  INSERT INTO public.profiles (id, full_name, avatar_url, first_name, last_name)
  VALUES (
    NEW.id, 
    CASE WHEN v_full_name = '' THEN NULL ELSE v_full_name END,
    NEW.raw_user_meta_data->>'avatar_url',
    CASE WHEN v_first_name = '' THEN NULL ELSE v_first_name END,
    CASE WHEN v_last_name = '' THEN NULL ELSE v_last_name END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;

  -- Create default settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger 'on_auth_user_created' already exists from profile.sql,
-- but re-creating the function updates its behavior.
