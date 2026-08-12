"use client";

import { useT } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Quote } from "lucide-react";

export function Testimonials() {
  const { testimonials } = useT();

  return (
    <section className="relative py-20 lg:py-28 bg-surface border-y border-border overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow={testimonials.eyebrow}
          number={testimonials.number}
          title={testimonials.title}
          accent={testimonials.accent}
          description={testimonials.description}
          className="mb-12"
          align="center"
        />

        <Reveal className="mb-14">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {testimonials.logos.map((logo) => (
              <div
                key={logo}
                className="flex h-14 min-w-[7.5rem] items-center justify-center rounded-xl border border-border bg-background px-5 text-xs font-semibold uppercase tracking-wider text-muted-light"
              >
                [{logo}]
              </div>
            ))}
          </div>
        </Reveal>

        <Stagger className="grid md:grid-cols-3 gap-5" stagger={0.1}>
          {testimonials.quotes.map((item) => (
            <StaggerItem key={item.company + item.author}>
              <blockquote className="h-full rounded-2xl border border-border bg-background p-7 flex flex-col">
                <Quote className="h-8 w-8 text-accent/40" strokeWidth={1.5} />
                <p className="mt-4 text-[15px] leading-relaxed text-charcoal/85 flex-1">
                  “{item.quote}”
                </p>
                <footer className="mt-6 pt-5 border-t border-border">
                  <cite className="not-italic">
                    <span className="block text-sm font-semibold text-charcoal">{item.author}</span>
                    <span className="block text-xs text-muted mt-0.5">
                      {item.role} · {item.company}
                    </span>
                  </cite>
                </footer>
              </blockquote>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
