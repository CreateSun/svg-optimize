import React from "react";
import { Metadata } from "next";
import { HomePage } from "./components/home";
import { EnglishArticle, englishFaqs } from "./components/EnglishArticle";

const title = "SVG Optimize — Free Local SVG Optimizer for Browsers";
const description = "Use SVG Optimize to reduce SVG file size with adjustable settings and previews; your files stay in the browser and are not uploaded.";

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://svg-optimize.com",
    languages: {
      en: "https://svg-optimize.com/",
      "zh-CN": "https://svg-optimize.com/zh",
      "x-default": "https://svg-optimize.com/",
    },
  },
  openGraph: {
    title,
    description,
    images: [{ url: "https://svg-optimize.com/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "SVG Optimize",
        url: "https://svg-optimize.com/",
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
        mainEntity: englishFaqs.map(({ question, answer }) => ({
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
      <HomePage article={<EnglishArticle />} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
