import type { Metadata } from "next";
import { brand } from "@/lib/content";
import { PageHero } from "@/components/motion/PageHero";
import { PrivacyPolicy } from "@/components/sections/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных",
  description: `Политика в отношении обработки персональных данных ${brand.legalName}. Оператор: Андрей Скорняну. Сайт https://www.aldetali.com.`,
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        pageKey="privacy"
        number="07"
        eyebrowEn="Documents"
        eyebrowRu="Документы"
        titleEn="Personal data"
        titleRu="Политика в отношении"
        accentEn="processing policy"
        accentRu="обработки персональных данных"
        descriptionEn="How we process personal data submitted via website forms, in accordance with Federal Law No. 152-FZ."
        descriptionRu="Порядок обработки персональных данных, оставляемых через формы на сайте, в соответствии с 152-ФЗ."
        compact
      />
      <PrivacyPolicy />
    </>
  );
}
