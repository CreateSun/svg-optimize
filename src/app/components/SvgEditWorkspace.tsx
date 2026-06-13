"use client";

import { autocompletion, type CompletionContext, snippetCompletion } from "@codemirror/autocomplete";
import { xml } from "@codemirror/lang-xml";
import { EditorSelection } from "@codemirror/state";
import { EditorView, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState, useTransition } from "react";
import { lucideIcons, type LucideIconItem } from "./svg-edit-lucide-icons";

type Template = {
  id: string;
  name: string;
  group: string;
  label: string;
  description: string;
  svg: string;
};

type ImportTab = "presets" | "lucide" | "iconfont" | "recent";

type ImportSource = "preset" | "lucide" | "iconfont" | "upload";

type ImportRecord = {
  id: string;
  name: string;
  source: ImportSource;
  sourceLabel: string;
  svg: string;
  previewSvg: string;
  importedAt: number;
};

type IconfontCandidate = {
  id: string;
  name: string;
  svg: string;
};

type ImportMeta = {
  name: string;
  source: ImportSource;
  sourceLabel: string;
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

type ExportThemeId = "paper" | "grid" | "ink";

type IconfontState = {
  items: IconfontCandidate[];
  message: string;
  status: "idle" | "loading" | "ready" | "error";
};

const RECENT_IMPORTS_KEY = "svg-edit-recent-imports";
const MAX_RECENT_IMPORTS = 12;

const templates: Template[] = [
  {
    id: "aurora-badge",
    name: "Aurora Badge",
    group: "Decorative",
    label: "Gradient emblem",
    description: "Soft gradients, rounded geometry, and layered highlights.",
    svg: `<svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="auroraGradient" x1="48" y1="44" x2="260" y2="278" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF6B2C" />
      <stop offset="0.45" stop-color="#FFB347" />
      <stop offset="1" stop-color="#F6F7FB" />
    </linearGradient>
    <radialGradient id="auroraGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(228 80) rotate(131.82) scale(187.848)">
      <stop stop-color="#FFF4D6" stop-opacity="0.96" />
      <stop offset="1" stop-color="#FFF4D6" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="320" height="320" rx="72" fill="#0D141A" />
  <rect x="26" y="26" width="268" height="268" rx="54" fill="url(#auroraGradient)" />
  <rect x="38" y="38" width="244" height="244" rx="44" fill="url(#auroraGlow)" />
  <path d="M86 172C86 129.026 120.026 95 163 95H198C216.225 95 231 109.775 231 128V193C231 228.346 202.346 257 167 257C122.265 257 86 220.735 86 176V172Z" fill="#0D141A" />
  <path d="M126 166.5C126 145.237 143.237 128 164.5 128H176.5C187.822 128 197 137.178 197 148.5V181.5C197 203.315 179.315 221 157.5 221C140.103 221 126 206.897 126 189.5V166.5Z" fill="#FFF8E7" />
  <circle cx="109" cy="107" r="23" fill="#FFF4D6" />
  <circle cx="219" cy="89" r="12" fill="#FFF4D6" fill-opacity="0.72" />
</svg>`,
  },
  {
    id: "signal-waves",
    name: "Signal Waves",
    group: "Interface",
    label: "Rhythmic motion",
    description: "Poster-like curves with strong contrast and a clear focal mark.",
    svg: `<svg width="420" height="280" viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="420" height="280" rx="36" fill="#F4EEE3" />
  <path d="M0 188C42 147.333 84 127 126 127C168 127 210 180.667 252 180.667C294 180.667 336 117 378 117C394 117 408 120.333 420 127" stroke="#0E1116" stroke-width="18" stroke-linecap="round" />
  <path d="M0 222C35 199.333 70 188 105 188C140 188 175 220.667 210 220.667C245 220.667 280 169.333 315 169.333C350 169.333 385 188.667 420 227" stroke="#0E1116" stroke-width="12" stroke-linecap="round" opacity="0.54" />
  <path d="M124 63H296" stroke="#0E1116" stroke-width="16" stroke-linecap="round" />
  <circle cx="210" cy="63" r="36" fill="#FF6B2C" />
  <circle cx="210" cy="63" r="13" fill="#F4EEE3" />
  <rect x="49" y="45" width="66" height="66" rx="22" fill="#0E1116" />
  <rect x="305" y="169" width="76" height="76" rx="28" fill="#FFC857" />
</svg>`,
  },
  {
    id: "grid-orbit",
    name: "Grid Orbit",
    group: "Data",
    label: "Data utility",
    description: "Structured grid with an orbital accent, suitable for UI icons and hero art.",
    svg: `<svg width="360" height="360" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="360" height="360" rx="40" fill="#F8F6F0" />
  <path d="M64 91H296" stroke="#CBD3E1" stroke-width="2" />
  <path d="M64 180H296" stroke="#CBD3E1" stroke-width="2" />
  <path d="M64 269H296" stroke="#CBD3E1" stroke-width="2" />
  <path d="M91 64V296" stroke="#CBD3E1" stroke-width="2" />
  <path d="M180 64V296" stroke="#CBD3E1" stroke-width="2" />
  <path d="M269 64V296" stroke="#CBD3E1" stroke-width="2" />
  <rect x="108" y="108" width="144" height="144" rx="34" fill="#11151C" />
  <path d="M144 178H217" stroke="#F8F6F0" stroke-width="16" stroke-linecap="round" />
  <path d="M180 142V215" stroke="#F8F6F0" stroke-width="16" stroke-linecap="round" />
  <circle cx="180" cy="180" r="116" stroke="#FF6B2C" stroke-width="10" stroke-dasharray="18 24" />
</svg>`,
  },
  {
    id: "pixel-pointer",
    name: "Pixel Pointer",
    group: "Interface",
    label: "Cursor marker",
    description: "Retro pointer badge for button groups, feature callouts, and empty states.",
    svg: `<svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="320" rx="52" fill="#FFF8EA" />
  <rect x="28" y="28" width="264" height="264" rx="34" fill="#121922" />
  <path d="M100 84V188H132V236H170V204H198L100 84Z" fill="#FFF8EA" />
  <path d="M132 188H154V220H148H132V188Z" fill="#FF7A1A" />
  <rect x="206" y="76" width="48" height="48" rx="16" fill="#FF7A1A" />
  <path d="M214 100H246" stroke="#FFF8EA" stroke-width="10" stroke-linecap="round" />
</svg>`,
  },
  {
    id: "route-chip",
    name: "Route Chip",
    group: "Navigation",
    label: "Directional map",
    description: "Compact route glyph with chips and nodes for navigation or logistics products.",
    svg: `<svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="320" rx="44" fill="#F4EFE4" />
  <path d="M82 222C82 168 118 146 150 146H198C220 146 236 132 236 106C236 83 219 68 196 68C173 68 156 83 156 106" stroke="#11151C" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="156" cy="106" r="22" fill="#FF6B2C" />
  <circle cx="236" cy="106" r="18" fill="#11151C" />
  <rect x="66" y="204" width="72" height="72" rx="24" fill="#11151C" />
  <path d="M162 222H242" stroke="#FFB347" stroke-width="14" stroke-linecap="round" stroke-dasharray="12 18" />
</svg>`,
  },
  {
    id: "mono-stack",
    name: "Mono Stack",
    group: "Data",
    label: "Layered panels",
    description: "Three stacked surfaces for dashboards, code tools, and file system views.",
    svg: `<svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="320" rx="48" fill="#10161E" />
  <rect x="62" y="68" width="196" height="54" rx="18" fill="#F7F3E8" />
  <rect x="48" y="132" width="224" height="54" rx="18" fill="#FFB347" />
  <rect x="62" y="196" width="196" height="54" rx="18" fill="#F7F3E8" />
  <path d="M86 95H162" stroke="#11151C" stroke-width="12" stroke-linecap="round" />
  <path d="M74 159H190" stroke="#11151C" stroke-width="12" stroke-linecap="round" />
  <path d="M86 223H146" stroke="#11151C" stroke-width="12" stroke-linecap="round" />
</svg>`,
  },
];

const starterSvg = templates[0].svg;

const importTabs: { id: ImportTab; label: string }[] = [
  { id: "presets", label: "Presets" },
  { id: "lucide", label: "Lucide" },
  { id: "iconfont", label: "iconfont" },
  { id: "recent", label: "Recent" },
];

const canvasThemes: { id: ExportThemeId; label: string; className: string }[] = [
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

const svgTagCompletions = [
  snippetCompletion("<svg>\n$0\n</svg>", {
    label: "svg",
    type: "keyword",
    info: "SVG root element",
  }),
  snippetCompletion("<g>$0</g>", {
    label: "g",
    type: "keyword",
    info: "Group related SVG nodes",
  }),
  snippetCompletion("<path>$0</path>", {
    label: "path",
    type: "keyword",
    info: "Freeform vector path",
  }),
  snippetCompletion("<rect>$0</rect>", {
    label: "rect",
    type: "keyword",
    info: "Rectangle shape",
  }),
  snippetCompletion("<circle>$0</circle>", {
    label: "circle",
    type: "keyword",
    info: "Circle shape",
  }),
  snippetCompletion("<ellipse>$0</ellipse>", {
    label: "ellipse",
    type: "keyword",
    info: "Ellipse shape",
  }),
  snippetCompletion("<line>$0</line>", {
    label: "line",
    type: "keyword",
    info: "Straight line segment",
  }),
  snippetCompletion("<polyline>$0</polyline>", {
    label: "polyline",
    type: "keyword",
    info: "Open multi-point line",
  }),
  snippetCompletion("<polygon>$0</polygon>", {
    label: "polygon",
    type: "keyword",
    info: "Closed multi-point polygon",
  }),
  snippetCompletion("<text>$0</text>", {
    label: "text",
    type: "keyword",
    info: "Text node",
  }),
  snippetCompletion("<tspan>$0</tspan>", {
    label: "tspan",
    type: "keyword",
    info: "Inline text span",
  }),
  snippetCompletion("<defs>\n$0\n</defs>", {
    label: "defs",
    type: "keyword",
    info: "Definitions container",
  }),
  snippetCompletion("<linearGradient>$0</linearGradient>", {
    label: "linearGradient",
    type: "keyword",
    info: "Linear gradient definition",
  }),
  snippetCompletion("<radialGradient>$0</radialGradient>", {
    label: "radialGradient",
    type: "keyword",
    info: "Radial gradient definition",
  }),
  snippetCompletion("<stop>$0</stop>", {
    label: "stop",
    type: "keyword",
    info: "Gradient stop",
  }),
  snippetCompletion("<clipPath>$0</clipPath>", {
    label: "clipPath",
    type: "keyword",
    info: "Clipping path container",
  }),
  snippetCompletion("<mask>$0</mask>", {
    label: "mask",
    type: "keyword",
    info: "Mask definition",
  }),
  snippetCompletion("<filter>$0</filter>", {
    label: "filter",
    type: "keyword",
    info: "Filter definition",
  }),
  snippetCompletion("<feGaussianBlur>$0</feGaussianBlur>", {
    label: "feGaussianBlur",
    type: "keyword",
    info: "Blur filter primitive",
  }),
  snippetCompletion("<symbol>$0</symbol>", {
    label: "symbol",
    type: "keyword",
    info: "Reusable symbol definition",
  }),
  snippetCompletion("<use>$0</use>", {
    label: "use",
    type: "keyword",
    info: "Reuse an existing node",
  }),
];

const svgAttributeCompletions = [
  "d",
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-dasharray",
  "opacity",
  "fill-opacity",
  "stroke-opacity",
  "width",
  "height",
  "viewBox",
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "points",
  "transform",
  "gradientUnits",
  "gradientTransform",
  "offset",
  "id",
  "href",
  "xmlns",
].map((attribute) =>
  snippetCompletion(`${attribute}="$0"`, {
    label: attribute,
    type: "property",
    info: `SVG attribute: ${attribute}`,
  }),
);

const svgEditorTheme = EditorView.theme({
  "&": {
    backgroundColor: "#18202a",
    color: "#f7f5ef",
    borderRadius: "22px",
    overflow: "hidden",
  },
  ".cm-editor": {
    minHeight: "620px",
  },
  ".cm-scroller": {
    minHeight: "620px",
    fontFamily: "var(--font-svg-edit-mono)",
    lineHeight: "1.75",
  },
  ".cm-content, .cm-gutter": {
    minHeight: "620px",
  },
  ".cm-content": {
    padding: "16px 0",
    caretColor: "#ffb347",
  },
  ".cm-line": {
    padding: "0 16px",
  },
  ".cm-gutters": {
    backgroundColor: "#111821",
    color: "#8a98a8",
    borderRight: "1px solid rgba(255,255,255,0.1)",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(255, 179, 71, 0.08)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(255, 179, 71, 0.12)",
    color: "#ffd8a1",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "rgba(255, 179, 71, 0.24)",
  },
  ".cm-tooltip.cm-tooltip-autocomplete": {
    border: "1px solid rgba(255,255,255,0.08)",
    backgroundColor: "#121922",
    color: "#f7f5ef",
  },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "rgba(255, 179, 71, 0.12)",
    color: "#fff7ea",
  },
});

function escapeAttributeValue(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function escapeTextValue(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function titleCaseKebab(value: string) {
  return value
    .replace(/^icon-/, "")
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function matchCatalogText(query: string, parts: string[]) {
  if (!query.trim()) {
    return true;
  }

  const normalized = query.trim().toLowerCase();
  return parts.some((part) => part.toLowerCase().includes(normalized));
}

function getMeaningfulChildren(node: Element) {
  return Array.from(node.childNodes).filter((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      return child.textContent?.trim();
    }

    return (
      child.nodeType === Node.ELEMENT_NODE ||
      child.nodeType === Node.CDATA_SECTION_NODE ||
      child.nodeType === Node.COMMENT_NODE
    );
  });
}

function serializeSvgNode(node: Node, multiline: boolean, depth = 0): string {
  const indent = multiline ? "  ".repeat(depth) : "";
  if (node.nodeType === Node.TEXT_NODE) {
    const content = escapeTextValue(node.textContent?.trim() || "");
    return multiline && content ? `${indent}${content}` : content;
  }

  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    const content = `<![CDATA[${node.textContent || ""}]]>`;
    return multiline ? `${indent}${content}` : content;
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    const content = `<!--${node.textContent || ""}-->`;
    return multiline ? `${indent}${content}` : content;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as Element;
  const attributes = Array.from(element.attributes)
    .map((attribute) => `${attribute.name}="${escapeAttributeValue(attribute.value)}"`)
    .join(" ");
  const openTag = attributes ? `<${element.tagName} ${attributes}` : `<${element.tagName}`;
  const children = getMeaningfulChildren(element);

  if (!children.length) {
    const content = `${openTag} />`;
    return multiline ? `${indent}${content}` : content;
  }

  const textOnly = children.every(
    (child) => child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE,
  );
  if (textOnly) {
    const content = children.map((child) => serializeSvgNode(child, false)).join("");
    const line = `${openTag}>${content}</${element.tagName}>`;
    return multiline ? `${indent}${line}` : line;
  }

  const separator = multiline ? "\n" : "";
  const content = children
    .map((child) => serializeSvgNode(child, multiline, depth + 1))
    .filter(Boolean)
    .join(separator);

  if (!multiline) {
    return `${openTag}>${content}</${element.tagName}>`;
  }

  return `${indent}${openTag}>\n${content}\n${indent}</${element.tagName}>`;
}

function serializeSvgRoot(root: Element, multiline: boolean) {
  return serializeSvgNode(root, multiline);
}

function formatSvgMarkup(source: string) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(source, "image/svg+xml");
  const parserError = documentNode.querySelector("parsererror");
  const root = documentNode.documentElement;

  if (parserError || root.tagName.toLowerCase() !== "svg") {
    return source;
  }

  return serializeSvgRoot(root, true);
}

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

  return {
    error: "",
    serialized: serializeSvgRoot(root, true),
    nodeCount: root.querySelectorAll("*").length + 1,
    viewBox: root.getAttribute("viewBox") || "Not set",
    width: root.getAttribute("width") || "Auto",
    height: root.getAttribute("height") || "Auto",
    title: documentNode.querySelector("title")?.textContent?.trim() || "",
  };
}

function normalizeImportedSvg(source: string) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(source, "image/svg+xml");
  const parserError = documentNode.querySelector("parsererror");
  const root = documentNode.documentElement;

  if (parserError || root.tagName.toLowerCase() !== "svg") {
    throw new Error("Imported content is not valid SVG.");
  }

  root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  root.removeAttribute("class");
  root.removeAttribute("aria-hidden");
  root.removeAttribute("focusable");
  root.querySelectorAll("*").forEach((element) => {
    element.removeAttribute("class");
    element.removeAttribute("aria-hidden");
    element.removeAttribute("focusable");
    element.removeAttribute("key");
  });

  return serializeSvgRoot(root, true);
}

function minifySvg(source: string) {
  const parsed = parseSvgMarkup(source);
  if (parsed.error) {
    return source;
  }

  const documentNode = new DOMParser().parseFromString(parsed.serialized, "image/svg+xml");
  return serializeSvgRoot(documentNode.documentElement, false);
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

  return serializeSvgRoot(root, true);
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
    return serializeSvgRoot(root, true);
  }

  if (existing) {
    existing.textContent = value.trim();
  } else {
    const titleNode = documentNode.createElementNS("http://www.w3.org/2000/svg", "title");
    titleNode.textContent = value.trim();
    root.prepend(titleNode);
  }

  return serializeSvgRoot(root, true);
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

function parseNumericValue(value: string) {
  const match = value.match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

function getSvgPixelSize(parsed: ParsedSvgState) {
  const width = parseNumericValue(parsed.width);
  const height = parseNumericValue(parsed.height);

  if (width > 0 && height > 0) {
    return { width, height };
  }

  const [, , viewBoxWidth, viewBoxHeight] = parsed.viewBox.split(/\s+/).map(Number);
  if (viewBoxWidth > 0 && viewBoxHeight > 0) {
    return { width: viewBoxWidth, height: viewBoxHeight };
  }

  return { width: 512, height: 512 };
}

async function loadSvgImage(svg: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Unable to render SVG as an image."));
      img.src = url;
    });

    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function paintPreviewBackground(
  context: CanvasRenderingContext2D,
  themeId: ExportThemeId,
  width: number,
  height: number,
) {
  if (themeId === "ink") {
    context.fillStyle = "#0f1419";
    context.fillRect(0, 0, width, height);
    return;
  }

  context.fillStyle = "#f8f5ec";
  context.fillRect(0, 0, width, height);

  if (themeId === "grid") {
    context.strokeStyle = "rgba(17, 21, 28, 0.08)";
    context.lineWidth = 1;

    for (let x = 0; x <= width; x += 24) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += 24) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }
}

async function exportSvgImage({
  svg,
  parsed,
  background,
  fileName,
  zoom = 100,
  scale = 2,
}: {
  svg: string;
  parsed: ParsedSvgState;
  background: ExportThemeId | null;
  fileName: string;
  zoom?: number;
  scale?: number;
}) {
  const image = await loadSvgImage(svg);
  const baseSize = getSvgPixelSize(parsed);
  const padding = background ? Math.max(48, Math.round(Math.max(baseSize.width, baseSize.height) * 0.18)) : 0;
  const logicalWidth = baseSize.width + padding * 2;
  const logicalHeight = baseSize.height + padding * 2;
  const canvas = document.createElement("canvas");

  canvas.width = Math.max(1, Math.round(logicalWidth * scale));
  canvas.height = Math.max(1, Math.round(logicalHeight * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas export is not supported in this browser.");
  }

  context.scale(scale, scale);

  if (background) {
    paintPreviewBackground(context, background, logicalWidth, logicalHeight);
  } else {
    context.clearRect(0, 0, logicalWidth, logicalHeight);
  }

  const zoomRatio = background ? zoom / 100 : 1;
  const drawWidth = baseSize.width * zoomRatio;
  const drawHeight = baseSize.height * zoomRatio;
  const x = (logicalWidth - drawWidth) / 2;
  const y = (logicalHeight - drawHeight) / 2;
  context.drawImage(image, x, y, drawWidth, drawHeight);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) {
    throw new Error("Failed to generate the PNG export.");
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function parseIconfontScript(source: string) {
  const match = source.match(/<svg[^>]*>[\s\S]*?<\/svg>/i);
  if (!match) {
    throw new Error("No icon sprite was found in this iconfont link.");
  }

  const parser = new DOMParser();
  const documentNode = parser.parseFromString(match[0], "image/svg+xml");
  const parserError = documentNode.querySelector("parsererror");
  const spriteRoot = documentNode.documentElement;

  if (parserError || spriteRoot.tagName.toLowerCase() !== "svg") {
    throw new Error("The iconfont payload could not be parsed as SVG.");
  }

  const serializer = new XMLSerializer();
  const candidates = Array.from(spriteRoot.querySelectorAll("symbol")).map((symbol, index) => {
    const symbolId = symbol.getAttribute("id") || `iconfont-${index + 1}`;
    const svgDocument = document.implementation.createDocument("http://www.w3.org/2000/svg", "svg", null);
    const root = svgDocument.documentElement;

    root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    root.setAttribute("fill", "currentColor");

    const viewBox = symbol.getAttribute("viewBox");
    if (viewBox) {
      root.setAttribute("viewBox", viewBox);
    } else {
      root.setAttribute("viewBox", "0 0 1024 1024");
    }

    Array.from(symbol.childNodes).forEach((childNode) => {
      root.appendChild(svgDocument.importNode(childNode, true));
    });

    return {
      id: symbolId,
      name: titleCaseKebab(symbolId),
      svg: serializer.serializeToString(root),
    };
  });

  if (!candidates.length) {
    throw new Error("This iconfont link does not expose any importable symbol icons.");
  }

  return candidates;
}

function svgCompletionSource(context: CompletionContext) {
  const line = context.state.doc.lineAt(context.pos);
  const beforeLine = line.text.slice(0, context.pos - line.from);
  const tagContext = beforeLine.match(/<\/?([\w:-]*)$/);

  if (tagContext) {
    return {
      from: context.pos - tagContext[1].length,
      options: svgTagCompletions,
      validFor: /^[\w:-]*$/,
    };
  }

  const blankTagContext = beforeLine.match(/^\s*([\w:-]*)$/);
  if (blankTagContext) {
    return {
      from: context.pos - blankTagContext[1].length,
      options: svgTagCompletions,
      validFor: /^[\w:-]*$/,
    };
  }

  const attributeContext = beforeLine.match(/<[\w:-]+\s+[^<>]*?([\w:-]*)$/);
  if (attributeContext) {
    return {
      from: context.pos - attributeContext[1].length,
      options: svgAttributeCompletions,
      validFor: /^[\w:-]*$/,
    };
  }

  return null;
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

function ImportCard({
  title,
  subtitle,
  previewSvg,
  tone = "light",
  actionLabel,
  onAction,
  meta,
}: {
  title: string;
  subtitle: string;
  previewSvg: string;
  tone?: "light" | "dark";
  actionLabel: string;
  onAction: () => void;
  meta?: string;
}) {
  return (
    <button
      type="button"
      onClick={onAction}
      className={[
        "group rounded-[24px] border p-4 text-left transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b2c]",
        tone === "dark"
          ? "border-white/10 bg-[#121922] text-white hover:border-[#ffb347]"
          : "border-[#e4ddcf] bg-white/90 hover:border-[#11151c]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-2">
          <div className={tone === "dark" ? "text-white" : "text-[#11151c]"}>
            <div className="font-[family:var(--font-svg-edit-display)] text-lg font-semibold">{title}</div>
            <div className={tone === "dark" ? "text-sm text-white/62" : "text-sm text-[#687282]"}>{subtitle}</div>
          </div>
          {meta ? (
            <div className={tone === "dark" ? "text-[11px] uppercase tracking-[0.22em] text-white/45" : "text-[11px] uppercase tracking-[0.22em] text-[#6b7280]"}>
              {meta}
            </div>
          ) : null}
        </div>

        <div
          className={[
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] border",
            tone === "dark" ? "border-white/10 bg-white/5" : "border-[#ede7db] bg-[#fcfaf6]",
          ].join(" ")}
        >
          <Image
            src={toDataUri(previewSvg)}
            alt=""
            width={40}
            height={40}
            unoptimized
            className="h-10 w-10 object-contain"
          />
        </div>
      </div>

      <div className="mt-4 inline-flex rounded-full border border-[#ffb347]/30 bg-[#ffb347]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb347]">
        {actionLabel}
      </div>
    </button>
  );
}

function LibraryButton({
  title,
  subtitle,
  previewSvg,
  onClick,
}: {
  title: string;
  subtitle: string;
  previewSvg: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-[20px] border border-[#ddd5c8] bg-[#f7f1e6] px-3 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#11151c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b2c]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-[#e7dcc9] bg-white shadow-[0_10px_24px_rgba(17,21,28,0.08)]">
        <Image
          src={toDataUri(previewSvg)}
          alt=""
          width={26}
          height={26}
          unoptimized
          className="h-6 w-6 object-contain"
        />
      </div>
      <div className="min-w-0">
        <div className="font-[family:var(--font-svg-edit-display)] text-base font-semibold tracking-[-0.03em] text-[#11151c]">
          {title}
        </div>
        <div className="truncate text-xs text-[#687282]">{subtitle}</div>
      </div>
    </button>
  );
}

export function SvgEditWorkspace() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const [svgSource, setSvgSource] = useState(starterSvg);
  const [canvasTheme, setCanvasTheme] = useState<ExportThemeId>(canvasThemes[0].id);
  const [zoom, setZoom] = useState(96);
  const [status, setStatus] = useState("Paste SVG, pick a template, or import from a preset library.");
  const [isClient, setIsClient] = useState(false);
  const [isPresetPanelOpen, setIsPresetPanelOpen] = useState(true);
  const [isImportPanelOpen, setIsImportPanelOpen] = useState(false);
  const [activeImportTab, setActiveImportTab] = useState<ImportTab>("presets");
  const [importQuery, setImportQuery] = useState("");
  const [iconfontUrl, setIconfontUrl] = useState("");
  const [iconfontState, setIconfontState] = useState<IconfontState>({
    items: [],
    message: "Paste a public iconfont symbol link to load icons.",
    status: "idle",
  });
  const [recentImports, setRecentImports] = useState<ImportRecord[]>([]);
  const [importMeta, setImportMeta] = useState<ImportMeta>({
    name: templates[0].name,
    source: "preset",
    sourceLabel: "Preset",
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsClient(true);
    startTransition(() => {
      setSvgSource((current) => formatSvgMarkup(current));
    });
  }, [startTransition]);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    try {
      const raw = window.localStorage.getItem(RECENT_IMPORTS_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as ImportRecord[];
      if (Array.isArray(parsed)) {
        setRecentImports(parsed.slice(0, MAX_RECENT_IMPORTS));
      }
    } catch {
      setStatus("Recent imports could not be restored from local storage.");
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    window.localStorage.setItem(RECENT_IMPORTS_KEY, JSON.stringify(recentImports.slice(0, MAX_RECENT_IMPORTS)));
  }, [isClient, recentImports]);

  const deferredSource = useDeferredValue(svgSource);
  const parsed = isClient ? parseSvgMarkup(deferredSource) : emptyParsedState;
  const selectedTheme =
    canvasThemes.find((theme) => theme.id === canvasTheme) || canvasThemes[0];
  const filteredTemplates = templates.filter((template) =>
    matchCatalogText(importQuery, [template.name, template.group, template.label, template.description]),
  );
  const filteredLucideIcons = lucideIcons.filter((icon) =>
    matchCatalogText(importQuery, [icon.name, icon.label, icon.id, icon.tags.join(" ")]),
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "s") {
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

      if ((event.metaKey || event.ctrlKey) && key === "i") {
        event.preventDefault();
        setIsImportPanelOpen((current) => !current);
        setStatus("Icon library toggled.");
      }

      if (key === "escape" && isImportPanelOpen) {
        setIsImportPanelOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isImportPanelOpen, parsed.error, parsed.serialized]);

  const previewSrc = parsed.error ? "" : toDataUri(parsed.serialized);
  const activeImportTabLabel = importTabs.find((tab) => tab.id === activeImportTab)?.label || "Library";

  function rememberImport(record: Omit<ImportRecord, "importedAt">) {
    setRecentImports((current) => {
      const next: ImportRecord[] = [
        {
          ...record,
          importedAt: Date.now(),
        },
        ...current.filter((item) => item.id !== record.id),
      ];
      return next.slice(0, MAX_RECENT_IMPORTS);
    });
  }

  function commitImportedSvg(svg: string, meta: ImportMeta) {
    let normalized = "";
    try {
      normalized = formatSvgMarkup(normalizeImportedSvg(svg));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The selected icon could not be imported.");
      return;
    }

    startTransition(() => {
      setSvgSource(normalized);
      setImportMeta(meta);
      rememberImport({
        id: `${meta.source}:${meta.name}`,
        name: meta.name,
        source: meta.source,
        sourceLabel: meta.sourceLabel,
        svg: normalized,
        previewSvg: normalized,
      });
      setStatus(`${meta.name} imported from ${meta.sourceLabel}.`);
    });
  }

  function handleTemplatePick(template: Template, sourceLabel = "Preset") {
    commitImportedSvg(template.svg, {
      name: template.name,
      source: "preset",
      sourceLabel,
    });
  }

  function handleLucidePick(icon: LucideIconItem) {
    commitImportedSvg(icon.svg, {
      name: icon.label,
      source: "lucide",
      sourceLabel: "Lucide",
    });
  }

  async function handleIconfontParse() {
    if (!iconfontUrl.trim()) {
      setIconfontState({
        items: [],
        message: "Paste an iconfont symbol link before parsing.",
        status: "error",
      });
      return;
    }

    setIconfontState({
      items: [],
      message: "Fetching and parsing your iconfont project...",
      status: "loading",
    });

    try {
      const response = await fetch(`/api/icon-source?url=${encodeURIComponent(iconfontUrl.trim())}`);
      const payload = (await response.json()) as { content?: string; error?: string };

      if (!response.ok || !payload.content) {
        throw new Error(payload.error || "Unable to load this iconfont link.");
      }

      const candidates = parseIconfontScript(payload.content);
      setIconfontState({
        items: candidates,
        message: `Loaded ${candidates.length} importable iconfont symbols.`,
        status: "ready",
      });
      setStatus(`Loaded ${candidates.length} iconfont symbols.`);
    } catch (error) {
      setIconfontState({
        items: [],
        message:
          error instanceof Error
            ? error.message
            : "This iconfont link could not be parsed. Check that it is a public symbol link.",
        status: "error",
      });
      setStatus("iconfont import failed. Check the link format and try again.");
    }
  }

  function handleIconfontPick(candidate: IconfontCandidate) {
    commitImportedSvg(candidate.svg, {
      name: candidate.name,
      source: "iconfont",
      sourceLabel: "iconfont",
    });
  }

  function handleRecentPick(record: ImportRecord) {
    commitImportedSvg(record.svg, {
      name: record.name,
      source: record.source,
      sourceLabel: record.sourceLabel,
    });
  }

  function insertSnippet(snippet: string, cursorOffset: number) {
    const editorView = editorViewRef.current;
    if (!editorView) {
      setSvgSource((current) => `${current}\n${snippet}`);
      return;
    }

    const selection = editorView.state.selection.main;
    const anchor = selection.from + cursorOffset;
    editorView.dispatch({
      changes: { from: selection.from, to: selection.to, insert: snippet },
      selection: EditorSelection.cursor(anchor),
      userEvent: "input",
    });
    editorView.focus();
    setStatus("Inserted a paired SVG tag.");
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

  async function handleExportPng() {
    if (parsed.error) {
      setStatus("Fix the SVG error before exporting PNG.");
      return;
    }

    try {
      await exportSvgImage({
        svg: parsed.serialized,
        parsed,
        background: null,
        fileName: "svg-edit-export.png",
      });
      setStatus("PNG exported with a transparent background.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "PNG export failed.");
    }
  }

  async function handleScreenshot() {
    if (parsed.error) {
      setStatus("Fix the SVG error before capturing a screenshot.");
      return;
    }

    try {
      await exportSvgImage({
        svg: parsed.serialized,
        parsed,
        background: canvasTheme,
        fileName: "svg-edit-screenshot.png",
        zoom,
      });
      setStatus("Preview screenshot exported as PNG.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Screenshot export failed.");
    }
  }

  function handleReset() {
    startTransition(() => {
      setSvgSource(formatSvgMarkup(starterSvg));
      setImportMeta({
        name: templates[0].name,
        source: "preset",
        sourceLabel: "Preset",
      });
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
      const loaded = String(reader.result || "");
      try {
        commitImportedSvg(loaded, {
          name: file.name.replace(/\.svg$/i, ""),
          source: "upload",
          sourceLabel: "Upload",
        });
        setStatus(`Loaded ${file.name}.`);
      } catch {
        setSvgSource(formatSvgMarkup(loaded));
      }
    };
    reader.readAsText(file);
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,214,153,0.58),_transparent_24%),radial-gradient(circle_at_88%_12%,_rgba(255,107,44,0.12),_transparent_18%),linear-gradient(180deg,_#f6efe3_0%,_#ece3d3_100%)] text-[#11151c]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1720px] flex-col px-4 py-5 sm:px-6 lg:px-8">
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
                Import presets, pull icons from Lucide, parse public iconfont symbol links, and keep every result editable as plain SVG markup.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:w-[480px]">
              <MetricCard label="Document size" value={bytesLabel(parsed.error ? svgSource : parsed.serialized || svgSource)} />
              <MetricCard label="Node count" value={String(parsed.nodeCount || 0)} />
              <MetricCard label="Viewport" value={parsed.viewBox} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ActionButton variant="primary" onClick={() => {
              setActiveImportTab("presets");
              setIsImportPanelOpen(true);
            }}>
              Open libraries
            </ActionButton>
            <ActionButton variant="primary" onClick={() => fileInputRef.current?.click()}>
              Upload SVG
            </ActionButton>
            <ActionButton onClick={handleCopy}>Copy markup</ActionButton>
            <ActionButton onClick={handleDownload}>Download SVG</ActionButton>
            <ActionButton onClick={handleExportPng}>Export PNG</ActionButton>
            <ActionButton onClick={handleScreenshot}>Screenshot</ActionButton>
            <ActionButton onClick={handleReset}>Reset</ActionButton>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-transparent px-4 text-sm font-semibold text-[#4b5563] transition hover:text-[#11151c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b2c]"
            >
              Back to optimizer
            </Link>
            <span className="rounded-full border border-[#e5ddd0] bg-white/75 px-3 py-2 text-xs text-[#5a6472]">
              Shortcuts: Ctrl/Cmd + S downloads, Ctrl/Cmd + I toggles icon libraries
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

        <section
          className={[
            "mt-5 grid flex-1 gap-5",
            isPresetPanelOpen
              ? "xl:grid-cols-[280px_minmax(0,1.55fr)_360px]"
              : "xl:grid-cols-[96px_minmax(0,1.7fr)_360px]",
          ].join(" ")}
        >
          <aside className="rounded-[30px] border border-white/70 bg-white/60 p-4 shadow-[0_18px_50px_rgba(17,21,28,0.08)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div className={isPresetPanelOpen ? "" : "sr-only"}>
                <div className="text-xs uppercase tracking-[0.28em] text-[#6b7280]">Icon shelf</div>
                <h2 className="mt-2 font-[family:var(--font-svg-edit-display)] text-xl font-semibold tracking-[-0.04em]">
                  Preselect
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsPresetPanelOpen((current) => !current)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-[#ddd5c8] bg-white/85 text-sm font-semibold text-[#11151c] transition hover:border-[#11151c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b2c]"
                aria-expanded={isPresetPanelOpen}
                aria-label={isPresetPanelOpen ? "Collapse quick presets" : "Expand quick presets"}
              >
                {isPresetPanelOpen ? "−" : "+"}
              </button>
            </div>

            <div className={isPresetPanelOpen ? "mt-4 grid gap-3" : "mt-4 grid gap-2"}>
              {templates.slice(0, 6).map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplatePick(template, "Quick preset")}
                  title={`${template.name}: ${template.label}`}
                  className={[
                    "group w-full overflow-hidden rounded-[20px] border border-[#e4ddcf] bg-white/85 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#11151c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b2c]",
                    isPresetPanelOpen ? "p-3.5" : "flex h-14 items-center justify-center p-0",
                  ].join(" ")}
                >
                  {isPresetPanelOpen ? (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-[family:var(--font-svg-edit-display)] text-base font-semibold tracking-[-0.03em] text-[#11151c]">
                            {template.name}
                          </div>
                          <div className="mt-1 text-xs text-[#687282]">{template.group}</div>
                        </div>
                        <div className="rounded-full border border-[#ede7db] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#6b7280] transition group-hover:border-[#11151c] group-hover:text-[#11151c]">
                          Load
                        </div>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-[#4b5563]">{template.description}</p>
                    </>
                  ) : (
                    <span className="font-[family:var(--font-svg-edit-display)] text-sm font-semibold uppercase tracking-[0.18em] text-[#11151c]">
                      {template.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {isPresetPanelOpen ? (
              <div className="mt-4 grid gap-3">
                <div className="text-xs uppercase tracking-[0.24em] text-[#6b7280]">Libraries</div>
                <LibraryButton
                  title="Preset library"
                  subtitle="All built-in compositions"
                  previewSvg={templates[0].svg}
                  onClick={() => {
                    setActiveImportTab("presets");
                    setIsImportPanelOpen(true);
                  }}
                />
                <LibraryButton
                  title="Lucide icons"
                  subtitle="Curated line icon pack"
                  previewSvg={lucideIcons[0].svg}
                  onClick={() => {
                    setActiveImportTab("lucide");
                    setIsImportPanelOpen(true);
                  }}
                />
                <LibraryButton
                  title="Iconfont project"
                  subtitle="Parse a public symbol link"
                  previewSvg={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#11151c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h10"/><path d="M4 17h7"/><circle cx="18" cy="17" r="3"/></svg>`}
                  onClick={() => {
                    setActiveImportTab("iconfont");
                    setIsImportPanelOpen(true);
                  }}
                />
                <LibraryButton
                  title="Recent imports"
                  subtitle="Reopen previous selections"
                  previewSvg={recentImports[0]?.previewSvg || templates[1].svg}
                  onClick={() => {
                    setActiveImportTab("recent");
                    setIsImportPanelOpen(true);
                  }}
                />
              </div>
            ) : null}

            {isPresetPanelOpen ? (
              <div className="mt-4 rounded-[24px] border border-dashed border-[#d9cfbd] bg-[#fcfaf6] p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-[#6b7280]">Usage</div>
                <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                  Left for icon intake, center for markup editing, right for visual inspection. Library buttons open full-screen selection without squeezing the editor.
                </p>
              </div>
            ) : null}
          </aside>

          <section className="rounded-[30px] border border-white/75 bg-[#16202a] p-4 text-white shadow-[0_22px_70px_rgba(17,21,28,0.18)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-[#f7d7a8]">Editor</div>
                <h2 className="mt-2 font-[family:var(--font-svg-edit-display)] text-2xl font-semibold tracking-[-0.04em] text-[#fff7ea]">
                  Direct markup control
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <ActionButton onClick={() => setSvgSource(formatSvgMarkup(svgSource))}>Format</ActionButton>
                <ActionButton onClick={() => setSvgSource(minifySvg(svgSource))}>Minify</ActionButton>
                <ActionButton onClick={() => insertSnippet("<g>\n\n</g>", 4)}>Insert group</ActionButton>
              </div>
            </div>

            <div className="mt-4 rounded-[28px] border border-white/10 bg-[#161d26] p-3">
              <CodeMirror
                value={svgSource}
                onChange={(value) => setSvgSource(value)}
                onCreateEditor={(view) => {
                  editorViewRef.current = view;
                }}
                height="620px"
                theme={oneDark}
                basicSetup={{
                  foldGutter: false,
                  searchKeymap: true,
                }}
                editable
                extensions={[
                  xml(),
                  highlightActiveLine(),
                  highlightActiveLineGutter(),
                  EditorView.lineWrapping,
                  autocompletion({
                    override: [svgCompletionSource],
                    activateOnTyping: true,
                    icons: false,
                  }),
                  svgEditorTheme,
                ]}
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
                Current source: {importMeta.sourceLabel} · {importMeta.name}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                Typing <span className="font-[family:var(--font-svg-edit-mono)]">p</span> on a fresh line suggests <span className="font-[family:var(--font-svg-edit-mono)]">path</span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                {isPending ? "Applying changes..." : status}
              </span>
            </div>
          </section>

          <aside className="rounded-[30px] border border-white/70 bg-white/60 p-5 shadow-[0_18px_50px_rgba(17,21,28,0.08)] backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.28em] text-[#6b7280]">Preview board</div>
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

              <div className="rounded-[24px] border border-[#ddd5c8] bg-[#fcfaf6] p-4">
                <div className="text-sm font-semibold text-[#11151c]">Imported source</div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-[family:var(--font-svg-edit-display)] text-xl font-semibold text-[#11151c]">
                      {importMeta.name}
                    </div>
                    <div className="mt-1 text-sm text-[#6b7280]">{importMeta.sourceLabel}</div>
                  </div>
                  {!parsed.error ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-[#ede7db] bg-white">
                      <Image
                        src={previewSrc}
                        alt=""
                        width={40}
                        height={40}
                        unoptimized
                        className="h-10 w-10 object-contain"
                      />
                  </div>
                ) : null}
                </div>
              </div>

              <div
                className={`relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[28px] border border-[#ddd5c8] p-6 ${selectedTheme.className}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_transparent_58%)]" />
                <div className="absolute inset-x-6 bottom-5 h-8 rounded-full bg-[rgba(17,21,28,0.08)] blur-2xl" />
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
                    className="relative max-h-full max-w-full object-contain drop-shadow-[0_26px_40px_rgba(17,21,28,0.14)] transition duration-200"
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

        {isImportPanelOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(14,17,22,0.58)] p-4 backdrop-blur-md">
            <section className="flex max-h-[88vh] w-full max-w-[1320px] flex-col overflow-hidden rounded-[34px] border border-white/15 bg-[#121922] text-white shadow-[0_28px_100px_rgba(0,0,0,0.35)]">
              <div className="flex flex-col gap-5 border-b border-white/10 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="max-w-2xl">
                    <div className="text-xs uppercase tracking-[0.28em] text-white/45">Icon library</div>
                    <h2 className="mt-2 font-[family:var(--font-svg-edit-display)] text-3xl font-semibold tracking-[-0.04em] text-[#fff7ea]">
                      {activeImportTabLabel}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                      Pick from built-in libraries, keep the editor centered, and import directly into editable SVG markup.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {importTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveImportTab(tab.id)}
                        className={[
                          "min-h-11 rounded-full px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b2c]",
                          activeImportTab === tab.id
                            ? "bg-[#ffb347] text-[#11151c]"
                            : "border border-white/10 bg-white/5 text-white/72 hover:border-white/25 hover:text-white",
                        ].join(" ")}
                      >
                        {tab.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsImportPanelOpen(false)}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/78 transition hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b2c]"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {activeImportTab === "presets" || activeImportTab === "lucide" ? (
                  <input
                    type="text"
                    value={importQuery}
                    onChange={(event) => setImportQuery(event.target.value)}
                    placeholder={activeImportTab === "presets" ? "Search presets, groups, or labels" : "Search Lucide icons or tags"}
                    className="min-h-12 w-full rounded-[20px] border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#ffb347]"
                  />
                ) : null}
              </div>

              <div className="overflow-y-auto px-5 py-5 sm:px-6">
                {activeImportTab === "presets" ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredTemplates.length ? (
                      filteredTemplates.map((template) => (
                        <ImportCard
                          key={template.id}
                          title={template.name}
                          subtitle={template.description}
                          previewSvg={template.svg}
                          tone="dark"
                          actionLabel="Import preset"
                          onAction={() => handleTemplatePick(template)}
                          meta={`${template.group} · ${template.label}`}
                        />
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/65">
                        No preset matched your search. Try a broader keyword or switch to Lucide.
                      </div>
                    )}
                  </div>
                ) : null}

                {activeImportTab === "lucide" ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {filteredLucideIcons.length ? (
                      filteredLucideIcons.map((icon) => (
                        <ImportCard
                          key={icon.id}
                          title={icon.label}
                          subtitle={icon.tags.join(", ")}
                          previewSvg={icon.svg}
                          tone="dark"
                          actionLabel="Import Lucide"
                          onAction={() => handleLucidePick(icon)}
                          meta={icon.id}
                        />
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/65">
                        No Lucide icon matched this query. Try names like search, shield, globe, or chart.
                      </div>
                    )}
                  </div>
                ) : null}

                {activeImportTab === "iconfont" ? (
                  <div className="grid gap-5 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-white/45">Public symbol link</div>
                      <div className="mt-3 text-sm leading-6 text-white/72">
                        Paste a public iconfont script URL such as <span className="font-[family:var(--font-svg-edit-mono)] text-white">https://at.alicdn.com/t/c/font_xxx.js</span>.
                      </div>
                      <input
                        type="text"
                        value={iconfontUrl}
                        onChange={(event) => setIconfontUrl(event.target.value)}
                        placeholder="https://at.alicdn.com/t/c/font_xxx.js"
                        className="mt-4 min-h-12 w-full rounded-[18px] border border-white/10 bg-[#0f1419] px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#ffb347]"
                      />
                      <div className="mt-4 flex flex-wrap gap-3">
                        <ActionButton onClick={handleIconfontParse} disabled={iconfontState.status === "loading"}>
                          {iconfontState.status === "loading" ? "Parsing..." : "Parse link"}
                        </ActionButton>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/65">
                          Only public iconfont CDN links are supported in P0.
                        </span>
                      </div>
                      <div
                        className={[
                          "mt-4 rounded-[18px] border px-4 py-3 text-sm leading-6",
                          iconfontState.status === "error"
                            ? "border-[#ff9d8a] bg-[#40231e] text-[#ffd9cf]"
                            : "border-white/10 bg-white/5 text-white/68",
                        ].join(" ")}
                      >
                        {iconfontState.message}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {iconfontState.items.length ? (
                        iconfontState.items.map((candidate) => (
                          <ImportCard
                            key={candidate.id}
                            title={candidate.name}
                            subtitle={candidate.id}
                            previewSvg={candidate.svg}
                            tone="dark"
                            actionLabel="Import iconfont"
                            onAction={() => handleIconfontPick(candidate)}
                          />
                        ))
                      ) : (
                        <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/58">
                          Parse a public iconfont link to populate importable symbols here. If the source is private or not a symbol link, the list will stay empty.
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {activeImportTab === "recent" ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {recentImports.length ? (
                      recentImports.map((record) => (
                        <ImportCard
                          key={`${record.id}-${record.importedAt}`}
                          title={record.name}
                          subtitle={`Imported from ${record.sourceLabel}`}
                          previewSvg={record.previewSvg}
                          tone="dark"
                          actionLabel="Re-import"
                          onAction={() => handleRecentPick(record)}
                          meta={new Date(record.importedAt).toLocaleString()}
                        />
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/58">
                        You have not imported any external icon yet. Import from presets, Lucide, or iconfont and they will appear here.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
