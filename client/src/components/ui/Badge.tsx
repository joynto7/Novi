import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "primary" | "accent" | "teal" | "neutral" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
  primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300",
  accent: "border border-accent-500 bg-transparent text-accent-700 dark:border-accent-500 dark:text-accent-300",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  neutral: "bg-surface-muted text-foreground-muted",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        TONE_CLASSES[tone],
        className
      )}
      {...props}
    />
  );
}
