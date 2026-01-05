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
        <GlobalErrorState error={error} reset={reset} />
      </body>
    </html>
  );
}
