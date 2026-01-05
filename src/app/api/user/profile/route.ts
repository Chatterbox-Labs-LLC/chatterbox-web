export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { revalidateUserCache } from '@/lib/revalidate';


export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fullName, bio, location, website, statusEmoji, statusText, organization, school, country, avatarUrl } = await request.json();

    // 1. Update Auth Metadata (for full_name and avatar_url)
    if (fullName !== undefined || avatarUrl !== undefined) {
      const authData: any = {};
      if (fullName !== undefined) authData.full_name = fullName;
      if (avatarUrl !== undefined) authData.avatar_url = avatarUrl;
      
      const { error: authError } = await supabase.auth.updateUser({
        data: authData
      });
      if (authError) throw authError;
    }

    // 2. Prepare update data - only include fields that are actually provided
    const updateData: any = {
      full_name: fullName,
      updated_at: new Date().toISOString()
    };

    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (statusEmoji !== undefined) updateData.status_emoji = statusEmoji;
    if (statusText !== undefined) updateData.status_text = statusText;
    if (organization !== undefined) updateData.organization = organization;
    if (school !== undefined) updateData.school = school;
    if (country !== undefined) updateData.country = country;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;

    // 3. Update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (profileError) {
      // Check for missing columns error (PGRST204)
      if (profileError.code === 'PGRST204') {
        return NextResponse.json({ 
          error: 'Database schema mismatch. Please run the migration script (user.sql) in your Supabase SQL Editor to add the new profile fields.' 
        }, { status: 500 });
      }
      throw profileError;
    }

    // 3. Invalidate Cache
    revalidateUserCache(user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
