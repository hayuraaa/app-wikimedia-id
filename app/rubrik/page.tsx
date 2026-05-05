// SERVER COMPONENT — fetch halaman pertama + popular + categories di server
import { Suspense } from "react";
import RubrikClient from "@/components/rubrik/RubrikClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rubrik – Wikimedia Indonesia",
  description: "Kumpulan artikel terbaru dari Wikimedia Indonesia.",
};

const PER_PAGE = 12;

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

export type PopularArticle = {
  id: number;
  title: string;
  slug: string;
  featured_image: string | null;
  views: number;
  published_at: string;
};

async function getArticles(): Promise<{ data: Article[]; meta: Meta | null }> {
  try {
    const res = await fetch(
      `https://dashboard.wikimedia.or.id/api/v1/articles?per_page=${PER_PAGE}&page=1`,
      { next: { revalidate: 3600, tags: ["articles"] } }
    );
    const json = await res.json();
    return json.success ? { data: json.data, meta: json.meta } : { data: [], meta: null };
  } catch {
    return { data: [], meta: null };
  }
}

async function getPopular(): Promise<PopularArticle[]> {
  try {
    const res = await fetch(
      "https://dashboard.wikimedia.or.id/api/v1/articles/popular/list?limit=7",
      { next: { revalidate: 3600, tags: ["articles"] } }
    );
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<{ name: string; count: number }[]> {
  try {
    const res = await fetch(
      "https://dashboard.wikimedia.or.id/api/v1/articles/stats/summary",
      { next: { revalidate: 86400 } }
    );
    const json = await res.json();
    if (json.success && json.data.categories_count) {
      return (json.data.categories_count as { category: string; count: number }[])
        .sort((a, b) => b.count - a.count)
        .map((c) => ({ name: c.category, count: c.count }));
    }
    return [];
  } catch {
    return [];
  }
}

export default async function RubrikPage() {
  const [{ data: articles, meta }, popular, categories] = await Promise.all([
    getArticles(),
    getPopular(),
    getCategories(),
  ]);

  return (
    <Suspense fallback={null}>
      <RubrikClient
        initialArticles={articles}
        initialMeta={meta}
        initialPopular={popular}
        initialCategories={categories}
      />
    </Suspense>
  );
}