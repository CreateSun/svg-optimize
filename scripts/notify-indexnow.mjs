#!/usr/bin/env node
/**
 * IndexNow submitter for svg-optimize.com.
 *
 * Usage:
 *   node notify-indexnow.mjs                 # submit every URL in sitemap.xml
 *   node notify-indexnow.mjs <url> [url...]  # submit specific URLs
 *   node notify-indexnow.mjs --dry-run       # print what would be sent
 *
 * The key file must exist at https://svg-optimize.com/<KEY>.txt and contain KEY.
 * Bing, Yandex, Seznam, Naver and Yep share the IndexNow endpoint; Google does not
 * take part, so keep submitting the sitemap in Search Console too.
 */

const SITE = "https://svg-optimize.com";
const KEY = "12e34ec4fbd1031477cdda99698847fe";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINTS = ["https://api.indexnow.org/indexnow", "https://www.bing.com/indexnow"];

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
let urls = args.filter((a) => !a.startsWith("--"));

if (!urls.length) {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

console.log(`IndexNow: ${urls.length} URL(s) → ${KEY_LOCATION}`);
for (const u of urls) console.log("  " + u);
if (dryRun) process.exit(0);

let failed = 0;
for (const endpoint of ENDPOINTS) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  });
  const ok = res.status === 200 || res.status === 202;
  console.log(`${ok ? "OK " : "ERR"} ${res.status} ${endpoint}`);
  if (!ok) failed++;
}

process.exit(failed ? 1 : 0);
