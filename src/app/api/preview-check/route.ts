import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("url");

  if (!target) {
    return NextResponse.json({ ok: false, error: "missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return NextResponse.json({ ok: false, error: "invalid protocol" }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(parsed.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; AdrienThevonPortfolio/1.0; +https://adrienthevon.dev)",
      },
    });

    const xfo = res.headers.get("x-frame-options")?.toLowerCase() ?? "";
    const csp = res.headers.get("content-security-policy")?.toLowerCase() ?? "";
    const framingBlocked =
      xfo.includes("deny") ||
      xfo.includes("sameorigin") ||
      /frame-ancestors\s+[^;]*\b(none|self)\b/.test(csp);

    return NextResponse.json(
      { ok: res.ok && !framingBlocked, status: res.status },
      { headers: { "cache-control": "s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch {
    return NextResponse.json({ ok: false, error: "fetch failed" });
  } finally {
    clearTimeout(timeout);
  }
}
