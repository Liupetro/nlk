"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useT } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";

type Props = {
  showHeading?: boolean;
  /** Limit items on home preview; omit for full grid */
  limit?: number;
  showDiscussCta?: boolean;
};

export function ProductExamples({
  showHeading = true,
  limit,
  showDiscussCta = true,
}: Props) {
  const { products } = useT();
  const items = limit ? products.examples.slice(0, limit) : products.examples;

  return (
    <section id="product-examples" className="relative">
      {showHeading && (
        <div className="relative overflow-hidden bg-hero-mesh bg-noise py-16 lg:py-20">
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
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <SectionHeading
                theme="dark"
                number={products.examplesNumber}
                eyebrow={products.eyebrow}
                title={products.examplesTitle}
                description={products.examplesDescription}
              />
              {showDiscussCta && (
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent-bright hover:text-white transition-colors shrink-0"
                >
                  {products.discussCta}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </Container>
        </div>
      )}

      {!showHeading && showDiscussCta && (
        <div className="bg-background pt-10 lg:pt-12">
          <Container>
            <div className="flex justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent-dim hover:text-charcoal transition-colors"
              >
                {products.discussCta}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Container>
        </div>
      )}

      <div className="relative bg-background py-16 lg:py-20">
        <Container>
          <Stagger
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
            stagger={0.05}
          >
            {items.map((item, index) => (
              <StaggerItem key={item.image}>
                <article className="group relative overflow-hidden rounded-2xl border border-border bg-charcoal shadow-sm transition-all duration-300 hover:border-accent/35 hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      priority={index < 4}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-transparent opacity-90"
                      aria-hidden
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                      <h3 className="text-sm sm:text-base font-semibold tracking-tight text-white leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </div>
    </section>
  );
}
