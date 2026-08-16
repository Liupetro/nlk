"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  /** Header is compact; footer can be slightly larger */
  size?: "header" | "footer";
  className?: string;
};

/**
 * Primary brand lockup: NLK mark + «Невская Литейная Компания»
 * Transparent PNG — no black plate; shows site charcoal/background through.
 */
export function BrandLogo({ size = "header", className }: Props) {
  const isHeader = size === "header";

  return (
    <Link
      href="/"
      className={cn(
        "group relative inline-flex shrink-0 items-center",
        className,
      )}
      aria-label="НЛК — Невская Литейная Компания"
    >
      <Image
        src="/brand/lockups/lockup-original-v2-trim.png"
        alt="НЛК — Невская Литейная Компания"
        width={808}
        height={420}
        priority={isHeader}
        className={cn(
          "w-auto object-contain object-left",
          isHeader ? "h-10 sm:h-11 lg:h-12" : "h-12 sm:h-14",
        )}
      />
    </Link>
  );
}
