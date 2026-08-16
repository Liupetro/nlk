"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";

type PageHeroProps = {
  pageKey: string;
  /** Section number e.g. "01" — shown with eyebrow */
  number?: string;
  eyebrowEn: string;
  eyebrowRu: string;
  titleEn: string;
  titleRu: string;
  accentEn?: string;
  accentRu?: string;
  descriptionEn?: string;
  descriptionRu?: string;
  /** Contact page only — slightly shorter vertical padding */
  compact?: boolean;
};

/**
 * Unified dark page header for About, Products, Advantages, Process, Capabilities.
 * Structure: number + eyebrow → title → short subtitle.
 */
export function PageHero({
  pageKey,
  number,
  eyebrowEn,
  eyebrowRu,
  titleEn,
  titleRu,
  accentEn = "",
  accentRu = "",
  descriptionEn = "",
  descriptionRu = "",
  compact = false,
}: PageHeroProps) {
  const { locale } = useLanguage();
  const reduceMotion = useReducedMotion();
  const isRu = locale === "ru";

  const eyebrow = isRu ? eyebrowRu : eyebrowEn;
  const title = isRu ? titleRu : titleEn;
  const accent = isRu ? accentRu : accentEn;
  const description = isRu ? descriptionRu : descriptionEn;

  const initial = reduceMotion ? false : { opacity: 0, y: 24 };

  return (
    <section
      className={`relative overflow-hidden bg-hero-mesh bg-noise ${
        compact
          ? "pt-28 pb-12 lg:pt-32 lg:pb-16"
          : "pt-32 pb-16 lg:pt-40 lg:pb-20"
      }`}
    >
      <div className="absolute inset-0 bg-grid-fade opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-accent/12 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-zamak/10 blur-[90px]"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="max-w-3xl">
          {(number || eyebrow) && (
            <motion.div
              key={`${pageKey}-eyebrow-${locale}`}
              initial={initial}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 flex items-center gap-3"
            >
              {number ? (
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
                  {number}
                </span>
              ) : null}
              {eyebrow ? (
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-bright/90">
                  <span className="h-px w-6 bg-accent/60" aria-hidden />
                  {eyebrow}
                </span>
              ) : null}
            </motion.div>
          )}

          <motion.h1
            key={`${pageKey}-title-${locale}`}
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-white"
          >
            <span className="text-gradient-metal">{title}</span>
            {accent ? (
              <>
                {" "}
                <span className="text-gradient-accent">{accent}</span>
              </>
            ) : null}
          </motion.h1>

          {description ? (
            <motion.p
              key={`${pageKey}-desc-${locale}`}
              initial={initial}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/55"
            >
              {description}
            </motion.p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
