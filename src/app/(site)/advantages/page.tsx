import type { Metadata } from "next";
import { brand } from "@/lib/content";
import { PageHero } from "@/components/motion/PageHero";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { HomeCTA } from "@/components/sections/HomeCTA";

export const metadata: Metadata = {
  title: "Преимущества",
  description: `Почему выбирают ${brand.name}: расчёт за день, сплавы, ОТК, пробные партии, механообработка и оснастка.`,
};

export default function AdvantagesPage() {
  return (
    <>
      <PageHero
        pageKey="advantages"
        number="03"
        eyebrowEn="Advantages"
        eyebrowRu="Преимущества"
        titleEn="Our"
        titleRu="Наши"
        accentEn="advantages"
        accentRu="преимущества"
        descriptionEn="Why it is calmer to launch and run aluminum series with us."
        descriptionRu="Почему с нами спокойнее запускать и вести серии алюминиевых деталей."
      />
      <WhyChooseUs showHeading={false} />
      <HomeCTA />
    </>
  );
}
