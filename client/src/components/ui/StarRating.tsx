"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, size = 18, readOnly = true }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-0.5" role={readOnly ? undefined : "radiogroup"}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className={cn(!readOnly && "cursor-pointer")}
        >
          <Star
            size={size}
            className={cn(
              star <= Math.round(value) ? "fill-accent-400 text-accent-400" : "fill-none text-foreground-muted/40"
            )}
          />
        </button>
      ))}
    </div>
  );
}
