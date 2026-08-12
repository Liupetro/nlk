"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CanvasFrameScrubber } from "@/components/ui/CanvasFrameScrubber";

export function Hero() {
  const t = useT();
  const { hero } = t;
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, reduceMotion ? 1 : 0.15]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduceMotion ? 1 : 0.25]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-black bg-hero-mesh bg-noise"
    >
      <div className="absolute inset-0 bg-grid-fade opacity-50 z-[2]" aria-hidden />

      {/* Interactive frame scrubber — original light global tint */}
      <motion.div style={{ opacity: sceneOpacity }} className="absolute inset-0 w-full h-full z-[1]">
        <CanvasFrameScrubber
          totalFrames={192}
          folderPath="/videos/frames"
          className="h-full w-full"
          overlayOpacity={0.35}
          blurAmount="blur-[0.5px]"
        />
      </motion.div>

      {/* Darken only the center column (~text width max-w-4xl), soft edges */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center px-4 sm:px-6"
        aria-hidden
      >
        <div
          className="w-full max-w-4xl"
          style={{
            height: "min(78vh, 700px)",
            background:
              "radial-gradient(ellipse 72% 68% at 50% 50%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.48) 38%, rgba(0,0,0,0.18) 62%, transparent 78%)",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden z-[2]" aria-hidden>
        <motion.div
          className="absolute -right-20 top-1/4 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[100px]"
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-16 bottom-1/4 h-[320px] w-[320px] rounded-full bg-zamak/10 blur-[90px]"
          animate={reduceMotion ? undefined : { opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Container className="relative z-10 pt-28 pb-20 lg:pt-32 lg:pb-24">
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="mx-auto flex w-full max-w-4xl flex-col items-center text-center"
        >
          <motion.p
            key={`eyebrow-${hero.eyebrow}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent-bright/90 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            key={`h1-${hero.headline}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 w-full text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-semibold tracking-tight leading-[1.05] text-white"
          >
            <span className="block text-gradient-metal text-balance">{hero.headline}</span>
            <span className="block mt-1 sm:mt-2 text-gradient-accent">{hero.headlineAccent}</span>
          </motion.h1>

          <motion.ul
            key={`bullets-${hero.bullets[0]}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-7 max-w-2xl space-y-2.5 text-left text-base sm:text-lg leading-relaxed text-white/85"
          >
            {hero.bullets.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                <span className="text-balance">{item}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="mt-9 flex items-center justify-center"
          >
            <Button
              href={hero.primaryCta.href}
              size="lg"
              variant="primary"
              icon={<ArrowUpRight className="h-5 w-5" />}
            >
              {hero.primaryCta.label}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-12 grid w-full max-w-lg grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {hero.floatingStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-3.5 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-sm font-medium text-accent-bright">{stat.unit}</span>
                  )}
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/45">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>

      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-charcoal to-transparent z-[2]"
        aria-hidden
      />
    </section>
  );
}
