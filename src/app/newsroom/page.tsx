"use client";

import { Calendar, ArrowRight, Newspaper, Tag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/footer";

export default function NewsroomPage() {
  const news = [
    {
      title: "Chatterbox Teams Beta is now live",
      description: "We're excited to announce that Chatterbox Teams is officially in open beta. Join thousands of teams already building the future.",
      date: "January 5, 2026",
      category: "Product",
      image: "bg-[#a9d6f3]/20",
    },
    {
      title: "Announcing our Series A funding",
      description: "We've raised $15M in Series A funding to accelerate our mission of building the best communication platform for teams.",
      date: "December 15, 2025",
      category: "Company",
      image: "bg-emerald-500/10",
    },
    {
      title: "Introducing Spaces: A new way to organize work",
      description: "Spaces allows teams to keep projects, topics, and departments separated while maintaining a unified communication flow.",
      date: "November 20, 2025",
      category: "Feature",
      image: "bg-purple-500/10",
    },
    {
      title: "Chatterbox for Mobile: Now available on iOS and Android",
      description: "Stay connected with your team wherever you go. Our mobile app is now available for download on the App Store and Google Play.",
      date: "October 10, 2025",
      category: "Mobile",
      image: "bg-amber-500/10",
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
          <Link className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors" href="/company">
            Company
          </Link>
          <Button variant="default" size="sm" className="rounded-full px-6 font-semibold shadow-lg" asChild>
            <Link href="/signup">Sign Up Free</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Newsroom Hero */}
        <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a9d6f3]/10 text-[#a9d6f3] text-sm font-bold"
              >
                <Newspaper className="h-4 w-4" />
                Newsroom
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-extrabold tracking-tight sm:text-7xl"
              >
                The latest from <span className="text-[#a9d6f3]">Chatterbox.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-zinc-500 dark:text-zinc-400 text-xl md:text-2xl max-w-2xl leading-relaxed"
              >
                Stay up to date with our latest product releases, company news, and team updates.
              </motion.p>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-24 md:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {news.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="h-full overflow-hidden border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-all group cursor-pointer">
                    <div className={`h-48 w-full ${item.image} flex items-center justify-center`}>
                      <Newspaper className="h-12 w-12 text-zinc-300 dark:text-zinc-700 group-hover:scale-110 transition-transform" />
                    </div>
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#a9d6f3] bg-[#a9d6f3]/10 px-3 py-1 rounded-full">
                          <Tag className="h-3.5 w-3.5" />
                          {item.category}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {item.date}
                        </div>
                      </div>
                      <CardTitle className="text-2xl group-hover:text-[#a9d6f3] transition-colors leading-tight">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="ghost" className="p-0 text-[#a9d6f3] font-bold hover:bg-transparent hover:text-[#a9d6f3]/80 group/btn">
                        Read more
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg font-bold">
                View Archive
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 bg-zinc-950 text-white">
          <div className="container px-4 md:px-6 mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold md:text-5xl tracking-tight">Don't miss an update</h2>
            <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
              Get our latest news and product updates delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 h-14 px-6 rounded-full bg-zinc-900 border border-zinc-800 focus:outline-none focus:border-[#a9d6f3] transition-colors"
              />
              <Button className="h-14 px-10 rounded-full bg-white text-black hover:bg-zinc-200 font-bold">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
