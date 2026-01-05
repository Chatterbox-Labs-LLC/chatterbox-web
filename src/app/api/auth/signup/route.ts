import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { resend, RESEND_FROM_EMAIL } from '@/lib/resend';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      console.error('Signup Error: Supabase environment variables are missing or set to placeholder');
      return NextResponse.json(
        { error: 'Server configuration error. Please ensure Supabase environment variables are set correctly.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password, firstName, lastName } = body;
    
    const origin = new URL(request.url).origin;
    console.log('Signup Attempt:', { email, origin });

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use the standard signUp method which handles email verification automatically
    // if it's enabled in the Supabase project settings.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
        },
        emailRedirectTo: `${new URL(request.url).origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Supabase Signup Error Details:', {
        message: error.message,
        status: error.status,
        code: error.code,
        name: error.name
      });
      
      // Handle the specific case where user creation succeeded but email failed
      if (error.message.includes('Error sending confirmation email')) {
        console.log('Signup: User created but Supabase email failed. Falling back to Resend manual send...');
        
        try {
          const supabaseAdmin = createAdminClient();
          
          // 1. Generate a verification link
          const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'signup',
            email,
            password, // Passing password to ensure it's set correctly
            options: {
              data: {
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`.trim(),
              },
              redirectTo: `${origin}/auth/callback`,
            },
          });

          if (linkError) {
            console.error('Fallback link generation error:', linkError);
            throw linkError;
          }

          const verificationLink = linkData.properties.action_link;

          // 2. Send email via Resend
          const { error: emailError } = await resend.emails.send({
            from: `Chatterbox Teams <${RESEND_FROM_EMAIL}>`,
            to: [email],
            subject: 'Verify your email for Chatterbox Teams',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                <h1 style="color: #000; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Verify your email</h1>
                <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                  Hi ${firstName}, welcome to Chatterbox Teams! Please click the button below to verify your email address and get started.
                </p>
                <a href="${verificationLink}" style="display: inline-block; background-color: #000; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">Verify Email Address</a>
                <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #3b82f6; font-size: 12px;">${verificationLink}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #9ca3af;">If you didn't create an account, you can safely ignore this email.</p>
              </div>
            `,
          });

          if (emailError) {
            console.error('Fallback Resend error:', emailError);
            throw emailError;
          }

          return NextResponse.json({ success: true, message: 'Fallback email sent via Resend' });
        } catch (fallbackError: any) {
          console.error('Resend fallback failed:', fallbackError);
          return NextResponse.json({ 
            error: 'User created but verification email failed to send. Please try the "Resend Email" option on the next screen.',
            details: fallbackError.message
          }, { status: 400 });
        }
      }
      
      // Provide more helpful messages for other common errors
      let errorMessage = error.message;
      if (error.message.includes('User already registered')) {
        errorMessage = 'This email is already registered. Please try logging in instead.';
      } else if (error.status === 400 && error.message.includes('Password')) {
        errorMessage = 'Password does not meet security requirements.';
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Unexpected signup error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
