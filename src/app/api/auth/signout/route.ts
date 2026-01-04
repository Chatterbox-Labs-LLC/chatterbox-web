import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/login`, {
    status: 303,
  });
}
