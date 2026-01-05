"use client";

import Link from "next/link";
import { MessageSquare, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="w-full py-20 border-t bg-zinc-50 dark:bg-zinc-950 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link className="flex items-center group" href="/">
              <div className="bg-black dark:bg-white p-1.5 rounded-lg mr-2 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-5 w-5 text-white dark:text-black" />
              </div>
              <span className="font-bold text-xl tracking-tight">Chatterbox Teams</span>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xs text-base leading-relaxed">
              The modern communication platform for high-performance teams. Work together, beautifully.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all">
                <Globe className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all">
                <Users className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/#features" className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors text-sm font-medium">Features</Link></li>
              <li><Link href="/pricing" className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors text-sm font-medium">Pricing</Link></li>
              <li><Link href="/download" className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors text-sm font-medium">Download</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors text-sm font-medium">About</Link></li>
              <li><Link href="/company" className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors text-sm font-medium">Our Story</Link></li>
              <li><Link href="/newsroom" className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors text-sm font-medium">Newsroom</Link></li>
              <li><Link href="/masthead" className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors text-sm font-medium">Masthead</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors text-sm font-medium">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors text-sm font-medium">Terms of Service</Link></li>
              <li><Link href="/security" className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors text-sm font-medium">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            © {new Date().getFullYear()} Chatterbox Labs LLC. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link className="text-sm font-semibold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/support">Support</Link>
            <Link className="text-sm font-semibold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/status">Status</Link>
            <Link className="text-sm font-semibold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
