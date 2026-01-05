'use client';

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  text?: string;
  fullPage?: boolean;
}

export function Loading({ className, text = "Loading...", fullPage = false }: LoadingProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-primary/20" />
        <Loader2 className="absolute top-0 left-0 h-12 w-12 animate-spin text-primary" />
      </div>
      {text && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
