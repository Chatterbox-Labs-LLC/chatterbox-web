import { ErrorState } from "@/components/error-states";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <ErrorState
      title="404 - Page Not Found"
      description="The page you're looking for doesn't exist or has been moved to a new location."
      icon={<Search className="h-10 w-10" />}
      actionLabel="Go to Dashboard"
      actionHref="/dashboard"
    />
  );
}
