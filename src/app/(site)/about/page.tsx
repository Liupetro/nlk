import type { Metadata } from "next";
import { brand } from "@/lib/content";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { TrustBar } from "@/components/sections/TrustBar";
import { HomeCTA } from "@/components/sections/HomeCTA";

export const metadata: Metadata = {
  title: "О компании",
  description: brand.description,
};

export default function AboutPage() {
  return (
    <>
      <ValueProposition showHeading asHero />
      <TrustBar />
      <HomeCTA />
    </>
  );
}
