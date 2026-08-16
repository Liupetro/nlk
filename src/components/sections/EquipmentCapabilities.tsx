"use client";

import Image from "next/image";
import { useT } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

/**
 * Equipment & tooling cards — machines + dies, on /capabilities.
 */
export function EquipmentCapabilities() {
  const { capabilities } = useT();
  const { equipment } = capabilities;

  return (
    <section
      id="equipment"
      className="relative py-16 lg:py-20 bg-dark-section bg-noise text-white border-t border-white/5"
      aria-labelledby="equipment-heading"
    >
      <div className="absolute inset-0 bg-grid-fade opacity-30" aria-hidden />
      <Container className="relative">
        <Reveal className="mb-8 lg:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
              05.2
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-bright/90">
              <span className="h-px w-6 bg-accent/60" />
              {equipment.title}
            </span>
          </div>
          <h2
            id="equipment-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-white"
          >
            {equipment.title}
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6" stagger={0.1}>
          {equipment.cards.map((card, index) => (
            <StaggerItem key={card.id}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-accent/35 hover:bg-white/[0.045] hover:-translate-y-0.5">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    priority={index === 0}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-80"
                    aria-hidden
                  />
                  <span className="absolute bottom-4 left-4 font-mono text-[11px] tracking-[0.2em] text-accent-bright/90">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white leading-snug">
                    {card.title}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {card.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm sm:text-[15px] leading-relaxed text-white/55"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)]"
                          aria-hidden
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
