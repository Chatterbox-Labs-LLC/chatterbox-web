'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = use(params)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [room, setRoom] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      // Get user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      // Get room details
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      if (roomError) {
        console.error('Error fetching room:', roomError.message)
        router.push('/')
        return
      }
      setRoom(roomData)

      // Get messages for this room
      const { data: initialMessages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100)

      if (msgError) {
        console.error('Error fetching messages:', msgError.message)
      } else {
        setMessages(initialMessages || [])
      }
      setLoading(false)
    }

    fetchData()

    // Subscribe to real-time messages for THIS room
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `room_id=eq.${roomId}` 
        }, 
        (payload) => {
          setMessages((current) => [...current, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, roomId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('messages')
      .insert([
        { 
          content: newMessage, 
          username: user.user_metadata.username || 'anonymous',
          user_id: user.id,
          room_id: roomId
        }
      ])

    if (error) {
      console.error('Error sending message:', error.message)
    } else {
      setNewMessage('');
    }
  };

  if (loading) {
    return <div className="text-xs text-gray-500 italic p-4">Loading room...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white border border-gray-300 px-3 py-2">
        <div className="flex items-center space-x-3">
          <Link href="/" className="text-[#ff6600] text-xs font-bold hover:underline">← Back</Link>
          <h2 className="text-sm font-bold">{room?.name}</h2>
        </div>
        <div className="text-[10px] text-gray-500">
          Room ID: {roomId.slice(0, 8)}...
        </div>
      </div>

      <div className="flex flex-col h-[65vh] border border-gray-300 bg-white">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#f6f6ef]">
          {messages.length === 0 && (
            <div className="text-xs text-gray-400 italic text-center py-4">
              Welcome to {room?.name}! Be the first to say something.
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm flex items-baseline space-x-2">
              <span className="font-bold text-black shrink-0">{msg.username}:</span>
              <span className="text-black break-words">{msg.content}</span>
              <span className="text-[9px] text-gray-400 shrink-0">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t border-gray-300 p-2 bg-[#f6f6ef] flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={user ? "Type a message..." : "Login to chat"}
            className="flex-1 border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-[#ff6600] bg-white"
            disabled={!user}
          />
          <button
            type="submit"
            disabled={!user || !newMessage.trim()}
            className="bg-[#ff6600] text-black px-4 py-1 text-xs font-bold border border-gray-400 hover:bg-[#ff8533] transition-colors disabled:opacity-50"
          >
            send
          </button>
        </form>
        {!user && (
          <div className="bg-[#ffffcc] text-[10px] px-2 py-1 border-t border-gray-300 text-center">
            You must be <Link href="/login" className="underline font-bold">logged in</Link> to send messages.
          </div>
        )}
      </div>
    </div>
  );
}
