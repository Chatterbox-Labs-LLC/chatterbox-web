export const runtime = 'edge';
import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { getCachedSpace, getCachedChannels, getCachedMembership } from '@/lib/cache';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const channelId = searchParams.get('channelId');

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch space (Cached)
    const space = await getCachedSpace(slug);

    if (!space) {
      console.error(`[API Chat] Space not found for slug: ${slug}`);
      return NextResponse.json({ error: 'Space not found' }, { status: 404 });
    }

    // Check membership (Cached)
    const membership = await getCachedMembership(space.id, user.id);

    if (!membership) {
      console.error(`[API Chat] User ${user.id} is not a member of space ${space.id}`);
      return NextResponse.json({ error: 'Not a member of this space' }, { status: 403 });
    }

    // Fetch channels (Cached)
    const channels = await getCachedChannels(space.id);
    console.log(`[API Chat] Fetched ${channels?.length || 0} channels for space ${space.id}`);

    // Fetch messages for active channel or general (Not cached as they change frequently)
    let activeChannelId = channelId;
    if (!activeChannelId && channels && channels.length > 0) {
      const general = channels.find((c: any) => c.slug === 'general') || channels[0];
      activeChannelId = general.id;
    }

    let messages = [];
    if (activeChannelId) {
      const { data: channelMessages } = await supabase
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
        .eq('channel_id', activeChannelId)
        .order('created_at', { ascending: true })
        .limit(50);
      messages = channelMessages || [];
    }

    return NextResponse.json({
      space,
      channels: channels || [],
      messages,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url
      }
    });
  } catch (error) {
    console.error('[API Chat] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
