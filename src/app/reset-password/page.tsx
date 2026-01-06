"use client";
export const runtime = "edge";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const changePasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number")
    .regex(/[^A-Za-z0-9]/, "Include at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    // Check if we have a session (the user should be signed in via the recovery link)
    const checkSession = async () => {
      console.log('[ResetPassword] Checking session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[ResetPassword] Session check error:', sessionError);
        setError("Error verifying your identity. Please try the link again.");
        return;
      }

      if (!session) {
        console.warn('[ResetPassword] No session found. Checking for hash tokens...');
        // Sometimes getSession() might be too early if the hash is still being processed
        // We can wait a tiny bit or just show the error
        setError("Invalid or expired link. Please request a new one.");
      } else {
        console.log('[ResetPassword] Session confirmed for:', session.user.email);
      }
    };
    
    checkSession();
  }, [supabase]);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setLoading(true);
    setError(null);
    console.log('[ResetPassword] Submitting password update...');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        console.error('[ResetPassword] Update user error:', updateError);
        throw updateError;
      }

      console.log('[ResetPassword] Password updated successfully!');
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      console.error('[ResetPassword] Unexpected error during update:', err);
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-md transform scale-[1.1] origin-center transition-transform">
        <Card className="shadow-xl border-zinc-200 dark:border-zinc-800">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3]">
                  <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
                </svg>
                <span className="text-2xl font-bold tracking-tight text-black dark:text-white">
                  Chatterbox Teams
                </span>
              </Link>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Reset Password
              </CardTitle>
              <CardDescription className="text-center">
                Choose a new secure password for your account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="space-y-6 py-2">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Password changed!</h3>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200/80 leading-relaxed">
                    Your password has been changed successfully. Redirecting you to login...
                  </p>
                </div>
                <Button className="w-full h-11 bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950" asChild>
                  <Link href="/login">
                    Go to Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="password" title="Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character." className="text-sm font-medium">New Password</Label>
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

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className={cn(
                        "pl-10 h-11 bg-white dark:bg-zinc-900 transition-all",
                        form.formState.errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
                      )}
                      {...form.register("confirmPassword")}
                    />
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-3 animate-in fade-in zoom-in-95">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive font-medium leading-tight">{error}</p>
                  </div>
                )}

                <Button 
                  className="w-full h-11 font-semibold shadow-sm bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950" 
                  type="submit"
                  disabled={loading || !form.formState.isValid}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
