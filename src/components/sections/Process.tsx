"use client";

import { useT } from "@/components/providers/LanguageProvider";
import { StepTimeline } from "@/components/sections/StepTimeline";

type Props = {
  showHeading?: boolean;
};

export function Process({ showHeading = true }: Props) {
  const { process } = useT();

  return (
    <StepTimeline
      id="process"
      showHeading={showHeading}
      eyebrow={process.eyebrow}
      number={process.number}
      title={process.title}
      accent={process.accent}
      description={process.description}
      steps={process.steps}
      disclaimer={process.disclaimer}
      variant="light"
    />
  );
}
