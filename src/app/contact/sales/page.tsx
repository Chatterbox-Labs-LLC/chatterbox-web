"use client";

import { Mail, Phone, Send, Sparkles, ChevronDown, CheckCircle2, Building2, Users2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/footer";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SalesContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  const salesFaqs = [
    {
      question: "Do you offer enterprise-wide licensing?",
      answer: "Yes, we provide flexible enterprise licensing models tailored to your organization's size and specific needs, including unlimited spaces and advanced security features."
    },
    {
      question: "Can we get a custom demo for our specific workflow?",
      answer: "Absolutely. Our solutions engineers can build a tailored demo that mirrors your team's actual workflow and challenges."
    },
    {
      question: "What security certifications do you hold?",
      answer: "Chatterbox is SOC2 Type II compliant and offers enterprise-grade encryption, SSO integration, and data residency options for global teams."
    },
    {
      question: "Do you provide onboarding and training support?",
      answer: "Yes, our Enterprise plan includes a dedicated success manager and customized training sessions to ensure smooth adoption across your entire organization."
    }
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
        <section className="relative py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/30 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-[#a9d6f3]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[#a9d6f3]/5 rounded-full blur-[120px]" />
          </div>
          
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a9d6f3]/10 border border-[#a9d6f3]/20 text-[#a9d6f3] text-sm font-bold mb-4"
              >
                <Sparkles className="h-4 w-4 fill-current" />
                Enterprise Solutions
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500"
              >
                Scale your team <br /> <span className="text-[#a9d6f3]">without limits.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-zinc-500 dark:text-zinc-400 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-medium"
              >
                Talk to our sales experts about custom plans, enterprise security, and priority support for your organization.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Sales Content Grid */}
        <section className="py-24 md:py-32 border-b border-zinc-100 dark:border-zinc-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
              {/* Value Props */}
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tight">Why Chatterbox for Enterprise?</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                    We help the world's most innovative teams collaborate securely at any scale.
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    {
                      icon: ShieldCheck,
                      title: "Enterprise Security",
                      desc: "SSO/SAML, advanced audit logs, and SOC2 Type II compliance.",
                      color: "bg-[#a9d6f3]/10 text-[#a9d6f3]"
                    },
                    {
                      icon: Users2,
                      title: "Dedicated Success",
                      desc: "Priority 24/7 support and a dedicated manager for your team.",
                      color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                    },
                    {
                      icon: Building2,
                      title: "Custom Workflows",
                      desc: "API access and custom integrations tailored to your stack.",
                      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                    }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-5 p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-1">{item.title}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-snug">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sales Form */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30"
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-6">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4">Request Received!</h2>
                      <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-sm">
                        A sales representative will reach out to you within one business day.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-8 rounded-full"
                        onClick={() => setSubmitted(false)}
                      >
                        New Inquiry
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl"
                    >
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" placeholder="Jane" required className="bg-zinc-50 dark:bg-zinc-950 h-12 rounded-xl border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-[#a9d6f3]" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" placeholder="Doe" required className="bg-zinc-50 dark:bg-zinc-950 h-12 rounded-xl border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-[#a9d6f3]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="work-email">Work Email</Label>
                          <Input id="work-email" type="email" placeholder="jane@company.com" required className="bg-zinc-50 dark:bg-zinc-950 h-12 rounded-xl border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-[#a9d6f3]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company Name</Label>
                          <Input id="company" placeholder="Acme Inc." required className="bg-zinc-50 dark:bg-zinc-950 h-12 rounded-xl border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-[#a9d6f3]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="size">Team Size</Label>
                          <Select required>
                            <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950 h-12 rounded-xl border-zinc-200 dark:border-zinc-800">
                              <SelectValue placeholder="Select team size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10-50">10-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="500+">500+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">How can we help?</Label>
                          <Textarea id="message" placeholder="Tell us about your team's goals..." className="min-h-[120px] bg-zinc-50 dark:bg-zinc-950 rounded-xl border-zinc-200 dark:border-zinc-800 resize-none focus:ring-2 focus:ring-[#a9d6f3]" required />
                        </div>
                        <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl shadow-lg bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <div className="h-4 w-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Send className="h-5 w-5" />
                              Contact Sales
                            </span>
                          )}
                        </Button>
                        <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
                          By submitting this form, you agree to our <Link href="/terms" className="underline hover:text-[#a9d6f3]">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-[#a9d6f3]">Privacy Policy</Link>.
                        </p>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Sales FAQ Section */}
        <section className="py-24 md:py-32 bg-white dark:bg-zinc-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Enterprise FAQ</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                  Everything you need to know about scaling with Chatterbox.
                </p>
              </div>

              <div className="space-y-4">
                {salesFaqs.map((faq, i) => (
                  <div 
                    key={i} 
                    className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50/30 dark:bg-zinc-900/10"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <span className="font-bold text-lg">{faq.question}</span>
                      <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="p-6 pt-0 text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
