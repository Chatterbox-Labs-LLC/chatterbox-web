"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Loader2, ShieldCheck, Mail, ArrowRight, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        if (signInError.message.includes("Email not confirmed")) {
          setError("Please verify your email address before logging in.");
        } else if (signInError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(signInError.message);
        }
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Github login failed");
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="bg-black p-2 rounded-xl">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-black">
                Chatterbox Teams
              </span>
            </Link>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Log in to your account to continue
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={cn(
                    "pl-10 h-11 bg-white dark:bg-zinc-900 transition-all",
                    form.formState.errors.email && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" title="Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character." className="text-sm font-medium">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-primary hover:underline underline-offset-4 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={cn(
                    "pl-10 h-11 bg-white dark:bg-zinc-900 transition-all",
                    form.formState.errors.password && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...form.register("password")}
                />
              </div>
              
              {form.formState.errors.password && (
                <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-3 animate-in fade-in zoom-in-95">
                <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium leading-tight">{error}</p>
              </div>
            )}

            <Button 
              className="w-full h-11 mt-2 font-semibold group" 
              type="submit"
              disabled={loading || !form.formState.isValid}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </CardContent>
        </form>

        <div className="px-6 pb-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-11 bg-white hover:bg-zinc-50 text-black border-zinc-200 transition-colors shadow-sm" 
            onClick={handleGithubLogin}
          >
            <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            Continue with GitHub
          </Button>

          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </div>
      </Card>

      <p className="mt-8 px-8 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms-of-service"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
