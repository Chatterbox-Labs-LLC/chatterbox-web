"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Shield, 
  Globe, 
  ArrowRight, 
  Star, 
  Users, 
  Layout, 
  Zap as ZapIcon,
  CheckCircle2,
  Lock,
  Search,
  Sparkles,
  Zap,
  Github
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 overflow-x-hidden">
      <header className="px-4 lg:px-10 h-16 flex items-center border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="bg-blue-600 p-1.5 rounded-lg mr-2 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
            Chatterbox
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden md:block" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="/login">
            Login
          </Link>
          <Button variant="default" size="sm" className="rounded-full px-5 font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[20%] right-[15%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-col items-center text-center space-y-12"
            >
              <motion.div variants={itemVariants}>
                <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-100 dark:border-blue-800 rounded-full shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 mr-2 inline" />
                  Now in public beta
                </Badge>
              </motion.div>
              
              <div className="space-y-6 max-w-4xl">
                <motion.h1 
                  variants={itemVariants}
                  className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500"
                >
                  Collaboration for the <br className="hidden md:block" />
                  <span className="text-blue-600">modern era.</span>
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="mx-auto max-w-[800px] text-zinc-500 dark:text-zinc-400 text-lg md:text-xl lg:text-2xl leading-relaxed font-medium"
                >
                  Organize your team, share ideas, and ship products faster with Chatterbox. 
                  The all-in-one workspace designed for high-performance teams.
                </motion.p>
              </div>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4"
              >
                <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/25 transition-all group" asChild>
                  <Link href="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                  View Demo
                </Button>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="pt-12 flex flex-col items-center space-y-4"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Avatar key={i} className="border-4 border-white dark:border-zinc-950 w-12 h-12">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Join <span className="text-zinc-900 dark:text-white font-bold">500+</span> teams already building on Chatterbox
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>


        {/* How it Works Section */}
        <section className="py-24 md:py-32 bg-white dark:bg-zinc-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-20">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Simple, yet powerful</h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-lg md:text-xl">
                Get your team up and running in minutes, not days.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {[
                {
                  title: "1. Create your Space",
                  description: "Set up dedicated workspaces for projects, departments, or interests in seconds.",
                  icon: Layout
                },
                {
                  title: "2. Invite your Team",
                  description: "Bring your teammates in with a simple link or via your existing SSO provider.",
                  icon: Users
                },
                {
                  title: "3. Start Collaborating",
                  description: "Chat in real-time, share files, and keep everyone aligned on your goals.",
                  icon: CheckCircle2
                }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-2">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-20">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Built for high-performance teams</h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-lg md:text-xl font-medium">
                Every feature is designed to help your team focus on what matters most: shipping great products.
              </p>
            </div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  title: "Real-time Spaces",
                  description: "Organized channels for every project. Keep conversations focused and searchable.",
                  icon: MessageSquare,
                  color: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                },
                {
                  title: "Secure by Default",
                  description: "Enterprise-grade encryption and granular permissions to keep your data safe.",
                  icon: Lock,
                  color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                },
                {
                  title: "Instant Search",
                  description: "Find any message, file, or person across your entire organization in milliseconds.",
                  icon: Search,
                  color: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                },
                {
                  title: "Global Edge Network",
                  description: "Lightning-fast performance no matter where your team is located in the world.",
                  icon: Globe,
                  color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                },
                {
                  title: "Smart Notifications",
                  description: "Stay in the loop without the noise. Customize exactly how and when you're notified.",
                  icon: Zap,
                  color: "bg-pink-500/10 text-pink-600 dark:text-pink-400"
                },
                {
                  title: "Developer First",
                  description: "Robust API, webhooks, and deep integrations with the tools your team already uses.",
                  icon: Github,
                  color: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                }
              ].map((feature, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="h-full border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600 -z-10" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-black/10 rounded-full blur-[120px]" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="container px-4 md:px-6 mx-auto text-center text-white space-y-10"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Ready to ship faster?</h2>
            <p className="text-blue-100 text-lg md:text-2xl max-w-3xl mx-auto font-medium">
              Join thousands of teams already using Chatterbox to build the future. 
              Start your 14-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
              <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-full bg-white text-blue-600 hover:bg-zinc-100 shadow-2xl transition-all hover:scale-105" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all">
                Talk to Sales
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
