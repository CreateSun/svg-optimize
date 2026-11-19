"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function DocumentHtml({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lang = pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : "en";

  return <html lang={lang}>{children}</html>;
}
