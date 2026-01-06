"use client";

import { Users, Sparkles, Heart, Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  const values = [
    {
      title: "Team First",
      description: "We believe that great things happen when teams are empowered to communicate clearly and effectively.",
      icon: Users,
      color: "text-[#a9d6f3]",
      bg: "bg-[#a9d6f3]/10",
    },
    {
      title: "Simple & Fast",
      description: "Speed is a feature. We build tools that stay out of your way so you can focus on doing your best work.",
      icon: Sparkles,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Global Reach",
      description: "Collaboration knows no borders. Our platform is built for teams spread across the globe.",
      icon: Globe,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Crafted with Care",
      description: "We pay attention to the details. From every pixel to every line of code, quality is our priority.",
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <header className="px-4 lg:px-10 h-16 flex items-center border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center group" href="/">
          <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3] transition-transform group-hover:scale-110 mr-2">
            <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
          </svg>
          <span className="font-bold text-xl tracking-tight">Chatterbox Teams</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-8 items-center">
          <Link className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors" href="/pricing">
            Pricing
          </Link>
          <Button variant="default" size="sm" className="rounded-full px-6 font-semibold shadow-lg" asChild>
            <Link href="/signup">Sign Up Free</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a9d6f3]/10 border border-[#a9d6f3]/20 text-[#a9d6f3] text-sm font-semibold mb-4"
              >
                <Sparkles className="h-4 w-4" />
                Our Mission
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
              >
                We're building the future of <span className="text-[#a9d6f3]">teamwork.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-zinc-500 dark:text-zinc-400 text-xl md:text-2xl leading-relaxed"
              >
                Chatterbox Teams was founded with a simple goal: to make team communication 
                more organized, more beautiful, and more productive.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-24 md:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What drives us</h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
                Our core values guide everything we do, from the features we build to the way we support our users.
              </p>
            </div>

            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="space-y-4"
                >
                  <div className={`w-12 h-12 rounded-2xl ${value.bg} flex items-center justify-center ${value.color}`}>
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section Placeholder */}
        <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-16">The team behind the magic</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
                    <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-900 rounded mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
