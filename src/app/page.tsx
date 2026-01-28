'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const [rooms, setRooms] = useState<any[]>([])
  const [showPasswordModal, setShowPasswordModal] = useState<string | null>(null)
  const [attemptPassword, setAttemptPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      // Get user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      // Get rooms
      const { data: initialRooms, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching rooms:', error.message)
      } else {
        setRooms(initialRooms || [])
      }
      setLoading(false)
    }

    fetchData()

    // Subscribe to real-time rooms
    const channel = supabase
      .channel('public:rooms')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rooms' }, (payload) => {
        setRooms((current) => [payload.new, ...current])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleJoinRoom = (room: any) => {
    if (room.is_private) {
      setShowPasswordModal(room.id)
      setAttemptPassword('')
      setPasswordError(false)
    } else {
      router.push(`/room/${room.id}`)
    }
  }

  const checkPassword = (e: React.FormEvent) => {
    e.preventDefault()
    const room = rooms.find(r => r.id === showPasswordModal)
    if (room && room.password === attemptPassword) {
      router.push(`/room/${room.id}`)
    } else {
      setPasswordError(true)
    }
  }

  if (loading) {
    return <div className="text-xs text-gray-500 italic p-4">Loading rooms...</div>
  }

  return (
    <div className="space-y-6 relative">
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-[#ff6600] p-6 max-w-sm w-full">
            <h3 className="text-sm font-bold mb-4">Private Room: Password Required</h3>
            <form onSubmit={checkPassword} className="space-y-4">
              <input
                type="password"
                value={attemptPassword}
                onChange={(e) => {
                  setAttemptPassword(e.target.value)
                  setPasswordError(false)
                }}
                autoFocus
                placeholder="Enter password..."
                className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-[#ff6600]"
              />
              {passwordError && (
                <p className="text-[10px] text-red-600 font-bold">Incorrect password. Try again.</p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(null)}
                  className="px-3 py-1 text-xs border border-gray-300 hover:bg-gray-100"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ff6600] text-black px-4 py-1 text-xs font-bold border border-gray-400 hover:bg-[#ff8533]"
                >
                  join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-300 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold">Rooms</h2>
          <p className="text-[10px] text-gray-500">Select a room to start chatting</p>
        </div>
        <Link 
          href="/create-room"
          className="bg-[#ff6600] text-black px-4 py-2 text-xs font-bold border border-gray-400 hover:bg-[#ff8533] transition-colors"
        >
          CREATE ROOM
        </Link>
      </div>

      <div className="bg-white border border-gray-300">
        <div className="bg-[#f6f6ef] border-b border-gray-300 px-2 py-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-600">Active Rooms</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {rooms.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 italic text-center">No rooms available. Be the first to create one!</div>
          ) : (
            rooms.map((room) => (
              <button 
                key={room.id} 
                onClick={() => handleJoinRoom(room)}
                className="w-full text-left block p-3 hover:bg-[#f6f6ef] transition-colors group"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold group-hover:text-[#ff6600]">{room.name}</h3>
                    {room.is_private && (
                      <span className="text-[9px] bg-gray-200 text-gray-600 px-1 font-mono uppercase">Private</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(room.created_at).toLocaleDateString()}
                  </span>
                </div>
                {room.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{room.description}</p>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
