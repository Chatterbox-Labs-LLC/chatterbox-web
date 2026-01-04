import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch conversations where the current user is a participant
    const { data: conversations, error } = await supabase
      .from('dm_conversations')
      .select(`
        *,
        participants:dm_conversation_participants (
          user:profiles (*)
        ),
        last_message:dm_messages (
          id,
          content,
          created_at,
          sender_id
        )
      `)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('[API DMs Conversations GET] Error fetching conversations:', error);
      
      // If table doesn't exist, return empty array instead of 500 if we want to be resilient
      // but for debugging it's better to know. However, the user reported 500s.
      if (error.code === '42P01') { // undefined_table
        console.warn('[API DMs Conversations GET] DM tables not found. Please run dms.sql in Supabase SQL Editor.');
        return NextResponse.json({ 
          error: 'DM tables not initialized', 
          details: 'The dm_conversations table does not exist. Please run the dms.sql schema.' 
        }, { status: 500 });
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter participants to find the "other" person in each DM
    const formattedConversations = (conversations || []).map(conv => {
      const otherParticipant = conv.participants?.find((p: any) => p.user?.id !== user.id);
      
      // Get the single most recent message from the array
      const lastMessage = conv.last_message && conv.last_message.length > 0 
        ? conv.last_message.sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0]
        : null;

      return {
        ...conv,
        other_user: otherParticipant?.user || null,
        last_message: lastMessage
      };
    });

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error('[API DMs Conversations GET] Unexpected error:', error);
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

    const { recipientId } = await request.json();

    if (!recipientId) {
      return NextResponse.json({ error: 'recipientId is required' }, { status: 400 });
    }

    // 1. Check if a conversation already exists between these two users
    const { data: existingParticipants, error: searchError } = await supabase
      .from('dm_conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (searchError) throw searchError;

    const conversationIds = existingParticipants.map(p => p.conversation_id);

    if (conversationIds.length > 0) {
      const { data: sharedConversation, error: sharedError } = await supabase
        .from('dm_conversation_participants')
        .select('conversation_id')
        .in('conversation_id', conversationIds)
        .eq('user_id', recipientId)
        .single();

      if (sharedConversation) {
        return NextResponse.json({ conversationId: sharedConversation.conversation_id });
      }
    }

    // 2. If no conversation exists, create one
    const { data: newConversation, error: convError } = await supabase
      .from('dm_conversations')
      .insert({})
      .select()
      .single();

    if (convError) throw convError;

    // 3. Add participants
    const { error: partError } = await supabase
      .from('dm_conversation_participants')
      .insert([
        { conversation_id: newConversation.id, user_id: user.id },
        { conversation_id: newConversation.id, user_id: recipientId }
      ]);

    if (partError) throw partError;

    return NextResponse.json({ conversationId: newConversation.id });
  } catch (error: any) {
    console.error('[API DMs Conversations POST] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
