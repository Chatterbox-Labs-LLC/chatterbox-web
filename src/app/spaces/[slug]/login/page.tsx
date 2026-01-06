"use client";
export const runtime = "edge";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SpaceLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [space, setSpace] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    checkUserAndFetchSpace();
  }, [slug]);

  const checkUserAndFetchSpace = async () => {
    // 1. Fetch Space
    const { data: spaceData } = await supabase
      .from('spaces')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (spaceData) {
      setSpace(spaceData);
      
      // 2. Check if already logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 3. Check if already a member
        const { data: membership } = await supabase
          .from('space_members')
          .select('*')
          .eq('space_id', spaceData.id)
          .eq('user_id', user.id)
          .single();
        
        if (membership) {
          router.push(`/spaces/${slug}`);
        } else {
          // If logged in but not a member, redirect to join page for this space
          router.push(`/join-space?slug=${slug}`);
        }
      }
    }
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Sign in
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) throw signInError;

      const user = authData.user;
      if (!user) throw new Error("No user found");

      // 2. Check if already a member
      const { data: membership } = await supabase
        .from('space_members')
        .select('*')
        .eq('space_id', space.id)
        .eq('user_id', user.id)
        .single();

      // 3. Join space if not a member
      if (!membership) {
        const { error: joinError } = await supabase
          .from('space_members')
          .insert([
            {
              space_id: space.id,
              user_id: user.id,
              role: 'member',
            },
          ]);
        
        if (joinError) throw joinError;
      }

      // 4. Redirect to space
      router.push(`/spaces/${slug}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3]">
                <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
              </svg>
              <span className="text-xl font-bold tracking-tight">Chatterbox Teams</span>
            </Link>
          </div>
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl">
              Login to {space?.name || 'Space'}
            </CardTitle>
            <CardDescription>
              Enter your credentials to access this space
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...form.register("email")}
                disabled={loading}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                disabled={loading}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login to Space
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-black dark:text-white font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-8 flex items-center gap-6 text-zinc-400">
        <Link href="/dashboard" className="text-sm hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          Dashboard
        </Link>
        <Link href="/join-space" className="text-sm hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          Find Spaces
        </Link>
      </div>
    </div>
  );
}
