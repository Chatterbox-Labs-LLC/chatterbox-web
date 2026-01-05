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
  const fetcher = async () => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  };

  try {
    return await unstable_cache(
      fetcher,
      [`profile-${userId}`],
      {
        revalidate: 3600, // 1 hour
        tags: [`user-${userId}`, 'profiles'],
      }
    )();
  } catch (e) {
    return await fetcher();
  }
};

export const getCachedUserSettings = async (userId: string) => {
  const fetcher = async () => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data;
  };

  try {
    return await unstable_cache(
      fetcher,
      [`settings-${userId}`],
      {
        revalidate: 3600, // 1 hour
        tags: [`user-${userId}`, 'settings'],
      }
    )();
  } catch (e) {
    return await fetcher();
  }
};

export const getCachedSpace = async (slug: string) => {
  const fetcher = async () => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('spaces')
      .select('*')
      .eq('slug', slug)
      .single();
    return data;
  };

  try {
    return await unstable_cache(
      fetcher,
      [`space-${slug}`],
      {
        revalidate: 300, // 5 minutes
        tags: [`space-slug-${slug}`, 'spaces'],
      }
    )();
  } catch (e) {
    return await fetcher();
  }
};

export const getCachedChannels = async (spaceId: string) => {
  const fetcher = async () => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('channels')
      .select('*')
      .eq('space_id', spaceId)
      .order('name');
    return data;
  };

  try {
    return await unstable_cache(
      fetcher,
      [`channels-${spaceId}`],
      {
        revalidate: 300, // 5 minutes
        tags: [`space-id-${spaceId}`, 'channels'],
      }
    )();
  } catch (e) {
    return await fetcher();
  }
};

export const getCachedMembership = async (spaceId: string, userId: string) => {
  const fetcher = async () => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('space_members')
      .select('*')
      .eq('space_id', spaceId)
      .eq('user_id', userId)
      .single();
    return data;
  };

  try {
    return await unstable_cache(
      fetcher,
      [`membership-${spaceId}-${userId}`],
      {
        revalidate: 300, // 5 minutes
        tags: [`user-${userId}`, `space-id-${spaceId}`, 'memberships'],
      }
    )();
  } catch (e) {
    return await fetcher();
  }
};

export const getCachedUserSpaces = async (userId: string) => {
  const fetcher = async () => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('spaces')
      .select('*, space_members!inner(*)')
      .eq('space_members.user_id', userId)
      .order('created_at', { ascending: false });
    return data;
  };

  try {
    return await unstable_cache(
      fetcher,
      [`user-spaces-${userId}`],
      {
        revalidate: 300, // 5 minutes
        tags: [`user-${userId}`, 'spaces'],
      }
    )();
  } catch (e) {
    return await fetcher();
  }
};
