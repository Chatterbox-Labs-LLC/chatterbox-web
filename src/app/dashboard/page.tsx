import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { Plus, Search, UserPlus, ArrowRight, MessageSquare, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch spaces for the user (only spaces they are a member of)
  const { data: spaces } = user ? await supabase
    .from('spaces')
    .select('*, space_members!inner(*)')
    .eq('space_members.user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3) : { data: [] };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening in your spaces.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spaces</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spaces?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active workspaces</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Free</div>
            <p className="text-xs text-muted-foreground">Community edition</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight">Recent Spaces</h3>
          <p className="text-muted-foreground">Your most recently active workspaces.</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/spaces">
            View All Spaces
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Recent Spaces Grid */}
      {spaces && spaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <Card key={space.id} className="group hover:shadow-lg transition-all border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    {space.is_public ? <Globe className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                  </div>
                </div>
                <CardTitle className="text-lg">{space.name}</CardTitle>
                <CardDescription className="line-clamp-1">
                  {space.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary" asChild>
                  <Link href={`/spaces/${space.slug}`}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed py-12 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground mb-4">You haven't joined any spaces yet.</p>
          <Button asChild>
            <Link href="/create-space">Create your first space</Link>
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/create-space">
                <Plus className="h-4 w-4 mr-2" />
                Create a New Space
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/join-space">
                <Search className="h-4 w-4 mr-2" />
                Find a Space to Join
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/invite">
                <UserPlus className="h-4 w-4 mr-2" />
                Join with Invite Code
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>What's new in Chatterbox Teams.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="text-sm font-medium">New: Threaded Conversations</p>
                <p className="text-xs text-muted-foreground">Keep your chats organized with our new threading feature.</p>
              </div>
              <div className="border-l-2 border-zinc-200 pl-4">
                <p className="text-sm font-medium">Improved Search</p>
                <p className="text-xs text-muted-foreground">Find messages and spaces faster than ever.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
