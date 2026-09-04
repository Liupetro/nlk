import type { Metadata } from "next";
import { brand } from "@/lib/content";
import { canonicalMeta } from "@/lib/site";
import { PageHero } from "@/components/motion/PageHero";
import { Process } from "@/components/sections/Process";
import { ProjectEstimator } from "@/components/sections/ProjectEstimator";
import { HomeCTA } from "@/components/sections/HomeCTA";

export const metadata: Metadata = {
  title: "Процесс работы",
  description: `От заявки и заказа оснастки до серийного производства деталей — полный процесс ${brand.name}: анализ, расчёт, оснастка, литьё, контроль и отгрузка.`,
  ...canonicalMeta("/process"),
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        pageKey="process"
        number="04"
        eyebrowEn="Process"
        eyebrowRu="Процесс"
        titleEn="From tooling order"
        titleRu="От заказа оснастки"
        accentEn="to serial production"
        accentRu="до серийного производства"
        descriptionEn="Clear stages: inquiry and DFM, tooling manufacture, sample approval from the tooling maker, process setup and trial batch, serial production, then shipment and support."
        descriptionRu="Понятные этапы: заявка и DFM, изготовление оснастки, согласование пробных деталей от изготовителя, наладка режима и пробная партия, серийное производство, отгрузка и сопровождение."
      />
      <Process showHeading={false} />
      <ProjectEstimator />
      <HomeCTA />
    </>
  );
}
