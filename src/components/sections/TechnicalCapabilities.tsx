"use client";

import { useT } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Spec sheet for casting limits — shown on /capabilities after the page intro.
 */
export function TechnicalCapabilities() {
  const { capabilities } = useT();
  const { technical } = capabilities;

  return (
    <section
      id="technical-capabilities"
      className="relative py-16 lg:py-20 bg-dark-section bg-noise text-white border-t border-white/5"
      aria-labelledby="technical-capabilities-heading"
    >
      <div className="absolute inset-0 bg-grid-fade opacity-30" aria-hidden />
      <Container className="relative">
        <Reveal className="mb-8 lg:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
              05.1
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-bright/90">
              <span className="h-px w-6 bg-accent/60" />
              {technical.title}
            </span>
          </div>
          <h2
            id="technical-capabilities-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-white"
          >
            {technical.title}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            {/* Column headers — desktop only */}
            <div className="hidden sm:grid sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-4 px-5 lg:px-7 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                {technical.paramLabel}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35 sm:text-right">
                {technical.valueLabel}
              </span>
            </div>

            <ul className="divide-y divide-white/8">
              {technical.rows.map((row) => (
                <li
                  key={row.parameter}
                  className="group grid grid-cols-1 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-1.5 sm:gap-4 px-5 lg:px-7 py-4 sm:py-5 hover:bg-white/[0.03] transition-colors"
                >
                  <span className="text-sm text-white/50 leading-snug">
                    {row.parameter}
                  </span>
                  <span className="text-sm sm:text-base font-semibold tracking-tight text-white sm:text-right leading-snug">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.14} className="mt-6 lg:mt-8 space-y-2.5 max-w-3xl">
          {technical.notes.map((note) => (
            <p key={note} className="text-sm leading-relaxed text-white/45">
              {note}
            </p>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
