"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Article, Meta, PopularArticle } from "@/app/rubrik/page";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    timeZone: "Asia/Jakarta",
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
        {/* Thumbnail */}
        <div
          style={{
            height: "180px",
            backgroundColor: "#f0eeec",
            overflow: "hidden",
            borderBottom: "1px solid #e5e2dd",
            position: "relative",
            flexShrink: 0,
          }}
        >
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
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0eeec 0%, #e5e2dd 100%)" }}>
              <span style={{ fontSize: "40px", opacity: 0.2 }}>📰</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>

          {/* Categories + date */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
            {article.categories?.length > 0 ? (
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", flex: 1 }}>
                {article.categories.map((cat) => (
                  <span
                    key={cat}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/rubrik/kategori/${cat}`);
                    }}
                    style={{
                      fontSize: "10px", fontWeight: "700", letterSpacing: "0.04em",
                      color: "#8b1a2a", backgroundColor: "rgba(139,26,42,0.08)",
                      padding: "2px 8px", borderRadius: "2px",
                      fontFamily: "var(--font-sans)", cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(139,26,42,0.18)"; e.currentTarget.style.color = "#5e0f1a"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(139,26,42,0.08)"; e.currentTarget.style.color = "#8b1a2a"; }}
                  >
                    {formatCategory(cat)}
                  </span>
                ))}
              </div>
            ) : (
              <span style={{ flex: 1 }} />
            )}
            <span style={{ fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)", whiteSpace: "nowrap", flexShrink: 0 }}>
              {formatDateShort(article.published_at)}
            </span>
          </div>

          {/* Title */}
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0d0d0d", lineHeight: "1.5", fontFamily: "var(--font-serif)", margin: 0 }}>
            {article.title}
          </h3>

          {/* Excerpt */}
          <p style={{
            fontSize: "12px", color: "#6b6966", lineHeight: "1.6", fontFamily: "var(--font-sans)",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            margin: 0, flex: 1,
          }}>
            {article.excerpt}
          </p>

          {/* Author + views */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid #f0eeec", marginTop: "auto" }}>
            {article.authors?.[0] ? (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/rubrik/author/${article.authors[0].slug}`);
                }}
                style={{
                  fontSize: "11px", color: "#5c5a57", fontFamily: "var(--font-sans)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  maxWidth: "65%", cursor: "pointer", transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1e4d7b")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5a57")}
              >
                {article.authors[0].name}
              </span>
            ) : (
              <span style={{ fontSize: "11px", color: "#5c5a57", fontFamily: "var(--font-sans)" }}>—</span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)", flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
              {article.views.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

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
        onMouseEnter={(e) => { if (current_page !== 1) (e.currentTarget as HTMLElement).style.borderColor = "#0C57A8"; }}
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
            style={{ ...btn, backgroundColor: p === current_page ? "#0C57A8" : "#fff", borderColor: p === current_page ? "#0C57A8" : "#e5e2dd", color: p === current_page ? "#fff" : "#3a3a3a", fontWeight: p === current_page ? "700" : "500" }}
            onClick={() => onPageChange(p as number)}
            onMouseEnter={(e) => { if (p !== current_page) { (e.currentTarget as HTMLElement).style.borderColor = "#0C57A8"; (e.currentTarget as HTMLElement).style.color = "#0C57A8"; } }}
            onMouseLeave={(e) => { if (p !== current_page) { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; (e.currentTarget as HTMLElement).style.color = "#3a3a3a"; } }}
          >
            {p}
          </button>
        )
      )}
      <button
        style={{ ...btn, color: current_page === last_page ? "#c5c3bf" : "#3a3a3a", cursor: current_page === last_page ? "not-allowed" : "pointer" }}
        disabled={current_page === last_page} onClick={() => onPageChange(current_page + 1)}
        onMouseEnter={(e) => { if (current_page !== last_page) (e.currentTarget as HTMLElement).style.borderColor = "#0C57A8"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ popular, popularLoading, categories, activeCategory, onCategoryClick }: {
  popular: PopularArticle[];
  popularLoading: boolean;
  categories: { name: string; count: number }[];
  activeCategory: string | null;
  onCategoryClick: (cat: string | null) => void;
}) {
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Kategori */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "3px solid #0d0d0d", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#0C57A8", fontFamily: "var(--font-sans)" }}>◆</span>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: 0 }}>Kategori</h3>
        </div>
        <div style={{ padding: "8px 0" }}>
          <button
            onClick={() => onCategoryClick(null)}
            style={{ width: "100%", padding: "8px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: activeCategory === null ? "rgba(12,87,168,0.07)" : "transparent", border: "none", borderLeft: activeCategory === null ? "3px solid #0C57A8" : "3px solid transparent", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={(e) => { if (activeCategory !== null) (e.currentTarget as HTMLElement).style.background = "rgba(12,87,168,0.04)"; }}
            onMouseLeave={(e) => { if (activeCategory !== null) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <span style={{ fontSize: "13px", fontWeight: activeCategory === null ? "600" : "400", color: activeCategory === null ? "#0C57A8" : "#3a3a3a", fontFamily: "var(--font-sans)" }}>Semua Artikel</span>
          </button>
          {categories.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => onCategoryClick(name)}
              style={{ width: "100%", padding: "8px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: activeCategory === name ? "rgba(12,87,168,0.07)" : "transparent", border: "none", borderLeft: activeCategory === name ? "3px solid #0C57A8" : "3px solid transparent", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => { if (activeCategory !== name) (e.currentTarget as HTMLElement).style.background = "rgba(12,87,168,0.04)"; }}
              onMouseLeave={(e) => { if (activeCategory !== name) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span style={{ fontSize: "13px", fontWeight: activeCategory === name ? "600" : "400", color: activeCategory === name ? "#0C57A8" : "#3a3a3a", fontFamily: "var(--font-sans)", textAlign: "left" as const }}>{formatCategory(name)}</span>
              <span style={{ fontSize: "10px", fontWeight: "600", color: "#6b6966", backgroundColor: "#f0eeec", padding: "1px 7px", borderRadius: "10px", fontFamily: "var(--font-sans)", flexShrink: 0 }}>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Artikel Populer */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "3px solid #0d0d0d", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#0C57A8", fontFamily: "var(--font-sans)" }}>◆</span>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: 0 }}>Artikel Populer</h3>
        </div>
        <div style={{ padding: "4px 0" }}>
          {popularLoading
            ? [...Array(5)].map((_, i) => (
                <div key={i} style={{ padding: "10px 16px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <div className="skeleton" style={{ width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: "11px", borderRadius: "2px", marginBottom: "5px" }} />
                    <div className="skeleton" style={{ height: "11px", borderRadius: "2px", width: "70%" }} />
                  </div>
                </div>
              ))
            : popular.map((a, idx) => (
                <Link key={a.id} href={`/rubrik/${a.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <div
                    style={{ padding: "10px 16px", display: "flex", gap: "10px", alignItems: "flex-start", transition: "background 0.15s", borderBottom: idx < popular.length - 1 ? "1px solid #f5f4f2" : "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#faf9f7"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <span style={{ flexShrink: 0, width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", fontFamily: "var(--font-sans)", backgroundColor: idx < 3 ? "#0C57A8" : "#f0eeec", color: idx < 3 ? "#fff" : "#6b6966", marginTop: "1px" }}>{idx + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "12px", fontWeight: "600", color: "#0d0d0d", lineHeight: "1.45", fontFamily: "var(--font-serif)", margin: "0 0 4px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.title}</p>
                      <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        {a.views.toLocaleString("id-ID")} tayangan
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>

      {/* Tentang Rubrik */}
      <div style={{ backgroundColor: "#1a3a5c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: "radial-gradient(circle, rgba(12,87,168,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "0 0 8px" }}>Tentang Rubrik</h4>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", fontFamily: "var(--font-sans)", margin: "0 0 14px" }}>Kumpulan artikel dan berita terbaru seputar kegiatan, program, dan perkembangan Wikimedia Indonesia.</p>
      </div>
    </aside>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function RubrikClient({
  initialArticles,
  initialMeta,
  initialPopular,
  initialCategories,
}: {
  initialArticles: Article[];
  initialMeta: Meta | null;
  initialPopular: PopularArticle[];
  initialCategories: { name: string; count: number }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Baca state awal dari URL ──────────────────────────────────────────────
  const pageFromUrl = Number(searchParams.get("page") ?? "1") || 1;
  const categoryFromUrl = searchParams.get("kategori") ?? null;
  const queryFromUrl = searchParams.get("q") ?? "";

  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [meta, setMeta] = useState<Meta | null>(initialMeta);
  const [loading, setLoading] = useState(false);
  const [popular] = useState<PopularArticle[]>(initialPopular);
  const [categories] = useState<{ name: string; count: number }[]>(initialCategories);
  const [searchInput, setSearchInput] = useState(queryFromUrl);

  const PER_PAGE = 12;

  // ── Helper: update URL tanpa reload ──────────────────────────────────────
  const pushUrl = useCallback(
    (page: number, category: string | null, query: string) => {
      const params = new URLSearchParams();
      if (page > 1) params.set("page", String(page));
      if (category) params.set("kategori", category);
      if (query) params.set("q", query);
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname]
  );

  // ── Fetch artikel ─────────────────────────────────────────────────────────
  const fetchArticles = useCallback(async (page: number, category: string | null, query: string) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      let url = "";
      if (query) {
        url = `https://dashboard.wikimedia.or.id/api/v1/articles/search/query?q=${encodeURIComponent(query)}&per_page=${PER_PAGE}&page=${page}`;
      } else if (category) {
        url = `https://dashboard.wikimedia.or.id/api/v1/articles/category/${encodeURIComponent(category)}?per_page=${PER_PAGE}&page=${page}`;
      } else {
        url = `https://dashboard.wikimedia.or.id/api/v1/articles?per_page=${PER_PAGE}&page=${page}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setArticles(json.data);
        setMeta(json.meta);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Sinkronisasi URL → data ───────────────────────────────────────────────
  // Setiap kali URL params berubah, fetch data yang sesuai.
  // Khusus kondisi awal (page 1, tanpa filter), pakai data SSR — skip fetch.
  useEffect(() => {
    if (pageFromUrl === 1 && !categoryFromUrl && !queryFromUrl) {
      // Kondisi default: gunakan data dari server
      setArticles(initialArticles);
      setMeta(initialMeta);
      return;
    }
    fetchArticles(pageFromUrl, categoryFromUrl, queryFromUrl);
  }, [pageFromUrl, categoryFromUrl, queryFromUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handler ───────────────────────────────────────────────────────────────

  const handlePageChange = (page: number) => {
    pushUrl(page, categoryFromUrl, queryFromUrl);
  };

  const handleCategoryClick = (cat: string | null) => {
    setSearchInput("");
    pushUrl(1, cat, "");
  };

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    pushUrl(1, null, searchInput.trim());
  };

  const handleClearFilter = () => {
    setSearchInput("");
    pushUrl(1, null, "");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 24px 36px", position: "relative", overflow: "hidden", backgroundImage: "url('/banner/Mosaik_Budaya_1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.88) 0%, rgba(10,30,65,0.80) 40%, rgba(15,40,80,0.72) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(12,87,168,0.20) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#3b8ed4", fontFamily: "var(--font-sans)" }}>Rubrik</span>
            {categoryFromUrl && (<><span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span><span style={{ fontSize: "11px", color: "#3b8ed4", fontFamily: "var(--font-sans)" }}>{formatCategory(categoryFromUrl)}</span></>)}
            {queryFromUrl && (<><span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span><span style={{ fontSize: "11px", color: "#3b8ed4", fontFamily: "var(--font-sans)" }}>Pencarian: "{queryFromUrl}"</span></>)}
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 0", lineHeight: "1.2" }}>
                {categoryFromUrl ? formatCategory(categoryFromUrl) : queryFromUrl ? `Hasil: "${queryFromUrl}"` : "Artikel & Berita"}
              </h1>
              {meta && (
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: "6px 0 0" }}>
                  {meta.total.toLocaleString("id-ID")} artikel{meta.last_page > 1 && ` · Halaman ${meta.current_page} dari ${meta.last_page}`}
                </p>
              )}
            </div>

            {/* Search */}
            <div style={{ display: "flex", borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
              <input
                type="text" placeholder="Cari artikel..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ padding: "10px 16px", fontSize: "13px", backgroundColor: "rgba(255,255,255,0.06)", border: "none", color: "#fff", fontFamily: "var(--font-sans)", outline: "none", minWidth: "220px" }}
              />
              <button
                onClick={handleSearch}
                style={{ padding: "10px 16px", backgroundColor: "#0C57A8", border: "none", color: "#fff", cursor: "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#0a4a8f")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#0C57A8")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "40px 24px 60px", minHeight: "60vh", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Filter chip */}
          {(categoryFromUrl || queryFromUrl) && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <span style={{ fontSize: "12px", color: "#5c5a57", fontFamily: "var(--font-sans)" }}>Filter aktif:</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 10px", backgroundColor: "rgba(12,87,168,0.1)", border: "1px solid rgba(12,87,168,0.25)", borderRadius: "100px", fontSize: "12px", fontWeight: "600", color: "#0C57A8", fontFamily: "var(--font-sans)" }}>
                {categoryFromUrl ? formatCategory(categoryFromUrl) : `"${queryFromUrl}"`}
                <button onClick={handleClearFilter} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#0C57A8", display: "flex", alignItems: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </span>
            </div>
          )}

          {/* Grid layout */}
          <div className="rubrik-layout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px", alignItems: "start" }}>

            {/* Articles */}
            <div>
              <div className="section-border-shimmer" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px", paddingBottom: "12px", borderBottom: "3px solid #0d0d0d" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0C57A8", fontFamily: "var(--font-sans)" }}>◆ Terkini</span>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "2px", marginBottom: 0 }}>
                    {categoryFromUrl ? formatCategory(categoryFromUrl) : queryFromUrl ? "Hasil Pencarian" : "Semua Artikel"}
                  </h2>
                </div>
                {meta && <span style={{ fontSize: "12px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>{meta.total.toLocaleString("id-ID")} artikel</span>}
              </div>

              {loading ? (
                <div className="articles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                  {[...Array(12)].map((_, i) => <CardSkeleton key={i} />)}
                </div>
              ) : articles.length === 0 ? (
                <div style={{ padding: "60px 24px", textAlign: "center", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px" }}>
                  <span style={{ fontSize: "40px", opacity: 0.2 }}>🔍</span>
                  <p style={{ fontSize: "15px", color: "#6b6966", fontFamily: "var(--font-sans)", marginTop: "12px" }}>Tidak ada artikel ditemukan.</p>
                  <button onClick={handleClearFilter} style={{ marginTop: "16px", padding: "8px 20px", backgroundColor: "#0C57A8", color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
                    Tampilkan Semua
                  </button>
                </div>
              ) : (
                <>
                  <div className="articles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                    {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
                  </div>
                  {meta && meta.last_page > 1 && <Pagination meta={meta} onPageChange={handlePageChange} />}
                </>
              )}
            </div>

            {/* Sidebar */}
            <Sidebar
              popular={popular}
              popularLoading={false}
              categories={categories}
              activeCategory={categoryFromUrl}
              onCategoryClick={handleCategoryClick}
            />
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1100px) {
          .rubrik-layout { grid-template-columns: 1fr 260px !important; }
          .articles-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .rubrik-layout { grid-template-columns: 1fr !important; }
          .articles-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .articles-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}