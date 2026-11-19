#!/usr/bin/env node
/**
 * Generates public/svgo-web.js — the browser global the optimizer pages call as
 *   window.svgo({ id, action: "load", data })
 *   window.svgo({ id, action: "process", settings })  ->  { result: { data } }
 *
 * It is a thin shim over the official svgo browser build, so updating the
 * optimizer means bumping SVGO_VERSION here and re-running this script:
 *
 *   node scripts/build-svgo-web.mjs
 *
 * Why the bundle is checked in: it is served straight from public/ as a static
 * asset, not compiled by Next, so the deployed bytes are whatever sits in the
 * repo. Rebuild it whenever SVGO_VERSION changes.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SVGO_VERSION = "3.3.5";
const ESBUILD_VERSION = "0.28.2";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const outFile = join(repoRoot, "public", "svgo-web.js");
const work = join(tmpdir(), `svgo-web-build-${process.pid}`);

const ENTRY = `
// Shim that reconstructs the API surface the optimizer pages expect, backed by
// the official svgo browser build. See scripts/build-svgo-web.mjs.
import { optimize } from "svgo/dist/svgo.browser.js";

// svgo 2 -> 3 plugin renames, keyed by the ids used in public/config.json.
const RENAMED = {
  cleanupIDs: "cleanupIds",
};

const store = new Map();

function pluginList(plugins) {
  if (!plugins || typeof plugins !== "object") return undefined;
  const names = Object.keys(plugins)
    .filter((id) => plugins[id])
    .map((id) => RENAMED[id] || id);
  // An empty list means "run no passes", which is a legitimate choice from the
  // panel; pass a no-op so svgo does not fall back to its defaults.
  return names.length ? names.map((name) => ({ name })) : ["removeDoctype"];
}

function svgo(args) {
  const { id, action, data, settings } = args || {};

  if (action === "load") {
    store.set(id, data);
    return { id, result: {} };
  }

  if (action === "process") {
    const src = store.get(id);
    if (typeof src !== "string" || src.trim() === "") {
      return { id, result: { data: undefined } };
    }

    try {
      const out = optimize(src, {
        plugins: pluginList(settings && settings.plugins),
        floatPrecision:
          settings && settings.floatPrecision != null
            ? settings.floatPrecision
            : 3,
        js2svg: { pretty: !!(settings && settings.pretty) },
      });

      // svgo can emit NaN coordinates for a few path shapes when the path is
      // rewritten in place. Treat that as a failure rather than handing the
      // caller a file that renders as nothing.
      if (typeof out.data !== "string" || /NaN/.test(out.data)) {
        return { id, result: { data: undefined, error: "invalid output" } };
      }

      return { id, result: { data: out.data } };
    } catch (err) {
      return {
        id,
        result: { data: undefined, error: String((err && err.message) || err) },
      };
    }
  }

  return { id, result: {} };
}

window.svgo = svgo;
`;

try {
  mkdirSync(join(work, "node_modules", "svgo", "dist"), { recursive: true });
  writeFileSync(join(work, "entry.js"), ENTRY);

  // Pull the official browser build from the CDN so the script does not need
  // svgo installed in this repo's dependencies.
  const url = `https://cdn.jsdelivr.net/npm/svgo@${SVGO_VERSION}/dist/svgo.browser.js`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} failed: ${res.status}`);
  const browserBuild = await res.text();
  writeFileSync(join(work, "node_modules", "svgo", "dist", "svgo.browser.js"), browserBuild);
  writeFileSync(
    join(work, "node_modules", "svgo", "package.json"),
    JSON.stringify({
      name: "svgo",
      version: SVGO_VERSION,
      type: "module",
      exports: { "./dist/svgo.browser.js": "./dist/svgo.browser.js" },
    })
  );

  execFileSync(
    "npx",
    [
      "--yes",
      `esbuild@${ESBUILD_VERSION}`,
      join(work, "entry.js"),
      "--bundle",
      "--format=iife",
      "--minify",
      `--outfile=${outFile}`,
    ],
    { stdio: "inherit" }
  );

  const bytes = readFileSync(outFile).length;
  console.log(`wrote ${outFile} (${(bytes / 1024).toFixed(0)} KB, svgo ${SVGO_VERSION})`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
