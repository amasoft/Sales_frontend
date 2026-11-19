import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Compass className="h-8 w-8" />
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-primary">404</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">Page not found</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">
          The page you're looking for doesn't exist or may have moved.
        </p>
      </div>
      <Button asChild>
        <Link to="/app/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
