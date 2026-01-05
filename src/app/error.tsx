"use client";

import { useEffect } from "react";
import { GlobalErrorState } from "@/components/error-states";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <GlobalErrorState error={error} reset={reset} />
    </div>
  );
}
