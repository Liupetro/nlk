"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export type TimelineStep = {
  number: string;
  title: string;
  description: string;
  duration?: string;
  /** Optional chips (e.g. industries tags) */
  tags?: string[];
  image: string;
  imageAlt: string;
  imageCaptions?: { left: string; right: string };
};

type Props = {
  id?: string;
  showHeading?: boolean;
  eyebrow: string;
  number: string;
  title: string;
  accent: string;
  description?: string;
  steps: TimelineStep[];
  disclaimer?: string;
  /** Section surface: process uses light surface */
  variant?: "light" | "muted";
};

/**
 * Shared vertical step timeline used by Process and Advantages (WhyChooseUs).
 * Pattern: center line, number badge, text card + image alternating on desktop.
 */
export function StepTimeline({
  id,
  showHeading = true,
  eyebrow,
  number,
  title,
  accent,
  description,
  steps,
  disclaimer,
  variant = "light",
}: Props) {
  const reduceMotion = useReducedMotion();
  const sectionBg =
    variant === "muted"
      ? "bg-background border-y border-border"
      : "bg-surface border-y border-border";

  return (
    <section id={id} className={cn("relative py-20 lg:py-28", sectionBg)}>
      <Container>
        {showHeading && (
          <SectionHeading
            eyebrow={eyebrow}
            number={number}
            title={title}
            accent={accent}
            description={description || undefined}
            className="mb-14 lg:mb-16 max-w-3xl"
          />
        )}

        <div className="relative">
          <div
            className="pointer-events-none absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-accent via-accent/40 to-border sm:left-8 lg:left-1/2 lg:-translate-x-px"
            aria-hidden
          />

          <ol className="space-y-10 lg:space-y-16">
            {steps.map((step, i) => {
              const imageOnRight = i % 2 === 0;
              const badgeRing =
                variant === "muted"
                  ? "shadow-[0_0_0_6px_var(--background),0_0_28px_-4px_var(--accent-glow)]"
                  : "shadow-[0_0_0_6px_var(--surface),0_0_28px_-4px_var(--accent-glow)]";
              const cardBg = variant === "muted" ? "bg-surface" : "bg-background";

              return (
                <Reveal key={step.number + step.title} delay={i * 0.06} as="li">
                  <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14 items-center min-w-0">
                    <div className="absolute left-0 sm:left-2 lg:left-1/2 lg:-translate-x-1/2 top-0 z-10 flex h-14 w-14 items-center justify-center">
                      <motion.span
                        initial={reduceMotion ? false : { scale: 0.75, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent/50 bg-background text-sm font-bold tracking-wide text-accent-dim",
                          badgeRing,
                        )}
                      >
                        {step.number}
                      </motion.span>
                    </div>

                    <div
                      className={cn(
                        "min-w-0 pl-16 sm:pl-20 lg:pl-0",
                        imageOnRight
                          ? "lg:pr-12 lg:col-start-1 lg:row-start-1 lg:text-right"
                          : "lg:pl-12 lg:col-start-2 lg:row-start-1",
                      )}
                    >
                      <article
                        className={cn(
                          "rounded-2xl border border-border p-6 sm:p-8 shadow-sm hover:border-accent/30 hover:shadow-md transition-all duration-300",
                          cardBg,
                        )}
                      >
                        <div
                          className={cn(
                            "flex flex-wrap items-center gap-3",
                            imageOnRight && "lg:justify-end",
                          )}
                        >
                          <span className="font-mono text-xs font-semibold tracking-[0.18em] text-accent-dim">
                            {step.number}
                          </span>
                          {step.duration ? (
                            <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent-dim">
                              {step.duration}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-charcoal leading-snug">
                          {step.title}
                        </h3>
                        <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-muted">
                          {step.description}
                        </p>
                        {step.tags && step.tags.length > 0 ? (
                          <ul
                            className={cn(
                              "mt-5 flex flex-wrap gap-2",
                              imageOnRight && "lg:justify-end",
                            )}
                          >
                            {step.tags.map((tag) => (
                              <li
                                key={tag}
                                className="rounded-md bg-charcoal/[0.05] px-2.5 py-1 text-xs font-medium text-charcoal/65"
                              >
                                {tag}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </article>
                    </div>

                    <div
                      className={cn(
                        "min-w-0 pl-16 sm:pl-20 lg:pl-0",
                        imageOnRight
                          ? "lg:pl-12 lg:col-start-2 lg:row-start-1"
                          : "lg:pr-12 lg:col-start-1 lg:row-start-1",
                      )}
                    >
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="group relative overflow-hidden rounded-2xl border border-border bg-charcoal aspect-[4/3] shadow-sm"
                      >
                        <Image
                          src={step.image}
                          alt={step.imageAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 42vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          priority={i === 0}
                        />
                        <div
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent"
                          aria-hidden
                        />
                        {step.imageCaptions ? (
                          <>
                            <span className="absolute top-3 left-3 rounded-lg bg-charcoal/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/85">
                              {step.number}
                            </span>
                            <div className="absolute bottom-3 left-3 right-3 grid grid-cols-2 gap-2">
                              <div className="flex min-w-0 justify-center">
                                <span className="max-w-full rounded-lg bg-charcoal/70 backdrop-blur-sm px-2 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide sm:tracking-wider text-white/85 leading-tight text-center">
                                  {step.imageCaptions.left}
                                </span>
                              </div>
                              <div className="flex min-w-0 justify-center">
                                <span className="max-w-full rounded-lg bg-charcoal/70 backdrop-blur-sm px-2 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide sm:tracking-wider text-white/85 leading-tight text-center">
                                  {step.imageCaptions.right}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                            <span className="rounded-lg bg-charcoal/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/85">
                              {step.number}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>

        {disclaimer ? (
          <Reveal delay={0.15} className="mt-12 text-center">
            <p className="text-xs text-muted-light max-w-xl mx-auto">{disclaimer}</p>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
