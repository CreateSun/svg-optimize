import type { Metadata } from "next";
import Link from "next/link";
import {
  SvgVsPngArticle,
  svgVsPngFaqs,
} from "../components/SvgVsPngArticle";

const title = "SVG vs PNG: Which Image Format Should You Use";
const description =
  "SVG vs PNG compares vectors with pixels. Logos and icons can stay sharp as SVG, while photos and screenshots are usually better as PNG.";
const canonical = "https://svg-optimize.com/svg-vs-png";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    images: ["https://svg-optimize.com/favicon.ico"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SvgVsPngPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "SVG vs PNG",
        description,
        mainEntityOfPage: canonical,
        datePublished: "2026-11-19",
        dateModified: "2026-11-19",
      },
      {
        "@type": "FAQPage",
        mainEntity: svgVsPngFaqs.map(({ question, answer }) => ({
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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">
          SVG vs PNG
        </h1>
        <SvgVsPngArticle />
        <footer className="text-gray-400 text-xs text-center select-none py-4 pt-8">
          <div className="flex flex-wrap justify-center gap-8 py-4 text-sm">
            <Link
              href="/"
              className="text-blue-600 hover:text-gray-700"
            >
              Home
            </Link>
            <Link
              href="/what-is-svg"
              className="text-blue-600 hover:text-gray-700"
            >
              What Is SVG
            </Link>
            <Link
              href="/svg-viewbox"
              className="text-blue-600 hover:text-gray-700"
            >
              viewBox
            </Link>
            <Link
              href="/svgo"
              className="text-blue-600 hover:text-gray-700"
            >
              SVGO
            </Link>
            <Link
              href="/svg-edit"
              className="text-blue-600 hover:text-gray-700"
            >
              SVG Editor
            </Link>
            <Link
              href="/svg-compressor"
              className="text-blue-600 hover:text-gray-700"
            >
              SVG Compressor
            </Link>
            <Link
              href="/svg-nan-path"
              className="text-blue-600 hover:text-gray-700"
            >
              NaN in Paths
            </Link>
            <Link
              href="/privacy"
              className="text-blue-600 hover:text-gray-700"
            >
              Privacy
            </Link>
          </div>
        </footer>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
