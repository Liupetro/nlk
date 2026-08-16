"use client";

import { useT } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Props = {
  showHeading?: boolean;
  /** Full-bleed dark hero-like block (used on /about) */
  asHero?: boolean;
};

export function ValueProposition({ showHeading = true, asHero = false }: Props) {
  const { about } = useT();

  return (
    <section
      id="about"
      className={cn(
        "relative overflow-hidden bg-hero-mesh bg-noise",
        asHero ? "pt-32 pb-20 lg:pt-40 lg:pb-28" : "py-20 lg:py-28",
      )}
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
        {showHeading && (
          <div className="mb-10 lg:mb-12">
            <SectionHeading
              theme="dark"
              eyebrow={about.eyebrow}
              number={about.number}
              title={about.title}
              accent={about.accent}
              description={about.description || undefined}
            />
          </div>
        )}

        <Reveal>
          <div className="max-w-3xl space-y-6">
            {about.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-white/60 leading-relaxed text-base lg:text-lg"
              >
                {paragraph}
              </p>
            ))}

            <div className="pt-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-bright/90">
                {about.listTitle}
              </p>
              <ul className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 sm:p-6 space-y-3.5 shadow-[0_0_0_1px_rgba(0,180,216,0.08)]">
                {about.highlights.map((item) => (
                  <li key={item} className="flex gap-3 items-start">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)]"
                      aria-hidden
                    />
                    <span className="text-[15px] sm:text-base leading-relaxed text-white/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-base lg:text-lg leading-relaxed text-white/75 font-medium">
              {about.closing}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
