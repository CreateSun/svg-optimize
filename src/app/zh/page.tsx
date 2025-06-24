import { Metadata } from "next";
import { HomePage } from "../components/home";

export const metadata: Metadata = {
    title: "免费在线安全SVG压缩工具",
    description: "一个免费的在线SVG压缩工具，可以压缩您的SVG文件并使其更小， 全程数据不落地，保护您的数据安全，适合企业级使用。",
    icons: {
      icon: "/favicon.ico",
    },
    keywords: ["免费SVG压缩工具", "SVG无损压缩", "SVG代码压缩", "在线SVG压缩工具", "数据安全的SVG压缩工具", "企业级SVG压缩工具"],
    openGraph: {
      title: "免费在线安全SVG压缩工具",
      description: "一个免费的在线SVG压缩工具，可以压缩您的SVG文件并使其更小， 全程数据不落地，保护您的数据安全，适合企业级使用。",
      images: ["/favicon.ico"],
    },
  };

export default function Home() {
  return <HomePage />;
}