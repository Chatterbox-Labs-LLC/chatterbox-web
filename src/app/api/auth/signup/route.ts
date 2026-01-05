import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getResend, RESEND_FROM_EMAIL } from '@/lib/resend';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    const resend = getResend();
    const origin = new URL(request.url).origin;
    
    // 1. Parse and validate request
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`[Signup] Attempting signup for: ${email}`);

    // 2. Try to create the user via Admin API
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
      }
    });

    let user = userData?.user;

    if (createError) {
      if (createError.message.toLowerCase().includes('already registered')) {
        console.log(`[Signup] User already exists: ${email}. Fetching user details...`);
        
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        
        if (existingUser?.email_confirmed_at) {
          return NextResponse.json(
            { error: 'This email is already registered. Please try logging in.' },
            { status: 400 }
          );
        }
        user = existingUser || null;
      } else {
        console.error('[Signup] Admin creation error:', createError);
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }
    }

    if (!user) {
      throw new Error('Failed to create or find user');
    }

    // 3. Generate verification link
    console.log(`[Signup] Generating link for: ${email}`);
    
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: { 
        redirectTo: `${origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error('[Signup] Link generation failed:', linkError);
      return NextResponse.json({ 
        error: 'Failed to generate verification link. Please try again later.' 
      }, { status: 500 });
    }

    const verificationLink = linkData.properties.action_link;

    // 4. Send email via Resend
    console.log(`[Signup] Sending email from ${RESEND_FROM_EMAIL} to ${email}`);
    
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `Chatterbox Teams <${RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: 'Verify your email for Chatterbox Teams',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 24px; color: #000; text-align: center;">Welcome to Chatterbox Teams!</h1>
          <p style="font-size: 16px; line-height: 24px; margin-bottom: 32px; color: #4b5563;">
            Hi ${firstName}, we're excited to have you join us. Please click the button below to verify your email address and activate your account.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationLink}" style="display: inline-block; background-color: #000; color: #fff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">Verify Email Address</a>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 40px; text-align: center;">If the button doesn't work, copy and paste this link into your browser:</p>
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin-top: 12px; word-break: break-all; border: 1px solid #e5e7eb;">
            <p style="color: #3b82f6; font-size: 13px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; margin: 0;">${verificationLink}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 48px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('[Signup] Resend error details:', emailError);
      // Return a 200/success even if email fails, because the user WAS created.
      // We just need to tell them to use the resend button.
      return NextResponse.json({ 
        success: true,
        message: 'Account created! But we couldn\'t send the verification email automatically. Please check your spam or use the "Resend Email" button.',
        data: { 
          user: { id: user.id, email: user.email },
          emailError: emailError.message 
        }
      });
    }

    console.log(`[Signup] Success: Email sent to ${email}. ID: ${emailData?.id}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent. Please check your inbox.',
      data: { 
        user: { id: user.id, email: user.email },
        emailId: emailData?.id
      }
    });

  } catch (error: any) {
    console.error('[Signup] Critical error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'An unexpected error occurred during signup',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
