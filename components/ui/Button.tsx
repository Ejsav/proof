import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-medium select-none " +
  "rounded-md transition-[transform,box-shadow,background-color,border-color,color] " +
  "duration-(--duration-base) ease-(--ease-out) " +
  "focus-visible:outline-2 focus-visible:outline-accent-600 focus-visible:outline-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "active:translate-y-0 active:shadow-none";

const variants: Record<Variant, string> = {
  // Spatial hover: lift + shadow, never color-only
  primary:
    "bg-accent-600 text-white shadow-sm " +
    "hover:bg-accent-700 hover:-translate-y-0.5 hover:shadow-accent",
  secondary:
    "bg-white text-ink border border-neutral-300 shadow-xs " +
    "hover:border-neutral-900 hover:-translate-y-0.5 hover:shadow-sm",
  ghost:
    "bg-transparent text-ink " +
    "hover:bg-neutral-100 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-small",
  md: "h-11 px-6 text-body",
  lg: "h-13 px-8 text-body-lg",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Renders a <button>, or an <a>/<Link> when `href` is passed
 * (external protocols like tel:/sms: get a plain anchor).
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = buttonClasses(variant, size, className);

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} className={classes} {...anchorProps}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonAsButton)}>
      {children}
    </button>
  );
}
