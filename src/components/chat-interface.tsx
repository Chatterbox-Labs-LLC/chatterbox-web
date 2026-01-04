'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { 
  Hash, 
  Search, 
  Settings, 
  Plus, 
  Smile, 
  Send, 
  X, 
  Pencil, 
  Trash2, 
  Reply,
  ChevronDown,
  Users,
  Pin,
  Phone,
  Video,
  Check,
  FileText, 
  FileIcon, 
  ExternalLink, 
  Download,
  MoreHorizontal,
  Loader2,
  Play,
  SmilePlus,
  MapPin,
  Globe,
  Building2,
} from 'lucide-react';
import { MediaModal } from './media-modal';
import { motion, AnimatePresence } from 'framer-motion';

import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface Message {
  id: string;
  created_at: string;
  content: string;
  user_id: string;
  space_id: string;
  channel_id?: string | null;
  conversation_id?: string | null;
  is_edited?: boolean;
  thread_id?: string | null;
  file_url?: string | null;
  file_type?: string | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  reactions?: {
    emoji: string;
    user_id: string;
  }[];
  reply_to?: {
    content: string;
    profiles: {
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  } | null;
  status?: 'sent' | 'pending' | 'error';
}

interface ChatInterfaceProps {
  currentSpace: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
  currentUser: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  searchQuery: string;
  activeChannelId: string | null;
  activeChannelName: string;
  activeConversationId?: string | null;
}

export default function ChatInterface({ 
  currentSpace, 
  currentUser,
  searchQuery,
  activeChannelId,
  activeChannelName,
  activeConversationId
}: ChatInterfaceProps) {
  // Use live query for messages
  const messagesQuery = useMemo(() => {
    return () => {
      if (activeChannelId) {
        return db.messages
          .where('channel_id')
          .equals(activeChannelId)
          .sortBy('created_at');
      } else if (activeConversationId) {
        return db.messages
          .where('conversation_id')
          .equals(activeConversationId)
          .sortBy('created_at');
      }
      return Promise.resolve([]) as unknown as Promise<Message[]>;
    };
  }, [activeChannelId, activeConversationId]);

  const liveMessages = (useLiveQuery(messagesQuery, [messagesQuery]) as Message[]) || [];

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; type: string } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, { full_name: string }>>({});
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: string; fileName?: string } | null>(null);
  const [hoveredUser, setHoveredUser] = useState<{
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    bio?: string | null;
    location?: string | null;
    organization?: string | null;
    rect: DOMRect | null;
  } | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const supabase = createClient();

  // Filter messages based on search query
  const filteredMessages = (liveMessages as Message[]).filter(message => {
    const contentMatch = message.content?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const nameMatch = message.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    return contentMatch || nameMatch;
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [liveMessages, typingUsers]);

  // Set up real-time subscription
  useEffect(() => {
    if (!activeChannelId && !activeConversationId) return;

    const channelName = activeChannelId ? `channel-${activeChannelId}` : `dm-${activeConversationId}`;
    const tableName = activeChannelId ? 'messages' : 'dm_messages';
    const filter = activeChannelId ? `channel_id=eq.${activeChannelId}` : `conversation_id=eq.${activeConversationId}`;

    console.log(`[Chat] Subscribing to changes for: ${channelName}`);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter: filter,
        },
        async (payload) => {
          console.log('[Chat] Message change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const { data, error } = await supabase
              .from(tableName)
              .select(`
                *,
                ${activeChannelId ? 'profiles (full_name, avatar_url),' : 'sender:profiles (*),'}
                ${activeChannelId ? 'reactions:message_reactions (emoji, user_id),' : ''}
                ${activeChannelId ? 'reply_to:thread_id (content, profiles (full_name, avatar_url))' : ''}
              `.replace(/,\s*$/, ''))
              .eq('id', payload.new.id)
              .single();

            if (!error && data) {
              // Normalize data for UI
              const normalizedData = activeChannelId ? data : {
                ...data,
                profiles: (data as { sender: any }).sender
              };
              
              // Cache in Dexie
              await db.messages.put({
                ...normalizedData,
                space_id: currentSpace.id,
                channel_id: activeChannelId,
                conversation_id: activeConversationId,
                status: 'sent'
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            await db.messages.update(payload.new.id, {
              ...payload.new,
              is_edited: true
            });
          } else if (payload.eventType === 'DELETE') {
            await db.messages.delete(payload.old.id);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
        },
        async (payload) => {
          console.log('[Chat] Reaction change received:', payload);
          if (payload.eventType === 'INSERT') {
        const message = await db.messages.get(payload.new.message_id);
        if (message) {
          const reactions = message.reactions || [];
          await db.messages.update(payload.new.message_id, {
            reactions: [...reactions, { emoji: payload.new.emoji, user_id: payload.new.user_id }]
          });
        }
      } else if (payload.eventType === 'DELETE') {
        const message = await db.messages.get(payload.old.message_id);
        if (message) {
          await db.messages.update(payload.old.message_id, {
            reactions: message.reactions?.filter((r: { user_id: string; emoji: string }) => r.user_id !== payload.old.user_id || r.emoji !== payload.old.emoji)
          });
        }
      }
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const typing: Record<string, { full_name: string }> = {};
        
        Object.values(newState).forEach((presences) => {
          (presences as any[]).forEach((presence) => {
            if (presence.is_typing && presence.user_id !== currentUser.id) {
              typing[presence.user_id] = { full_name: presence.full_name };
            }
          });
        });
        
        setTypingUsers(typing);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: currentUser.id,
            full_name: currentUser.full_name,
            is_typing: false
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChannelId, supabase]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type for image or video
    
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileId = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
      const fileName = `${fileId}.${fileExt}`;
      const filePath = `${currentUser.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file);

      if (error) throw error;

      // Use our custom CDN URL format
      const customUrl = `/file/${data.path}`;

      setUploadedFile({
        url: customUrl,
        type: file.type
      });
    } catch (error) {
      console.error('[Chat] Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    if (!activeChannelId) return;

    if (!isTyping) {
      setIsTyping(true);
      supabase.channel(`channel-${activeChannelId}`).track({
        user_id: currentUser.id,
        full_name: currentUser.full_name,
        is_typing: true
      });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      supabase.channel(`channel-${activeChannelId}`).track({
        user_id: currentUser.id,
        full_name: currentUser.full_name,
        is_typing: false
      });
    }, 3000);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!newMessage.trim() && !uploadedFile) || isSending) return;
    if (!currentUser.id) {
      alert('You must be logged in to send messages.');
      return;
    }

    setIsSending(true);
    const tempId = `temp-${Date.now()}`;
    const messageContent = newMessage.trim();
    
    // Optimistic Update
    const optimisticMessage: Message = {
      id: tempId,
      created_at: new Date().toISOString(),
      content: messageContent,
      user_id: currentUser.id,
      space_id: currentSpace.id,
      channel_id: activeChannelId,
      conversation_id: activeConversationId,
      profiles: {
        full_name: currentUser.full_name,
        avatar_url: currentUser.avatar_url
      },
      status: 'pending'
    };

    await db.messages.put(optimisticMessage);
    setNewMessage('');
    setUploadedFile(null);
    setReplyingTo(null);

    try {
      const endpoint = activeChannelId ? '/api/messages/send' : '/api/dms/messages';
      const body = activeChannelId ? {
        content: messageContent,
        spaceId: currentSpace.id,
        channelId: activeChannelId,
        threadId: replyingTo?.id || null,
        fileUrl: uploadedFile?.url || null,
        fileType: uploadedFile?.type || null
      } : {
        content: messageContent,
        conversationId: activeConversationId
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to send');
      }
      
      const sentMessage = await response.json();
      
      // Replace optimistic message with real one
      await db.messages.delete(tempId);
      
      const normalizedMessage = activeChannelId ? sentMessage : {
        ...sentMessage,
        profiles: sentMessage.sender
      };

      await db.messages.put({
        ...normalizedMessage,
        space_id: currentSpace.id,
        channel_id: activeChannelId,
        conversation_id: activeConversationId,
        status: 'sent'
      });
    } catch (err) {
      console.error('[Chat] Error sending message:', err);
      await db.messages.update(tempId, { status: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditMessage = async (messageId: string) => {
    if (!editContent.trim()) return;

    try {
      const tableName = activeChannelId ? 'messages' : 'dm_messages';
      const { error } = await supabase
        .from(tableName)
        .update({ 
          content: editContent.trim(),
          is_edited: true 
        })
        .eq('id', messageId);

      if (error) throw error;
      setEditingMessageId(null);
      setEditContent('');
    } catch (error) {
      console.error('[Chat] Error editing message:', error);
      alert('Failed to edit message');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const tableName = activeChannelId ? 'messages' : 'dm_messages';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('[Chat] Error deleting message:', error);
      alert('Failed to delete message');
    }
  };



  const handleUserHover = async (e: React.MouseEvent, message: Message) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    
    // Set basic info immediately
    setHoveredUser({
      id: message.user_id,
      full_name: message.profiles?.full_name || 'Unknown',
      avatar_url: message.profiles?.avatar_url || null,
      rect
    });

    // Fetch extra details
    const { data: profile } = await supabase
      .from('profiles')
      .select('bio, location, organization')
      .eq('id', message.user_id)
      .single();

    if (profile) {
      setHoveredUser(prev => prev && prev.id === message.user_id ? {
        ...prev,
        bio: profile.bio,
        location: profile.location,
        organization: profile.organization
      } : prev);
    }
  };

  const handleUserLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredUser(null);
    }, 300);
  };

  const handleStartDM = async (recipientId: string) => {
    try {
      const response = await fetch('/api/dms/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId })
      });

      if (!response.ok) throw new Error('Failed to start conversation');
      
      const { conversationId } = await response.json();
      
      // We need to notify the parent to switch to this conversation
      // For now, we'll just reload the page or use a window event
      // Better approach: use a custom event or a shared state if we had a provider
      window.dispatchEvent(new CustomEvent('switch-to-dm', { detail: { conversationId } }));
      setHoveredUser(null);
    } catch (error) {
      console.error('[Chat] Error starting DM:', error);
      alert('Failed to start conversation');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-950">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
              <Hash className="h-12 w-12 mb-4 opacity-20" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div key={message.id} className="flex gap-3 group relative">
                <Link 
                  href={`/spaces/${currentSpace.slug}/user/${encodeURIComponent(message.profiles?.full_name || '')}`}
                  className="shrink-0"
                  onMouseEnter={(e) => handleUserHover(e, message)}
                  onMouseLeave={handleUserLeave}
                >
                  <Avatar className="h-10 w-10 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors">
                    <AvatarImage src={message.profiles?.avatar_url || ''} />
                    <AvatarFallback>{message.profiles?.full_name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between group/header">
                    <div className="flex items-center gap-2 mb-1">
                      <Link 
                        href={`/spaces/${currentSpace.slug}/user/${encodeURIComponent(message.profiles?.full_name || '')}`}
                        className="font-bold text-sm hover:underline cursor-pointer"
                        onMouseEnter={(e) => handleUserHover(e, message)}
                        onMouseLeave={handleUserLeave}
                      >
                        {message.profiles?.full_name || 'Unknown'}
                      </Link>
                      <span className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {format(new Date(message.created_at), 'h:mm a')}
                      </span>
                      {message.is_edited && (
                        <span className="text-[10px] text-zinc-400 italic">(edited)</span>
                      )}
                      {message.status === 'pending' && (
                        <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
                      )}
                      {message.status === 'error' && (
                        <span className="text-[10px] text-red-500">Failed to send</span>
                      )}
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {activeChannelId && (
                            <DropdownMenuItem onClick={() => setReplyingTo(message)}>
                              <Reply className="h-4 w-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                          )}
                          {message.user_id === currentUser.id && (
                            <>
                              <DropdownMenuItem onClick={() => {
                                setEditingMessageId(message.id);
                                setEditContent(message.content);
                              }}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDeleteMessage(message.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {editingMessageId === message.id ? (
                    <div className="mt-1 space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[80px] w-full"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleEditMessage(message.id)}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingMessageId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-800 dark:text-zinc-200 break-words leading-relaxed">
                      {message.content}
                    </div>
                  )}
                  {message.file_url && (
                    <div className="mt-2">
                      {message.file_type?.startsWith('image/') ? (
                        <img 
                          src={message.file_url} 
                          alt="Attachment" 
                          className="max-w-sm max-h-[300px] rounded-lg border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedMedia({ url: message.file_url!, type: message.file_type! })}
                        />
                      ) : (
                        <a 
                          href={message.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-fit hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <FileIcon className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-medium">Download Attachment</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
          {replyingTo && (
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 mb-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <Reply className="h-3 w-3 text-blue-500 shrink-0" />
                <div className="text-xs truncate">
                  <span className="font-bold mr-1">Replying to {replyingTo.profiles?.full_name}:</span>
                  <span className="text-zinc-600 dark:text-zinc-400">{replyingTo.content}</span>
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={() => setReplyingTo(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {uploadedFile && (
            <div className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileIcon className="h-4 w-4 text-blue-500" />
                <span className="text-xs truncate">{uploadedFile.url.split('/').pop()}</span>
              </div>
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setUploadedFile(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading || isSending}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isUploading || isSending}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
            <Input
              value={newMessage}
              onChange={handleMessageChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${activeChannelName}`}
              className="flex-1"
              disabled={isSending}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={(!newMessage.trim() && !uploadedFile) || isSending}
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {selectedMedia && (
        <MediaModal
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          url={selectedMedia.url}
          type={selectedMedia.type}
        />
      )}

      {/* User Hover Card */}
      <AnimatePresence>
        {hoveredUser && hoveredUser.rect && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden pointer-events-auto"
            style={{
              left: Math.min(typeof window !== 'undefined' ? window.innerWidth - 340 : 0, Math.max(20, hoveredUser.rect.left)),
              top: hoveredUser.rect.top > (typeof window !== 'undefined' ? window.innerHeight / 2 : 0) 
                ? hoveredUser.rect.top - 240 
                : hoveredUser.rect.bottom + 10
            }}
            onMouseEnter={() => {
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
              }
            }}
            onMouseLeave={handleUserLeave}
          >
            <div className="h-20 bg-gradient-to-r from-blue-500 to-indigo-600" />
            <div className="px-4 pb-4">
              <div className="relative -mt-10 mb-3">
                <Avatar className="h-20 w-20 border-4 border-white dark:border-zinc-900 shadow-lg">
                  <AvatarImage src={hoveredUser.avatar_url || ''} />
                  <AvatarFallback className="text-2xl bg-zinc-100 text-zinc-600">
                    {hoveredUser.full_name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {hoveredUser.full_name}
                </h3>
                {hoveredUser.organization && (
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-sm">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{hoveredUser.organization}</span>
                  </div>
                )}
                {hoveredUser.location && (
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{hoveredUser.location}</span>
                  </div>
                )}
              </div>

              {hoveredUser.bio && (
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                  {hoveredUser.bio}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <Button 
                  className="flex-1 h-9 text-sm"
                  asChild
                >
                  <Link href={`/spaces/${currentSpace.slug}/user/${encodeURIComponent(hoveredUser.full_name || '')}`}>
                    View Profile
                  </Link>
                </Button>
                {hoveredUser.id !== currentUser.id && (
                  <Button 
                    variant="outline" 
                    className="flex-1 h-9 text-sm"
                    onClick={() => handleStartDM(hoveredUser.id)}
                  >
                    Message
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
