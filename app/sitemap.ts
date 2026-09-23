import type { MetadataRoute } from "next";

const BASE = "https://wikimedia.or.id";
const API = "https://dashboard.wikimedia.or.id/api/v1";

type ArticleEntry = {
  slug: string;
  published_at: string;
};

async function getAllArticleSlugs(): Promise<ArticleEntry[]> {
  try {
    const first = await fetch(`${API}/articles?per_page=100&page=1`, {
      next: { revalidate: 3600 },
    });
    const json = await first.json();
    if (!json.success) return [];

    const entries: ArticleEntry[] = json.data.map((a: ArticleEntry) => ({
      slug: a.slug,
      published_at: a.published_at,
    }));

    const lastPage: number = json.meta?.last_page ?? 1;
    if (lastPage > 1) {
      const pages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
      const results = await Promise.all(
        pages.map((p) =>
          fetch(`${API}/articles?per_page=100&page=${p}`, {
            next: { revalidate: 3600 },
          })
            .then((r) => r.json())
            .catch(() => ({ success: false }))
        )
      );
      for (const r of results) {
        if (r.success) {
          for (const a of r.data) {
            entries.push({ slug: a.slug, published_at: a.published_at });
          }
        }
      }
    }

    return entries;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/rubrik`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/tentang`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/program`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/acara`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/donasi`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/kontak`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/ruang-pers`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/menjadi-anggota`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/menjadi-sukarelawan`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const articles = await getAllArticleSlugs();
  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/rubrik/${a.slug}`,
    lastModified: new Date(a.published_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages];
}
