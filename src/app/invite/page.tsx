"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Hash, ArrowRight, ShieldCheck, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const inviteSchema = z.object({
  inviteCode: z.string()
    .length(8, "Invite code must be exactly 8 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Invite code can only contain letters and numbers"),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export default function InvitePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        router.push("/login?next=/invite");
      }
    };
    checkUser();
  }, [supabase, router]);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    mode: "onChange",
    defaultValues: {
      inviteCode: "",
    },
  });

  const onSubmit = async (data: InviteFormValues) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      // 1. Find the space with this invite code
      const { data: space, error: findError } = await supabase
        .from("spaces")
        .select("id, slug, name")
        .eq("invite_code", data.inviteCode)
        .single();

      if (findError || !space) {
        throw new Error("Invalid invite code. Please check and try again.");
      }

      // 2. Try to join the space
      const { error: joinError } = await supabase
        .from("space_members")
        .insert([
          {
            space_id: space.id,
            user_id: user.id,
            role: "member",
          },
        ]);

      if (joinError) {
        if (joinError.code === "23505") {
          // Already a member
          router.push(`/spaces/${space.slug}`);
          return;
        }
        throw joinError;
      }

      // 3. Redirect to the space
      router.push(`/spaces/${space.slug}`);
    } catch (err: any) {
      setError(err.message || "Failed to join space");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2">
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
        <CardHeader className="space-y-4 pt-8 pb-6 text-center">
          <div className="flex justify-center">
            <div className="bg-[#a9d6f3]/10 p-4 rounded-full">
              <UserPlus className="h-10 w-10 text-[#a9d6f3]" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">Join a Space</CardTitle>
            <CardDescription className="text-base px-2 leading-relaxed">
              Enter the 8-character invite code shared with you to join a private space.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="inviteCode" className="text-sm font-medium">Invite Code</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="inviteCode"
                  placeholder="e.g. A1B2C3D4"
                  className="pl-10 h-12 text-lg font-mono uppercase tracking-widest"
                  maxLength={8}
                  {...form.register("inviteCode")}
                />
              </div>
              {form.formState.errors.inviteCode && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {form.formState.errors.inviteCode.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 font-semibold shadow-sm group bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950" 
              disabled={loading || !form.formState.isValid}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Join Space
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-zinc-50 dark:bg-zinc-900/50 border-t py-6 flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have a code? <Link href="/join-space" className="text-[#a9d6f3] font-semibold hover:underline">Browse public spaces</Link>
          </p>
        </CardFooter>
      </Card>
      
      <p className="mt-8 text-zinc-400 text-sm">
        Need to create your own? <Link href="/create-space" className="text-[#a9d6f3] hover:underline font-medium">Create a new space</Link>
      </p>
    </div>
  );
}
