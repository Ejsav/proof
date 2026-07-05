import { cn } from "@/lib/utils";

type BadgeProps = {
  variant?: "neutral" | "accent" | "success" | "outline";
  className?: string;
  children: React.ReactNode;
};

const variants = {
  neutral: "bg-neutral-100 text-neutral-700",
  accent: "bg-accent-50 text-accent-700",
  success: "bg-success/10 text-success",
  outline: "border border-neutral-300 text-ink-muted",
};

export function Badge({ variant = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xs px-2 py-1 label-caps",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
