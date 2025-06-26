"use client";
import React, { useState, useCallback, useEffect } from "react";
import UploadArea from "./UploadArea";
import ParamsPanel from "./ParamsPanel";
import PreviewTable from "./PreviewTable";
import ErrorTip from "./ErrorTip";
import { Introduction } from "./Introduction";
import { useI18n } from "../i18n/useI18n";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HowToUse from "./HowToUse";

// 与PreviewTable保持一致
interface SvgResult {
  id: string;
  filename: string;
  optimizeSvg: string;
  base64SVG: string;
  encodeSVG: string;
  optimizeRatio: string;
}

interface Param {
  id: string;
  name: string;
  name_en: string;
  active: boolean;
}

interface SvgFile {
  id: string;
  filename: string;
  content: string;
}

// svgo类型声明
interface WindowWithSvgo extends Window {
  svgo: unknown;
}
declare const window: WindowWithSvgo;

function isSVGFile(file: File) {
  return (
    file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")
  );
}

function encodeSVG(svg: string) {
  return (
    "data:image/svg+xml," +
    svg
      .replace(/"/g, "'")
      .replace(/%/g, "%25")
      .replace(/#/g, "%23")
      .replace(/{/g, "%7B")
      .replace(/}/g, "%7D")
      .replace(/</g, "%3C")
      .replace(/>/g, "%3E")
  );
}

function base64SVG(svg: string) {
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

function ratio(origin: string, optimized: string) {
  const r = Math.ceil((100 * origin.length) / 1024) / 100;
  const a = Math.ceil((100 * optimized.length) / 1024) / 100;
  const n =
    Math.round((1000 * (origin.length - optimized.length)) / origin.length) /
    10;
  return `${r}k → ${a}k ↓${n}%`;
}

export function HomePage() {
  const t = useI18n();
  const pathname = usePathname();
  const lang = pathname.startsWith("/zh") ? "zh" : "en";
  // 参数设置
  const [params, setParams] = useState<Param[]>([]);
  // SVG原始内容列表
  const [svgFiles, setSvgFiles] = useState<SvgFile[]>([]);
  // 优化结果
  const [results, setResults] = useState<SvgResult[]>([]);
  // 错误信息
  const [error, setError] = useState("");
  // 右侧悬浮参数面板
  const [showParams, setShowParams] = useState(false);
  // 侧边栏展开/收起
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 动态加载config.json初始化参数
  useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.plugins)) {
          setParams(
            data.plugins.map(
              (p: {
                id: string;
                name: string;
                name_en: string;
                active?: boolean;
              }) => ({
                id: p.id,
                name: p.name,
                name_en: p.name_en,
                active: !!p.active,
              })
            )
          );
        }
      })
      .catch((error) => {
        console.error(error);
        setError("load params failed");
      });
  }, []);

  // 优化SVG并更新结果
  const optimizeAll = useCallback((files: SvgFile[], params: Param[]) => {
    if (typeof window === "undefined" || !window.svgo) return;
    const svgo = window.svgo as (args: Record<string, unknown>) => {
      result: { data?: string };
    };
    const settings = {
      floatPrecision: 3,
      gzip: true,
      original: false,
      pretty: false,
      plugins: Object.fromEntries(params.map((p) => [p.id, p.active])),
    };
    const newResults: SvgResult[] = files.map((f) => {
      // 加载原始SVG
      svgo({ id: f.id, action: "load", data: f.content });
      // 优化
      const res = svgo({ id: f.id, action: "process", settings }).result;
      let optimized = res.data || f.content;
      optimized = optimized
        .replace("<style/>", "")
        .replace("<defs></defs>", "");
      return {
        id: f.id,
        filename: f.filename,
        optimizeSvg: optimized,
        base64SVG: base64SVG(optimized),
        encodeSVG: encodeSVG(optimized),
        optimizeRatio: ratio(f.content, optimized),
      };
    });
    setResults(newResults);
  }, []);

  // 监听svgFiles和params变化，自动优化
  useEffect(() => {
    if (
      svgFiles.length &&
      params.length &&
      typeof window !== "undefined" &&
      window.svgo
    ) {
      optimizeAll(svgFiles, params);
    } else if (!svgFiles.length) {
      setResults([]);
    }
  }, [svgFiles, params, optimizeAll]);

  // 粘贴事件监听
  // const uploadAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text") || "";
      if (/<svg[\w\W]*?>[\w\W]+<\/svg>/gi.test(text)) {
        const id = Date.now() + Math.random().toString(36).slice(2);
        setSvgFiles((files) => [
          { id, filename: `paste_${id}.svg`, content: text },
          ...files,
        ]);
      } else {
        setError(t("paste_not_svg"));
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // 处理文件上传/拖拽/粘贴
  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArr = Array.from(files);
    let hasError = false;
    fileArr.forEach((file) => {
      if (!isSVGFile(file)) {
        setError(`${file.name} is not a SVG file`);
        hasError = true;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const id = Date.now() + Math.random().toString(36).slice(2);
        setSvgFiles((files) => [
          { id, filename: file.name.replace(/\.svg$/i, ""), content },
          ...files,
        ]);
      };
      reader.readAsText(file);
    });
    if (!hasError && fileArr.length === 0) {
      setError("no SVG file selected");
    }
  }, []);

  // 参数变更
  const handleParamChange = useCallback((id: string, active: boolean) => {
    setParams((ps) => ps.map((p) => (p.id === id ? { ...p, active } : p)));
  }, []);

  // 参数重置
  const handleParamReset = useCallback(() => {
    setParams((ps) => ps.map((p) => ({ ...p, active: false })));
  }, []);

  // 结果操作
  const handleCopy = useCallback(
    (id: string, type: "optimize" | "base64" | "encode") => {
      const r = results.find((r) => r.id === id);
      if (!r) return;
      let text = "";
      if (type === "optimize") text = r.optimizeSvg;
      if (type === "base64") text = r.base64SVG;
      if (type === "encode") text = r.encodeSVG;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(
          () => setError("copied"),
          () => setError("copy failed")
        );
      } else {
        setError("browser not support clipboard");
      }
    },
    [results]
  );

  const handleDownload = useCallback(
    (id: string) => {
      const r = results.find((r) => r.id === id);
      if (!r) return;
      const blob = new Blob([r.optimizeSvg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = r.filename + ".svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [results]
  );

  const handleDelete = useCallback((id: string) => {
    setSvgFiles((files) => files.filter((f) => f.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 relative">
      {/* 桌面端flex布局 */}
      <div className="flex h-screen">
        {/* 侧边栏 */}
        <div
          className={`hidden md:flex h-screen flex-col bg-white border-r border-gray-200 shadow-xl transition-all duration-200 ${
            sidebarOpen ? "w-64" : "w-16"
          }`}
        >
          {/* 展开/收起按钮 */}
          <div className="flex items-center justify-end p-2 sticky top-0 bg-white z-20 border-b border-gray-100">
            <button
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? t("reset") : t("params")}
            >
              {sidebarOpen ? (
                <span className="text-xl">&lt;</span>
              ) : (
                <span className="text-xl">&gt;</span>
              )}
            </button>
          </div>
          {/* ParamsPanel 吸顶区与滚动区分离 */}
          <div
            className={`flex-1 overflow-y-auto transition-all duration-200 ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ParamsPanel
              params={params}
              onChange={handleParamChange}
              onReset={handleParamReset}
              t={t}
            />
          </div>
        </div>
        {/* 主面板 */}
        <main className="flex-1 flex flex-col pt-10 items-center h-screen  overflow-y-scroll ">
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-4xl bg-white/90 rounded-2xl shadow-xl p-4 flex flex-col gap-8 border border-gray-100">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 tracking-tight mb-2">
                  {t("title")}
                </h1>

                <div className="text-sm  border rounded-sm px-2 py-1 text-blue-600 mr-2">
                  <Link
                    href={`/${lang === "en" ? "zh" : ""}`}
                    className="hover:text-gray-700"
                  >
                    {"EN / 中"}
                  </Link>
                </div>
              </div>

              <p className="text-center text-gray-500 mb-4 text-base sm:text-lg">
                {t("description")}
              </p>

              <UploadArea onFiles={handleFiles} t={t} />
              <div className="flex-1 overflow-auto">
                {results.length > 0 && (
                  <PreviewTable
                    results={results}
                    onCopy={handleCopy}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    t={t}
                  />
                )}
                <HowToUse />
                <Introduction t={t} />
              </div>
            </div>
          </div>
          <footer className="text-gray-400 text-xs text-center select-none py-4 pt-8">
            <div className="flex justify-center gap-8 py-4 text-sm">
              <Link
                href={lang === "en" ? "/" : "/zh"}
                className="text-blue-600 hover:text-gray-700"
              >
                Home
              </Link>
              <Link
                href={lang === "en" ? "/privacy" : "/zh/privacy"}
                className="text-blue-600 hover:text-gray-700"
              >
                Privacy Policy
              </Link>
            </div>
            <div>
              &copy; {new Date().getFullYear()} - SVG Optimizer&nbsp;|&nbsp;Powered by SVG
              Optimizer
            </div>
          </footer>
        </main>
      </div>
      {/* 移动端底部弹出参数面板按钮 */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          className="bg-blue-600 text-white rounded-full shadow-lg px-4 py-2 text-lg font-semibold"
          onClick={() => setShowParams(true)}
        >
          {t("params")}
        </button>
      </div>
      {/* 移动端弹窗参数面板 */}
      {showParams && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-4 w-11/12 max-w-sm relative max-h-[80vh] overflow-y-auto flex flex-col gap-4 text-base">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowParams(false)}
            >
              ×
            </button>
            <ParamsPanel
              params={params}
              onChange={handleParamChange}
              onReset={handleParamReset}
              t={t}
            />
          </div>
        </div>
      )}
      <ErrorTip message={error} onClose={() => setError("")} t={t} />
    </div>
  );
}
