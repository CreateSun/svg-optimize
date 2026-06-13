import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function normalizeTargetUrl(rawUrl: string) {
  const candidate = rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl;
  const parsed = new URL(candidate);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  if (!parsed.hostname.endsWith("alicdn.com")) {
    throw new Error("Only public iconfont CDN links are supported in P0.");
  }

  return parsed.toString();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url")?.trim();

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url query parameter." }, { status: 400 });
  }

  let targetUrl = "";
  try {
    targetUrl = normalizeTargetUrl(rawUrl);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid url." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "svg-optimize-icon-import/1.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Remote source returned ${response.status}.` },
        { status: 502 },
      );
    }

    const content = await response.text();
    return NextResponse.json({ content, targetUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch remote source." },
      { status: 502 },
    );
  }
}
