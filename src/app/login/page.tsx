'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const email = `${username.toLowerCase()}@index.chat`

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="max-w-sm space-y-4">
      <h2 className="text-base font-bold">Login</h2>
      <form onSubmit={handleLogin} className="space-y-2">
        {error && <div className="text-xs text-red-500 bg-red-50 p-2 border border-red-200">{error}</div>}
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1" htmlFor="username">username:</label>
          <input 
            id="username"
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 px-1 py-0.5 text-sm focus:outline-none"
            autoComplete="username"
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
            className="border border-gray-300 px-1 py-0.5 text-sm focus:outline-none"
            autoComplete="current-password"
            required
          />
        </div>
        <div className="pt-2">
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#ff6600] text-black px-4 py-1 text-xs font-bold border border-gray-400 hover:bg-[#ff8533] transition-colors disabled:opacity-50"
          >
            {loading ? 'logging in...' : 'login'}
          </button>
        </div>
      </form>
      <div className="text-xs pt-4 border-t border-gray-200">
        <a href="#" className="text-gray-600 hover:underline">Forgot your password?</a>
        <p className="mt-2 text-gray-600">
          Don't have an account? <a href="/signup" className="text-black hover:underline">create account</a>
        </p>
      </div>
    </div>
  );
}
