"use client";

import { useLanguage, useT } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ArrowUpRight } from "lucide-react";

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function Insights() {
  const { insights } = useT();
  const { locale } = useLanguage();

  return (
    <section id="insights" className="relative py-20 lg:py-28 bg-background">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <SectionHeading
            eyebrow={insights.eyebrow}
            number={insights.number}
            title={insights.title}
            accent={insights.accent}
          />
          <a
            href="#contact"
            className="text-sm font-semibold text-muted hover:text-accent-dim transition-colors"
          >
            {insights.viewAll}
          </a>
        </div>

        <Stagger className="grid md:grid-cols-3 gap-5" stagger={0.08}>
          {insights.items.map((article) => (
            <StaggerItem key={article.title}>
              <article className="group h-full rounded-2xl border border-border bg-surface p-6 sm:p-7 card-hover flex flex-col">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold uppercase tracking-wider text-accent-dim">
                    {article.category}
                  </span>
                  <span className="text-muted-light">{formatDate(article.date, locale)}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-charcoal leading-snug group-hover:text-accent-dim transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted flex-1">{article.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal/70 group-hover:text-accent-dim transition-colors">
                  {insights.readMore}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
