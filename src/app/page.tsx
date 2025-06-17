import React from "react";
import { Metadata } from "next";
import { HomePage } from "./components/home";

export const metadata: Metadata = {
  title: "Free Online Safe SVG Optimizer",
  description: "A free online safe SVG optimizer that can optimize your SVG files and make them smaller and faster.",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["Data safe SVG Optimizer", "Free Online Safe SVG Optimizer", "Free Online Safe SVG Optimizer", "Free Online Safe SVG Optimizer"],
  openGraph: {
    title: "Free Online Safe SVG Optimizer",
    description: "A free online safe SVG optimizer that can optimize your SVG files and make them smaller and faster.",
    images: ["/favicon.ico"],
  },
};

export default function Home() {
  return <HomePage />;
}
