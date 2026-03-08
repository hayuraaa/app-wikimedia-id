"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Author, Article, Meta } from "@/app/rubrik/author/[slug]/page";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCategory = (cat: string) => {
  const connectors = new Set(["dan", "atau", "di", "ke", "dari", "untuk", "yang", "dengan"]);
  return cat
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word, i) =>
      i === 0 || !connectors.has(word.toLowerCase())
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase()
    )
    .join(" ");
};

const formatDateShort = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// ─── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({ article }: { article: Article }) {
  const router = useRouter();
  return (
    <Link href={`/rubrik/${article.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <article
        className="card-glow"
        style={{
          border: "1px solid #e5e2dd",
          borderRadius: "4px",
          overflow: "hidden",
          height: "100%",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: "180px", backgroundColor: "#f0eeec", overflow: "hidden", borderBottom: "1px solid #e5e2dd", flexShrink: 0, position: "relative" }}>
          {article.featured_image ? (
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              sizes="(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 33vw"
              style={{ objectFit: "cover", transition: "transform 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0eeec, #e5e2dd)" }}>
              <span style={{ fontSize: "40px", opacity: 0.15 }}>📰</span>
            </div>
          )}
        </div>
        <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
            {article.categories?.length > 0 ? (
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" as const, flex: 1 }}>
                {article.categories.map((cat) => (
                  <span
                    key={cat}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/rubrik/kategori/${cat}`); }}
                    style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.04em", color: "#1e4d7b", backgroundColor: "rgba(30,77,123,0.08)", padding: "2px 8px", borderRadius: "2px", fontFamily: "var(--font-sans)", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(30,77,123,0.18)"; e.currentTarget.style.color = "#0d2a4d"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(30,77,123,0.08)"; e.currentTarget.style.color = "#1e4d7b"; }}
                  >
                    {formatCategory(cat)}
                  </span>
                ))}
              </div>
            ) : <span style={{ flex: 1 }} />}
            <span style={{ fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
              {formatDateShort(article.published_at)}
            </span>
          </div>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0d0d0d", lineHeight: "1.5", fontFamily: "var(--font-serif)", margin: 0 }}>
            {article.title}
          </h3>
          <p style={{ fontSize: "12px", color: "#6b6966", lineHeight: "1.6", fontFamily: "var(--font-sans)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", margin: 0, flex: 1 }}>
            {article.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid #f0eeec", marginTop: "auto" }}>
            <span style={{ fontSize: "11px", color: "#5c5a57", fontFamily: "var(--font-sans)" }}>
              {article.authors?.[0]?.name ?? "—"}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {article.views.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div style={{ border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", backgroundColor: "#fff" }}>
      <div className="skeleton" style={{ height: "180px" }} />
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="skeleton" style={{ height: "10px", borderRadius: "2px", width: "40%" }} />
        <div className="skeleton" style={{ height: "15px", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "15px", borderRadius: "2px", width: "75%" }} />
        <div className="skeleton" style={{ height: "11px", borderRadius: "2px", width: "55%", marginTop: "4px" }} />
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ meta, onPageChange }: { meta: Meta; onPageChange: (p: number) => void }) {
  const { current_page, last_page } = meta;
  const pages: (number | "...")[] = [];
  if (last_page <= 7) {
    for (let i = 1; i <= last_page; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current_page > 3) pages.push("...");
    for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) pages.push(i);
    if (current_page < last_page - 2) pages.push("...");
    pages.push(last_page);
  }

  const btn: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    minWidth: "36px", height: "36px", padding: "0 6px",
    borderRadius: "3px", border: "1px solid #e5e2dd",
    backgroundColor: "#fff", fontSize: "13px", fontWeight: "500",
    fontFamily: "var(--font-sans)", cursor: "pointer", transition: "all 0.2s", color: "#3a3a3a",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", paddingTop: "36px" }}>
      <button
        style={{ ...btn, color: current_page === 1 ? "#c5c3bf" : "#3a3a3a", cursor: current_page === 1 ? "not-allowed" : "pointer" }}
        disabled={current_page === 1} onClick={() => onPageChange(current_page - 1)}
        onMouseEnter={(e) => { if (current_page !== 1) (e.currentTarget as HTMLElement).style.borderColor = "#8b1a2a"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`e-${idx}`} style={{ minWidth: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>···</span>
        ) : (
          <button
            key={p}
            style={{ ...btn, backgroundColor: p === current_page ? "#8b1a2a" : "#fff", borderColor: p === current_page ? "#8b1a2a" : "#e5e2dd", color: p === current_page ? "#fff" : "#3a3a3a", fontWeight: p === current_page ? "700" : "500" }}
            onClick={() => onPageChange(p as number)}
            onMouseEnter={(e) => { if (p !== current_page) { (e.currentTarget as HTMLElement).style.borderColor = "#8b1a2a"; (e.currentTarget as HTMLElement).style.color = "#8b1a2a"; } }}
            onMouseLeave={(e) => { if (p !== current_page) { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; (e.currentTarget as HTMLElement).style.color = "#3a3a3a"; } }}
          >
            {p}
          </button>
        )
      )}
      <button
        style={{ ...btn, color: current_page === last_page ? "#c5c3bf" : "#3a3a3a", cursor: current_page === last_page ? "not-allowed" : "pointer" }}
        disabled={current_page === last_page} onClick={() => onPageChange(current_page + 1)}
        onMouseEnter={(e) => { if (current_page !== last_page) (e.currentTarget as HTMLElement).style.borderColor = "#8b1a2a"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function AuthorClient({
  slug,
  initialAuthor,
  initialArticles,
  initialMeta,
}: {
  slug: string;
  initialAuthor: Author | null;
  initialArticles: Article[];
  initialMeta: Meta | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Baca page dari URL ────────────────────────────────────────────────────
  const pageFromUrl = Number(searchParams.get("page") ?? "1") || 1;

  const [author] = useState<Author | null>(initialAuthor);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [meta, setMeta] = useState<Meta | null>(initialMeta);
  const [articlesLoading, setArticlesLoading] = useState(false);

  const PER_PAGE = 12;
  const BASE = "https://dashboard.wikimedia.or.id/api/v1";

  const authorName = author?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const authorInitial = authorName.charAt(0).toUpperCase();

  // ── Helper: update URL tanpa reload ──────────────────────────────────────
  const pushPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams();
      if (page > 1) params.set("page", String(page));
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname]
  );

  // ── Sinkronisasi URL → data ───────────────────────────────────────────────
  useEffect(() => {
    if (pageFromUrl === 1) {
      setArticles(initialArticles);
      setMeta(initialMeta);
      return;
    }
    setArticlesLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetch(`${BASE}/articles/author/${slug}?per_page=${PER_PAGE}&page=${pageFromUrl}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setArticles(json.data);
          setMeta(json.meta);
        }
      })
      .catch(() => {})
      .finally(() => setArticlesLoading(false));
  }, [pageFromUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: "48px 24px 40px", position: "relative", overflow: "hidden", backgroundImage: "url('/banner/Mosaik_Budaya_1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.90) 0%, rgba(10,30,65,0.82) 40%, rgba(15,40,80,0.75) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "32px", flexWrap: "wrap" as const }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)" }}>/</span>
            <Link href="/rubrik" style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
              Rubrik
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#e05070", fontFamily: "var(--font-sans)" }}>Penulis</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-sans)" }}>{authorName}</span>
            {pageFromUrl > 1 && (
              <>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)" }}>/</span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)" }}>Halaman {pageFromUrl}</span>
              </>
            )}
          </div>

          {/* Author profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" as const }}>
            {/* Avatar */}
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "rgba(139,26,42,0.35)", border: "2px solid rgba(139,26,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "28px", fontWeight: "700", color: "#e05070", fontFamily: "var(--font-serif)" }}>{authorInitial}</span>
            </div>

            <div>
              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Penulis</span>
              <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: "700", color: "#ffffff", fontFamily: "var(--font-serif)", margin: "4px 0 6px", lineHeight: "1.2" }}>
                {authorName}
              </h1>
              {author?.bio && (
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-sans)", margin: 0, maxWidth: "560px", lineHeight: "1.6" }}>
                  {author.bio}
                </p>
              )}
              {meta && (
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-sans)", margin: author?.bio ? "6px 0 0" : "0" }}>
                  {meta.total.toLocaleString("id-ID")} artikel ditulis
                  {meta.last_page > 1 && ` · Halaman ${pageFromUrl} dari ${meta.last_page}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLES ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "40px 24px 60px", minHeight: "60vh", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Section header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", paddingBottom: "12px", borderBottom: "3px solid #0d0d0d" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Karya</span>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "2px", marginBottom: 0 }}>
                Artikel oleh {authorName}
              </h2>
            </div>
            {meta && (
              <span style={{ fontSize: "12px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>
                {meta.total.toLocaleString("id-ID")} artikel
              </span>
            )}
          </div>

          {/* Grid */}
          {articlesLoading ? (
            <div className="author-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {[...Array(PER_PAGE)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : articles.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px" }}>
              <span style={{ fontSize: "40px", opacity: 0.2 }}>📝</span>
              <p style={{ fontSize: "15px", color: "#6b6966", fontFamily: "var(--font-sans)", marginTop: "12px" }}>
                Penulis ini belum memiliki artikel yang dipublikasikan.
              </p>
              <Link href="/rubrik" style={{ display: "inline-flex", marginTop: "16px", padding: "8px 20px", backgroundColor: "#8b1a2a", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)" }}>
                Lihat Semua Artikel
              </Link>
            </div>
          ) : (
            <>
              <div className="author-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
              </div>
              {meta && meta.last_page > 1 && (
                <Pagination meta={meta} onPageChange={pushPage} />
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 1100px) {
          .author-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .author-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}