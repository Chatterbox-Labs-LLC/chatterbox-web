"use client";
export const runtime = "edge";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyPopper, ArrowRight, Sparkles, CheckCircle2, Rocket, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#a9d6f3]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#a9d6f3]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-4xl"
      >
        <div className="flex flex-col md:flex-row items-stretch gap-8">
          {/* Left Side - Welcome Message */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3]">
                <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
              </svg>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Chatterbox Teams
              </span>
            </div>
            
            <div className="space-y-2">
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]"
              >
                Welcome to the <span className="text-[#a9d6f3]">community.</span>
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-md"
              >
                We're thrilled to have you here, {user?.user_metadata?.first_name || 'friend'}. Your journey to seamless team collaboration starts now.
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="pt-4">
              <Button size="lg" className="h-14 px-8 text-lg font-bold group rounded-full shadow-lg shadow-[#a9d6f3]/20 bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950" asChild>
                <Link href="/dashboard">
                  Explore Your Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Side - Steps */}
          <div className="flex-1">
            <div className="h-full relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#a9d6f3]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    <Rocket className="h-5 w-5 text-[#a9d6f3]" />
                    Quick Start Guide
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Three simple steps to get the most out of Chatterbox
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      title: "Complete your profile",
                      desc: "Add a photo and bio so teammates know it's you.",
                      icon: Sparkles,
                      color: "text-amber-500",
                      bg: "bg-amber-500/10"
                    },
                    {
                      title: "Join a workspace",
                      desc: "Browse public spaces or create your own team area.",
                      icon: Sparkles,
                      color: "text-purple-500",
                      bg: "bg-purple-500/10"
                    },
                    {
                      title: "Enable notifications",
                      desc: "Stay in the loop with real-time alerts for your team.",
                      icon: ShieldCheck,
                      color: "text-green-500",
                      bg: "bg-green-500/10"
                    }
                  ].map((step, i) => (
                    <motion.div 
                      key={i} 
                      variants={itemVariants}
                      className="flex gap-4 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center`}>
                        <step.icon className={`h-6 w-6 ${step.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h4>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-700" />
                      ))}
                    </div>
                    Join 1,000+ others already using Chatterbox
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-zinc-400 text-sm"
      >
        Need a hand? <Link href="/support" className="text-[#a9d6f3] hover:underline font-medium">Chat with our support team</Link>
      </motion.p>
    </div>
  );
}
