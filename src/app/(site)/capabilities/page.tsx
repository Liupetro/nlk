import type { Metadata } from "next";
import { brand } from "@/lib/content";
import { PageHero } from "@/components/motion/PageHero";
import { TechnicalCapabilities } from "@/components/sections/TechnicalCapabilities";
import { EquipmentCapabilities } from "@/components/sections/EquipmentCapabilities";
import { HomeCTA } from "@/components/sections/HomeCTA";

export const metadata: Metadata = {
  title: "Возможности",
  description: `Технические параметры производства ${brand.name}: литьё алюминия под давлением, оборудование, оснастка.`,
};

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        pageKey="capabilities"
        number="05"
        eyebrowEn="Capabilities"
        eyebrowRu="Возможности"
        titleEn="Capabilities"
        titleRu="Возможности"
        descriptionEn="Production technical parameters"
        descriptionRu="Технические параметры производства"
      />
      <TechnicalCapabilities />
      <EquipmentCapabilities />
      <HomeCTA />
    </>
  );
}
