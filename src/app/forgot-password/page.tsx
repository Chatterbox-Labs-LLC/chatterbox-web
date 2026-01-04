"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Loader2, Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const changePasswordRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ChangePasswordRequestFormValues = z.infer<typeof changePasswordRequestSchema>;

export const runtime = "edge";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<ChangePasswordRequestFormValues>({
    resolver: zodResolver(changePasswordRequestSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ChangePasswordRequestFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send reset link");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
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
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center">
              {success 
                ? "Check your email for a reset link" 
                : "Enter your email address and we'll send you a link to reset your password"}
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
                <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Check your inbox</h3>
                <p className="text-sm text-emerald-800 dark:text-emerald-200/80 leading-relaxed">
                  If an account exists for <span className="font-bold">{form.getValues("email")}</span>, 
                  you'll receive a password change link shortly.
                </p>
              </div>
              <Button variant="outline" className="w-full h-11" asChild>
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</Label>
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

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-3 animate-in fade-in zoom-in-95">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive font-medium leading-tight">{error}</p>
                </div>
              )}

              <Button 
                className="w-full h-11 font-semibold shadow-sm" 
                type="submit"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  "Send Change Link"
                )}
              </Button>

              <Button variant="ghost" className="w-full h-11 text-muted-foreground hover:text-foreground" asChild>
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
