import { cn } from "@/lib/utils";

type SectionProps = {
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  /** Tighter vertical rhythm for stacked sub-sections */
  size?: "base" | "sm";
  id?: string;
  as?: "section" | "div" | "header";
};

export function Section({
  className,
  containerClassName,
  children,
  size = "base",
  id,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={cn(size === "base" ? "py-section" : "py-section-sm", className)}>
      <div className={cn("container-site", containerClassName)}>{children}</div>
    </Tag>
  );
}
