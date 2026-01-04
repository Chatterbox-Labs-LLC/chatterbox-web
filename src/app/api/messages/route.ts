import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!channelId) {
      return NextResponse.json({ error: 'channelId is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles (full_name, avatar_url),
        reactions:message_reactions (emoji, user_id),
        reply_to:thread_id (
          content,
          profiles (full_name, avatar_url)
        )
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('[API Messages GET] Error fetching messages:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Messages GET] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
