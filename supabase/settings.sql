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
CREATE POLICY "Users can view their own settings." ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings." ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings." ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update the handle_new_user function to also create settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, avatar_url, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );

  -- Create default settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger 'on_auth_user_created' already exists from profile.sql,
-- but re-creating the function updates its behavior.
