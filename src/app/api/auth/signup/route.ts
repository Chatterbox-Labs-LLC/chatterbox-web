import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

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
      console.error('Signup error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
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
