import { createAdminClient } from './supabase-admin';

/**
 * Cache settings:
 * - User Profile: 1 hour (revalidate on update)
 * - User Settings: 1 hour (revalidate on update)
 * - Space Data: 5 minutes (revalidate on update)
 * - Channels: 5 minutes (revalidate on update)
 */

export const getCachedProfile = async (userId: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
};

export const getCachedUserSettings = async (userId: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  return data;
};

export const getCachedSpace = async (slug: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('spaces')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
};

export const getCachedChannels = async (spaceId: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('channels')
    .select('*')
    .eq('space_id', spaceId)
    .order('name');
  return data;
};

export const getCachedMembership = async (spaceId: string, userId: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('space_members')
    .select('*')
    .eq('space_id', spaceId)
    .eq('user_id', userId)
    .single();
  return data;
};

export const getCachedUserSpaces = async (userId: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('spaces')
    .select('*, space_members!inner(*)')
    .eq('space_members.user_id', userId)
    .order('created_at', { ascending: false });
  return data;
};
