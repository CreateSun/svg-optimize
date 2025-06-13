import { useMemo } from "react";
import en from "./en.json";
import zh from "./zh.json";
import { usePathname } from "next/navigation";

// 为en/zh类型添加索引签名
interface Dict {
  [key: string]: string;
}

const enDict = en as unknown as Dict;
const zhDict = zh as unknown as Dict;

export function useI18n() {
  // 获取当前路径
  const pathname = usePathname();

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