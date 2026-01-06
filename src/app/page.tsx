"use client";
export const runtime = "edge";

import { Button } from "@/components/ui/button";
import { 
  ChevronRight,
  Layout,
  Lock,
  Users,
  Zap,
  Globe,
  MessageSquare,
  Shield,
  BarChart3,
  Check,
  Plus,
  Slack,
  Github,
  Trello,
  Figma,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]" 
           style={{ 
             backgroundImage: `linear-gradient(to right, #eaeaea 1px, transparent 1px), linear-gradient(to bottom, #eaeaea 1px, transparent 1px)`,
             backgroundSize: '40px 40px',
             maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
           }} />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(169,214,243,0.3),rgba(0,0,0,0)_50%)]" />
      
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b border-zinc-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <Link className="flex items-center gap-2 group" href="/">
          <svg width="28" height="28" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3] transition-transform group-hover:rotate-12">
            <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
          </svg>
          <span className="font-extrabold text-2xl tracking-tighter text-zinc-900">
            CHATTERBOX
          </span>
        </Link>
        <nav className="hidden lg:flex gap-10 items-center">
          <Link className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors" href="#integrations">
            Integrations
          </Link>
          <Link className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors" href="#stats">
            Stats
          </Link>
          <Link className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors" href="#pricing">
            Pricing
          </Link>
        </nav>
        <div className="flex gap-4 items-center">
          <Link className="text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors hidden sm:block" href="/login">
            Log In
          </Link>
          <Button variant="default" size="lg" className="rounded-full px-6 h-11 font-bold bg-zinc-950 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-200 transition-all active:scale-95" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative w-full pt-24 pb-20 md:pt-32 md:pb-32">
          <div className="container px-6 mx-auto">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-col items-center text-center max-w-5xl mx-auto"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-[#a9d6f3] bg-[#a9d6f3]/5 text-[#a9d6f3] font-bold text-xs uppercase tracking-widest">
                  v2.0 is now live
                </Badge>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-zinc-950 leading-[0.9] mb-8"
              >
                Communication for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-950 via-zinc-800 to-[#a9d6f3]">High-Performance</span> Teams
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="max-w-[700px] text-zinc-500 text-lg md:text-xl leading-relaxed mb-12 font-medium"
              >
                Chatterbox is the all-in-one workspace for modern teams. 
                Chat, collaborate, and scale your operations with enterprise-grade tools.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto"
              >
                <Button size="lg" className="h-14 px-10 text-base font-bold rounded-full bg-zinc-950 hover:bg-zinc-800 text-white transition-all active:scale-[0.98] w-full sm:w-auto shadow-xl shadow-zinc-200 group" asChild>
                  <Link href="/signup">
                    Start Building Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 text-base font-bold rounded-full border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 transition-all active:scale-[0.98] w-full sm:w-auto">
                  View Demo
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-20 w-full max-w-6xl">
                <div className="relative rounded-3xl border border-zinc-200 bg-white shadow-2xl p-2 md:p-4">
                  <div className="aspect-[16/9] bg-zinc-50 rounded-2xl border border-zinc-100 overflow-hidden flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-[#a9d6f3]/10" />
                    <div className="z-10 flex flex-col items-center gap-4">
                       <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                          <Zap className="h-8 w-8 text-[#a9d6f3]" />
                       </div>
                       <p className="font-bold text-zinc-400">Preview Interactive Workspace</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-24 border-y border-zinc-100 bg-zinc-50/50">
          <div className="container px-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: 'Active Users', value: '500k+' },
                { label: 'Messages Sent', value: '1.2B' },
                { label: 'Edge Regions', value: '32' },
                { label: 'Uptime SLA', value: '99.99%' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tight">{stat.value}</h4>
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 bg-white">
          <div className="container px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-zinc-950 mb-6 tracking-tight">Everything you need to scale</h2>
              <p className="text-lg text-zinc-500 font-medium leading-relaxed">
                Chatterbox provides a comprehensive suite of tools designed for the modern developer and high-growth teams.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                {
                  icon: <MessageSquare className="h-6 w-6 text-[#a9d6f3]" />,
                  title: "Real-time Chat",
                  desc: "Lightning fast messaging with sub-100ms latency across the globe."
                },
                {
                  icon: <Shield className="h-6 w-6 text-[#a9d6f3]" />,
                  title: "Secure by Design",
                  desc: "End-to-end encryption and SOC2 compliance built into every message."
                },
                {
                  icon: <Zap className="h-6 w-6 text-[#a9d6f3]" />,
                  title: "Powerful APIs",
                  desc: "Fully documented SDKs for every language and framework imaginable."
                },
                {
                  icon: <Globe className="h-6 w-6 text-[#a9d6f3]" />,
                  title: "Global Edge",
                  desc: "Messages are delivered through our proprietary edge network for max speed."
                },
                {
                  icon: <BarChart3 className="h-6 w-6 text-[#a9d6f3]" />,
                  title: "Deep Analytics",
                  desc: "Insights into team productivity and engagement patterns out of the box."
                },
                {
                  icon: <Users className="h-6 w-6 text-[#a9d6f3]" />,
                  title: "Team Spaces",
                  desc: "Organize your conversations into dedicated spaces for projects and teams."
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl border border-zinc-100 bg-white hover:border-[#a9d6f3]/20 hover:shadow-2xl hover:shadow-[#a9d6f3]/5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-[#a9d6f3]/10 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-zinc-950 tracking-tight">{feature.title}</h3>
                  <p className="text-zinc-500 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section id="integrations" className="py-32 bg-zinc-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#a9d6f3,transparent_70%)]" />
          <div className="container px-6 mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/2">
                <Badge className="mb-6 bg-[#a9d6f3] text-zinc-950 hover:bg-[#a9d6f3]/90 font-bold px-4 py-1">Integrations</Badge>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Works with your favorite tools</h2>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed mb-10">
                  Connect Chatterbox with the tools you already use. Sync messages, automate workflows, and keep your team in the loop without switching tabs.
                </p>
                <Button size="lg" className="h-14 px-10 text-base font-bold rounded-full bg-white text-zinc-950 hover:bg-zinc-100">
                  Browse App Store
                </Button>
              </div>
              <div className="lg:w-1/2 grid grid-cols-3 gap-6 w-full">
                {[
                  { icon: <Slack className="h-8 w-8" />, name: 'Slack' },
                  { icon: <Github className="h-8 w-8" />, name: 'GitHub' },
                  { icon: <Trello className="h-8 w-8" />, name: 'Trello' },
                  { icon: <Figma className="h-8 w-8" />, name: 'Figma' },
                  { icon: <MessageSquare className="h-8 w-8" />, name: 'Discord' },
                  { icon: <Plus className="h-8 w-8" />, name: 'More' },
                ].map((app, i) => (
                  <div key={i} className="aspect-square rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:bg-white/10 hover:border-[#a9d6f3]/50 transition-all cursor-pointer group">
                    <div className="text-zinc-400 group-hover:text-[#a9d6f3] transition-colors">{app.icon}</div>
                    <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase">{app.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 bg-white">
          <div className="container px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-zinc-950 mb-6 tracking-tight">Simple, transparent pricing</h2>
              <p className="text-lg text-zinc-500 font-medium leading-relaxed">
                Start for free and scale as you grow. No hidden fees or complex contracts.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "$0",
                  desc: "Perfect for small teams and side projects.",
                  features: ["Unlimited messages", "Up to 5 spaces", "Basic analytics", "Standard support"],
                  button: "Get Started Free",
                  highlight: false
                },
                {
                  name: "Pro",
                  price: "$19",
                  desc: "Advanced tools for growing organizations.",
                  features: ["Everything in Starter", "Unlimited spaces", "Advanced analytics", "Priority support", "Custom integrations"],
                  button: "Start Free Trial",
                  highlight: true
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  desc: "Maximum security and control for large teams.",
                  features: ["Everything in Pro", "Dedicated account manager", "Custom SLA", "Audit logs", "SSO/SAML support"],
                  button: "Contact Sales",
                  highlight: false
                }
              ].map((tier, i) => (
                <div key={i} className={`p-10 rounded-[40px] border ${tier.highlight ? 'border-[#a9d6f3] bg-zinc-50/50 shadow-2xl shadow-[#a9d6f3]/10 relative overflow-hidden' : 'border-zinc-100 bg-white'}`}>
                  {tier.highlight && <div className="absolute top-0 right-0 bg-[#a9d6f3] text-zinc-950 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-bl-2xl">Most Popular</div>}
                  <h3 className="text-2xl font-black text-zinc-950 mb-2 tracking-tight">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black text-zinc-950 tracking-tighter">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-zinc-500 font-bold">/mo</span>}
                  </div>
                  <p className="text-zinc-500 font-medium mb-8 leading-relaxed">{tier.desc}</p>
                  <div className="space-y-4 mb-10">
                    {tier.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center">
                          <Check className="h-3 w-3 text-zinc-950" />
                        </div>
                        <span className="text-sm font-semibold text-zinc-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button size="lg" className={`w-full h-14 rounded-full font-bold transition-all active:scale-[0.98] ${tier.highlight ? 'bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950 shadow-lg shadow-[#a9d6f3]/20' : 'bg-zinc-950 hover:bg-zinc-800 text-white'}`} asChild>
                    <Link href="/signup">{tier.button}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 bg-zinc-50 border-t border-zinc-100">
          <div className="container px-6 mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-950 mb-8">Ready to transform <br /> your team?</h2>
            <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto mb-12">
              Join 50,000+ teams who are already building the future on Chatterbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="h-16 px-12 text-lg font-bold rounded-full bg-zinc-950 hover:bg-zinc-800 text-white shadow-2xl shadow-zinc-200 transition-all active:scale-[0.98]" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button variant="outline" size="lg" className="h-16 px-12 text-lg font-bold rounded-full border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 transition-all active:scale-[0.98]">
                Talk to Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 lg:px-12 py-24 bg-white border-t border-zinc-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <Link className="flex items-center gap-2 mb-6 group" href="/">
                <svg width="28" height="28" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3] transition-transform group-hover:rotate-12">
                  <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
                </svg>
                <span className="font-extrabold text-2xl tracking-tighter text-zinc-900">
                  CHATTERBOX
                </span>
              </Link>
              <p className="text-zinc-500 font-medium leading-relaxed max-w-xs mb-8">
                The all-in-one workspace for modern teams. Build, collaborate, and scale.
              </p>
              <div className="flex gap-4">
                {['twitter', 'github', 'linkedin'].map((social) => (
                  <div key={social} className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-zinc-400 rounded-sm" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-black text-zinc-950 uppercase tracking-widest text-xs mb-6">Product</h5>
              <ul className="space-y-4 text-sm font-bold text-zinc-500">
                <li className="hover:text-zinc-950 cursor-pointer transition-colors">Features</li>
                <li className="hover:text-zinc-950 cursor-pointer transition-colors">Integrations</li>
                <li className="hover:text-zinc-950 cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-zinc-950 cursor-pointer transition-colors">Changelog</li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-zinc-950 uppercase tracking-widest text-xs mb-6">Company</h5>
              <ul className="space-y-4 text-sm font-bold text-zinc-500">
                <li className="hover:text-zinc-950 cursor-pointer transition-colors">About</li>
                <li className="hover:text-zinc-950 cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-zinc-950 cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-zinc-950 cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-zinc-950 uppercase tracking-widest text-xs mb-6">Legal</h5>
              <ul className="space-y-4 text-sm font-bold text-zinc-500">
                <li className="hover:text-zinc-950 cursor-pointer transition-colors"><Link href="/privacy-policy">Privacy</Link></li>
                <li className="hover:text-zinc-950 cursor-pointer transition-colors"><Link href="/terms-of-service">Terms</Link></li>
                <li className="hover:text-zinc-950 cursor-pointer transition-colors">Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-zinc-100 gap-6">
            <p className="text-sm font-bold text-zinc-400">© 2024 Chatterbox Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
