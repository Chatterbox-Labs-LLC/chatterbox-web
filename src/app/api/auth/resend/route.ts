export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getResend, RESEND_FROM_EMAIL } from '@/lib/resend';


export async function POST(request: Request) {
  const supabaseAdmin = createAdminClient();
  const resend = getResend();
  try {
    const { email, next } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Get user to find their metadata (for the name in the email)
    // We search through users to find the one with the matching email
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      return NextResponse.json({ error: 'Failed to lookup user' }, { status: 500 });
    }

    const user = users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      // For security, don't reveal if user exists
      return NextResponse.json({ success: true });
    }

    // If already verified, we can just return success or a specific message
    if (user.email_confirmed_at) {
      return NextResponse.json({ success: true, message: 'Email already verified' });
    }

    // 2. Generate a verification link
    // We'll use 'magiclink' for verification as it doesn't require the password
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${new URL(request.url).origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`,
      },
    });

    if (linkError) {
      console.error('[Resend] Link generation error:', linkError);
      return NextResponse.json({ error: linkError.message }, { status: 500 });
    }

    const verificationLink = linkData.properties.action_link;
    const firstName = user.user_metadata?.first_name || 'there';

    // 3. Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: `Chatterbox Teams <${RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: 'Verify your email for Chatterbox Teams',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 24px; color: #000; text-align: center;">Verify your email</h1>
          <p style="font-size: 16px; line-height: 24px; margin-bottom: 32px; color: #4b5563;">
            Hi ${firstName}, here is your new verification link to get started with Chatterbox Teams. Please click the button below to verify your email address.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationLink}" style="display: inline-block; background-color: #000; color: #fff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">Verify Email Address</a>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 40px; text-align: center;">If the button doesn't work, copy and paste this link into your browser:</p>
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin-top: 12px; word-break: break-all; border: 1px solid #e5e7eb;">
            <p style="color: #3b82f6; font-size: 13px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; margin: 0;">${verificationLink}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 48px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you didn't request this link, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (emailError) {
      return NextResponse.json({ error: emailError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to resend email' }, { status: 500 });
  }
}
