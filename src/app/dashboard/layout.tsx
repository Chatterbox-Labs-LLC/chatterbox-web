export const runtime = "edge";
export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Chatterbox Teams',
  description: 'Manage your profile, billing, and settings.',
};

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.log('[Dashboard Layout] No user found, redirecting to login');
      redirect('/login');
    }
    
    return <>{children}</>;
  } catch (err) {
    console.error('[Dashboard Layout] Auth error:', err);
    redirect('/login');
  }
}
