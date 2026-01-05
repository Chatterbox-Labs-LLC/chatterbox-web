export const runtime = 'edge';
export const dynamic = 'force-dynamic';
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

    const { theme, emailNotifications, desktopNotifications, compactMode, language, timezone } = await request.json();

    // Update user_settings table
    const { error: settingsError } = await supabase
      .from('user_settings')
      .update({
        theme,
        email_notifications: emailNotifications,
        desktop_notifications: desktopNotifications,
        compact_mode: compactMode,
        language,
        timezone,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (settingsError) throw settingsError;

    // Invalidate Cache
    revalidateUserCache(user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
