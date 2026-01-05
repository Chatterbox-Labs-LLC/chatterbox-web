export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getResend, RESEND_FROM_EMAIL } from '@/lib/resend'

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
    
    if (!error && data?.user) {
      const user = data.user;
      const isNewUser = new Date(user.created_at).getTime() > Date.now() - 60000;
      
      console.log('[Auth Callback] Session active:', { 
        id: user.id, 
        email: user.email,
        isNewUser,
        provider: user.app_metadata.provider 
      });

      // If it's a new signup (especially via GitHub/OAuth), send a welcome email
      if (isNewUser) {
        try {
          const resend = getResend();
          const firstName = user.user_metadata?.full_name?.split(' ')[0] || user.user_metadata?.first_name || 'there';
          
          console.log(`[Auth Callback] Sending welcome email to ${user.email}`);
          
          await resend.emails.send({
            from: `Chatterbox Teams <${RESEND_FROM_EMAIL}>`,
            to: [user.email!],
            subject: 'Welcome to Chatterbox Teams! 🚀',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
                <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 24px; color: #000; text-align: center;">Welcome aboard, ${firstName}!</h1>
                <p style="font-size: 18px; line-height: 28px; margin-bottom: 32px; color: #4b5563; text-align: center;">
                  We're thrilled to have you join Chatterbox Teams. Your account is now active and you're ready to start collaborating.
                </p>
                
                <div style="background-color: #f9fafb; padding: 32px; border-radius: 16px; margin-bottom: 32px; border: 1px solid #e5e7eb;">
                  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #000;">Getting Started</h2>
                  <ul style="padding-left: 20px; color: #4b5563; line-height: 24px;">
                    <li style="margin-bottom: 12px;">Create your first workspace</li>
                    <li style="margin-bottom: 12px;">Invite your team members</li>
                    <li style="margin-bottom: 12px;">Start your first conversation</li>
                  </ul>
                </div>

                <div style="text-align: center;">
                  <a href="${appUrl}/dashboard/welcome" style="display: inline-block; background-color: #000; color: #fff; padding: 18px 36px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">Go to Dashboard</a>
                </div>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 48px 0;" />
                <p style="font-size: 14px; color: #9ca3af; text-align: center;">
                  If you have any questions, just reply to this email. We're here to help!
                </p>
              </div>
            `,
          });
          console.log('[Auth Callback] Welcome email sent successfully');
        } catch (emailErr) {
          console.error('[Auth Callback] Failed to send welcome email:', emailErr);
          // Don't block the redirect if email fails
        }
      }

      console.log('[Auth Callback] Redirecting to:', redirectUrl);
      return NextResponse.redirect(redirectUrl)
    }
    
    if (error) {
      console.error('[Auth Callback] Code exchange error:', error);
    }
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
