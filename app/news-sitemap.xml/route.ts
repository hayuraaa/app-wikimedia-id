import { NextResponse } from "next/server";

const BASE = "https://wikimedia.or.id";
const API = "https://dashboard.wikimedia.or.id/api/v1";

type Article = {
  slug: string;
  title: string;
  published_at: string;
  keywords: string[];
};

// Google News sitemap only indexes articles published within the last 2 days.
// We fetch the latest page and filter by recency.
async function getRecentArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/articles?per_page=100&page=1`, {
      next: { revalidate: 600 },
    });
    const json = await res.json();
    if (!json.success) return [];

    const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
    return (json.data as Article[]).filter(
      (a) => new Date(a.published_at).getTime() > twoDaysAgo
    );
  } catch {
    return [];
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await getRecentArticles();

  const urls = articles
    .map((a) => {
      const pubDate = new Date(a.published_at).toISOString();
      const keywords = Array.isArray(a.keywords) && a.keywords.length > 0
        ? `<news:keywords>${escapeXml(a.keywords.join(", "))}</news:keywords>`
        : "";

      return `
  <url>
    <loc>${BASE}/rubrik/${escapeXml(a.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>Wikimedia Indonesia</news:name>
        <news:language>id</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
      ${keywords}
    </news:news>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, stale-while-revalidate=60",
    },
  });
}
