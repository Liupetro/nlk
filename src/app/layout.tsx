import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { brand } from "@/lib/content";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aldetali.com"),
  title: {
    default: `${brand.name} | ${brand.subtitle}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  keywords: [
    "НЛК",
    "Невская Литейная Компания",
    "литьё под давлением",
    "литьё алюминия",
    "алюминиевое литьё",
    "aluminum die casting",
    "HPDC",
    "пресс-форма",
    "оснастка",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.description,
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["en_US"],
    url: "https://www.aldetali.com",
    siteName: brand.legalName,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <LanguageProvider>{children}</LanguageProvider>
        <YandexMetrika />
      </body>
    </html>
  );
}
