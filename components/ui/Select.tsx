"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useId } from "react";

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

export function Select({ label, error, className, id, children, ...props }: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={selectId} className="text-small font-medium text-ink">
        {label}
        {props.required ? <span aria-hidden="true" className="text-ink-faint"> *</span> : null}
      </label>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cn(
            "h-11 w-full appearance-none rounded-sm border bg-white pl-4 pr-10 text-body text-ink",
            "transition-[border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out)",
            "focus:outline-none focus:ring-2 focus:ring-accent-600/25",
            "disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-ink-faint",
            error
              ? "border-error focus:border-error focus:ring-error/20"
              : "border-neutral-300 hover:border-neutral-400 focus:border-accent-600",
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
        />
      </div>
      {error ? (
        <p id={`${selectId}-error`} role="alert" className="text-small text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}