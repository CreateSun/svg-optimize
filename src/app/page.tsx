import React from "react";
import { Metadata } from "next";
import { HomePage } from "./components/home";

export const metadata: Metadata = {
  title: "SVG Optimizer - Free Online Safe SVG Optimizer use SVGO Online",
  description: "A free online safe SVG optimizer that can optimize your SVG files using SVGO Online and make them smaller and faster.",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["SVG Optimizer", "SVGO Online Optimizer",  "Data safe SVG Optimizer", "Free Online Safe SVG Optimizer", "Free Online Safe SVG Optimizer", "Free Online Safe SVG Optimizer"],
  openGraph: {
    title: "SVG Optimizer - Free Online Safe SVG Optimizer use SVGO Online",
    description: "A free online safe SVG optimizer that can optimize your SVG files using SVGO Online and make them smaller and faster.",
    images: ["/favicon.ico"],
  },
};

export default function Home() {
  return <HomePage />;
}
