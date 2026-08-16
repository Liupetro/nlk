"use client";

import Link from "next/link";
import { useT } from "@/components/providers/LanguageProvider";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();
  const copyright = t.footer.copyright
    .replace("{year}", String(year))
    .replace("{legalName}", t.brand.legalName);

  return (
    <footer className="bg-charcoal text-white border-t border-white/8">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <BrandLogo size="footer" />
            <p className="mt-5 text-sm leading-relaxed text-white/50 max-w-sm">
              {t.footer.blurb}
            </p>
          </div>

          {t.footer.columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") || link.href.startsWith("mailto:") ? (
                      <a
                        href={link.href}
                        className="text-sm text-white/65 hover:text-accent-bright transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/65 hover:text-accent-bright transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              {t.footer.languagesTitle}
            </h3>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
            <p className="mt-6 text-xs leading-relaxed text-white/35">
              {t.footer.languageHint}
            </p>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">{copyright}</p>
          <Link
            href={t.footer.privacyHref}
            className="text-xs text-white/40 hover:text-accent-bright transition-colors sm:text-right"
          >
            {t.footer.privacyLabel}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
