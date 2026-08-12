"use client";

import { useT } from "@/components/providers/LanguageProvider";
import { StepTimeline } from "@/components/sections/StepTimeline";

/**
 * Advantages timeline — page header is PageHero on /advantages.
 * On home, keep a compact section heading inside the timeline.
 */
type Props = {
  /** When false, only timeline (page already has PageHero). Default true for home. */
  showHeading?: boolean;
};

export function WhyChooseUs({ showHeading = true }: Props) {
  const { whyUs } = useT();

  const steps = whyUs.benefits.map((b, i) => ({
    number: String(i + 1).padStart(2, "0"),
    title: b.title,
    description: b.description,
    image: b.image,
    imageAlt: b.imageAlt,
  }));

  return (
    <StepTimeline
      id="why-us"
      showHeading={showHeading}
      eyebrow={whyUs.eyebrow}
      number={whyUs.number}
      title={whyUs.title}
      accent={whyUs.accent}
      description={whyUs.description || undefined}
      steps={steps}
      variant="muted"
    />
  );
}
