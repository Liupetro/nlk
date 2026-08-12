import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline-light" | "primary-light";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-charcoal font-semibold shadow-[0_0_0_1px_rgba(0,180,216,0.3),0_12px_32px_-12px_rgba(0,180,216,0.55)] hover:bg-accent-bright hover:shadow-[0_0_0_1px_rgba(34,211,238,0.4),0_16px_40px_-12px_rgba(0,180,216,0.65)] active:scale-[0.98]",
  "primary-light":
    "bg-charcoal text-white font-semibold hover:bg-charcoal-mid shadow-lg shadow-charcoal/15 active:scale-[0.98]",
  secondary:
    "bg-white/10 text-white font-semibold border border-white/20 backdrop-blur-sm hover:bg-white/15 hover:border-white/30 active:scale-[0.98]",
  ghost:
    "bg-transparent text-foreground font-medium hover:bg-black/5 border border-transparent",
  "outline-light":
    "bg-transparent text-white font-semibold border border-white/25 hover:border-accent/60 hover:bg-accent/10 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm rounded-lg gap-1.5",
  md: "h-12 px-6 text-sm sm:text-base rounded-xl gap-2",
  lg: "h-14 px-8 text-base rounded-xl gap-2.5",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  icon,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    if (isInternalHref(href)) {
      return (
        <Link href={href} className={classes} onClick={anchorProps.onClick}>
          {children}
          {icon}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <button
      type={(props as ButtonHTMLAttributes<HTMLButtonElement>).type ?? "button"}
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
      {icon}
    </button>
  );
}
