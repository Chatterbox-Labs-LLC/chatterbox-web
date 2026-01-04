'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, LogOut, UserPlus, User, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface UserProfileSectionProps {
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export default function UserProfileSection({ user }: UserProfileSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const initial = user.full_name.charAt(0).toUpperCase();
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div 
      className="relative p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm group/profile"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, x: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.95, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-[calc(100%+8px)] left-4 w-[240px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Popover Header */}
            <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-900 shadow-sm">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {user.full_name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-tight">Online</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popover Content */}
            <div className="p-1.5 space-y-0.5">
              <button 
                onClick={() => router.push('/profile')}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-lg transition-all group/item"
              >
                <User className="h-3.5 w-3.5 text-zinc-500 group-hover/item:text-blue-500" />
                <span className="font-medium text-zinc-900 dark:text-zinc-100">My Profile</span>
              </button>

              <button 
                onClick={() => router.push('/settings')}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-lg transition-all group/item"
              >
                <Settings className="h-3.5 w-3.5 text-zinc-500 group-hover/item:text-blue-500" />
                <span className="font-medium text-zinc-900 dark:text-zinc-100">Settings</span>
              </button>

              <button 
                onClick={() => router.push('/add-account')}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-lg transition-all group/item"
              >
                <UserPlus className="h-3.5 w-3.5 text-zinc-500 group-hover/item:text-blue-500" />
                <span className="font-medium text-zinc-900 dark:text-zinc-100">Add Account</span>
              </button>

              <button 
                onClick={() => router.push('/forgot-password')}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-lg transition-all group/item"
              >
                <Shield className="h-3.5 w-3.5 text-zinc-500 group-hover/item:text-blue-500" />
                <span className="font-medium text-zinc-900 dark:text-zinc-100">Forgot Password</span>
              </button>

              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1 mx-1" />

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all group/item"
              >
                <LogOut className="h-3.5 w-3.5 text-red-500" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 cursor-pointer group-hover/profile:opacity-80 transition-opacity">
        <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800 shadow-sm ring-0 group-hover/profile:ring-2 ring-blue-500/20 transition-all">
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover/profile:text-blue-600 dark:group-hover/profile:text-blue-400 transition-colors">
            {user.full_name}
          </p>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Online</p>
          </div>
        </div>
        <div className="text-zinc-400 group-hover/profile:text-blue-500 transition-colors h-8 w-8 flex items-center justify-center">
          <Settings className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
