"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "border border-accent-600 bg-transparent text-accent-700 hover:bg-accent-500 hover:text-primary-900 hover:border-accent-500 focus-visible:outline-accent-500 disabled:border-accent-200 disabled:text-accent-300 dark:border-accent-400 dark:text-accent-400 dark:hover:bg-accent-500 dark:hover:text-primary-900 dark:disabled:border-accent-800 dark:disabled:text-accent-700",
  secondary:
    "bg-primary-800 text-white hover:bg-primary-900 focus-visible:outline-primary-700 disabled:bg-primary-300 dark:bg-primary-600 dark:hover:bg-primary-500",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-surface-muted focus-visible:outline-primary-600",
  ghost: "bg-transparent text-foreground hover:bg-surface-muted",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600 disabled:bg-red-300",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, fullWidth, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
