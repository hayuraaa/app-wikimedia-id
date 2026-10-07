// Bentuk data Writer API dashboard (dipakai di server & browser)

export type WriterUser = {
  id: number;
  wiki_username: string | null;
  email: string;
  needs_name: boolean;
  author: { id: number; name: string; slug: string } | null;
};

export type ArticleStatus = "draft" | "pending" | "published" | "rejected";

export type WriterArticle = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featured_image: string | null;
  status: ArticleStatus;
  rejection_reason: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  authors: { id: number; name: string; slug: string }[];
  categories: string[];
  keywords: string[];
};

export type Paginated<T> = {
  success: boolean;
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
};

/** Artikel dengan status ini masih bisa diedit/dihapus penulis */
export const EDITABLE_STATUSES: ArticleStatus[] = ["draft", "rejected"];

export const STATUS_LABEL: Record<ArticleStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: "Draft",           color: "#5c5a57", bg: "#f0eeec" },
  pending:   { label: "Menunggu review", color: "#a16207", bg: "rgba(234,179,8,0.14)" },
  published: { label: "Terbit",          color: "#15803d", bg: "rgba(22,163,74,0.12)" },
  rejected:  { label: "Perlu perbaikan", color: "#b91c1c", bg: "rgba(220,38,38,0.10)" },
};
