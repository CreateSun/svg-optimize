import type { Metadata } from "next";
import { HomePage } from "../components/home";
import {
  CompressorArticle,
  compressorFaqs,
} from "../components/CompressorArticle";

const title = "SVG Compressor — Batch SVG Files in the Browser";
const description =
  "Compress several SVG files in your browser, compare each result, and download them one by one. Processing stays on your device and files are not uploaded.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://svg-optimize.com/svg-compressor",
  },
  openGraph: {
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SvgCompressorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "SVG Compressor",
        url: "https://svg-optimize.com/svg-compressor",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: 0,
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: compressorFaqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <HomePage
        heading="SVG Compressor"
        lede="Run an svg compressor on several files at once, then compare the size of each result before you download it."
        article={<CompressorArticle />}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
