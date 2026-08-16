"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, Phone } from "lucide-react";
import { useT } from "@/components/providers/LanguageProvider";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useT();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";
  const solid = scrolled || open || !isHome;
  const phoneHref = `tel:${t.header.phoneTel}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "bg-charcoal/90 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <Container className="flex h-16 lg:h-[4.5rem] items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <BrandLogo size="header" />
          <a
            href={phoneHref}
            className="hidden sm:inline-flex items-center gap-1.5 shrink-0 text-sm font-medium text-white/80 hover:text-accent-bright transition-colors"
          >
            <Phone className="h-3.5 w-3.5 opacity-70" aria-hidden />
            <span className="tabular-nums tracking-tight">{t.header.phone}</span>
          </a>
        </div>

        <nav className="hidden lg:flex items-center gap-0.5">
          {t.nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  active
                    ? "text-white bg-white/10"
                    : "text-white/65 hover:text-white hover:bg-white/5",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher />
          <Button
            href="/contact"
            size="sm"
            variant="primary"
            icon={<ArrowUpRight className="h-4 w-4" />}
          >
            {t.header.quoteCta}
          </Button>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <a
            href={phoneHref}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white hover:bg-white/10 sm:hidden"
            aria-label={t.header.phone}
          >
            <Phone className="h-4 w-4" />
          </a>
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white hover:bg-white/10"
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-white/8 bg-charcoal/95 backdrop-blur-xl"
          >
            <Container className="py-6 flex flex-col gap-1">
              {t.nav.map((item, i) => {
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                        active
                          ? "text-white bg-white/10"
                          : "text-white/80 hover:text-white hover:bg-white/5",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                <a
                  href={phoneHref}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3.5 text-base font-medium text-white hover:bg-white/5 transition-colors"
                >
                  <Phone className="h-4 w-4 text-accent-bright" aria-hidden />
                  <span className="tabular-nums">{t.header.phone}</span>
                </a>
                <Button
                  href="/contact"
                  variant="primary"
                  className="w-full"
                  icon={<ArrowUpRight className="h-4 w-4" />}
                  onClick={() => setOpen(false)}
                >
                  {t.header.quoteCta}
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
