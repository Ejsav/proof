"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
};

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={inputId} className="text-small font-medium text-ink">
        {label}
        {props.required ? <span aria-hidden="true" className="text-ink-faint"> *</span> : null}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-11 w-full rounded-sm border bg-white px-4 text-body text-ink",
          "placeholder:text-ink-faint",
          "transition-[border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out)",
          "focus:outline-none focus:ring-2 focus:ring-accent-600/25",
          "disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-ink-faint",
          error
            ? "border-error focus:border-error focus:ring-error/20"
            : "border-neutral-300 hover:border-neutral-400 focus:border-accent-600",
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-small text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-small text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}