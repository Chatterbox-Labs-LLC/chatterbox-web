import { Loading } from "@/components/loading-state";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center">
      <Loading text="Preparing your workspace..." />
    </div>
  );
}
