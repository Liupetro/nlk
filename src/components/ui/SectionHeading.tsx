import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
  number?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "left",
  theme = "light",
  className,
  number,
}: SectionHeadingProps) {
  const isDark = theme === "dark";

  return (
    <Reveal className={cn(align === "center" && "text-center mx-auto", className)}>
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {(eyebrow || number) && (
          <div
            className={cn(
              "mb-4 flex items-center gap-3",
              align === "center" && "justify-center",
            )}
          >
            {number && (
              <span
                className={cn(
                  "font-mono text-xs tracking-[0.2em] uppercase",
                  isDark ? "text-accent" : "text-accent-dim",
                )}
              >
                {number}
              </span>
            )}
            {eyebrow && (
              <span
                className={cn(
                  "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]",
                  isDark ? "text-accent-bright/90" : "text-accent-dim",
                )}
              >
                <span
                  className={cn(
                    "h-px w-6",
                    isDark ? "bg-accent/60" : "bg-accent-dim/60",
                  )}
                />
                {eyebrow}
              </span>
            )}
          </div>
        )}
        <h2
          className={cn(
            "text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]",
            isDark ? "text-white" : "text-charcoal",
          )}
        >
          {title}
          {accent && (
            <>
              {" "}
              <span className="text-gradient-accent">{accent}</span>
            </>
          )}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-5 text-base sm:text-lg leading-relaxed max-w-2xl",
              isDark ? "text-white/60" : "text-muted",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}
