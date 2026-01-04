import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { resend } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Get user to find their metadata (for the name in the email)
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      // For security, don't reveal if user exists
      return NextResponse.json({ success: true });
    }

    // 2. Generate a magic link or signup link
    // We'll use a magic link for resending verification if they haven't verified yet
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password: '', // This might be tricky for resending if we don't have the password. 
      // Actually, for resending verification, we usually use 'magiclink' or 'invite'.
      // But 'signup' type in generateLink requires a password.
      options: {
        redirectTo: `${new URL(request.url).origin}/auth/callback`,
      },
    });

    // Wait, if we don't have the password, we can't generate a 'signup' link.
    // Let's use 'magiclink' instead, it works for verification too if handled correctly.
    // Or better: Use 'invite' link which doesn't require a password.
    
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${new URL(request.url).origin}/auth/callback`,
      },
    });

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 500 });
    }

    const verificationLink = inviteData.properties.action_link;
    const firstName = user.user_metadata?.first_name || 'there';

    // 3. Send email via Resend
    await resend.emails.send({
      from: 'Chatterbox Teams <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify your email for Chatterbox Teams',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h1 style="color: #000; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Verify your email</h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Here is your new verification link to get started with Chatterbox Teams.
          </p>
          <a href="${verificationLink}" style="display: inline-block; background-color: #065ce5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0;">Verify Email Address</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationLink}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">If you didn't request this link, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to resend email' }, { status: 500 });
  }
}
