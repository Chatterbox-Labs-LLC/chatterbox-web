"use client";
export const runtime = "edge";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus, AlertCircle, ArrowRight, LogIn, UserCircle2 } from "lucide-react";

export default function InviteCodePage() {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [space, setSpace] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    const initialize = async () => {
      if (!code) return;

      try {
        // 1. Fetch space details (publicly viewable)
        const { data: spaceData, error: spaceError } = await supabase
          .from("spaces")
          .select("id, slug, name, description")
          .eq("invite_code", code)
          .single();

        if (spaceError || !spaceData) {
          throw new Error("Invalid invite code. This link may have expired or is incorrect.");
        }
        setSpace(spaceData);

        // 2. Check for authenticated user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        if (currentUser) {
          // 3. If logged in, try to join automatically
          const { error: joinError } = await supabase
            .from("space_members")
            .insert([
              {
                space_id: spaceData.id,
                user_id: currentUser.id,
                role: "member",
              },
            ]);

          if (joinError) {
            if (joinError.code === "23505") {
              // Already a member, just redirect
              router.push(`/spaces/${spaceData.slug}`);
              return;
            }
            throw joinError;
          }

          // Successfully joined, redirect
          router.push(`/spaces/${spaceData.slug}`);
        } else {
          // Not logged in, stop loading and show the invite card
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Invite error:", err);
        setError(err.message || "Failed to process invitation");
        setLoading(false);
      }
    };

    initialize();
  }, [supabase, router, code]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3]">
            <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
          </svg>
          <span className="text-2xl font-bold tracking-tight text-black dark:text-white">
            Chatterbox Teams
          </span>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-xl border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="h-2 bg-[#a9d6f3] w-full" />
        
        {loading ? (
          <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#a9d6f3]" />
            <div className="text-center">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">Processing invitation...</p>
              <p className="text-sm text-zinc-500">Checking code {code}</p>
            </div>
          </CardContent>
        ) : error ? (
          <>
            <CardHeader className="space-y-4 pt-8 pb-6 text-center">
              <div className="flex justify-center">
                <div className="bg-destructive/10 p-4 rounded-full">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold tracking-tight text-destructive">
                  Invitation Error
                </CardTitle>
                <CardDescription className="text-base px-2 leading-relaxed">
                  {error}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pb-8">
              <Button variant="outline" className="w-full h-11" asChild>
                <Link href="/invite">Try another code</Link>
              </Button>
              <Button className="w-full h-11 bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-4 pt-8 pb-6 text-center">
              <div className="flex justify-center">
                <div className="bg-[#a9d6f3]/10 p-4 rounded-full">
                  <UserPlus className="h-10 w-10 text-[#a9d6f3]" />
                </div>
              </div>
              <div className="space-y-2">
                <CardDescription className="text-[#a9d6f3] font-semibold uppercase tracking-wider text-xs">
                  You've been invited to join
                </CardDescription>
                <CardTitle className="text-3xl font-bold tracking-tight">
                  {space?.name}
                </CardTitle>
                {space?.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2 px-4 mt-2">
                    {space.description}
                  </p>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pb-8">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800 text-sm text-center">
                To accept this invitation and join the space, please sign in or create an account.
              </div>

              <div className="grid gap-3">
                <Button className="w-full h-12 bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950 font-bold group" asChild>
                  <Link href={`/signup?next=/invite/${code}`}>
                    <UserCircle2 className="mr-2 h-5 w-5" />
                    Create Account to Join
                    <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full h-12 border-zinc-200 dark:border-zinc-800 font-semibold" asChild>
                  <Link href={`/login?next=/invite/${code}`}>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In to Join
                  </Link>
                </Button>
              </div>
            </CardContent>

            <CardFooter className="bg-zinc-50 dark:bg-zinc-900/50 border-t py-4 flex justify-center">
              <p className="text-xs text-muted-foreground">
                Invite Code: <span className="font-mono font-bold text-[#a9d6f3]">{code}</span>
              </p>
            </CardFooter>
          </>
        )}
      </Card>
      
      <p className="mt-8 text-zinc-500 text-sm">
        New to Chatterbox Teams? <Link href="/" className="text-[#a9d6f3] hover:underline font-medium">Learn more</Link>
      </p>
    </div>
  );
}
