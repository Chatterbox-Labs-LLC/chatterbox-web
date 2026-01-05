"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertCircle, 
  ChevronLeft, 
  Home, 
  MonitorOff, 
  Smartphone, 
  Search, 
  RefreshCcw,
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
    default: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    warning: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
    error: "text-red-500 bg-red-50 dark:bg-red-900/20"
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="text-center border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
          <CardHeader className="pt-10 pb-6">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-2xl ${iconColors[variant]}`}>
                {icon || <AlertCircle className="h-10 w-10" />}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <p className="text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pb-10 px-10">
            {actionHref ? (
              <Button className="w-full h-12 font-semibold" asChild>
                <Link href={actionHref}>{actionLabel || "Try Again"}</Link>
              </Button>
            ) : onAction ? (
              <Button className="w-full h-12 font-semibold" onClick={onAction}>
                {actionLabel || "Try Again"}
              </Button>
            ) : null}
            
            {showHomeButton && (
              <Button variant="outline" className="w-full h-12 font-semibold gap-2" asChild>
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
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

export function GlobalErrorState({ error, reset }: { error: Error; reset: () => void }) {
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
