import Script from "next/script";
import "./globals.css";

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
