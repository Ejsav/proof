"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";

type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
};

export function Textarea({ label, error, hint, className, id, ...props }: TextareaProps) {
  const autoId = useId();
  const areaId = id ?? autoId;
  const describedBy = error ? `${areaId}-error` : hint ? `${areaId}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={areaId} className="text-small font-medium text-ink">
        {label}
        {props.required ? <span aria-hidden="true" className="text-ink-faint"> *</span> : null}
      </label>
      <textarea
        id={areaId}
        rows={props.rows ?? 4}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full resize-y rounded-sm border bg-white px-4 py-3 text-body text-ink",
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
        <p id={`${areaId}-error`} role="alert" className="text-small text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${areaId}-hint`} className="text-small text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}