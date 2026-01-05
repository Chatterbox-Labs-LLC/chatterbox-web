"use client";

export const runtime = 'edge';

import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Check, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");

  const handleResendEmail = async () => {
    if (!email) return;
    
    setResending(true);
    setResendStatus("idle");
    
    try {
      const response = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) throw new Error("Failed to resend");
      
      setResendStatus("success");
    } catch (err) {
      setResendStatus("error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-zinc-50 to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-black px-4">
      <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <div className="bg-black p-2.5 rounded-2xl shadow-lg shadow-black/10">
            <MessageSquare className="h-7 w-7 text-white" />
          </div>
          <span className="text-3xl font-bold tracking-tight text-black dark:text-white">
            Chatterbox Teams
          </span>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-2xl shadow-black/5 border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-6 pt-10 pb-6">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-5 rounded-full ring-[12px] ring-primary/5 animate-pulse">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div className="space-y-3 text-center">
            <CardTitle className="text-3xl font-extrabold tracking-tight">Check your email</CardTitle>
            <CardDescription className="text-lg px-2 leading-relaxed text-muted-foreground">
              We've sent a verification link to<br />
              {email ? (
                <span className="inline-block mt-2 text-primary font-bold bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                  {email}
                </span>
              ) : (
                <span className="inline-block mt-2 italic">your email address</span>
              )}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pb-10">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 text-sm text-muted-foreground shadow-sm group hover:border-primary/20 transition-colors">
            <ul className="space-y-4">
              <li className="flex gap-4 items-center">
                <div className="bg-emerald-500/10 p-1.5 rounded-full ring-4 ring-emerald-500/5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                </div>
                <span className="text-zinc-700 dark:text-zinc-300">Click the link in the email to verify your account</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="bg-emerald-500/10 p-1.5 rounded-full ring-4 ring-emerald-500/5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                </div>
                <span className="text-zinc-700 dark:text-zinc-300">Check your <b>spam folder</b> if you don't see it</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="bg-emerald-500/10 p-1.5 rounded-full ring-4 ring-emerald-500/5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                </div>
                <span className="text-zinc-700 dark:text-zinc-300">The link will expire in 24 hours</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-14 text-base font-semibold transition-all hover:bg-primary/5 hover:text-primary hover:border-primary/30 rounded-xl" 
              onClick={handleResendEmail}
              disabled={resending || resendStatus === "success" || !email}
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending new link...
                </>
              ) : resendStatus === "success" ? (
                <>
                  <Check className="mr-2 h-5 w-5 text-emerald-500" />
                  Verification email resent!
                </>
              ) : (
                "Didn't receive an email? Resend"
              )}
            </Button>
            
            {resendStatus === "error" && (
              <p className="text-sm text-destructive text-center font-medium animate-in fade-in slide-in-from-top-1">
                Failed to resend email. Please try again.
              </p>
            )}

            <Button className="w-full h-14 text-base font-bold shadow-lg shadow-primary/10 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" variant="secondary" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
