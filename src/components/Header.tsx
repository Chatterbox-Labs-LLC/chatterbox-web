'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="bg-[#ff6600] py-1 mb-4">
      <div className="container mx-auto px-1 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="border border-white w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
            Y
          </div>
          <h1 className="text-sm font-bold tracking-tight">
            <Link href="/">index</Link>
          </h1>
          <nav className="space-x-2 text-xs">
            <Link href="/" className="hover:underline font-bold">rooms</Link>
            <span>|</span>
            <Link href="/create-room" className="hover:underline font-bold">create</Link>
            <span>|</span>
            {user ? (
              <>
                <span className="text-black font-medium">{user.user_metadata.username || 'user'}</span>
                <span>|</span>
                <button onClick={handleLogout} className="hover:underline cursor-pointer">logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:underline">login</Link>
                <span>|</span>
                <Link href="/signup" className="hover:underline">signup</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
