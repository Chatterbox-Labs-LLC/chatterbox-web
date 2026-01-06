"use client";
export const runtime = "edge";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for small teams and side projects.",
      features: [
        "Up to 5 team members",
        "Unlimited messages",
        "10GB storage",
        "Standard support",
        "Basic integrations",
      ],
      buttonText: "Start for Free",
      buttonVariant: "outline" as const,
      highlight: false,
    },
    {
      name: "Pro",
      price: "$12",
      description: "For growing teams that need more power.",
      features: [
        "Unlimited team members",
        "Unlimited messages",
        "100GB storage",
        "Priority support",
        "Advanced integrations",
        "Custom emojis",
        "Message search history",
      ],
      buttonText: "Get Started",
      buttonVariant: "default" as const,
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Scale with confidence and security.",
      features: [
        "Unlimited everything",
        "Dedicated account manager",
        "SSO & Advanced Security",
        "Compliance exports",
        "Custom branding",
        "99.9% Uptime SLA",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      highlight: false,
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
          <Link className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors" href="/login">
            Login
          </Link>
          <Button variant="default" size="sm" className="rounded-full px-6 font-semibold shadow-lg" asChild>
            <Link href="/signup">Sign Up Free</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 py-24 md:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center space-y-4 mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
            >
              Simple, transparent <span className="text-[#a9d6f3]">pricing.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-xl"
            >
              Choose the plan that's right for your team and start collaborating today.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <Card className={`h-full flex flex-col border-2 ${plan.highlight ? 'border-[#a9d6f3] shadow-2xl shadow-[#a9d6f3]/10' : 'border-zinc-200 dark:border-zinc-800'}`}>
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1 pt-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && <span className="text-zinc-500">/month</span>}
                    </div>
                    <CardDescription className="pt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-4 pt-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <div className="mt-1 bg-[#a9d6f3]/10 p-0.5 rounded-full">
                            <Check className="h-3.5 w-3.5 text-[#a9d6f3]" />
                          </div>
                          <span className="text-zinc-600 dark:text-zinc-400 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full h-12 text-lg font-bold rounded-xl ${plan.highlight ? 'bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950' : ''}`} 
                      variant={plan.buttonVariant}
                      asChild
                    >
                      <Link href="/signup">{plan.buttonText}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 max-w-3xl mx-auto text-center p-12 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-2xl font-bold mb-4">Need something else?</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-lg">
              We offer special discounts for non-profits and educational institutions.
            </p>
            <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
