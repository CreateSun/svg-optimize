import { useMemo } from "react";
import en from "./en.json";
import zh from "./zh.json";

// 为en/zh类型添加索引签名
interface Dict {
  [key: string]: string;
}

const enDict = en as Dict;
const zhDict = zh as Dict;

// Next.js 13+ usePathname hook（如未启用app router可用window.location.pathname）
let usePathname: (() => string) | undefined;
try {
  // 动态import防止非Next环境报错
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  usePathname = require("next/navigation").usePathname;
} catch {}

export function useI18n() {
  // 获取当前路径
  let pathname = "";
  if (usePathname) {
    pathname = usePathname();
  } else if (typeof window !== "undefined") {
    pathname = window.location.pathname;
  }

  // 判断语言
  const lang = pathname.startsWith("/zh") ? "zh" : "en";
  const dict = lang === "zh" ? zhDict : enDict;

  // t函数
  const t = useMemo(
    () => (key: string) => dict[key] ?? key,
    [dict]
  );

  return t;
} 