import Script from "next/script";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
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
    <html lang={"en"}>
      <Script
        id="adsbygoogle"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2737057559362179"
        crossOrigin="anonymous"
      ></Script>
      <body>{children}</body>
      <Script src="/svgo-web.js"></Script>
    </html>
  );
}
