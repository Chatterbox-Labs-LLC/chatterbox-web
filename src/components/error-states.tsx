"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  Home, 
  MonitorOff, 
  Smartphone, 
  Search, 
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ErrorStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  showHomeButton?: boolean;
  variant?: "default" | "warning" | "error";
}

export function ErrorState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  onAction,
  showHomeButton = true,
  variant = "default"
}: ErrorStateProps) {
  const iconColors = {
    default: "text-[#a9d6f3] bg-[#a9d6f3]/10 dark:bg-[#a9d6f3]/5",
    warning: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
    error: "text-red-500 bg-red-50 dark:bg-red-900/20"
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative bg-zinc-50 dark:bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md text-center"
      >
        <div className="flex justify-center mb-8">
          <div className={`p-5 rounded-3xl ${iconColors[variant]} shadow-inner`}>
            {icon || <AlertCircle className="h-12 w-12" />}
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
          {title}
        </h1>
        
        <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-10 max-w-[320px] mx-auto leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col gap-3 max-w-[280px] mx-auto">
          {actionHref ? (
            <Button className="w-full h-12 font-semibold rounded-xl" asChild>
              <Link href={actionHref}>{actionLabel || "Try Again"}</Link>
            </Button>
          ) : onAction ? (
            <Button className="w-full h-12 font-semibold rounded-xl" onClick={onAction}>
              {actionLabel || "Try Again"}
            </Button>
          ) : null}
          
          {showHomeButton && (
            <Button variant="ghost" className="w-full h-12 font-semibold gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100" asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Simplified Copyright Footer */}
      <footer className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs text-zinc-400 dark:text-zinc-600 font-medium tracking-wide uppercase">
          &copy; {currentYear} Chatterbox Labs LLC. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export function DeviceNotSupported() {
  return (
    <ErrorState
      title="Device Not Supported"
      description="Chatterbox Teams is currently optimized for desktop and larger tablets. Your current device experience may be limited."
      icon={<Smartphone className="h-10 w-10" />}
      variant="warning"
      actionLabel="Continue Anyway"
      onAction={() => window.location.reload()}
    />
  );
}

export function BrowserNotSupported() {
  return (
    <ErrorState
      title="Browser Not Supported"
      description="We've detected you're using an older browser. For the best experience, please use a modern browser like Chrome, Firefox, or Safari."
      icon={<MonitorOff className="h-10 w-10" />}
      variant="warning"
      actionLabel="Check Compatibility"
      actionHref="https://browsehappy.com/"
    />
  );
}

export function WorkspaceNotFound({ slug }: { slug?: string }) {
  return (
    <ErrorState
      title="Workspace Not Found"
      description={slug 
        ? `The workspace "${slug}" could not be found. It may have been deleted or the URL is incorrect.`
        : "The workspace you're looking for doesn't exist or you don't have access to it."
      }
      icon={<Search className="h-10 w-10" />}
      variant="error"
      actionLabel="Browse Workspaces"
      actionHref="/spaces"
    />
  );
}

export function GlobalErrorState({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState
      title="Something went wrong"
      description="An unexpected error occurred while processing your request. Our team has been notified."
      icon={<ShieldAlert className="h-10 w-10" />}
      variant="error"
      actionLabel="Try to Recover"
      onAction={reset}
    />
  );
}
