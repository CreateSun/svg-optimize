import { execSync } from "node:child_process";

/**
 * 每一页真正会改变内容的源文件。
 * page.tsx 往往只是薄壳，正文在 components/*.tsx 里，所以两个都要看。
 */
const PAGE_SOURCES: Record<string, string[]> = {
  "/": ["src/app/page.tsx", "src/app/components/home.tsx", "src/app/components/EnglishArticle.tsx"],
  "/zh": ["src/app/zh/page.tsx", "src/app/components/home.tsx", "src/app/components/ZhArticle.tsx"],
  "/privacy": ["src/app/privacy/page.tsx"],
  "/svg-edit": ["src/app/svg-edit/page.tsx", "src/app/components/SvgEditWorkspace.tsx"],
  "/svg-compressor": [
    "src/app/svg-compressor/page.tsx",
    "src/app/components/CompressorArticle.tsx",
  ],
  "/what-is-svg": [
    "src/app/what-is-svg/page.tsx",
    "src/app/components/WhatIsSvgArticle.tsx",
  ],
  "/svg-vs-png": ["src/app/svg-vs-png/page.tsx", "src/app/components/SvgVsPngArticle.tsx"],
  "/svg-viewbox": [
    "src/app/svg-viewbox/page.tsx",
    "src/app/components/SvgViewBoxArticle.tsx",
  ],
  "/svgo": ["src/app/svgo/page.tsx", "src/app/components/SvgoArticle.tsx"],
  "/svg-nan-path": ["src/app/svg-nan-path/page.tsx", "src/app/components/NanArticle.tsx"],
};

/**
 * 读这些文件在 git 里的最后一次提交时间。
 *
 * 之前这里写的是 `lastModified: new Date()`，于是每次抓 sitemap 都返回「刚刚更新」。
 * Google 明确说过 lastmod 不可信时会忽略该字段,等于这个信号一直是废的。
 *
 * 构建环境没有 git(比如 CI 只传了源码快照)时回退到下面的常量,保证字段始终是
 * 一个稳定的历史日期,而不是「现在」。
 */
const FALLBACK: Record<string, string> = {
  "/": "2026-11-22",
  "/zh": "2026-11-22",
  "/privacy": "2025-06-20",
  "/svg-edit": "2026-06-13",
  "/svg-compressor": "2026-11-19",
  "/what-is-svg": "2026-11-22",
  "/svg-vs-png": "2026-11-22",
  "/svg-viewbox": "2026-11-22",
  "/svgo": "2026-11-22",
  "/svg-nan-path": "2026-11-22",
};

function lastModifiedFor(path: string): Date {
  const sources = PAGE_SOURCES[path];
  if (sources) {
    try {
      const out = execSync(`git log -1 --format=%cI -- ${sources.join(" ")}`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (out) return new Date(out);
    } catch {
      // 没有 git 或不是仓库，走下面的回退
    }
  }
  return new Date(`${FALLBACK[path] ?? "2026-11-22"}T00:00:00+08:00`);
}

type Entry = {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
};

const ENTRIES: Entry[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/zh", changeFrequency: "weekly", priority: 0.8 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/svg-edit", changeFrequency: "weekly", priority: 0.8 },
  { path: "/svg-compressor", changeFrequency: "weekly", priority: 0.8 },
  { path: "/what-is-svg", changeFrequency: "monthly", priority: 0.6 },
  { path: "/svg-vs-png", changeFrequency: "monthly", priority: 0.6 },
  { path: "/svg-viewbox", changeFrequency: "monthly", priority: 0.6 },
  { path: "/svgo", changeFrequency: "monthly", priority: 0.6 },
  { path: "/svg-nan-path", changeFrequency: "monthly", priority: 0.6 },
];

export default function Sitemap() {
  return ENTRIES.map(({ path, changeFrequency, priority }) => ({
    url: path === "/" ? "https://svg-optimize.com" : `https://svg-optimize.com${path}`,
    lastModified: lastModifiedFor(path),
    changeFrequency,
    priority,
  }));
}
