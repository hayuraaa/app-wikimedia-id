import { notFound } from "next/navigation";
import ArticleClient from "@/components/rubrik/ArticleClient";
import type { Metadata } from "next";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan – Wikimedia Indonesia",
    };
  }

  return {
    title: `${article.title} – Wikimedia Indonesia`,
    description: article.excerpt
      ? article.excerpt.substring(0, 160).trim()
      : article.content.replace(/<[^>]*>/g, "").substring(0, 160).trim(),
    openGraph: {
      title: article.title,
      description: article.excerpt ?? "",
      images: article.featured_image ? [article.featured_image] : [],
    },
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image: string | null;
  published_at: string;
  views: number;
  authors: { id: number; name: string; slug: string }[];
  categories: string[];
  keywords: string[];
  creator?: { id: number; name: string };
};

export type RelatedArticle = {
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

// ─── Fetch helpers ────────────────────────────────────────────────────────────

const API = "https://dashboard.wikimedia.or.id/api/v1";

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API}/articles/${slug}`, { next: { revalidate: 3600 } });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

async function getRelated(categories: string[], currentSlug: string): Promise<RelatedArticle[]> {
  if (categories.length === 0) return [];
  try {
    const results = await Promise.all(
      categories.map((cat) =>
        fetch(`${API}/articles/category/${encodeURIComponent(cat)}?per_page=6`, {
          next: { revalidate: 3600 },
        })
          .then((r) => r.json())
          .catch(() => ({ success: false }))
      )
    );
    const seen = new Set<string>([currentSlug]);
    const merged: RelatedArticle[] = [];
    for (const res of results) {
      if (!res.success) continue;
      for (const a of res.data) {
        if (!seen.has(a.slug)) {
          seen.add(a.slug);
          merged.push(a);
        }
      }
    }
    return merged.slice(0, 5);
  } catch {
    return [];
  }
}

async function getLatest(currentSlug: string): Promise<RelatedArticle[]> {
  try {
    const res = await fetch(`${API}/articles/latest/list?limit=6`, { next: { revalidate: 3600 } });
    const json = await res.json();
    if (!json.success) return [];
    return json.data.filter((a: RelatedArticle) => a.slug !== currentSlug).slice(0, 5);
  } catch {
    return [];
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getArticle(slug);
  if (!article) notFound();

  const [related, latest] = await Promise.all([
    getRelated(article.categories ?? [], slug),
    getLatest(slug),
  ]);

  return (
    <ArticleClient
      article={article}
      related={related}
      latest={latest}
    />
  );
}