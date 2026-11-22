import { Metadata } from "next";
import { HomePage } from "../components/home";
import { SvgOptimizeZhArticle, zhFaqs } from "../components/ZhArticle";

const title = "SVG 在线优化工具 — 浏览器本地压缩，无需上传";
const description =
  "免费的在线 SVG 优化工具：选择插件、实时预览、批量处理，文件在你的浏览器里处理，不会上传。附插件说明与常见问题。";
const canonical = "https://svg-optimize.com/zh";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
    languages: {
      en: "https://svg-optimize.com/",
      "zh-CN": "https://svg-optimize.com/zh",
      "x-default": "https://svg-optimize.com/",
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "SVG 在线优化",
    "SVG 压缩工具",
    "SVG 优化器",
    "SVGO 在线",
    "免费 SVG 压缩",
    "SVG 无损压缩",
    "浏览器本地 SVG 处理",
  ],
  openGraph: {
    title,
    description,
    locale: "zh_CN",
    images: ["https://svg-optimize.com/favicon.ico"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "SVG 在线优化工具",
        url: canonical,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        inLanguage: "zh-CN",
        offers: {
          "@type": "Offer",
          price: 0,
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: zhFaqs.map(({ question, answer }) => ({
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
        heading="SVG 在线优化工具"
        lede="在浏览器里优化 SVG：选择插件、实时预览、批量处理，文件不会上传。"
        article={<SvgOptimizeZhArticle />}
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
