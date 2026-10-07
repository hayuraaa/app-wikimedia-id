"use client";

import ArticleClient from "@/components/rubrik/ArticleClient";
import type { Article } from "@/app/rubrik/[slug]/page";

export type PreviewData = {
  title: string;
  content: string;
  featuredImage: string | null;
  authorName: string;
  categories: string[];
  keywords: string[];
  publishedAt?: string | null;
};

/**
 * Artikel ditampilkan dengan komponen halaman /rubrik/[slug] yang asli, tanpa menyimpan apa pun.
 * Semua tautan & tombol bagikan dinonaktifkan agar tulisan yang belum disimpan tidak hilang.
 */
export default function ArticlePreview({ data }: { data: PreviewData }) {
  const article: Article = {
    id: 0,
    title: data.title.trim() || "(Judul belum diisi)",
    slug: "pratinjau",
    content: data.content,
    featured_image: data.featuredImage,
    published_at: data.publishedAt ?? new Date().toISOString(),
    views: 0,
    authors: [{ id: 0, name: data.authorName, slug: "" }],
    categories: data.categories,
    keywords: data.keywords,
  };

  const blockNavigation = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // <a>, tombol (salin tautan), dan nama penulis/kategori yang memakai router.push
    if (target.closest("a, button, [style*='cursor: pointer']")) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div onClickCapture={blockNavigation} className="writer-preview">
      <ArticleClient article={article} related={[]} latest={[]} preview />
      <style>{`
        .writer-preview a, .writer-preview button, .writer-preview [style*="cursor: pointer"] { cursor: default !important; }
      `}</style>
    </div>
  );
}
