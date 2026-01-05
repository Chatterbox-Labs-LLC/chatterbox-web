"use client";

export const runtime = 'edge';

import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Check, Loader2, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const emailError = searchParams.get("emailError");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="mb-10 flex flex-col items-center">
        <div className="bg-black dark:bg-white p-3 rounded-2xl shadow-xl mb-4">
          <MessageSquare className="h-8 w-8 text-white dark:text-black" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Chatterbox Teams
        </h2>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
        <CardHeader className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
              <Mail className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">Check your email</CardTitle>
            <CardDescription className="text-base">
              {emailError ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Account created, but we couldn't send the link automatically. Please click "Resend" below.
                </span>
              ) : (
                <>
                  We've sent a magic link to <br />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{email || "your inbox"}</span>
                </>
              )}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-zinc-100 dark:bg-zinc-800/50 p-6 rounded-2xl space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              What happens next?
            </h4>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">1</div>
                Check your inbox (and spam folder)
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">2</div>
                Click the verification link
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">3</div>
                You'll be taken to your new welcome dashboard!
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" 
              onClick={handleResendEmail}
              disabled={resending || resendStatus === "success"}
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : resendStatus === "success" ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  Sent!
                </>
              ) : (
                "Didn't get the email? Resend"
              )}
            </Button>
            <Button className="w-full h-12 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold" variant="default" asChild>
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
