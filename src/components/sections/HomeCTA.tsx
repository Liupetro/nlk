"use client";

import { ArrowUpRight } from "lucide-react";
import { useT } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function HomeCTA() {
  const { contact, header } = useT();

  return (
    <section className="relative py-20 lg:py-28 bg-charcoal bg-noise overflow-hidden">
      <div className="absolute inset-0 bg-grid-fade opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-accent/12 blur-[120px]"
        aria-hidden
      />
      <Container className="relative text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-bright/90">
            {contact.sectionLabel}
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1] max-w-3xl mx-auto">
            {contact.headline}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-white/55 leading-relaxed max-w-xl mx-auto">
            {contact.subheadline}
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              href="/contact"
              size="lg"
              variant="primary"
              icon={<ArrowUpRight className="h-5 w-5" />}
            >
              {header.quoteCta}
            </Button>
            <Button href={`mailto:${contact.email}`} size="lg" variant="outline-light">
              {contact.email}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
