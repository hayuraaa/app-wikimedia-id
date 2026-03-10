import { Suspense } from "react";
import { notFound } from "next/navigation";
import AuthorClient from "@/components/rubrik/AuthorClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { author } = await getAuthorArticles(slug);

  if (!author) {
    return {
      title: "Penulis Tidak Ditemukan – Wikimedia Indonesia",
    };
  }

  return {
    title: `Artikel oleh ${author.name} – Wikimedia Indonesia`,
    description: author.bio
      ? author.bio.substring(0, 160).trim()
      : `Kumpulan artikel yang ditulis oleh ${author.name} di Wikimedia Indonesia.`,
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type Author = {
  id: number;
  name: string;
  slug: string;
  bio?: string;
};

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
  author?: Author;
};

// ─── Fetch ────────────────────────────────────────────────────────────────────

const BASE = "https://dashboard.wikimedia.or.id/api/v1";
const PER_PAGE = 12;

async function getAuthorArticles(slug: string): Promise<{ author: Author | null; articles: Article[]; meta: Meta | null }> {
  try {
    const res = await fetch(
      `${BASE}/articles/author/${slug}?per_page=${PER_PAGE}&page=1`,
      { next: { revalidate: 3600 } }
    );
    const json = await res.json();
    if (!json.success) return { author: null, articles: [], meta: null };
    return {
      author: json.meta?.author ?? null,
      articles: json.data,
      meta: json.meta,
    };
  } catch {
    return { author: null, articles: [], meta: null };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { author, articles, meta } = await getAuthorArticles(slug);

  if (!meta && articles.length === 0) notFound();

  return (
    <Suspense fallback={null}>
      <AuthorClient
        slug={slug}
        initialAuthor={author}
        initialArticles={articles}
        initialMeta={meta}
      />
    </Suspense>
  );
}