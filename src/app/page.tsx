export const runtime = 'edge';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Shield, Globe, ArrowRight, Star, Users, Layout, Zap as ZapIcon } from "lucide-react";
import Link from "next/link";


export default function Home() {
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
          <Link className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors" href="/login">
            Login
          </Link>
          <Button variant="default" size="sm" className="rounded-full px-6 font-semibold shadow-lg" asChild>
            <Link href="/signup">Sign Up Free</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden">
          {/* Enhanced background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
          </div>
          
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4 shadow-sm">
                NEW: Chatterbox Teams Beta is Live
              </div>
              
              <div className="space-y-6 max-w-5xl">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl/none bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
                  Work together, <br className="hidden md:block" />
                  <span className="text-blue-600 dark:text-blue-500">beautifully.</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-zinc-500 dark:text-zinc-400 text-lg md:text-xl lg:text-2xl leading-relaxed font-medium">
                  The modern communication platform for high-performance teams. 
                  Organize your work into Spaces, chat in real-time, and ship faster.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="h-16 px-10 text-xl font-bold rounded-full shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all group bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href="/signup">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1.5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 text-xl font-bold rounded-full border-2 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                  Live Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-32 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-100 dark:border-zinc-800/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Everything your team needs</h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-xl font-medium">
                We've built a platform that puts your team's productivity first.
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Workspaces (Spaces)",
                  description: "Keep projects, teams, and topics separated with dedicated spaces. It's collaboration organized.",
                  icon: Layout,
                  color: "bg-blue-500/10 text-blue-500"
                },
                {
                  title: "Lightning Performance",
                  description: "Real-time messaging with zero latency. Built on the modern edge for global teams.",
                  icon: ZapIcon,
                  color: "bg-amber-500/10 text-amber-500"
                },
                {
                  title: "Secure by Design",
                  description: "Enterprise-grade security and permissions to keep your team's data safe and private.",
                  icon: Shield,
                  color: "bg-emerald-500/10 text-emerald-500"
                },
                {
                  title: "Global Search",
                  description: "Find anything instantly. Messages, files, and spaces are all just one search away.",
                  icon: Globe,
                  color: "bg-purple-500/10 text-purple-500"
                },
                {
                  title: "Modern UI/UX",
                  description: "A beautiful, dark-mode first interface that your team will actually enjoy using every day.",
                  icon: Star,
                  color: "bg-pink-500/10 text-pink-500"
                },
                {
                  title: "Team Directory",
                  description: "See who's online, their roles, and manage permissions with our comprehensive directory.",
                  icon: Users,
                  color: "bg-indigo-500/10 text-indigo-500"
                }
              ].map((feature, i) => (
                <Card key={i} className="h-full border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4 shadow-sm`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full -z-10 bg-blue-600" />
          <div className="container px-4 md:px-6 mx-auto text-center text-white space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to transform your team?</h2>
            <p className="text-blue-100 text-xl md:text-2xl max-w-3xl mx-auto font-medium">
              Join hundreds of high-performance teams building the future on Chatterbox.
            </p>
            <div className="pt-6">
              <Button size="lg" variant="secondary" className="h-16 px-12 text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-transform" asChild>
                <Link href="/signup">Start Free Trial Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 border-t bg-zinc-50 dark:bg-zinc-950 px-4 md:px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-black dark:bg-white p-1.5 rounded-lg">
              <MessageSquare className="h-5 w-5 text-white dark:text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight">Chatterbox Teams</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            © {new Date().getFullYear()} Chatterbox Labs LLC. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link className="text-sm font-semibold text-zinc-500 hover:text-blue-600 transition-colors" href="/terms">Terms</Link>
            <Link className="text-sm font-semibold text-zinc-500 hover:text-blue-600 transition-colors" href="/privacy">Privacy</Link>
            <Link className="text-sm font-semibold text-zinc-500 hover:text-blue-600 transition-colors" href="/support">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
