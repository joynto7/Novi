import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-lg font-semibold tracking-tight text-foreground", className)}>
      occasi<span className="text-accent-500">o</span>
    </span>
  );
}
