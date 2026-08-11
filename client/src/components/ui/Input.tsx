"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FieldWrapperProps {}
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldWrapperProps {}

const fieldClasses =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/70 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-60";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(fieldClasses, error && "border-red-500 focus:border-red-500 focus:ring-red-500/20", className)}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-xs font-medium text-red-500">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-foreground-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(fieldClasses, "min-h-28 resize-y", error && "border-red-500 focus:border-red-500 focus:ring-red-500/20", className)}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-xs font-medium text-red-500">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-foreground-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldWrapperProps {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, id, className, children, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>
        )}
        <select ref={ref} id={inputId} className={cn(fieldClasses, "cursor-pointer", className)} {...props}>
          {children}
        </select>
        {error ? (
          <p className="text-xs font-medium text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-xs text-foreground-muted">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Select.displayName = "Select";
