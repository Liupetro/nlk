"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { localeLabels, locales, type Locale } from "@/lib/content";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  size?: "sm" | "md";
  variant?: "dark" | "light";
};

export function LanguageSwitcher({
  className,
  size = "sm",
  variant = "dark",
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      role="group"
      aria-label={t.footer.languagesTitle}
    >
      {locales.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code as Locale)}
            aria-pressed={active}
            className={cn(
              "rounded-lg font-semibold uppercase tracking-wide transition-all duration-200",
              size === "sm" ? "h-9 min-w-10 px-3 text-sm" : "h-10 min-w-11 px-3.5 text-sm",
              variant === "dark" &&
                (active
                  ? "bg-accent/20 text-accent-bright border border-accent/30 shadow-[0_0_0_1px_rgba(0,180,216,0.15)]"
                  : "bg-white/5 text-white/50 border border-white/10 hover:text-white hover:border-white/20"),
              variant === "light" &&
                (active
                  ? "bg-accent/15 text-accent-dim border border-accent/30"
                  : "bg-charcoal/[0.04] text-muted border border-border hover:text-charcoal hover:border-border-strong"),
            )}
          >
            {localeLabels[code]}
          </button>
        );
      })}
    </div>
  );
}
