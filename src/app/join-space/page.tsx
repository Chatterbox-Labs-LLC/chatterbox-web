"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, ArrowRight, Layout, Users, Plus, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <CardHeader className="space-y-4">
            <div className="flex justify-center mb-2">
              <Link href="/dashboard" className="hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3]">
                  <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
                </svg>
              </Link>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {slugParam ? `Join ${spaces[0]?.name || 'Space'}` : "Join a Space"}
              </CardTitle>
              <CardDescription className="text-center">
                {slugParam 
                  ? "You need to join this space to access its channels."
                  : "Search for a space to join your team."}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!slugParam && (
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter space name or URL slug..."
                  className="pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="hidden" />
              </form>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-3">
              {searching ? (
                <div className="py-12 flex flex-col items-center justify-center text-zinc-400 gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-[#a9d6f3]" />
                  <p className="text-sm">Searching for spaces...</p>
                </div>
              ) : spaces.length > 0 ? (
                <div className="grid gap-3">
                  {spaces.map((space) => (
                    <motion.div
                      key={space.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group"
                    >
                      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#a9d6f3]/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-[#a9d6f3]/10 flex items-center justify-center">
                            <Layout className="h-5 w-5 text-[#a9d6f3]" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm truncate">{space.name}</h4>
                            <p className="text-xs text-muted-foreground">/{space.slug}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => joinSpace(space.id, space.slug)}
                          disabled={loading}
                          className="h-8 px-4 bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950"
                        >
                          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Join"}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : searchQuery && !searching ? (
                <div className="text-center py-10 border-2 border-dashed rounded-2xl border-zinc-100 dark:border-zinc-800">
                  <div className="bg-zinc-50 dark:bg-zinc-900 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">No spaces found</p>
                  <p className="text-xs text-muted-foreground mt-1">Try a different name</p>
                </div>
              ) : !slugParam ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm italic">Enter a search to find your community</p>
                </div>
              ) : null}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-6">
            {slugParam ? (
              <Button 
                variant="outline" 
                className="w-full bg-white dark:bg-zinc-950"
                onClick={() => router.push('/join-space')}
              >
                Find another space
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full bg-white dark:bg-zinc-950"
                asChild
              >
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            )}
            
            <p className="text-[10px] text-center text-muted-foreground px-4 uppercase tracking-widest font-semibold">
              Chatterbox Teams &bull; Join your space
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
