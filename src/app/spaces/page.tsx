export const runtime = "edge";
export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { Plus, Search, UserPlus, ArrowRight, LayoutDashboard, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';

export default async function SpacesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch spaces for the user directly from Supabase
  const { data: spaces } = await supabase
    .from('spaces')
    .select('*, space_members!inner(*)')
    .eq('space_members.user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="h-16 border-b bg-white dark:bg-zinc-900 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3]">
            <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
          </svg>
          <span className="font-bold text-lg tracking-tight hidden sm:inline-block">Chatterbox Teams</span>
          <span className="font-bold text-lg tracking-tight sm:hidden">Chatterbox</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <form action="/api/auth/signout" method="post">
            <Button variant="ghost" size="sm" type="submit" className="px-2 sm:px-3">
              Logout
            </Button>
          </form>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Your Spaces</h1>
            <p className="text-muted-foreground text-lg">Access and manage all your collaborative workspaces.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/join-space">
                <Search className="h-4 w-4 mr-2" />
                Find Space
              </Link>
            </Button>
            <Button className="shadow-lg shadow-primary/20" asChild>
              <Link href="/create-space">
                <Plus className="h-4 w-4 mr-2" />
                Create Space
              </Link>
            </Button>
          </div>
        </div>

        {/* Spaces Grid */}
        {spaces && spaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <Card key={space.id} className="group hover:shadow-xl transition-all duration-300 border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="h-2 bg-[#a9d6f3]" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-[#a9d6f3]/10 text-[#a9d6f3]">
                      {space.is_public ? <Globe className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                      space.is_public 
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                    }`}>
                      {space.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-xl group-hover:text-[#a9d6f3] transition-colors">
                    {space.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px]">
                    {space.description || 'No description provided.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full group/btn bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950" asChild>
                    <Link href={`/spaces/${space.slug}`}>
                      Enter Space
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center">
            <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-full mb-6">
              <Users className="h-12 w-12 text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No spaces found</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              You haven't joined or created any spaces yet. Start by creating your first workspace!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/create-space">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Space
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/join-space">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Public Spaces
                </Link>
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card className="bg-gradient-to-br from-[#a9d6f3] to-[#a9d6f3]/80 text-zinc-950 border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <UserPlus className="h-32 w-32" />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-bold">Have an invite code?</CardTitle>
              <CardDescription className="text-zinc-800">
                Join a private space using a code from your team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full sm:w-auto" asChild>
                <Link href="/invite">Join with Code</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle>Need help?</CardTitle>
              <CardDescription>
                Learn how to get the most out of Chatterbox Teams spaces.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full sm:w-auto">View Documentation</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
