import { revalidateTag, revalidatePath } from 'next/cache';

export const revalidateUserCache = (userId: string) => {
  revalidateTag(`user-${userId}`, 'layout');
  revalidatePath('/dashboard', 'layout');
};

export const revalidateSpaceCache = (spaceId: string, slug?: string) => {
  revalidateTag(`space-id-${spaceId}`, 'page');
  if (slug) {
    revalidateTag(`space-slug-${slug}`, 'page');
    revalidatePath(`/chat/${slug}`, 'page');
  }
};

export const revalidateAllProfiles = () => {
  revalidateTag('profiles', 'page');
  revalidatePath('/dashboard/profile', 'page');
};

export const revalidateAllSpaces = () => {
  revalidateTag('spaces', 'page');
  revalidatePath('/spaces', 'page');
};
