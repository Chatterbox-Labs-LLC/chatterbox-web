"use client";

import { MessageSquare, Building2, MapPin, Briefcase, Globe2, Rocket } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

export default function CompanyPage() {
  const stats = [
    { label: "Founded", value: "2024", icon: Rocket },
    { label: "Headquarters", value: "San Francisco", icon: MapPin },
    { label: "Team Size", value: "25+", icon: Building2 },
    { label: "Global Presence", value: "12+ Countries", icon: Globe2 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <header className="px-4 lg:px-10 h-16 flex items-center border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="bg-black dark:bg-white p-1.5 rounded-lg mr-2 group-hover:scale-110 transition-transform">
            <MessageSquare className="h-5 w-5 text-white dark:text-black" />
          </div>
          <span className="font-bold text-xl tracking-tight">Chatterbox Teams</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-8 items-center">
          <Link className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors" href="/about">
            About
          </Link>
          <Button variant="default" size="sm" className="rounded-full px-6 font-semibold shadow-lg" asChild>
            <Link href="/signup">Sign Up Free</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Company Hero */}
        <section className="py-24 md:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-bold"
              >
                <Building2 className="h-4 w-4 text-blue-600" />
                The Company
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-extrabold tracking-tight sm:text-7xl leading-tight"
              >
                Building the infrastructure for <span className="text-blue-600">modern work.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-zinc-500 dark:text-zinc-400 text-xl md:text-2xl leading-relaxed max-w-3xl"
              >
                Chatterbox Labs LLC is a technology company dedicated to creating tools 
                that help people work together more effectively. Based in San Francisco, 
                we are a remote-first team of designers and engineers.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-12 border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
                    <stat.icon className="h-4 w-4" />
                    <span className="text-sm font-semibold uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 md:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Story</h2>
                <div className="space-y-4 text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                  <p>
                    Chatterbox started as a small internal tool built to solve a problem: existing 
                    communication platforms were too cluttered and often got in the way of actual work.
                  </p>
                  <p>
                    We wanted something that combined the speed of chat with the organization of 
                    a project management tool. Something that was beautiful, fast, and 
                    delightful to use every day.
                  </p>
                  <p>
                    What started as a side project quickly grew as other teams saw what we were 
                    building. Today, Chatterbox is used by high-performance teams around the 
                    world to ship faster and work better together.
                  </p>
                </div>
              </div>
              <div className="relative aspect-square rounded-3xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageSquare className="h-32 w-32 text-zinc-200 dark:text-zinc-700 animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Careers CTA */}
        <section className="py-24 bg-blue-600">
          <div className="container px-4 md:px-6 mx-auto text-center text-white space-y-8">
            <h2 className="text-4xl font-bold">Want to join us?</h2>
            <p className="text-blue-100 text-xl max-w-2xl mx-auto">
              We're always looking for talented individuals who are passionate about building 
              the future of collaboration.
            </p>
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold rounded-full shadow-xl hover:scale-105 transition-transform" asChild>
              <Link href="/careers">
                <Briefcase className="mr-2 h-5 w-5" />
                View Open Positions
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
