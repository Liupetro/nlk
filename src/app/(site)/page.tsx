import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { HomeCTA } from "@/components/sections/HomeCTA";

/**
 * Home: hero + trust + about → products → advantages → contact.
 * Full process lives on /process; industries only inside /products.
 * Capabilities ("full cycle") is not on home — it duplicates advantages.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ValueProposition />
      <FeaturedProducts limit={8} />
      <WhyChooseUs />
      <HomeCTA />
    </>
  );
}
