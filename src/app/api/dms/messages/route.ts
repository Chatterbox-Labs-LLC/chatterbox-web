import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('dm_messages')
      .select(`
        *,
        sender:profiles (*)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('[API DMs Messages GET] Error fetching messages:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API DMs Messages GET] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, conversationId } = body;

    if (!content || !conversationId) {
      return NextResponse.json({ error: 'Content and conversationId are required' }, { status: 400 });
    }

    // 1. Insert the message
    const { data: message, error: msgError } = await supabase
      .from('dm_messages')
      .insert({
        content: content.trim(),
        conversation_id: conversationId,
        sender_id: user.id
      })
      .select(`
        *,
        sender:profiles (*)
      `)
      .single();

    if (msgError) throw msgError;

    // 2. Update the conversation's last_message_at timestamp
    await supabase
      .from('dm_conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    return NextResponse.json(message);
  } catch (error: any) {
    console.error('[API DMs Messages POST] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
