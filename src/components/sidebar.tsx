"use client";

import Link from 'next/link';
import { 
  Plus, 
  Hash,
  X as CloseIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import CreateChannelModal from '@/components/create-channel-modal';
import UserProfileSection from '@/components/user-profile-section';

interface Space {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface Channel {
  id: string;
  name: string;
}

interface Conversation {
  id: string;
  other_user?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface User {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  spaces: Space[];
  currentSpace: Space;
  slug: string;
  channels: Channel[];
  activeChannelId: string | null;
  handleChannelSwitch: (id: string) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  handleConversationSwitch: (id: string) => void;
  handleRefresh: () => void;
  currentUser: User;
  onOpenDirectMessageModal?: () => void;
}

export function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  spaces,
  currentSpace,
  slug,
  channels,
  activeChannelId,
  handleChannelSwitch,
  conversations,
  activeConversationId,
  handleConversationSwitch,
  handleRefresh,
  currentUser
}: SidebarProps) {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col bg-zinc-50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-0",
      isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3]">
            <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
          </svg>
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
                      ? "bg-[#a9d6f3]/10 text-[#a9d6f3] font-medium" 
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <Hash className={`h-4 w-4 ${space.slug === slug ? "text-[#a9d6f3]" : "text-zinc-400"}`} />
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
              {channels.map((channel: Channel) => (
                <button 
                  key={channel.id}
                  onClick={() => handleChannelSwitch(channel.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm group ${
                    activeChannelId === channel.id
                      ? "bg-[#a9d6f3]/10 text-[#a9d6f3] font-medium"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <Hash className={`h-4 w-4 ${activeChannelId === channel.id ? "text-[#a9d6f3]" : "text-zinc-400 group-hover:text-zinc-600"}`} />
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
              {conversations.map((conv: Conversation) => (
                <button 
                  key={conv.id}
                  onClick={() => handleConversationSwitch(conv.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm group ${
                    activeConversationId === conv.id
                      ? "bg-[#a9d6f3]/10 text-[#a9d6f3] font-medium"
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
  );
}
