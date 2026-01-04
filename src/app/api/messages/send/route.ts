import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, spaceId, channelId, threadId, fileUrl, fileType } = body;

    if (!content && !fileUrl) {
      return NextResponse.json({ error: 'Message content or file is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        content: content?.trim(),
        space_id: spaceId,
        channel_id: channelId,
        user_id: user.id,
        thread_id: threadId || null,
        type: 'message',
        file_url: fileUrl || null,
        file_type: fileType || null
      })
      .select(`
        *,
        profiles (full_name, avatar_url),
        reactions:message_reactions (emoji, user_id),
        reply_to:thread_id (
          content,
          profiles (full_name, avatar_url)
        )
      `)
      .single();

    if (error) {
      console.error('[API Messages Send] Error inserting message:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Messages Send] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
