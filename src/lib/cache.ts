import { unstable_cache } from 'next/cache';
import { createAdminClient } from './supabase-admin';

/**
 * Cache settings:
 * - User Profile: 1 hour (revalidate on update)
 * - User Settings: 1 hour (revalidate on update)
 * - Space Data: 5 minutes (revalidate on update)
 * - Channels: 5 minutes (revalidate on update)
 */

export const getCachedProfile = async (userId: string) => {
  return unstable_cache(
    async () => {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return data;
    },
    [`profile-${userId}`],
    {
      revalidate: 3600, // 1 hour
      tags: [`user-${userId}`, 'profiles'],
    }
  )();
};

export const getCachedUserSettings = async (userId: string) => {
  return unstable_cache(
    async () => {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      return data;
    },
    [`settings-${userId}`],
    {
      revalidate: 3600, // 1 hour
      tags: [`user-${userId}`, 'settings'],
    }
  )();
};

export const getCachedSpace = async (slug: string) => {
  return unstable_cache(
    async () => {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from('spaces')
        .select('*')
        .eq('slug', slug)
        .single();
      return data;
    },
    [`space-${slug}`],
    {
      revalidate: 300, // 5 minutes
      tags: [`space-slug-${slug}`, 'spaces'],
    }
  )();
};

export const getCachedChannels = async (spaceId: string) => {
  return unstable_cache(
    async () => {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('space_id', spaceId)
        .order('name');
      return data;
    },
    [`channels-${spaceId}`],
    {
      revalidate: 300, // 5 minutes
      tags: [`space-id-${spaceId}`, 'channels'],
    }
  )();
};

export const getCachedMembership = async (spaceId: string, userId: string) => {
  return unstable_cache(
    async () => {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from('space_members')
        .select('*')
        .eq('space_id', spaceId)
        .eq('user_id', userId)
        .single();
      return data;
    },
    [`membership-${spaceId}-${userId}`],
    {
      revalidate: 300, // 5 minutes
      tags: [`user-${userId}`, `space-id-${spaceId}`, 'memberships'],
    }
  )();
};

export const getCachedUserSpaces = async (userId: string) => {
  return unstable_cache(
    async () => {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from('spaces')
        .select('*, space_members!inner(*)')
        .eq('space_members.user_id', userId)
        .order('created_at', { ascending: false });
      return data;
    },
    [`user-spaces-${userId}`],
    {
      revalidate: 300, // 5 minutes
      tags: [`user-${userId}`, 'spaces'],
    }
  )();
};
