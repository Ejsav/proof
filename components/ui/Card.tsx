import { cn } from "@/lib/utils";

type CardProps = {
  className?: string;
  children: React.ReactNode;
  /** Lifts on hover — for clickable cards (e.g. vehicle cards) */
  interactive?: boolean;
  as?: "div" | "article" | "li";
};

export function Card({ className, children, interactive = false, as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-neutral-200 bg-white shadow-xs",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-(--ease-out) " +
            "hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
