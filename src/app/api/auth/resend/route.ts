export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getResend, RESEND_FROM_EMAIL } from '@/lib/resend';


export async function POST(request: Request) {
  const supabaseAdmin = createAdminClient();
  const resend = getResend();
  try {
    const { email } = await request.json();

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
    // We'll use 'magiclink' for verification as it's the most reliable for existing users
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${new URL(request.url).origin}/auth/callback`,
      },
    });

    if (linkError) {
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
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h1 style="color: #000; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Verify your email</h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Hi ${firstName}, here is your new verification link to get started with Chatterbox Teams.
          </p>
          <a href="${verificationLink}" style="display: inline-block; background-color: #065ce5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0;">Verify Email Address</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationLink}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">If you didn't request this link, you can safely ignore this email.</p>
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
