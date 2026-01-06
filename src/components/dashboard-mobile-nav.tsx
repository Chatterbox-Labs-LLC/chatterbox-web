"use client";

import { useState } from "react";
import { Menu, X, LayoutDashboard, Settings, User, LogOut, Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function DashboardMobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden text-zinc-500 mr-2"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-[70] w-64 flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3]">
              <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
            </svg>
            <span className="font-bold text-lg tracking-tight">Chatterbox Teams</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3" asChild onClick={() => setIsOpen(false)}>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-600 dark:text-zinc-400" asChild onClick={() => setIsOpen(false)}>
            <Link href="/spaces">
              <Plus className="h-4 w-4" />
              My Spaces
            </Link>
          </Button>
          
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Settings
            </div>
            <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-600 dark:text-zinc-400" asChild onClick={() => setIsOpen(false)}>
              <Link href="/dashboard/profile">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-600 dark:text-zinc-400" asChild onClick={() => setIsOpen(false)}>
              <Link href="/dashboard/billing">
                <CreditCard className="h-4 w-4" />
                Billing
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-600 dark:text-zinc-400" asChild onClick={() => setIsOpen(false)}>
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                App Settings
              </Link>
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t">
          <form action="/api/auth/signout" method="post">
            <Button variant="ghost" className="w-full justify-start gap-3 text-red-600" type="submit">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
