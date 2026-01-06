'use client';

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Hash,
  Menu,
  Search,
  Bell,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInterface from '@/components/chat-interface';
import { WorkspaceNotFound } from '@/components/error-states';
import { Sidebar } from '@/components/sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import ChannelSettingsModal from '@/components/channel-settings-modal';
import WorkspaceSettingsModal from '@/components/workspace-settings-modal';
import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SpacePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function SpacePage({params }: SpacePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [currentSpace, setCurrentSpace] = useState<any>(null);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // Load cached user on mount
  useEffect(() => {
    const cachedUser = localStorage.getItem('chatterbox_user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error('Error parsing cached user:', e);
      }
    }
  }, []);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [channels, setChannels] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  
  const supabase = createClient();
  const router = useRouter();

  const fetchData = useCallback(async (resolvedSlug: string) => {
    // Show global loading if no channels yet
    if (channels.length === 0) {
      setIsLoading(true);
    }
    
    try {
      const response = await fetch(`/api/chat?slug=${resolvedSlug}${activeChannelId ? `&channelId=${activeChannelId}` : ''}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push(`/spaces/${resolvedSlug}/login`);
          return;
        }
        if (response.status === 403) {
          router.push(`/join-space?slug=${resolvedSlug}`);
          return;
        }
        throw new Error('Failed to fetch chat data');
      }

      const data = await response.json();
      setUser(data.user);
      // Save user data locally
      if (data.user) {
        localStorage.setItem('chatterbox_user', JSON.stringify(data.user));
      }
      setCurrentSpace(data.space);
      setChannels(data.channels || []);
      setSpaces(data.spaces || []);

      console.log('[SpacePage] Received data channels:', data.channels);
      
      if (!activeChannelId && !activeConversationId && data.channels && data.channels.length > 0) {
        const generalChannel = data.channels.find((c: any) => c.slug === 'general') || data.channels[0];
        setActiveChannelId(generalChannel.id);
      }
    } catch (error) { 
      console.error('[SpacePage] Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeChannelId, activeConversationId, router, channels.length]);

  // Fetch DM conversations
  useEffect(() => {
    const fetchDMs = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('dm_conversations')
        .select(`
          id,
          created_at,
          updated_at,
          last_message_at,
          user1_id,
          user2_id,
          user1:profiles!user1_id (*),
          user2:profiles!user2_id (*)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (!error && data) {
        const normalizedDMs = data.map((dm: any) => {
          const otherUser = dm.user1_id === user.id ? dm.user2 : dm.user1;
          return {
            id: dm.id,
            created_at: dm.created_at,
            updated_at: dm.updated_at,
            last_message_at: dm.last_message_at,
            other_user: otherUser
          };
        });
        setConversations(normalizedDMs);
      }
    };

    fetchDMs();

    // Subscribe to DM changes
    const channel = supabase
      .channel('dm-conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dm_conversations' }, fetchDMs)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, supabase]);

  const handleChannelSwitch = useCallback((channelId: string) => {
    setActiveChannelId(channelId);
    setActiveConversationId(null);
  }, []);

  const handleConversationSwitch = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    setActiveChannelId(null);
  }, []);

  useEffect(() => {
    const handleSwitchDM = (e: any) => {
      handleConversationSwitch(e.detail.conversationId);
    };

    window.addEventListener('switch-to-dm', handleSwitchDM);
    return () => window.removeEventListener('switch-to-dm', handleSwitchDM);
  }, [handleConversationSwitch]);

  useEffect(() => {
    if (slug) {
      fetchData(slug);
    }
  }, [slug, fetchData]);

  const handleRefresh = () => {
    if (slug) fetchData(slug);
  };

  if (isLoading && channels.length === 0) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please log in</h1>
          <Button asChild className="mt-4">
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!currentSpace) {
    return <WorkspaceNotFound slug={slug} />;
  }

  const fullName = user?.full_name || user?.user_metadata?.full_name || 'User';
  const currentUser = {
    id: user?.id || '',
    full_name: fullName,
    avatar_url: user?.avatar_url || user?.user_metadata?.avatar_url || '',
  };

  const activeChannel = (channels as any[]).find(c => c.id === activeChannelId) || { name: currentSpace.name, description: currentSpace.description };
  const activeConversation = (conversations as any[]).find(c => c.id === activeConversationId);
  const headerName = activeChannelId ? activeChannel.name : (activeConversation?.other_user?.full_name || 'Direct Message');
  const headerDescription = activeChannelId ? activeChannel.description : 'Private conversation';

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans relative">
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        spaces={spaces}
        currentSpace={currentSpace}
        slug={slug}
        channels={channels}
        activeChannelId={activeChannelId}
        handleChannelSwitch={handleChannelSwitch}
        conversations={conversations}
        activeConversationId={activeConversationId}
        handleConversationSwitch={handleConversationSwitch}
        handleRefresh={handleRefresh}
        currentUser={currentUser}
      />

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col bg-white dark:bg-zinc-950 relative min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-20">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-zinc-500"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {activeChannelId ? (
              <Hash className="h-5 w-5 text-zinc-400" />
            ) : (
              <div className="relative shrink-0">
                <Avatar className="h-6 w-6 border border-zinc-200 dark:border-zinc-800">
                  <AvatarImage src={activeConversation?.other_user?.avatar_url || ''} />
                  <AvatarFallback className="text-[10px]">{activeConversation?.other_user?.full_name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">{headerName}</h2>
                {activeChannelId && (
                  <ChannelSettingsModal 
                    channel={{
                      id: activeChannelId,
                      name: activeChannel.name,
                      description: activeChannel.description
                    }}
                    onChannelUpdated={handleRefresh}
                    onChannelDeleted={() => {
                      if (slug) fetchData(slug);
                      setActiveChannelId(null);
                    }}
                  />
                )}
              </div>
              {headerDescription && (
                <p className="text-xs text-zinc-500 truncate max-w-md">{headerDescription}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative mr-4 hidden md:block">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-zinc-400" />
              <Input 
                placeholder="Search messages..." 
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 w-64 bg-zinc-100 dark:bg-zinc-900 border-none text-sm rounded-md focus-visible:ring-1 focus-visible:ring-zinc-300"
              />
            </div>
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-900"><Bell className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-900"><Users className="h-5 w-5" /></Button>
            <WorkspaceSettingsModal 
              space={{
                id: currentSpace.id,
                name: currentSpace.name,
                description: currentSpace.description,
                slug: currentSpace.slug
              }}
              onUpdate={() => {
                if (slug) fetchData(slug);
              }}
            />
          </div>
        </header>

        <ChatInterface 
          currentSpace={currentSpace} 
          currentUser={currentUser} 
          searchQuery={searchQuery}
          activeChannelId={activeChannelId}
          activeChannelName={headerName}
          activeConversationId={activeConversationId}
        />
      </main>
    </div>
  );
}
