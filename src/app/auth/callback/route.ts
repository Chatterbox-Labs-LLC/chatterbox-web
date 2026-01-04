import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? (type === 'recovery' ? '/reset-password' : '/dashboard/welcome')
  
  console.log('[Auth Callback] Start', { code: !!code, token_hash: !!token_hash, type, next });

  // Use NEXT_PUBLIC_APP_URL for redirects to ensure consistency
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
  const redirectUrl = new URL(next, appUrl).toString()

  const supabase = await createClient()

  if (code) {
    console.log('[Auth Callback] Exchanging code for session...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      console.log('[Auth Callback] Code exchange successful, redirecting to:', redirectUrl);
      return NextResponse.redirect(redirectUrl)
    }
    console.error('[Auth Callback] Code exchange error:', error);
  }

  if (token_hash && type) {
    console.log('[Auth Callback] Verifying OTP...', { type });
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })
    if (!error) {
      console.log('[Auth Callback] OTP verification successful, redirecting to:', redirectUrl);
      return NextResponse.redirect(redirectUrl)
    }
    console.error('[Auth Callback] OTP verification error:', error);
  }

  console.warn('[Auth Callback] No valid code or token found, or verification failed. Redirecting to error page.');
  // return the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', appUrl).toString())
}
