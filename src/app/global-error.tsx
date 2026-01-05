"use client";

import { GlobalErrorState } from "@/components/error-states";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <GlobalErrorState error={error} reset={reset} />
        </div>
      </body>
    </html>
  );
}
