"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, PartyPopper, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const runtime = "edge";

export default function WelcomePage() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <div className="mb-12">
        <div className="flex items-center gap-2">
          <div className="bg-black p-2 rounded-xl">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-black">
            Chatterbox Teams
          </span>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <div className="relative">
          {/* Decorative background elements */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

          <Card className="relative overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
            
            <CardHeader className="text-center pt-12 pb-6">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-primary text-primary-foreground p-5 rounded-full">
                    <PartyPopper className="h-10 w-10" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-4xl font-extrabold tracking-tight">
                Welcome to the community!
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Your email has been successfully verified.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pb-10">
              <div className="bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  What's next?
                </h3>
                <div className="grid gap-4">
                  {[
                    "Complete your profile information",
                    "Join your first public channel",
                    "Invite your teammates to join",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-zinc-500 text-sm mb-6">
                  We're excited to have you here, {user?.user_metadata?.first_name || 'friend'}! 
                  Let's get started with your dashboard.
                </p>
                <Button size="lg" className="w-full h-14 text-lg font-bold group" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <p className="mt-8 text-zinc-400 text-sm">
        Need help? <Link href="/support" className="text-primary hover:underline">Contact support</Link>
      </p>
    </div>
  );
}
