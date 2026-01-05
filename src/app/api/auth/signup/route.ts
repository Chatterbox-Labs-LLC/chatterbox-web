export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { resend } from '@/lib/resend';


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
      },
    });

    if (authError) {
      return NextResponse.json(
        { 
          error: authError.message,
          code: authError.code,
        }, 
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 3. Generate verification link
    // We use 'signup' because it generates a link to confirm a new account creation.
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        redirectTo: `${new URL(request.url).origin}/dashboard/welcome`,
      },
    });

    if (linkError) {
      // Cleanup user if link generation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: 'Failed to generate verification link' }, { status: 500 });
    }

    const verificationLink = linkData.properties.action_link;

    // 4. Send email via Resend
    // Use onboarding@resend.dev if you haven't verified your domain yet
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Chatterbox Teams <onboarding@chatterboxteams.com>';
    
    const { error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Verify your email for Chatterbox Teams',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #065ce5;">Welcome to Chatterbox Teams!</h1>
          <p>Hi ${firstName},</p>
          <p>Thanks for signing up. Please click the button below to verify your email address and get started.</p>
          <a href="${verificationLink}" style="display: inline-block; background-color: #065ce5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0;">Verify Email Address</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationLink}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (emailError) {
      // We don't delete the user here because they can still try to resend the email later
      return NextResponse.json({ 
        error: `Account created but email failed: ${emailError.message}. Make sure your RESEND_API_KEY is correct.`,
        userId 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
