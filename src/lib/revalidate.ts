import { revalidateTag, revalidatePath } from 'next/cache';

export const revalidateUserCache = (userId: string) => {
  revalidateTag(`user-${userId}`);
  revalidatePath('/dashboard', 'layout');
};

export const revalidateSpaceCache = (spaceId: string, slug?: string) => {
  revalidateTag(`space-id-${spaceId}`);
  if (slug) {
    revalidateTag(`space-slug-${slug}`);
    revalidatePath(`/chat/${slug}`, 'page');
  }
};

export const revalidateAllProfiles = () => {
  revalidateTag('profiles');
  revalidatePath('/dashboard/profile', 'page');
};

export const revalidateAllSpaces = () => {
  revalidateTag('spaces');
  revalidatePath('/spaces', 'page');
};
