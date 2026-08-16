"use client";

import Link from "next/link";
import { useT } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { capabilityIcons } from "@/components/ui/Icons";
import { ArrowUpRight } from "lucide-react";

type Props = {
  showHeading?: boolean;
};

export function Capabilities({ showHeading = true }: Props) {
  const { capabilities } = useT();

  return (
    <section
      id="capabilities"
      className="relative py-20 lg:py-28 bg-dark-section bg-noise text-white"
    >
      <div className="absolute inset-0 bg-grid-fade opacity-40" aria-hidden />
      <Container className="relative">
        {showHeading && (
          <SectionHeading
            theme="dark"
            eyebrow={capabilities.eyebrow}
            number={capabilities.number}
            title={capabilities.title}
            accent={capabilities.accent}
            description={capabilities.description}
            className="mb-14"
          />
        )}

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5" stagger={0.06}>
          {capabilities.items.map((cap) => {
            const Icon = capabilityIcons[cap.icon] ?? capabilityIcons.engineering;
            return (
              <StaggerItem key={cap.title}>
                <article className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-accent/40 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent-bright group-hover:border-accent/40 group-hover:bg-accent/10 transition-colors">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-5 text-base font-semibold tracking-tight text-white leading-snug pr-6">
                    {cap.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/50">{cap.description}</p>
                  <span className="absolute top-6 right-6 text-white/20 group-hover:text-accent transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
          <p className="text-sm text-white/60 max-w-xl">{capabilities.bottomNote}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-bright hover:text-white transition-colors shrink-0"
          >
            {capabilities.bottomCta}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
