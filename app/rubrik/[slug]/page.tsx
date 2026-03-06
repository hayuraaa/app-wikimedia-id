"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image: string | null;
  published_at: string;
  views: number;
  authors: { id: number; name: string }[];
  categories: string[];
  keywords: string[];
  creator?: { id: number; name: string };
};

type RelatedArticle = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  views: number;
  authors: { id: number; name: string }[];
  categories: string[];
};

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

const formatDateLong = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatDateShort = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });


const BASE_URL = "https://dashboard.wikimedia.or.id";

const fixImageUrls = (html: string) =>
  html
    .replace(/src="https?:\/\/127\.0\.0\.1:\d+\/storage\//g, `src="${BASE_URL}/storage/`)
    .replace(/src="https?:\/\/localhost(:\d+)?\/storage\//g, `src="${BASE_URL}/storage/`)
    .replace(/src="(?!http)(\/storage\/)/g, `src="${BASE_URL}/storage/`);

const estimateReadingTime = (content: string) => {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

// ─── Reading Progress Bar ─────────────────────────────────────────────────────

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "3px",
        backgroundColor: "rgba(139,26,42,0.15)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #8b1a2a, #e05070)",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

// ─── Related Article Card ─────────────────────────────────────────────────────

function RelatedCard({ article }: { article: RelatedArticle }) {
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
        <div style={{ height: "160px", backgroundColor: "#f0eeec", overflow: "hidden", borderBottom: "1px solid #e5e2dd", flexShrink: 0 }}>
          {article.featured_image ? (
            <img
              src={article.featured_image}
              alt={article.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0eeec, #e5e2dd)" }}>
              <span style={{ fontSize: "32px", opacity: 0.15 }}>📰</span>
            </div>
          )}
        </div>
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: "7px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
            {article.categories?.[0] && (
              <span
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/rubrik/kategori/${article.categories[0]}`); }}
                style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: "#1e4d7b", backgroundColor: "rgba(30,77,123,0.08)", padding: "2px 7px", borderRadius: "2px", fontFamily: "var(--font-sans)", cursor: "pointer" }}
              >
                {formatCategory(article.categories[0])}
              </span>
            )}
            <span style={{ fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" as const, marginLeft: "auto" }}>
              {formatDateShort(article.published_at)}
            </span>
          </div>
          <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#0d0d0d", lineHeight: "1.45", fontFamily: "var(--font-serif)", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
            {article.title}
          </h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid #f0eeec" }}>
            <span style={{ fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>{article.authors?.[0]?.name ?? "—"}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              {article.views.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ArticleSkeleton() {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "48px" }}>
        <div>
          <div className="skeleton" style={{ height: "12px", width: "30%", borderRadius: "2px", marginBottom: "20px" }} />
          <div className="skeleton" style={{ height: "36px", borderRadius: "2px", marginBottom: "10px" }} />
          <div className="skeleton" style={{ height: "36px", width: "75%", borderRadius: "2px", marginBottom: "24px" }} />
          <div className="skeleton" style={{ height: "14px", width: "50%", borderRadius: "2px", marginBottom: "32px" }} />
          <div className="skeleton" style={{ height: "400px", borderRadius: "4px", marginBottom: "32px" }} />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "14px", borderRadius: "2px", marginBottom: "10px", width: i % 3 === 2 ? "65%" : "100%" }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="skeleton" style={{ height: "200px", borderRadius: "4px" }} />
          <div className="skeleton" style={{ height: "300px", borderRadius: "4px" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<RelatedArticle[]>([]);
  const [latest, setLatest] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`https://dashboard.wikimedia.or.id/api/v1/articles/${slug}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setArticle(json.data);
          // increment views
          fetch(`https://dashboard.wikimedia.or.id/api/v1/articles/${slug}/views`, { method: "POST" }).catch(() => {});
          // fetch related from ALL categories, merge & deduplicate
          const cats: string[] = json.data.categories ?? [];
          if (cats.length > 0) {
            Promise.all(
              cats.map((cat: string) =>
                fetch(`https://dashboard.wikimedia.or.id/api/v1/articles/category/${encodeURIComponent(cat)}?per_page=6`)
                  .then((r) => r.json())
                  .catch(() => ({ success: false }))
              )
            ).then((results) => {
              const seen = new Set<string>([json.data.slug]);
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
              setRelated(merged.slice(0, 5));
            });
          }
          // fetch latest articles
          fetch(`https://dashboard.wikimedia.or.id/api/v1/articles/latest/list?limit=6`)
            .then((r) => r.json())
            .then((lat) => {
              if (lat.success) {
                setLatest(lat.data.filter((a: RelatedArticle) => a.slug !== json.data.slug).slice(0, 5));
              }
            })
            .catch(() => {});
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "#f8f7f5", minHeight: "100vh" }}>
        <ReadingProgress />
        <ArticleSkeleton />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div style={{ backgroundColor: "#f8f7f5", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "48px", opacity: 0.2 }}>📄</span>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "16px 0 8px" }}>Artikel Tidak Ditemukan</h2>
          <p style={{ fontSize: "14px", color: "#9a9690", fontFamily: "var(--font-sans)", marginBottom: "24px" }}>Artikel yang kamu cari mungkin sudah dihapus atau URL tidak valid.</p>
          <Link href="/rubrik" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 24px", backgroundColor: "#8b1a2a", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em" }}>
            ← Kembali ke Rubrik
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = estimateReadingTime(article.content);

  return (
    <>
      <ReadingProgress />

      {/* ── HERO / TITLE AREA ─────────────────────────────────────────────── */}
      <section style={{ padding: "48px 24px 0", position: "relative", overflow: "hidden", backgroundImage: "url('/banner/Mosaik_Budaya_1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        {/* Overlay gradient biru gelap */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.90) 0%, rgba(10,30,65,0.82) 40%, rgba(15,40,80,0.75) 100%)", pointerEvents: "none" }} />
        {/* Grid pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "28px", flexWrap: "wrap" as const }}>
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
            {article.categories?.[0] && (
              <>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)" }}>/</span>
                <Link href={`/rubrik/kategori/${article.categories[0]}`} style={{ fontSize: "11px", color: "#e05070", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f07090")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#e05070")}>
                  {formatCategory(article.categories[0])}
                </Link>
              </>
            )}
          </div>

          {/* Categories */}
          {article.categories?.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const, marginBottom: "16px" }}>
              {article.categories.map((cat) => (
                <Link key={cat} href={`/rubrik/kategori/${cat}`}
                  style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#e05070", backgroundColor: "rgba(224,80,112,0.12)", border: "1px solid rgba(224,80,112,0.25)", padding: "3px 10px", borderRadius: "2px", fontFamily: "var(--font-sans)", textDecoration: "none", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(224,80,112,0.22)"; e.currentTarget.style.color = "#f07090"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(224,80,112,0.12)"; e.currentTarget.style.color = "#e05070"; }}
                >
                  {formatCategory(cat)}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: "700", color: "#ffffff",
            lineHeight: "1.2", fontFamily: "var(--font-serif)", margin: "0 0 24px",
            maxWidth: "860px", letterSpacing: "-0.01em",
          }}>
            {article.title}
          </h1>

          {/* Meta bar */}
          <div style={{
            display: "flex", alignItems: "center", flexWrap: "wrap" as const, gap: "20px",
            paddingBottom: "28px", borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}>
            {/* Authors */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(139,26,42,0.4)", border: "1px solid rgba(139,26,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                {article.authors?.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "4px" }}>
                    {article.authors.map((a, i) => (
                      <span key={a.id}>
                        <span
                          onClick={() => router.push(`/rubrik/author/${a.name.toLowerCase().replace(/\s+/g, "-")}`)}
                          style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans)", cursor: "pointer", transition: "color 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#e05070")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                        >
                          {a.name}
                        </span>
                        {i < article.authors.length - 1 && <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)" }}>, </span>}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)" }}>Redaksi WMID</span>
                )}
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-sans)", margin: 0 }}>Penulis</p>
              </div>
            </div>

            <div style={{ width: "1px", height: "32px", backgroundColor: "rgba(255,255,255,0.1)" }} />

            {/* Date */}
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-sans)" }}>
                {formatDateLong(article.published_at)}
              </span>
            </div>

            <div style={{ width: "1px", height: "32px", backgroundColor: "rgba(255,255,255,0.1)" }} />

            {/* Read time */}
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-sans)" }}>{readingTime} menit baca</span>
            </div>

            <div style={{ width: "1px", height: "32px", backgroundColor: "rgba(255,255,255,0.1)" }} />

            {/* Views */}
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-sans)" }}>{article.views.toLocaleString("id-ID")} tayangan</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "0 24px 60px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="article-layout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "48px", alignItems: "start" }}>

            {/* ── Left: Article body ── */}
            <div>
              {/* Featured image */}
              {article.featured_image && (
                <div style={{ marginTop: "-1px", marginBottom: "0", position: "relative" }}>
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    style={{ width: "100%", maxHeight: "480px", objectFit: "cover", display: "block" }}
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(transparent, #f8f7f5)", pointerEvents: "none" }} />
                </div>
              )}

              {/* Article content */}
              <div
                ref={contentRef}
                className="article-content"
                style={{ paddingTop: article.featured_image ? "32px" : "40px" }}
                dangerouslySetInnerHTML={{ __html: fixImageUrls(article.content) }}
              />

              {/* Keywords */}
              {article.keywords?.length > 0 && (
                <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #e5e2dd" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#9a9690", fontFamily: "var(--font-sans)", display: "block", marginBottom: "10px" }}>
                    Kata Kunci
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px" }}>
                    {article.keywords.map((kw) => (
                      <span key={kw} style={{ fontSize: "12px", color: "#5c5a57", backgroundColor: "#f0eeec", border: "1px solid #e5e2dd", padding: "3px 10px", borderRadius: "100px", fontFamily: "var(--font-sans)" }}>
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share + back */}
              <div style={{ marginTop: "36px", paddingTop: "24px", borderTop: "2px solid #0d0d0d", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "12px" }}>
                <Link href="/rubrik" style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: "#5c5a57", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#8b1a2a")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5a57")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                  Kembali ke Rubrik
                </Link>

                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#9a9690", fontFamily: "var(--font-sans)", alignSelf: "center" }}>Bagikan:</span>
                  {/* Twitter/X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "50%", border: "1px solid #e5e2dd", backgroundColor: "#fff", color: "#5c5a57", textDecoration: "none", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#0d0d0d"; e.currentTarget.style.borderColor = "#0d0d0d"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.borderColor = "#e5e2dd"; e.currentTarget.style.color = "#5c5a57"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "50%", border: "1px solid #e5e2dd", backgroundColor: "#fff", color: "#5c5a57", textDecoration: "none", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1877f2"; e.currentTarget.style.borderColor = "#1877f2"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.borderColor = "#e5e2dd"; e.currentTarget.style.color = "#5c5a57"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  {/* Copy link */}
                  <button
                    onClick={handleCopy}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "50%", border: "1px solid #e5e2dd", backgroundColor: copied ? "#16a34a" : "#fff", color: copied ? "#fff" : "#5c5a57", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { if (!copied) { (e.currentTarget as HTMLElement).style.backgroundColor = "#8b1a2a"; (e.currentTarget as HTMLElement).style.borderColor = "#8b1a2a"; (e.currentTarget as HTMLElement).style.color = "#fff"; } }}
                    onMouseLeave={(e) => { if (!copied) { (e.currentTarget as HTMLElement).style.backgroundColor = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; (e.currentTarget as HTMLElement).style.color = "#5c5a57"; } }}
                    title="Salin tautan"
                  >
                    {copied ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Author bio card */}
              {article.authors?.length > 0 && (
                <div style={{ marginTop: "32px", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", borderLeft: "3px solid #8b1a2a", padding: "20px 24px" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Tentang Penulis</span>
                  <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {article.authors.map((a) => (
                      <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(139,26,42,0.1)", border: "2px solid rgba(139,26,42,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: "15px", fontWeight: "700", color: "#8b1a2a", fontFamily: "var(--font-serif)" }}>{a.name.charAt(0)}</span>
                        </div>
                        <div>
                          <span
                            onClick={() => router.push(`/rubrik/author/${a.name.toLowerCase().replace(/\s+/g, "-")}`)}
                            style={{ fontSize: "14px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", cursor: "pointer", transition: "color 0.15s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#8b1a2a")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#0d0d0d")}
                          >
                            {a.name}
                          </span>
                          <p style={{ fontSize: "12px", color: "#9a9690", fontFamily: "var(--font-sans)", margin: "2px 0 0" }}>Kontributor Wikimedia Indonesia</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Sticky sidebar ── */}
            <div className="article-sidebar" style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "20px", marginTop: "32px" }}>

              {/* Artikel Terkait */}
              {related.length > 0 && (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "3px solid #0d0d0d" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: article.categories?.length > 1 ? "8px" : "0" }}>
                      <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Artikel Terkait</span>
                    </div>
                    {article.categories?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "4px" }}>
                        {article.categories.map((cat) => (
                          <Link key={cat} href={`/rubrik/kategori/${cat}`}
                            style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: "#1e4d7b", backgroundColor: "rgba(30,77,123,0.08)", border: "1px solid rgba(30,77,123,0.15)", padding: "2px 8px", borderRadius: "2px", fontFamily: "var(--font-sans)", textDecoration: "none", transition: "all 0.15s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(139,26,42,0.08)"; e.currentTarget.style.borderColor = "rgba(139,26,42,0.2)"; e.currentTarget.style.color = "#8b1a2a"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(30,77,123,0.08)"; e.currentTarget.style.borderColor = "rgba(30,77,123,0.15)"; e.currentTarget.style.color = "#1e4d7b"; }}
                          >
                            {formatCategory(cat)} →
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "4px 0" }}>
                    {related.map((a, idx) => (
                      <Link key={a.id} href={`/rubrik/${a.slug}`} style={{ textDecoration: "none", display: "block" }}>
                        <div
                          style={{ padding: "12px 16px", display: "flex", gap: "10px", alignItems: "flex-start", transition: "background 0.15s", borderBottom: idx < related.length - 1 ? "1px solid #f5f4f2" : "none" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#faf9f7"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          {a.featured_image ? (
                            <img src={a.featured_image} alt={a.title} style={{ width: "60px", height: "48px", objectFit: "cover", borderRadius: "3px", flexShrink: 0, border: "1px solid #e5e2dd" }} />
                          ) : (
                            <div style={{ width: "60px", height: "48px", backgroundColor: "#f0eeec", borderRadius: "3px", flexShrink: 0, border: "1px solid #e5e2dd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: "16px", opacity: 0.2 }}>📰</span>
                            </div>
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {a.categories?.[0] && (
                              <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: "#1e4d7b", fontFamily: "var(--font-sans)", display: "block", marginBottom: "3px" }}>
                                {formatCategory(a.categories[0])}
                              </span>
                            )}
                            <p style={{ fontSize: "12px", fontWeight: "600", color: "#0d0d0d", lineHeight: "1.4", fontFamily: "var(--font-serif)", margin: "0 0 3px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{a.title}</p>
                            <span style={{ fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>{formatDateShort(a.published_at)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Artikel Terbaru */}
              {latest.length > 0 && (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "3px solid #0d0d0d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Terbaru</span>
                    <Link href="/rubrik" style={{ fontSize: "10px", color: "#1e4d7b", textDecoration: "none", fontFamily: "var(--font-sans)", fontWeight: "600" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#8b1a2a")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#1e4d7b")}>
                      Lihat semua →
                    </Link>
                  </div>
                  <div style={{ padding: "4px 0" }}>
                    {latest.map((a, idx) => (
                      <Link key={a.id} href={`/rubrik/${a.slug}`} style={{ textDecoration: "none", display: "block" }}>
                        <div
                          style={{ padding: "11px 16px", display: "flex", gap: "10px", alignItems: "flex-start", transition: "background 0.15s", borderBottom: idx < latest.length - 1 ? "1px solid #f5f4f2" : "none" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#faf9f7"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          <span style={{ fontSize: "16px", fontWeight: "800", color: "#e5e2dd", fontFamily: "var(--font-serif)", lineHeight: 1, flexShrink: 0, width: "20px", textAlign: "center" as const, paddingTop: "2px" }}>
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: "12px", fontWeight: "600", color: "#0d0d0d", lineHeight: "1.4", fontFamily: "var(--font-serif)", margin: "0 0 3px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{a.title}</p>
                            <span style={{ fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>{formatDateShort(a.published_at)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── MORE ARTICLES (related grid) ─────────────────────────────────── */}
      {related.length > 0 && (
        <section style={{ backgroundColor: "#ffffff", padding: "60px 24px", borderTop: "1px solid #e5e2dd" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div className="section-border-shimmer" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "14px", borderBottom: "3px solid #0d0d0d" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Terkait</span>
                <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "4px", marginBottom: 0 }}>Artikel Lainnya</h2>
              </div>
              {article.categories?.[0] && (
                <Link href={`/rubrik/kategori/${article.categories[0]}`} style={{ fontSize: "13px", fontWeight: "600", color: "#1e4d7b", textDecoration: "none", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", whiteSpace: "nowrap" as const, transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#8b1a2a")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#1e4d7b")}>
                  Lihat Semua →
                </Link>
              )}
            </div>
            <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {related.map((a) => <RelatedCard key={a.id} article={a} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── ARTICLE CONTENT STYLES ───────────────────────────────────────── */}
      <style>{`
        .article-content {
          font-family: var(--font-serif);
          font-size: 17px;
          line-height: 1.85;
          color: #1a1a18;
          max-width: 720px;
        }
        .article-content p {
          margin: 0 0 1.5em;
        }
        .article-content h2 {
          font-size: 1.55em;
          font-weight: 700;
          color: #0d0d0d;
          margin: 2em 0 0.6em;
          line-height: 1.25;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e2dd;
        }
        .article-content h3 {
          font-size: 1.25em;
          font-weight: 700;
          color: #0d0d0d;
          margin: 1.6em 0 0.5em;
          line-height: 1.3;
        }
        .article-content h4 {
          font-size: 1.1em;
          font-weight: 700;
          color: #2a2826;
          margin: 1.4em 0 0.4em;
        }
        .article-content a {
          color: #1e4d7b;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.15s;
        }
        .article-content a:hover {
          color: #8b1a2a;
        }
        .article-content blockquote {
          margin: 2em 0;
          padding: 16px 24px;
          border-left: 4px solid #8b1a2a;
          background: rgba(139,26,42,0.04);
          border-radius: 0 4px 4px 0;
          font-style: italic;
          color: #3a3a3a;
        }
        .article-content blockquote p { margin: 0; }
        .article-content ul, .article-content ol {
          margin: 0 0 1.5em;
          padding-left: 1.6em;
        }
        .article-content li {
          margin-bottom: 0.4em;
        }
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 1.5em 0 0;
          border: 1px solid #e5e2dd;
          display: block;
        }
        .article-content figure {
          margin: 1.8em 0;
        }
        .article-content figure img {
          margin: 0;
          width: 100%;
        }
        .article-content figcaption {
          margin-top: 6px;
          font-size: 0.82em;
          color: #7a7874;
          font-style: italic;
          font-family: var(--font-sans);
          text-align: center;
          line-height: 1.45;
          padding: 0 8px;
        }
        .article-content figcaption p {
          margin: 0;
        }
        .article-content code {
          font-family: 'Courier New', monospace;
          font-size: 0.88em;
          background: #f0eeec;
          border: 1px solid #e5e2dd;
          padding: 1px 6px;
          border-radius: 3px;
          color: #8b1a2a;
        }
        .article-content pre {
          background: #0d0d0d;
          color: #f8f8f6;
          padding: 20px 24px;
          border-radius: 4px;
          overflow-x: auto;
          margin: 1.5em 0;
          font-size: 0.875em;
          line-height: 1.6;
        }
        .article-content pre code {
          background: none;
          border: none;
          padding: 0;
          color: inherit;
          font-size: inherit;
        }
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
          font-size: 0.9em;
          font-family: var(--font-sans);
        }
        .article-content th {
          background: #0d0d0d;
          color: #fff;
          padding: 10px 14px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .article-content td {
          padding: 10px 14px;
          border-bottom: 1px solid #e5e2dd;
          color: #2a2826;
        }
        .article-content tr:hover td {
          background: #faf9f7;
        }
        .article-content strong { font-weight: 700; color: #0d0d0d; }
        .article-content em { font-style: italic; }
        .article-content hr {
          border: none;
          border-top: 2px solid #e5e2dd;
          margin: 2.5em 0;
        }

        @media (max-width: 900px) {
          .article-layout {
            grid-template-columns: 1fr !important;
          }
          .article-sidebar {
            position: static !important;
            order: -1;
          }
          .article-content {
            max-width: 100%;
            font-size: 16px;
          }
        }
        @media (max-width: 640px) {
          .related-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .related-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
}