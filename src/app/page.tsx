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
        <section className="relative w-full py-24 md:py-32 lg:py-48 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
          </div>
          
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                NEW: Chatterbox Teams is now in public beta
              </div>
              
              <div className="space-y-4 max-w-4xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-b from-black to-zinc-600 dark:from-white dark:to-zinc-400">
                  Where great work happens, together.
                </h1>
                <p className="mx-auto max-w-[800px] text-zinc-500 dark:text-zinc-400 md:text-xl lg:text-2xl leading-relaxed">
                  Chatterbox Teams brings all your team communication into one place. Organize your work into Spaces, chat in real-time, and collaborate effortlessly.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full shadow-xl shadow-primary/20 group" asChild>
                  <Link href="/signup">
                    Start for Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold rounded-full border-2">
                  View Demo
                </Button>
              </div>
              
              <div className="pt-12 flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-bold text-xl">Trusted by teams everywhere</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Built for modern collaboration</h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
                Everything you need to communicate effectively with your team, all in one beautiful, fast interface.
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Spaces & Channels",
                  description: "Organize your conversations by project, topic, or team with dedicated workspaces.",
                  icon: Layout,
                  color: "bg-blue-500/10 text-blue-500"
                },
                {
                  title: "Lightning Fast",
                  description: "Real-time messaging with zero latency. See who's typing and get instant notifications.",
                  icon: ZapIcon,
                  color: "bg-amber-500/10 text-amber-500"
                },
                {
                  title: "Secure by Design",
                  description: "Enterprise-grade security and RLS ensure your data stays private and protected.",
                  icon: Shield,
                  color: "bg-emerald-500/10 text-emerald-500"
                },
                {
                  title: "Global Search",
                  description: "Find any message, file, or person instantly across all your spaces.",
                  icon: Globe,
                  color: "bg-purple-500/10 text-purple-500"
                },
                {
                  title: "Rich Media",
                  description: "Share files, images, and videos with built-in previews and easy organization.",
                  icon: MessageSquare,
                  color: "bg-rose-500/10 text-rose-500"
                },
                {
                  title: "Team Management",
                  description: "Powerful admin tools to manage members, roles, and space permissions.",
                  icon: Users,
                  color: "bg-indigo-500/10 text-indigo-500"
                }
              ].map((feature, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-zinc-900">
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400 pt-2 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-black dark:bg-white px-6 py-24 text-center shadow-2xl sm:px-16">
              <div className="relative z-10">
                <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white dark:text-black sm:text-4xl">
                  Ready to transform how your team works?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-400 dark:text-zinc-500">
                  Join thousands of teams using Chatterbox Teams to build better products, together.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 dark:bg-black dark:text-white dark:hover:bg-zinc-800" asChild>
                    <Link href="/signup">Get started for free</Link>
                  </Button>
                  <Link href="/login" className="text-sm font-semibold leading-6 text-white dark:text-black">
                    Already have an account? <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              {/* Background gradient for CTA */}
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-white dark:bg-zinc-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link className="flex items-center group" href="/">
                <div className="bg-black dark:bg-white p-1.5 rounded-lg mr-2">
                  <MessageSquare className="h-5 w-5 text-white dark:text-black" />
                </div>
                <span className="font-bold text-xl tracking-tight">Chatterbox Teams</span>
              </Link>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                The modern communication platform for teams that want to move fast and stay connected.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">© 2024 Chatterbox Teams Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-zinc-400 hover:text-black dark:hover:text-white"><Star className="h-4 w-4" /></Link>
              <Link href="#" className="text-zinc-400 hover:text-black dark:hover:text-white"><Globe className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
