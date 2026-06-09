import { NextRequest, NextResponse } from "next/server";

/**
 * Allowed upstream host patterns for PDF proxying.
 * Only URLs matching one of these are fetched — this prevents
 * the proxy from being abused as an open redirector.
 *
 * Add your actual S3 bucket domain(s) here when you provision them.
 */
const ALLOWED_HOST_PATTERNS: RegExp[] = [
  // Google Docs export
  /^docs\.google\.com$/i,

  // AWS S3 (virtual-hosted & path-style)
  /\.s3[.-].*\.amazonaws\.com$/i,
  /^s3\..*\.amazonaws\.com$/i,

  // DigitalOcean Spaces
  /\.digitaloceanspaces\.com$/i,

  // Cloudflare R2
  /\.r2\.cloudflarestorage\.com$/i,

  // Google Cloud Storage
  /^storage\.googleapis\.com$/i,

  // Azure Blob
  /\.blob\.core\.windows\.net$/i,

  // Supabase
  /\.supabase\.co$/i,
];

function isAllowedUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_HOST_PATTERNS.some((re) => re.test(parsed.hostname));
  } catch {
    return false;
  }
}

/**
 * Proxy route for PDF documents to bypass browser CORS restrictions.
 * Usage: /api/pdf-proxy?url=<encoded-url>
 *
 * Security:
 *  - Only HTTPS URLs on allow-listed hosts are fetched.
 *  - Response is streamed with Content-Disposition: inline (no download prompt).
 *  - X-Frame-Options DENY prevents the proxied PDF from being embedded elsewhere.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  const decodedUrl = decodeURIComponent(rawUrl);

  // ── Security: only proxy allow-listed hosts ──
  if (!isAllowedUrl(decodedUrl)) {
    return NextResponse.json(
      { error: "URL host is not in the allow-list" },
      { status: 403 }
    );
  }

  try {
    const response = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BashAcademy/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: response.status }
      );
    }

    const contentType =
      response.headers.get("content-type") ?? "application/pdf";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        // Prevent downstream framing of the raw PDF bytes
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[pdf-proxy]", err);
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 500 });
  }
}
