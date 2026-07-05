"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useId } from "react";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "type"> & {
  label: React.ReactNode;
  className?: string;
};

/**
 * Styled, accessible checkbox: the real <input> stays in the tree
 * (visually hidden, still focusable); the box is drawn with peer states.
 */
export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const autoId = useId();
  const boxId = id ?? autoId;

  return (
    <label
      htmlFor={boxId}
      className={cn(
        "group flex cursor-pointer items-start gap-3 text-small text-ink",
        props.disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input id={boxId} type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-xs border bg-white",
          "border-neutral-400 transition-[background-color,border-color,transform]",
          "duration-(--duration-fast) ease-(--ease-spring)",
          "group-hover:border-neutral-600",
          "peer-checked:border-accent-600 peer-checked:bg-accent-600",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-accent-600 peer-focus-visible:outline-offset-2",
          "peer-checked:[&>svg]:scale-100 [&>svg]:scale-0",
        )}
      >
        <Check
          className="size-3.5 text-white transition-transform duration-(--duration-fast) ease-(--ease-spring)"
          strokeWidth={3}
        />
      </span>
      <span className="leading-normal">{label}</span>
    </label>
  );
}