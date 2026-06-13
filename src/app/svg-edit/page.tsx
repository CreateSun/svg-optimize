import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { SvgEditWorkspace } from "../components/SvgEditWorkspace";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-svg-edit-display",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-svg-edit-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "SVG Editor - Free Online SVG Code Editor with Live Preview",
  description:
    "Free online SVG editor with live preview, code formatting, root attribute controls, and local-only processing. Edit SVG markup safely in your browser.",
  keywords: [
    "SVG editor",
    "online SVG editor",
    "SVG code editor",
    "edit SVG online",
    "SVG live preview",
    "SVG markup editor",
    "free SVG editor",
  ],
  alternates: {
    canonical: "/svg-edit",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://svg-optimize.com/svg-edit",
    title: "SVG Editor - Free Online SVG Code Editor with Live Preview",
    description:
      "Edit SVG code online with live preview, formatting tools, and local-only processing.",
    siteName: "SVG Optimize",
    images: [
      {
        url: "/favicon.ico",
        width: 64,
        height: 64,
        alt: "SVG Optimize",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SVG Editor - Free Online SVG Code Editor with Live Preview",
    description:
      "Edit SVG code online with live preview, formatting tools, and local-only processing.",
    images: ["/favicon.ico"],
  },
};

export default function SvgEditPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SVG Editor",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    url: "https://svg-optimize.com/svg-edit",
    description:
      "Free online SVG editor with live preview, code formatting, and local-only processing.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Live SVG preview",
      "SVG code editing",
      "Format and minify SVG markup",
      "Root width and height controls",
      "Browser-only local processing",
    ],
  };

  return (
    <div className={`${displayFont.variable} ${monoFont.variable}`}>
      <Script
        id="svg-edit-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SvgEditWorkspace />
    </div>
  );
}
