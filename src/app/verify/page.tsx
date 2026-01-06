"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Check, Loader2, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const emailError = searchParams.get("emailError");
  const next = searchParams.get("next");
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
        body: JSON.stringify({ email, next }),
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#a9d6f3]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#a9d6f3]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md transform scale-[1.1] origin-center transition-transform">
        <div className="mb-10 flex flex-col items-center">
          <svg width="40" height="40" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3] mb-4">
            <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
          </svg>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Chatterbox Teams
          </h2>
        </div>

        <Card className="shadow-2xl border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
          <CardHeader className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="bg-[#a9d6f3]/10 p-4 rounded-full">
                <Mail className="h-10 w-10 text-[#a9d6f3]" />
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
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#a9d6f3]" />
                  What happens next?
                </span>
              </h4>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#a9d6f3]/20 text-[#a9d6f3] flex items-center justify-center text-[10px] font-bold">1</div>
                  Check your inbox (and spam folder)
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#a9d6f3]/20 text-[#a9d6f3] flex items-center justify-center text-[10px] font-bold">2</div>
                  Click the verification link
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#a9d6f3]/20 text-[#a9d6f3] flex items-center justify-center text-[10px] font-bold">3</div>
                  You'll be redirected to your dashboard
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              className={`w-full h-12 text-lg font-bold rounded-xl transition-all ${resendStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950 shadow-lg shadow-[#a9d6f3]/20'}`}
              onClick={handleResendEmail}
              disabled={resending || resendStatus === 'success'}
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resending...
                </>
              ) : resendStatus === 'success' ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Email Sent!
                </>
              ) : (
                'Resend magic link'
              )}
            </Button>
            <Button className="w-full h-12 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold" variant="default" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
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
