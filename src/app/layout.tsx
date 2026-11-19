import Script from "next/script";
import "./globals.css";
import { Metadata } from "next";
import DocumentHtml from "./components/DocumentHtml";

export const metadata: Metadata = {
  metadataBase: new URL("https://svg-optimize.com"),
  other: {
    "baidu-site-verification": "codeva-YqdLRGZgt8",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocumentHtml>
      <head>
        <script
          defer
          src="https://www.pvuv.ai/f.js"
          data-site="j2f6ydCF"
          data-api="https://in.pvuv.ai"
        />
      </head>
      <Script
        id="adsbygoogle"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2737057559362179"
        crossOrigin="anonymous"
      ></Script>
      <body>{children}</body>
      <Script src="/svgo-web.js"></Script>
    </DocumentHtml>
  );
}
