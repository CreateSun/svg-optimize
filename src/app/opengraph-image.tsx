import { ImageResponse } from "next/og";

export const alt = "SVG Optimize — a free browser optimizer that keeps your files local";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * 全站默认的社交分享卡片。
 *
 * 之前所有页面的 og:image 都指向 /favicon.ico,分享到 X、LinkedIn、Slack 时
 * 显示不出卡片图。这里用 next/og 在构建时生成一张 1200×630 的固定卡片,
 * 不需要手工作图,也不用把二进制文件塞进仓库。
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#2563eb",
              color: "#fff",
              fontSize: 40,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            S
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#111827" }}>
            SVG Optimize
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            <span>Make SVG files smaller</span>
            <span>without uploading them</span>
          </div>
          <div style={{ fontSize: 32, color: "#6b7280", lineHeight: 1.4 }}>
            Every optimizer pass is a visible switch. Preview, then download.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#9ca3af",
          }}
        >
          <span>svg-optimize.com</span>
          <span>Free · Runs in your browser</span>
        </div>
      </div>
    ),
    size
  );
}
