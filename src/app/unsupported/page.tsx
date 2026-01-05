"use client";

import { useSearchParams } from "next/navigation";
import { DeviceNotSupported, BrowserNotSupported } from "@/components/error-states";
import { Suspense } from "react";

function UnsupportedContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return type === "device" ? <DeviceNotSupported /> : <BrowserNotSupported />;
}

export default function UnsupportedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    }>
      <UnsupportedContent />
    </Suspense>
  );
}
