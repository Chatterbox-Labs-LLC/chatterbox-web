import { supabaseAdmin } from '@/lib/supabase-admin'
import { resend } from '@/lib/resend'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 1. Generate a recovery link using the Admin SDK
    // This gives us more control over the email and the redirect
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    
    console.log('[Forgot Password] Generating link for:', email);
    console.log('[Forgot Password] App URL:', appUrl);

    // Use admin client to generate the link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
      }
    });

    if (linkError) {
      console.error('[Forgot Password] Link generation error:', {
        message: linkError.message,
        status: linkError.status,
        name: linkError.name
      });
      return NextResponse.json({ error: linkError.message }, { status: 400 });
    }

    const resetLink = linkData.properties.action_link;
    console.log('[Forgot Password] Generated link details:', {
      link: resetLink,
      email,
      type: 'recovery'
    });

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'Chatterbox Teams <onboarding@resend.dev>',
      to: [email],
      subject: 'Reset your password for Chatterbox Teams',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h1 style="color: #000; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Reset your password</h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            We received a request to reset the password for your Chatterbox Teams account. Click the button below to choose a new password.
          </p>
          <a href="${resetLink}" style="display: inline-block; background-color: #000; color: #fff; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-bottom: 24px;">
            Reset Password
          </a>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #3b82f6; font-size: 14px; word-break: break-all;">
            ${resetLink}
          </p>
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px;">
              If you didn't request this, you can safely ignore this email. This link will expire in 24 hours.
            </p>
          </div>
        </div>
      `,
    })

    if (emailError) {
      console.error('[Forgot Password] Email send error:', emailError);
      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Forgot Password API] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

