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

  return <GlobalErrorState error={error} reset={reset} />;
}
