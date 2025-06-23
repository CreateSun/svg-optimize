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
      <body>{children}</body>
      <Script src="/svgo-web.js"></Script>
    </html>
  );
}
