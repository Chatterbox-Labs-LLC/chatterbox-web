"use client";

import { Twitter, Linkedin, Github, Mail, Users2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

export default function MastheadPage() {
  const leadership = [
    {
      name: "George Holmes",
      role: "Founder & CEO",
      image: "GH",
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
    {
      name: "Connor Dugan",
      role: "Co-Founder & President",
      image: "CD",
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
    {
      name: "Micheal Chessare",
      role: "CTO & Board Member",
      image: "MC",
      twitter: "#",
      linkedin: "#",
      github: "#",
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
          <Link className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors" href="/newsroom">
            Newsroom
          </Link>
          <Button variant="default" size="sm" className="rounded-full px-6 font-semibold shadow-lg" asChild>
            <Link href="/signup">Sign Up Free</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Masthead Hero */}
        <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a9d6f3]/10 text-[#a9d6f3] text-sm font-bold"
              >
                <Users2 className="h-4 w-4" />
                Our Masthead
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-extrabold tracking-tight sm:text-7xl"
              >
                The people behind the <span className="text-[#a9d6f3]">vision.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-zinc-500 dark:text-zinc-400 text-xl md:text-2xl max-w-3xl leading-relaxed"
              >
                Meet the leadership team dedicated to building the world's most 
                beautiful and effective communication platform.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Leadership Grid */}
        <section className="py-24 md:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
              {leadership.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex flex-col md:flex-row gap-8 items-start"
                >
                  <div className="w-32 h-32 rounded-3xl bg-[#a9d6f3] flex items-center justify-center text-zinc-950 text-3xl font-bold flex-shrink-0 shadow-2xl shadow-[#a9d6f3]/20">
                    {member.image}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold">{member.name}</h3>
                      <p className="text-[#a9d6f3] font-semibold uppercase tracking-wider text-sm">{member.role}</p>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <Link href={member.twitter} className="text-zinc-400 hover:text-[#a9d6f3] transition-colors">
                        <Twitter className="h-5 w-5" />
                      </Link>
                      <Link href={member.linkedin} className="text-zinc-400 hover:text-[#a9d6f3] transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </Link>
                      <Link href={member.github} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        <Github className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-100 dark:border-zinc-800">
          <div className="container px-4 md:px-6 mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Have a question for our team?</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-xl max-w-2xl mx-auto">
              We're always happy to hear from our users, partners, and the community.
            </p>
            <div className="pt-4">
              <Button size="lg" className="h-14 px-10 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold" asChild>
                <Link href="mailto:contact@chatterbox.teams">
                  <Mail className="mr-2 h-5 w-5" />
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
