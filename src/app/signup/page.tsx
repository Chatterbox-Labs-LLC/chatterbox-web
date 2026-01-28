'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Using a dummy email since Supabase Auth requires one by default
    const email = `${username.toLowerCase()}@index.chat`

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="max-w-sm space-y-4">
      <h2 className="text-base font-bold">Join Chat</h2>
      <form onSubmit={handleSignup} className="space-y-2">
        {error && <div className="text-xs text-red-500 bg-red-50 p-2 border border-red-200">{error}</div>}
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1" htmlFor="username">username:</label>
          <input 
            id="username"
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 px-1 py-0.5 text-sm focus:outline-none bg-white"
            autoComplete="off"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1" htmlFor="password">password:</label>
          <input 
            id="password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 px-1 py-0.5 text-sm focus:outline-none bg-white"
            autoComplete="new-password"
            required
          />
        </div>
        <div className="pt-2 text-[10px] text-gray-500 italic">
          * no email required for index chat
        </div>
        <div className="pt-2">
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#ff6600] text-black px-4 py-1 text-xs font-bold border border-gray-400 hover:bg-[#ff8533] transition-colors disabled:opacity-50"
          >
            {loading ? 'creating...' : 'create account'}
          </button>
        </div>
      </form>
      <div className="text-xs pt-4 border-t border-gray-200">
        <p className="text-gray-600">
          Already have an account? <a href="/login" className="text-black hover:underline">login</a>
        </p>
      </div>
    </div>
  );
}
