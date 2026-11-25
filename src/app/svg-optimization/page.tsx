import type { Metadata } from "next";
import { HomePage } from "../components/home";
import {
  SvgOptimizationArticle,
  svgOptimizationFaqs,
} from "../components/SvgOptimizationArticle";

const title = "SVG Optimization: Why Your File Is Bigger Than It Needs To Be";
const description =
  "SVG optimization removes editor metadata, hidden layers and excess precision. Measured on real files: a Figma export lost 55%, a pre-minified library icon lost 0.8%.";
const canonical = "https://svg-optimize.com/svg-optimization";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    images: [{ url: "https://svg-optimize.com/opengraph-image", width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SvgOptimizationPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "SVG Optimization",
        url: canonical,
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
        mainEntity: svgOptimizationFaqs.map(({ question, answer }) => ({
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
        heading="SVG Optimization"
        lede="See what an optimization pass removes from your own file, how much smaller it gets, and which switches can change the drawing."
        article={<SvgOptimizationArticle />}
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
