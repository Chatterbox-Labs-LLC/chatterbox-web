'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateRoomPage() {
  const [newRoomName, setNewRoomName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [roomPassword, setRoomPassword] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)
      setLoading(false)
    }
    checkUser()
  }, [supabase, router])

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim() || !user) return
    if (isPrivate && !roomPassword.trim()) return

    const { data, error } = await supabase
      .from('rooms')
      .insert([
        { 
          name: newRoomName.trim(), 
          created_by: user.id,
          is_private: isPrivate,
          password: isPrivate ? roomPassword : null
        }
      ])
      .select()

    if (error) {
      console.error('Error creating room:', error.message)
    } else {
      if (data && data[0]) {
        router.push(`/room/${data[0].id}`)
      }
    }
  }

  if (loading) {
    return <div className="text-xs text-gray-500 italic p-4">Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/" className="text-[#ff6600] text-xs font-bold hover:underline">← Back to Rooms</Link>
      </div>

      <div className="bg-white border border-gray-300 p-6">
        <h2 className="text-sm font-bold mb-4">Create a New Room</h2>
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-500">Room Name</label>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Enter room name..."
              className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-[#ff6600] bg-white"
              required
            />
          </div>
          
          <div className="space-y-3 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="accent-[#ff6600]"
              />
              <span className="text-xs text-gray-600">Make this room private</span>
            </label>
            
            {isPrivate && (
              <div className="space-y-1 pl-6">
                <label className="text-[10px] font-bold uppercase text-gray-500">Room Password</label>
                <input
                  type="password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="Set password..."
                  className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-[#ff6600]"
                  required
                />
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!newRoomName.trim() || (isPrivate && !roomPassword.trim())}
              className="w-full bg-[#ff6600] text-black px-4 py-2 text-xs font-bold border border-gray-400 hover:bg-[#ff8533] transition-colors disabled:opacity-50"
            >
              CREATE ROOM
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
