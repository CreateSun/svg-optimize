"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState, useTransition } from "react";

type Template = {
  id: string;
  name: string;
  label: string;
  description: string;
  svg: string;
};

type ParsedSvgState = {
  error: string;
  serialized: string;
  nodeCount: number;
  viewBox: string;
  width: string;
  height: string;
  title: string;
};

const templates: Template[] = [
  {
    id: "aurora-badge",
    name: "Aurora Badge",
    label: "Gradient emblem",
    description: "Soft gradients, rounded geometry, and layered highlights.",
    svg: `<svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="auroraGradient" x1="48" y1="44" x2="260" y2="278" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF6B2C"/>
      <stop offset="0.45" stop-color="#FFB347"/>
      <stop offset="1" stop-color="#F6F7FB"/>
    </linearGradient>
    <radialGradient id="auroraGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(228 80) rotate(131.82) scale(187.848)">
      <stop stop-color="#FFF4D6" stop-opacity="0.96"/>
      <stop offset="1" stop-color="#FFF4D6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="320" height="320" rx="72" fill="#0D141A"/>
  <rect x="26" y="26" width="268" height="268" rx="54" fill="url(#auroraGradient)"/>
  <rect x="38" y="38" width="244" height="244" rx="44" fill="url(#auroraGlow)"/>
  <path d="M86 172C86 129.026 120.026 95 163 95H198C216.225 95 231 109.775 231 128V193C231 228.346 202.346 257 167 257C122.265 257 86 220.735 86 176V172Z" fill="#0D141A"/>
  <path d="M126 166.5C126 145.237 143.237 128 164.5 128H176.5C187.822 128 197 137.178 197 148.5V181.5C197 203.315 179.315 221 157.5 221C140.103 221 126 206.897 126 189.5V166.5Z" fill="#FFF8E7"/>
  <circle cx="109" cy="107" r="23" fill="#FFF4D6"/>
  <circle cx="219" cy="89" r="12" fill="#FFF4D6" fill-opacity="0.72"/>
</svg>`,
  },
  {
    id: "signal-waves",
    name: "Signal Waves",
    label: "Rhythmic motion",
    description: "Poster-like curves with strong contrast and a clear focal mark.",
    svg: `<svg width="420" height="280" viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="420" height="280" rx="36" fill="#F4EEE3"/>
  <path d="M0 188C42 147.333 84 127 126 127C168 127 210 180.667 252 180.667C294 180.667 336 117 378 117C394 117 408 120.333 420 127" stroke="#0E1116" stroke-width="18" stroke-linecap="round"/>
  <path d="M0 222C35 199.333 70 188 105 188C140 188 175 220.667 210 220.667C245 220.667 280 169.333 315 169.333C350 169.333 385 188.667 420 227" stroke="#0E1116" stroke-width="12" stroke-linecap="round" opacity="0.54"/>
  <path d="M124 63H296" stroke="#0E1116" stroke-width="16" stroke-linecap="round"/>
  <circle cx="210" cy="63" r="36" fill="#FF6B2C"/>
  <circle cx="210" cy="63" r="13" fill="#F4EEE3"/>
  <rect x="49" y="45" width="66" height="66" rx="22" fill="#0E1116"/>
  <rect x="305" y="169" width="76" height="76" rx="28" fill="#FFC857"/>
</svg>`,
  },
  {
    id: "grid-orbit",
    name: "Grid Orbit",
    label: "Data utility",
    description: "Structured grid with an orbital accent, suitable for UI icons and hero art.",
    svg: `<svg width="360" height="360" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="360" height="360" rx="40" fill="#F8F6F0"/>
  <path d="M64 91H296" stroke="#CBD3E1" stroke-width="2"/>
  <path d="M64 180H296" stroke="#CBD3E1" stroke-width="2"/>
  <path d="M64 269H296" stroke="#CBD3E1" stroke-width="2"/>
  <path d="M91 64V296" stroke="#CBD3E1" stroke-width="2"/>
  <path d="M180 64V296" stroke="#CBD3E1" stroke-width="2"/>
  <path d="M269 64V296" stroke="#CBD3E1" stroke-width="2"/>
  <rect x="108" y="108" width="144" height="144" rx="34" fill="#11151C"/>
  <path d="M144 178H217" stroke="#F8F6F0" stroke-width="16" stroke-linecap="round"/>
  <path d="M180 142V215" stroke="#F8F6F0" stroke-width="16" stroke-linecap="round"/>
  <circle cx="180" cy="180" r="116" stroke="#FF6B2C" stroke-width="10" stroke-dasharray="18 24"/>
</svg>`,
  },
];

const starterSvg = templates[0].svg;

const canvasThemes = [
  { id: "paper", label: "Paper", className: "bg-[#f8f5ec]" },
  {
    id: "grid",
    label: "Grid",
    className:
      "bg-[linear-gradient(rgba(17,21,28,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(17,21,28,0.08)_1px,transparent_1px)] [background-size:24px_24px]",
  },
  { id: "ink", label: "Ink", className: "bg-[#0f1419]" },
];

const emptyParsedState: ParsedSvgState = {
  error: "",
  serialized: "",
  nodeCount: 0,
  viewBox: "Not set",
  width: "Auto",
  height: "Auto",
  title: "",
};

function parseSvgMarkup(source: string): ParsedSvgState {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(source, "image/svg+xml");
  const parserError = documentNode.querySelector("parsererror");
  const root = documentNode.documentElement;

  if (parserError || root.tagName.toLowerCase() !== "svg") {
    return {
      error: parserError?.textContent?.trim() || "SVG markup is invalid.",
      serialized: "",
      nodeCount: 0,
      viewBox: "",
      width: "",
      height: "",
      title: "",
    };
  }

  const serializer = new XMLSerializer();
  return {
    error: "",
    serialized: serializer.serializeToString(root),
    nodeCount: root.querySelectorAll("*").length + 1,
    viewBox: root.getAttribute("viewBox") || "Not set",
    width: root.getAttribute("width") || "Auto",
    height: root.getAttribute("height") || "Auto",
    title: documentNode.querySelector("title")?.textContent?.trim() || "",
  };
}

function prettyPrintSvg(source: string) {
  const parsed = parseSvgMarkup(source);
  if (parsed.error) {
    return source;
  }

  const withBreaks = parsed.serialized
    .replace(/></g, ">\n<")
    .replace(/(>)(<)(\/*)/g, "$1\n$2$3");

  const lines = withBreaks.split("\n");
  let indent = 0;

  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^<\//.test(line)) {
        indent = Math.max(indent - 1, 0);
      }

      const formatted = `${"  ".repeat(indent)}${line}`;

      if (/^<[^!?/][^>]*[^/]?>$/.test(line) && !/^<svg[^>]*>.*<\/svg>$/.test(line)) {
        indent += 1;
      }

      if (/^<svg[^>]*>$/.test(line)) {
        indent += 1;
      }

      return formatted;
    })
    .join("\n");
}

function minifySvg(source: string) {
  const parsed = parseSvgMarkup(source);
  if (parsed.error) {
    return source;
  }

  return parsed.serialized
    .replace(/>\s+</g, "><")
    .replace(/\n/g, "")
    .trim();
}

function updateSvgRootAttribute(source: string, attribute: string, value: string) {
  const parsed = parseSvgMarkup(source);
  if (parsed.error) {
    return source;
  }

  const documentNode = new DOMParser().parseFromString(parsed.serialized, "image/svg+xml");
  const root = documentNode.documentElement;

  if (value.trim()) {
    root.setAttribute(attribute, value.trim());
  } else {
    root.removeAttribute(attribute);
  }

  return new XMLSerializer().serializeToString(root);
}

function updateSvgTitle(source: string, value: string) {
  const parsed = parseSvgMarkup(source);
  if (parsed.error) {
    return source;
  }

  const documentNode = new DOMParser().parseFromString(parsed.serialized, "image/svg+xml");
  const root = documentNode.documentElement;
  const existing = documentNode.querySelector("title");

  if (!value.trim()) {
    existing?.remove();
    return new XMLSerializer().serializeToString(root);
  }

  if (existing) {
    existing.textContent = value.trim();
  } else {
    const titleNode = documentNode.createElementNS("http://www.w3.org/2000/svg", "title");
    titleNode.textContent = value.trim();
    root.prepend(titleNode);
  }

  return new XMLSerializer().serializeToString(root);
}

function toDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function bytesLabel(content: string) {
  const size = new Blob([content]).size;
  if (size < 1024) {
    return `${size} B`;
  }

  return `${(size / 1024).toFixed(2)} KB`;
}

function ActionButton({
  children,
  onClick,
  variant = "secondary",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b2c] disabled:cursor-not-allowed disabled:opacity-45",
        variant === "primary"
          ? "bg-[#11151c] text-[#fff7ea] shadow-[0_16px_30px_rgba(17,21,28,0.18)] hover:-translate-y-0.5 hover:bg-[#1c232d]"
          : "border border-[#d8d2c7] bg-white/85 text-[#18202a] hover:-translate-y-0.5 hover:border-[#11151c]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_12px_30px_rgba(17,21,28,0.07)] backdrop-blur">
      <div className="text-[11px] uppercase tracking-[0.24em] text-[#6b7280]">{label}</div>
      <div className="mt-2 font-[family:var(--font-svg-edit-display)] text-lg font-semibold text-[#11151c]">
        {value}
      </div>
    </div>
  );
}

export function SvgEditWorkspace() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [svgSource, setSvgSource] = useState(starterSvg);
  const [canvasTheme, setCanvasTheme] = useState(canvasThemes[0].id);
  const [zoom, setZoom] = useState(96);
  const [status, setStatus] = useState("Paste SVG, pick a template, or load a local file.");
  const [isClient, setIsClient] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const deferredSource = useDeferredValue(svgSource);
  const parsed = isClient ? parseSvgMarkup(deferredSource) : emptyParsedState;
  const selectedTheme =
    canvasThemes.find((theme) => theme.id === canvasTheme) || canvasThemes[0];

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!parsed.error) {
          const blob = new Blob([parsed.serialized], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = "svg-edit-export.svg";
          anchor.click();
          URL.revokeObjectURL(url);
          setStatus("SVG downloaded to your device.");
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [parsed.error, parsed.serialized]);

  const previewSrc = parsed.error ? "" : toDataUri(parsed.serialized);

  function handleTemplatePick(template: Template) {
    startTransition(() => {
      setSvgSource(template.svg);
      setStatus(`Template loaded: ${template.name}.`);
    });
  }

  function handleCopy() {
    const payload = parsed.error ? svgSource : parsed.serialized;
    navigator.clipboard.writeText(payload).then(
      () => setStatus("SVG markup copied."),
      () => setStatus("Copy failed in this browser."),
    );
  }

  function handleDownload() {
    if (parsed.error) {
      setStatus("Fix the SVG error before downloading.");
      return;
    }

    const blob = new Blob([parsed.serialized], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "svg-edit-export.svg";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("SVG downloaded to your device.");
  }

  function handleReset() {
    startTransition(() => {
      setSvgSource(starterSvg);
      setStatus("Editor reset to the starter composition.");
    });
  }

  function handleUpload(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
      setStatus("Only SVG files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSvgSource(String(reader.result || ""));
      setStatus(`Loaded ${file.name}.`);
    };
    reader.readAsText(file);
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,214,153,0.72),_transparent_28%),radial-gradient(circle_at_88%_12%,_rgba(255,107,44,0.18),_transparent_20%),linear-gradient(180deg,_#fcfaf5_0%,_#efe8dc_100%)] text-[#11151c]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/70 bg-white/55 p-4 shadow-[0_22px_70px_rgba(17,21,28,0.09)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#e2dacb] bg-white/70 px-3 py-2 text-xs uppercase tracking-[0.28em] text-[#556070]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b2c]" />
                Local-only SVG editor
              </div>
              <h1 className="font-[family:var(--font-svg-edit-display)] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-[#11151c] sm:text-5xl lg:text-6xl">
                Edit SVG like a layout tool, ship it like code.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#45505f] sm:text-lg">
                Import a file, refine the markup, tune root attributes, and inspect the live output on a responsive canvas.
                Everything stays in your browser.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:w-[480px]">
              <MetricCard label="Document size" value={bytesLabel(parsed.error ? svgSource : parsed.serialized || svgSource)} />
              <MetricCard label="Node count" value={String(parsed.nodeCount || 0)} />
              <MetricCard label="Viewport" value={parsed.viewBox} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ActionButton variant="primary" onClick={() => fileInputRef.current?.click()}>
              Upload SVG
            </ActionButton>
            <ActionButton onClick={handleCopy}>Copy markup</ActionButton>
            <ActionButton onClick={handleDownload}>Download</ActionButton>
            <ActionButton onClick={handleReset}>Reset</ActionButton>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-transparent px-4 text-sm font-semibold text-[#4b5563] transition hover:text-[#11151c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b2c]"
            >
              Back to optimizer
            </Link>
            <span className="rounded-full border border-[#e5ddd0] bg-white/75 px-3 py-2 text-xs text-[#5a6472]">
              Shortcut: Ctrl/Cmd + S downloads the current SVG
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            className="hidden"
            onChange={(event) => handleUpload(event.target.files?.[0])}
          />
        </section>

        <section className="mt-5 grid flex-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <aside className="rounded-[30px] border border-white/70 bg-white/60 p-5 shadow-[0_18px_50px_rgba(17,21,28,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-[#6b7280]">Template rack</div>
                <h2 className="mt-2 font-[family:var(--font-svg-edit-display)] text-2xl font-semibold tracking-[-0.04em]">
                  Start with structure
                </h2>
              </div>
              <span className="rounded-full bg-[#11151c] px-3 py-1 text-xs font-semibold text-[#fff7ea]">
                {templates.length} presets
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplatePick(template)}
                  className="group block w-full rounded-[24px] border border-[#e4ddcf] bg-white/85 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#11151c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b2c]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-[family:var(--font-svg-edit-display)] text-xl font-semibold tracking-[-0.03em] text-[#11151c]">
                        {template.name}
                      </div>
                      <div className="mt-1 text-sm text-[#687282]">{template.label}</div>
                    </div>
                    <div className="rounded-full border border-[#ede7db] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#6b7280] transition group-hover:border-[#11151c] group-hover:text-[#11151c]">
                      Load
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#4b5563]">{template.description}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-dashed border-[#d9cfbd] bg-[#fcfaf6] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[#6b7280]">Notes</div>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                Paste complete SVG markup into the editor. Live preview uses an encoded image URL, so the rendered output stays isolated from the page.
              </p>
            </div>
          </aside>

          <section className="rounded-[30px] border border-white/75 bg-[#11151c] p-4 text-white shadow-[0_22px_70px_rgba(17,21,28,0.18)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-white/55">Editor</div>
                <h2 className="mt-2 font-[family:var(--font-svg-edit-display)] text-2xl font-semibold tracking-[-0.04em] text-[#fff7ea]">
                  Direct markup control
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <ActionButton onClick={() => setSvgSource(prettyPrintSvg(svgSource))}>Format</ActionButton>
                <ActionButton onClick={() => setSvgSource(minifySvg(svgSource))}>Minify</ActionButton>
                <ActionButton
                  onClick={() => {
                    startTransition(() => {
                      setSvgSource(`${svgSource}\n`);
                      setStatus("Ready for the next change.");
                    });
                  }}
                >
                  Add line
                </ActionButton>
              </div>
            </div>

            <div className="mt-4 rounded-[28px] border border-white/10 bg-[#161d26] p-3">
              <textarea
                value={svgSource}
                onChange={(event) => setSvgSource(event.target.value)}
                spellCheck={false}
                aria-label="SVG markup editor"
                className="min-h-[520px] w-full resize-none rounded-[22px] border border-white/8 bg-[#0f1419] p-4 font-[family:var(--font-svg-edit-mono)] text-[13px] leading-6 text-[#f7f5ef] outline-none transition placeholder:text-white/30 focus:border-[#ffb347] sm:text-sm"
                placeholder="<svg>...</svg>"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                {parsed.error ? "Parser detected an issue." : "Markup is valid."}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                Zoom {zoom}%
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                {isPending ? "Applying changes..." : status}
              </span>
            </div>
          </section>

          <aside className="rounded-[30px] border border-white/70 bg-white/60 p-5 shadow-[0_18px_50px_rgba(17,21,28,0.08)] backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.28em] text-[#6b7280]">Preview + inspector</div>
            <h2 className="mt-2 font-[family:var(--font-svg-edit-display)] text-2xl font-semibold tracking-[-0.04em] text-[#11151c]">
              Visual feedback
            </h2>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-[#364152]">Canvas theme</span>
                <div className="grid grid-cols-3 gap-2">
                  {canvasThemes.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setCanvasTheme(theme.id)}
                      className={[
                        "min-h-11 rounded-2xl border px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b2c]",
                        theme.id === canvasTheme
                          ? "border-[#11151c] bg-[#11151c] text-[#fff7ea]"
                          : "border-[#ddd5c8] bg-white/80 text-[#11151c] hover:border-[#11151c]",
                      ].join(" ")}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </label>

              <label className="grid gap-2">
                <span className="flex items-center justify-between text-sm font-medium text-[#364152]">
                  Zoom
                  <span className="font-[family:var(--font-svg-edit-mono)] text-xs text-[#6b7280]">{zoom}%</span>
                </span>
                <input
                  type="range"
                  min="40"
                  max="160"
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="accent-[#ff6b2c]"
                />
              </label>

              <div className={`relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[28px] border border-[#ddd5c8] p-6 ${selectedTheme.className}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.75),_transparent_58%)]" />
                {parsed.error ? (
                  <div className="relative rounded-[24px] border border-[#ffb4a8] bg-white/85 p-5 text-sm leading-6 text-[#8a3324] shadow-[0_16px_40px_rgba(138,51,36,0.08)]">
                    {parsed.error}
                  </div>
                ) : (
                  <Image
                    src={previewSrc}
                    alt="Live SVG preview"
                    width={640}
                    height={640}
                    unoptimized
                    className="relative max-h-full max-w-full object-contain drop-shadow-[0_26px_40px_rgba(17,21,28,0.18)] transition duration-200"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                )}
              </div>

              <div className="rounded-[26px] border border-[#ddd5c8] bg-[#fcfaf6] p-4">
                <div className="text-sm font-semibold text-[#11151c]">Root attributes</div>
                <div className="mt-4 grid gap-3">
                  <label className="grid gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#6b7280]">Width</span>
                    <input
                      type="text"
                      value={parsed.width === "Auto" ? "" : parsed.width}
                      onChange={(event) => setSvgSource(updateSvgRootAttribute(svgSource, "width", event.target.value))}
                      className="min-h-11 rounded-2xl border border-[#d8d2c7] bg-white px-4 text-sm outline-none transition focus:border-[#11151c]"
                      placeholder="320"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#6b7280]">Height</span>
                    <input
                      type="text"
                      value={parsed.height === "Auto" ? "" : parsed.height}
                      onChange={(event) => setSvgSource(updateSvgRootAttribute(svgSource, "height", event.target.value))}
                      className="min-h-11 rounded-2xl border border-[#d8d2c7] bg-white px-4 text-sm outline-none transition focus:border-[#11151c]"
                      placeholder="320"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#6b7280]">Title</span>
                    <input
                      type="text"
                      value={parsed.title}
                      onChange={(event) => setSvgSource(updateSvgTitle(svgSource, event.target.value))}
                      className="min-h-11 rounded-2xl border border-[#d8d2c7] bg-white px-4 text-sm outline-none transition focus:border-[#11151c]"
                      placeholder="Accessible title"
                    />
                  </label>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
