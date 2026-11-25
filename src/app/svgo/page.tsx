import type { Metadata } from "next";
import Link from "next/link";
import {
  SvgoArticle,
  svgoFaqs,
} from "../components/SvgoArticle";

const title = "SVGO Online — What It Changes and How to Run It in a Browser";
const description =
  "SVGO online without installing anything: what the optimizer rewrites, where the browser version differs from the command line, and which plugins to leave off before you ship a file.";
const canonical = "https://svg-optimize.com/svgo";

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

export default function SvgoPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "SVGO Online",
        description,
        mainEntityOfPage: canonical,
        datePublished: "2026-11-19",
        dateModified: "2026-11-22",
      },
      {
        "@type": "FAQPage",
        mainEntity: svgoFaqs.map(({ question, answer }) => ({
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
          SVGO Online
        </h1>
        <p className="text-lg leading-7 text-gray-600">
          Run SVGO online without installing anything: the optimizer reads your
          files in the browser, you choose which plugins run, every result can
          be compared before download, and the files never leave your device.
        </p>
        <SvgoArticle />
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
              href="/svg-vs-png"
              className="text-blue-600 hover:text-gray-700"
            >
              SVG vs PNG
            </Link>
            <Link
              href="/svg-viewbox"
              className="text-blue-600 hover:text-gray-700"
            >
              viewBox
            </Link>
            <Link
              href="/svg-edit"
              className="text-blue-600 hover:text-gray-700"
            >
              SVG Editor
            </Link>
            <Link
              href="/svg-optimization"
              className="text-blue-600 hover:text-gray-700"
            >
              SVG Optimization
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
