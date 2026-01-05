"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Loader2, Search, ArrowRight, Layout, Users, Plus, ShieldCheck } from "lucide-react";

export default function JoinSpacePage() {
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [spaces, setSpaces] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        router.push(slugParam ? `/spaces/${slugParam}/login` : "/login?next=/join-space");
      }
    };
    checkUser();
  }, [supabase, router, slugParam]);

  useEffect(() => {
    if (slugParam && user) {
      fetchSpecificSpace(slugParam);
    }
  }, [slugParam, user]);

  const fetchSpecificSpace = async (slug: string) => {
    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      if (data) setSpaces([data]);
    } catch (err: any) {
      console.error("Error fetching space:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError(null);

    try {
      // Search for spaces by name or slug
      const { data, error: searchError } = await supabase
        .from("spaces")
        .select(`
          *
        `)
        .or(`name.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%`)
        .limit(10);

      if (searchError) throw searchError;
      setSpaces(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to search for spaces");
    } finally {
      setSearching(false);
    }
  };

  const joinSpace = async (spaceId: string, slug: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error: joinError } = await supabase
        .from("space_members")
        .insert([
          {
            space_id: spaceId,
            user_id: user.id,
            role: "member",
          },
        ]);

      if (joinError) {
        if (joinError.code === "23505") {
          // Already a member, just redirect
          router.push(`/spaces/${slug}`);
          return;
        }
        throw joinError;
      }

      router.push(`/spaces/${slug}`);
    } catch (err: any) {
      setError(err.message || "Failed to join space");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="h-16 border-b bg-white dark:bg-zinc-900 px-6 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-black p-1.5 rounded-lg">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">Chatterbox Teams</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {slugParam ? `Join ${spaces[0]?.name || 'Space'}` : "Join a Space"}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {slugParam 
              ? "You need to join this space before you can access its channels."
              : "Search for an existing space by name or unique URL slug to join your team or community."}
          </p>
        </div>

        {!slugParam && (
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or slug (e.g. 'marketing' or 'design-team')"
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" disabled={searching} className="px-8">
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20 text-center">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {searching ? (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Searching for spaces...</p>
            </div>
          ) : spaces.length > 0 ? (
            spaces.map((space) => (
              <Card key={space.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Layout className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{space.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                        /{space.slug}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Active Space
                      </span>
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => joinSpace(space.id, space.slug)}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join Space"}
                  </Button>
                </CardHeader>
                {space.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {space.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          ) : searchQuery && !searching ? (
            <div className="text-center py-12 border-2 border-dashed rounded-xl space-y-4">
              <div className="bg-zinc-100 dark:bg-zinc-800 h-12 w-12 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">No spaces found</p>
                <p className="text-sm text-zinc-500">Try searching with a different keyword</p>
              </div>
            </div>
          ) : null}
        </div>

        {slugParam && (
          <div className="text-center pt-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/join-space')}
              className="text-zinc-500 hover:text-black"
            >
              Search for other spaces
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
