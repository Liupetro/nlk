import type { Metadata } from "next";
import { brand } from "@/lib/content";
import { canonicalMeta } from "@/lib/site";
import { PageHero } from "@/components/motion/PageHero";
import { Industries } from "@/components/sections/Industries";
import { ProductExamples } from "@/components/sections/ProductExamples";
import { HomeCTA } from "@/components/sections/HomeCTA";

export const metadata: Metadata = {
  title: "Продукция",
  description: `Алюминиевые отливки под давлением ${brand.name}: промышленные, машиностроительные, электронные и другие детали. Серии от 200 шт.`,
  ...canonicalMeta("/products"),
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        pageKey="products"
        number="02"
        eyebrowEn="Products"
        eyebrowRu="Продукция"
        titleEn="Products"
        titleRu="Продукция"
        descriptionEn="We manufacture aluminum high-pressure die castings for series from 200 pcs. Industrial, machinery, electronics, and other precision parts."
        descriptionRu="Производим алюминиевые отливки под давлением для серий от 200 шт. Работаем с промышленными, машиностроительными, электронными и другими деталями."
      />
      <Industries showHeading />
      <ProductExamples showHeading showDiscussCta />
      <HomeCTA />
    </>
  );
}
