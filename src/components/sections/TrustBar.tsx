"use client";

import { useT } from "@/components/providers/LanguageProvider";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function TrustBar() {
  const { trustBar } = useT();

  return (
    <section className="relative bg-charcoal border-y border-white/8 py-14 lg:py-16">
      <Container>
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-10">
            {trustBar.eyebrow}
          </p>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {trustBar.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06} className="text-center lg:text-left">
              <div className="px-2">
                <div className="flex items-baseline justify-center lg:justify-start gap-0.5">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                    className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white tabular-nums"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-white/80">{stat.label}</p>
                <p className="mt-0.5 text-xs text-white/40">{stat.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
