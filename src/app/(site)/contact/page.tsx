import type { Metadata } from "next";
import { brand } from "@/lib/content";
import { canonicalMeta } from "@/lib/site";
import { PageHero } from "@/components/motion/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { BitrixCrmForm } from "@/components/sections/BitrixCrmForm";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Связаться с ${brand.name}: расчёт оснастки и деталей, email, телефон, форма заявки.`,
  ...canonicalMeta("/contact"),
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        pageKey="contact"
        number="06"
        eyebrowEn="Contact"
        eyebrowRu="Контакты"
        titleEn="Ready to discuss"
        titleRu="Готовы обсудить"
        accentEn="your project?"
        accentRu="ваш проект?"
        descriptionEn="Send a drawing or 3D model — we will quote tooling and parts, propose technology, and confirm lead times."
        descriptionRu="Пришлите чертёж или 3D-модель — рассчитаем стоимость оснастки и детали, предложим технологию и сроки."
        compact
      />
      <FinalCTA showHeading={false} />
      <BitrixCrmForm />
    </>
  );
}

