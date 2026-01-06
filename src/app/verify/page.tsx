"use client";
export const runtime = "edge";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-md transform scale-[1.1] origin-center transition-transform">
        <div className="mb-8 flex flex-col items-center">
          <Link className="flex items-center group" href="/">
            <div className="flex items-center font-bold text-2xl tracking-tight">
              <span className="text-zinc-950 mr-1.5">chatter</span>
              <div className="bg-[#a9d6f3] text-white px-2.5 py-1 rounded-lg text-base shadow-sm">
                box teams
              </div>
            </div>
          </Link>
        </div>

        <Card className="shadow-xl border-zinc-200 dark:border-zinc-800">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="bg-[#a9d6f3]/10 p-4 rounded-full">
                <Mail className="h-10 w-10 text-[#a9d6f3]" />
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
              <CardDescription>
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
          <CardContent className="space-y-4">
            <div className="bg-[#a9d6f3]/5 dark:bg-[#a9d6f3]/10 p-5 rounded-xl space-y-3 border border-[#a9d6f3]/20 dark:border-[#a9d6f3]/30">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#a9d6f3]" />
                Next steps
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex gap-2.5 items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#a9d6f3] text-white flex items-center justify-center text-[10px] font-bold shadow-sm">1</div>
                  Check your inbox and spam folder
                </li>
                <li className="flex gap-2.5 items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#a9d6f3] text-white flex items-center justify-center text-[10px] font-bold shadow-sm">2</div>
                  Click the magic link to verify
                </li>
                <li className="flex gap-2.5 items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#a9d6f3] text-white flex items-center justify-center text-[10px] font-bold shadow-sm">3</div>
                  You'll be signed in automatically
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button 
              className={`w-full h-11 font-semibold rounded-lg transition-all ${resendStatus === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-white shadow-lg shadow-[#a9d6f3]/20 dark:shadow-none'}`}
              onClick={handleResendEmail}
              disabled={resending || resendStatus === 'success'}
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : resendStatus === 'success' ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Email Sent!
                </>
              ) : (
                'Resend magic link'
              )}
            </Button>
            <Button className="w-full h-11 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100" variant="ghost" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-8 flex justify-center gap-6">
          <Link href="/terms" className="text-zinc-400 hover:text-zinc-600 text-xs font-medium transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-zinc-400 hover:text-zinc-600 text-xs font-medium transition-colors">
            Privacy Policy
          </Link>
        </div>
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
