'use client';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Bell, 
  Users,
  Hash,
  Menu,
  X as CloseIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ChatInterface from '@/components/chat-interface';
import { cn } from '@/lib/utils';
import CreateChannelModal from '@/components/create-channel-modal';
import ChannelSettingsModal from '@/components/channel-settings-modal';
import WorkspaceSettingsModal from '@/components/workspace-settings-modal';
import UserProfileSection from '@/components/user-profile-section';
import { WorkspaceNotFound } from '@/components/error-states';
import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

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
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Use Dexie for live data
  const localConversations = useLiveQuery(() => db.conversations.toArray()) as any || [];
  const localChannels = useLiveQuery(() => 
    (slug && currentSpace?.id) ? db.channels.where('space_id').equals(currentSpace.id).toArray() : db.channels.toArray()
  ) as any || [];
  
  const supabase = createClient();
  const router = useRouter();

  const fetchData = useCallback(async (resolvedSlug: string) => {
    // If we have local data, don't show global loading
    if (localChannels.length === 0) {
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
      setCurrentSpace(data.space);

      console.log('[SpacePage] Received data channels:', data.channels);

      // Cache channels in Dexie
      if (data.channels && data.space) {
        await db.channels.bulkPut(data.channels.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          space_id: data.space.id,
          description: c.description
        })));
      }
      
      if (!activeChannelId && !activeConversationId && data.channels.length > 0) {
        const generalChannel = data.channels.find((c: any) => c.slug === 'general') || data.channels[0];
        setActiveChannelId(generalChannel.id);
        setMessages(data.messages);
        // Cache initial messages
        if (data.messages) {
          await db.messages.bulkPut(data.messages.map((m: any) => ({
            ...m,
            space_id: data.space.id,
            channel_id: generalChannel.id,
            status: 'sent'
          })));
        }
      } else if (activeChannelId) {
        setMessages(data.messages);
        if (data.messages) {
          await db.messages.bulkPut(data.messages.map((m: any) => ({
            ...m,
            space_id: data.space.id,
            channel_id: activeChannelId,
            status: 'sent'
          })));
        }
      }

      // Fetch user's spaces for switcher
      const { data: userSpaces } = await supabase
        .from('spaces')
        .select('*, space_members!inner(*)')
        .eq('space_members.user_id', data.user.id)
        .order('name');
      setSpaces(userSpaces || []);

      // Fetch DMs
      const dmResponse = await fetch('/api/dms/conversations');
      if (dmResponse.ok) {
        const dmData = await dmResponse.json();
        // Cache conversations in Dexie
        await db.conversations.bulkPut(dmData);
      }

      // Real-time subscription for new conversations
      const convSubscription = supabase
        .channel('new-conversations')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'dm_conversations' },
          async () => {
            const res = await fetch('/api/dms/conversations');
            if (res.ok) {
              const dmData = await res.json();
              await db.conversations.bulkPut(dmData);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(convSubscription);
      };
    } catch (error) {
      console.error('[SpacePage] Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeChannelId, activeConversationId, localChannels.length, router, supabase]);

  const handleChannelSwitch = useCallback((channelId: string) => {
    setActiveChannelId(channelId);
    setActiveConversationId(null);
    // Fetch messages for the new channel
    const fetchChannelMessages = async () => {
      try {
        const response = await fetch(`/api/messages?channelId=${channelId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
          // Cache messages in Dexie
          if (data && currentSpace) {
            await db.messages.bulkPut(data.map((m: any) => ({
              ...m,
              space_id: currentSpace.id,
              channel_id: channelId,
              status: 'sent'
            })));
          }
        }
      } catch (error) {
        console.error('[SpacePage] Error fetching channel messages:', error);
      }
    };
    fetchChannelMessages();
  }, [currentSpace]);

  const handleConversationSwitch = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    setActiveChannelId(null);
    // Fetch messages for the conversation
    const fetchConversationMessages = async () => {
      try {
        const response = await fetch(`/api/dms/messages?conversationId=${conversationId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
          // Cache messages in Dexie
          if (data && currentSpace) {
            await db.messages.bulkPut(data.map((m: any) => ({
              ...m,
              space_id: currentSpace.id,
              conversation_id: conversationId,
              status: 'sent',
              profiles: m.sender // Map sender to profiles for the chat interface
            })));
          }
        }
      } catch (error) {
        console.error('[SpacePage] Error fetching conversation messages:', error);
      }
    };
    fetchConversationMessages();
  }, [currentSpace]);

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

  if (isLoading && localChannels.length === 0) {
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
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <WorkspaceNotFound slug={slug} />
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || 'Guest';
  const currentUser = {
    id: user?.id || '',
    full_name: fullName,
    avatar_url: user?.user_metadata?.avatar_url || '',
  };

  const activeChannel = (localChannels as any[]).find(c => c.id === activeChannelId) || { name: currentSpace.name, description: currentSpace.description };
  const activeConversation = (localConversations as any[]).find(c => c.id === activeConversationId);
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
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col bg-zinc-50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-black dark:bg-white p-1.5 rounded-lg">
              <MessageSquare className="h-5 w-5 text-white dark:text-black fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight">Chatterbox Teams</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-zinc-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <CloseIcon className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-6 py-4">
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Spaces</h3>
                <Button variant="ghost" size="icon" className="h-4 w-4 text-zinc-400 hover:text-zinc-900" asChild>
                  <Link href="/create-space"><Plus className="h-3 w-3" /></Link>
                </Button>
              </div>
              <div className="space-y-0.5">
                {spaces.map((space) => (
                  <Link 
                    key={space.id}
                    href={`/spaces/${space.slug}`}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm ${
                      space.slug === slug 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium" 
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <Hash className={`h-4 w-4 ${space.slug === slug ? "text-blue-500" : "text-zinc-400"}`} />
                    <span className="truncate">{space.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Channels Section */}
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Channels</h3>
                <CreateChannelModal spaceId={currentSpace.id} onChannelCreated={handleRefresh} />
              </div>
              <div className="space-y-0.5">
                {localChannels.map((channel: any) => (
                  <button 
                    key={channel.id}
                    onClick={() => handleChannelSwitch(channel.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm group ${
                      activeChannelId === channel.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <Hash className={`h-4 w-4 ${activeChannelId === channel.id ? "text-blue-500" : "text-zinc-400 group-hover:text-zinc-600"}`} />
                    <span className="truncate">{channel.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Messages Section */}
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Direct Messages</h3>
                <Button variant="ghost" size="icon" className="h-4 w-4 text-zinc-400 hover:text-zinc-900">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-0.5">
                {localConversations.map((conv: any) => (
                  <button 
                    key={conv.id}
                    onClick={() => handleConversationSwitch(conv.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm group ${
                      activeConversationId === conv.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-5 w-5 border border-zinc-200 dark:border-zinc-800">
                        <AvatarImage src={conv.other_user?.avatar_url || ''} />
                        <AvatarFallback className="text-[8px]">{conv.other_user?.full_name?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                    </div>
                    <span className="truncate">{conv.other_user?.full_name || 'Unknown User'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <UserProfileSection user={currentUser} />
      </aside>

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
                onChange={(e) => setSearchQuery(e.target.value)}
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
