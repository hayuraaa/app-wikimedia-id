import { Suspense } from "react";
import KategoriClient from "@/components/rubrik/KategoriClient";

export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  views: number;
  authors: { id: number; name: string; slug: string }[];
  categories: string[];
};

export type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const BASE = "https://dashboard.wikimedia.or.id/api/v1";
const PER_PAGE = 12;

async function getArticles(slug: string): Promise<{ articles: Article[]; meta: Meta | null }> {
  try {
    const res = await fetch(
      `${BASE}/articles/category/${encodeURIComponent(slug)}?per_page=${PER_PAGE}&page=1`,
      { next: { revalidate: 3600 } }
    );
    const json = await res.json();
    if (!json.success) return { articles: [], meta: null };
    return { articles: json.data, meta: json.meta };
  } catch {
    return { articles: [], meta: null };
  }
}

async function getOtherCategories(currentSlug: string): Promise<{ name: string; count: number }[]> {
  try {
    const res = await fetch(`${BASE}/articles/stats/summary`, { next: { revalidate: 86400 } });
    const json = await res.json();
    if (!json.success || !json.data.categories_count) return [];
    return (json.data.categories_count as { category: string; count: number }[])
      .filter((c) => c.category !== currentSlug)
      .sort((a, b) => b.count - a.count)
      .map((c) => ({ name: c.category, count: c.count }));
  } catch {
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [{ articles, meta }, otherCategories] = await Promise.all([
    getArticles(slug),
    getOtherCategories(slug),
  ]);

  return (
    <Suspense fallback={null}>
      <KategoriClient
        slug={slug}
        initialArticles={articles}
        initialMeta={meta}
        initialOtherCategories={otherCategories}
      />
    </Suspense>
  );
}