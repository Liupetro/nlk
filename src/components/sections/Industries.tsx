"use client";

import { useT } from "@/components/providers/LanguageProvider";
import { StepTimeline } from "@/components/sections/StepTimeline";

type Props = {
  showHeading?: boolean;
};

/**
 * Industries — same vertical timeline pattern as Process / Advantages.
 * Used inside /products (not a top-level nav section).
 */
export function Industries({ showHeading = true }: Props) {
  const { industries } = useT();

  const steps = industries.items.map((item, i) => ({
    number: String(i + 1).padStart(2, "0"),
    title: item.title,
    description: item.description,
    tags: item.tags,
    image: item.image,
    imageAlt: item.title,
  }));

  return (
    <StepTimeline
      id="industries"
      showHeading={showHeading}
      eyebrow={industries.eyebrow}
      number={industries.number}
      title={industries.title}
      accent={industries.accent}
      description={industries.description}
      steps={steps}
      disclaimer={industries.footerNote}
      variant="muted"
    />
  );
}
