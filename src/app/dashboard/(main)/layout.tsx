export const runtime = "edge";
export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { LayoutDashboard, Settings, User, LogOut, Plus, Search, UserPlus, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCachedProfile } from '@/lib/cache';
import { Metadata } from 'next';
import { DashboardMobileNav } from '@/components/dashboard-mobile-nav';

export const metadata: Metadata = {
  title: 'Dashboard - Chatterbox Teams',
  description: 'Manage your profile, billing, and settings.',
};

export default async function DashboardMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch cached profile for header/sidebar
  const profile = user ? await getCachedProfile(user.id) : null;
  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'Guest';

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white dark:bg-zinc-900 fixed h-full">
        <div className="p-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3]">
              <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
            </svg>
            <span className="font-bold text-lg tracking-tight">Chatterbox Teams</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-600 dark:text-zinc-400" asChild>
            <Link href="/spaces">
              <Plus className="h-4 w-4" />
              My Spaces
            </Link>
          </Button>
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Settings
            </div>
            <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-600 dark:text-zinc-400" asChild>
              <Link href="/dashboard/profile">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-600 dark:text-zinc-400" asChild>
              <Link href="/dashboard/billing">
                <CreditCard className="h-4 w-4" />
                Billing
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-600 dark:text-zinc-400" asChild>
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                App Settings
              </Link>
            </Button>
          </div>
        </nav>
        <div className="p-4 border-t">
          <form action="/api/auth/signout" method="post">
            <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10" type="submit">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Header */}
        <header className="h-16 border-b bg-white dark:bg-zinc-900 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <DashboardMobileNav />
            <h1 className="font-semibold text-lg md:text-xl">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:block">{fullName}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <footer className="py-6 px-8 border-t bg-white dark:bg-zinc-900 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Chatterbox Teams. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
