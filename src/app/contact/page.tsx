"use client";

import { MessageSquare, Mail, MapPin, Phone, Send, Sparkles, ChevronDown, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/footer";
import { useState } from "react";

export default function ContactPage() {
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

  const faqs = [
    {
      question: "What kind of support do you offer?",
      answer: "We offer 24/7 email support for all plans, and dedicated account managers for our Enterprise customers."
    },
    {
      question: "Can I schedule a live demo for my team?",
      answer: "Absolutely! Just select 'Request a Demo' in the subject line, and our sales team will reach out to schedule a call."
    },
    {
      question: "Do you have a bug bounty program?",
      answer: "Yes, we take security seriously. Please contact our security team at security@chatterboxteams.com for more information."
    },
    {
      question: "Is there a discount for non-profits?",
      answer: "We love supporting non-profits! We offer a 50% discount on all our paid plans for verified non-profit organizations."
    }
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
            <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />
          </div>
          
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4"
              >
                <Sparkles className="h-4 w-4" />
                Contact Us
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500"
              >
                Get in touch with <br /> <span className="text-blue-600">our team.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-zinc-500 dark:text-zinc-400 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-medium"
              >
                Have questions about Chatterbox? We're here to help you build the perfect workspace for your team.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Contact Grid */}
        <section className="py-24 md:py-32 border-b border-zinc-100 dark:border-zinc-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tight">Contact Information</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                    Fill out the form and our team will get back to you within 24 hours. We're here to help you succeed.
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    {
                      icon: Mail,
                      title: "Email Us",
                      lines: ["support@chatterboxteams.com", "sales@chatterboxteams.com"],
                      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                    },
                    {
                      icon: Phone,
                      title: "Call Us",
                      lines: ["+1 (555) 000-0000", "Mon-Fri from 9am to 6pm PST"],
                      color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                    },
                    {
                      icon: MapPin,
                      title: "Visit Us",
                      lines: ["123 Innovation Drive", "San Francisco, CA 94103"],
                      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                    }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
                    >
                      <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        {item.lines.map((line, li) => (
                          <p key={li} className="text-zinc-500 dark:text-zinc-400">{line}</p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30"
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-6">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
                      <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-sm">
                        Thank you for reaching out. Our team will get back to you shortly.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-8 rounded-full"
                        onClick={() => setSubmitted(false)}
                      >
                        Send another message
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-zinc-50 dark:bg-zinc-900/50 p-8 md:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl"
                    >
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" placeholder="Jane" required className="bg-white dark:bg-zinc-950 h-12 rounded-xl border-zinc-200 dark:border-zinc-800" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" placeholder="Doe" required className="bg-white dark:bg-zinc-950 h-12 rounded-xl border-zinc-200 dark:border-zinc-800" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" placeholder="jane@company.com" required className="bg-white dark:bg-zinc-950 h-12 rounded-xl border-zinc-200 dark:border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input id="subject" placeholder="How can we help?" required className="bg-white dark:bg-zinc-950 h-12 rounded-xl border-zinc-200 dark:border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea id="message" placeholder="Tell us more about your team's needs..." className="min-h-[150px] bg-white dark:bg-zinc-950 rounded-xl border-zinc-200 dark:border-zinc-800 resize-none" required />
                        </div>
                        <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Send className="h-5 w-5" />
                              Send Message
                            </span>
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 md:py-32 bg-white dark:bg-zinc-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                  Quick answers to common questions about Chatterbox.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div 
                    key={i} 
                    className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden"
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
                          <div className="p-6 pt-0 text-zinc-500 dark:text-zinc-400 leading-relaxed">
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

