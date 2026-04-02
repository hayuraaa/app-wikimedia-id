"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type ResultType = "semua" | "artikel" | "acara" | "ruang-pers" | "faq";

type SearchResult = {
  type: Exclude<ResultType, "semua">;
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date?: string;
  image?: string | null;
  meta?: string;
};

type PageMap = Record<Exclude<ResultType, "semua">, number>;

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE = "https://dashboard.wikimedia.or.id/api/v1";
const PER_PAGE = 8;

const TYPE_META: Record<
  Exclude<ResultType, "semua">,
  { label: string; color: string; bg: string; border: string; href: (slug: string) => string; icon: React.ReactNode }
> = {
  artikel: {
    label: "Artikel", color: "#1e4d7b",
    bg: "rgba(30,77,123,0.07)", border: "rgba(30,77,123,0.2)",
    href: (s) => `/rubrik/${s}`,
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
  },
  acara: {
    label: "Acara", color: "#16a34a",
    bg: "rgba(22,163,74,0.07)", border: "rgba(22,163,74,0.2)",
    href: (s) => `/acara/${s}`,
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  "ruang-pers": {
    label: "Siaran Pers", color: "#b45309",
    bg: "rgba(180,83,9,0.07)", border: "rgba(180,83,9,0.2)",
    href: (s) => `/ruang-pers/${s}`,
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>,
  },
  faq: {
    label: "FAQ", color: "#7c3aed",
    bg: "rgba(124,58,237,0.07)", border: "rgba(124,58,237,0.2)",
    href: () => `/faq`,
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
};

const FILTERS: { key: ResultType; label: string }[] = [
  { key: "semua",      label: "Semua" },
  { key: "artikel",    label: "Artikel" },
  { key: "acara",      label: "Acara" },
  { key: "ruang-pers", label: "Siaran Pers" },
  { key: "faq",        label: "FAQ" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase()
      ? <mark key={i} style={{ backgroundColor: "rgba(12,87,168,0.12)", color: "#0C57A8", fontWeight: "700", borderRadius: "2px", padding: "0 1px" }}>{p}</mark>
      : p
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;

  const pages: (number | "...")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  const btn: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    minWidth: "32px", height: "32px", padding: "0 6px",
    borderRadius: "3px", border: "1px solid #e5e2dd",
    backgroundColor: "#fff", fontSize: "12px", fontWeight: "500",
    fontFamily: "var(--font-sans)", cursor: "pointer", transition: "all 0.2s", color: "#3a3a3a",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", paddingTop: "28px" }}>
      <button
        style={{ ...btn, color: current === 1 ? "#c5c3bf" : "#3a3a3a", cursor: current === 1 ? "not-allowed" : "pointer" }}
        disabled={current === 1} onClick={() => onChange(current - 1)}
        onMouseEnter={(e) => { if (current !== 1) (e.currentTarget as HTMLElement).style.borderColor = "#0C57A8"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`e-${idx}`} style={{ minWidth: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>···</span>
        ) : (
          <button key={p}
            style={{ ...btn, backgroundColor: p === current ? "#0C57A8" : "#fff", borderColor: p === current ? "#0C57A8" : "#e5e2dd", color: p === current ? "#fff" : "#3a3a3a", fontWeight: p === current ? "700" : "500" }}
            onClick={() => onChange(p as number)}
            onMouseEnter={(e) => { if (p !== current) { (e.currentTarget as HTMLElement).style.borderColor = "#0C57A8"; (e.currentTarget as HTMLElement).style.color = "#0C57A8"; } }}
            onMouseLeave={(e) => { if (p !== current) { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; (e.currentTarget as HTMLElement).style.color = "#3a3a3a"; } }}
          >
            {p}
          </button>
        )
      )}
      <button
        style={{ ...btn, color: current === total ? "#c5c3bf" : "#3a3a3a", cursor: current === total ? "not-allowed" : "pointer" }}
        disabled={current === total} onClick={() => onChange(current + 1)}
        onMouseEnter={(e) => { if (current !== total) (e.currentTarget as HTMLElement).style.borderColor = "#0C57A8"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ResultSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "18px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <div className="skeleton" style={{ width: "110px", height: "72px", borderRadius: "3px", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "7px" }}>
            <div className="skeleton" style={{ height: "10px", width: "18%", borderRadius: "2px" }} />
            <div className="skeleton" style={{ height: "15px", width: "72%", borderRadius: "2px" }} />
            <div className="skeleton" style={{ height: "12px", borderRadius: "2px" }} />
            <div className="skeleton" style={{ height: "12px", width: "55%", borderRadius: "2px" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────

function ResultCard({ result, query }: { result: SearchResult; query: string }) {
  const m = TYPE_META[result.type];
  const excerpt = stripHtml(result.excerpt || "");
  const truncated = excerpt.length > 150 ? excerpt.slice(0, 150) + "…" : excerpt;

  return (
    <Link href={m.href(result.slug)} style={{ textDecoration: "none", display: "block" }}>
      <article
        style={{
          backgroundColor: "#fff", border: "1px solid #e5e2dd",
          borderLeft: `3px solid ${m.color}`, borderRadius: "4px",
          overflow: "hidden", display: "flex",
          transition: "box-shadow 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateX(3px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
      >
        {result.image && (
          <div style={{ width: "120px", flexShrink: 0, backgroundColor: "#f0eeec", overflow: "hidden" }}>
            <img src={result.image} alt={result.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              fontSize: "9px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const,
              color: m.color, backgroundColor: m.bg, border: `1px solid ${m.border}`,
              padding: "2px 7px", borderRadius: "2px", fontFamily: "var(--font-sans)",
            }}>
              {m.icon}{m.label}
            </span>
            {result.date && <span style={{ fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>{formatDate(result.date)}</span>}
            {result.meta && <span style={{ fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>· {result.meta}</span>}
          </div>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0d0d0d", lineHeight: "1.45", fontFamily: "var(--font-serif)", margin: 0 }}>
            {highlightText(result.title, query)}
          </h3>
          {truncated && (
            <p style={{ fontSize: "12px", color: "#5c5a57", lineHeight: "1.65", fontFamily: "var(--font-sans)", margin: 0 }}>
              {highlightText(truncated, query)}
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: m.color, fontFamily: "var(--font-sans)" }}>
              {result.type === "faq" ? "Lihat di FAQ" : "Baca selengkapnya"}
            </span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ query }: { query: string }) {
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "56px 24px", textAlign: "center" }}>
      <div style={{ fontSize: "44px", marginBottom: "14px", opacity: 0.2 }}>🔍</div>
      <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "0 0 8px" }}>
        Tidak ada hasil untuk "{query}"
      </h3>
      <p style={{ fontSize: "13px", color: "#6b6966", fontFamily: "var(--font-sans)", lineHeight: "1.7", marginBottom: "20px" }}>
        Coba gunakan kata kunci yang berbeda atau lebih umum.
      </p>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
        {["Wikimedia", "Wikipedia", "Program", "Acara", "Berita"].map((s) => (
          <Link key={s} href={`/cari?q=${s}`} style={{
            padding: "5px 13px", backgroundColor: "#f8f7f5", border: "1px solid #e5e2dd",
            borderRadius: "100px", fontSize: "12px", color: "#5c5a57",
            fontFamily: "var(--font-sans)", textDecoration: "none", transition: "all 0.15s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#0d0d0d"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#0d0d0d"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f8f7f5"; e.currentTarget.style.color = "#5c5a57"; e.currentTarget.style.borderColor = "#e5e2dd"; }}
          >
            {s}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Inner Page ───────────────────────────────────────────────────────────────

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [inputValue,   setInputValue]   = useState(initialQuery);
  const [activeQuery,  setActiveQuery]  = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<ResultType>("semua");
  const [results,      setResults]      = useState<SearchResult[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [searched,     setSearched]     = useState(false);

  // per-type page + "semua" page
  const [pages,   setPages]   = useState<PageMap>({ artikel: 1, acara: 1, "ruang-pers": 1, faq: 1 });
  const [semPage, setSemPage] = useState(1);

  // Derived
  const counts = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  counts["semua"] = results.length;

  const currentPage = activeFilter === "semua" ? semPage : pages[activeFilter as Exclude<ResultType, "semua">];

  const filteredAll = activeFilter === "semua" ? results : results.filter((r) => r.type === activeFilter);
  const totalPages  = Math.ceil(filteredAll.length / PER_PAGE);
  const pageSlice   = filteredAll.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleFilterChange = (f: ResultType) => {
    setActiveFilter(f);
    setSemPage(1);
    setPages({ artikel: 1, acara: 1, "ruang-pers": 1, faq: 1 });
  };

  const handlePageChange = (p: number) => {
    if (activeFilter === "semua") {
      setSemPage(p);
    } else {
      setPages((prev) => ({ ...prev, [activeFilter]: p }));
    }
    document.getElementById("search-results-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(false);
    setSemPage(1);
    setPages({ artikel: 1, acara: 1, "ruang-pers": 1, faq: 1 });
    try {
      const [artRes, eventRes, faqRes, persRes] = await Promise.allSettled([
        fetch(`${BASE}/articles?search=${encodeURIComponent(q)}&per_page=50`).then((r) => r.json()),
        fetch(`${BASE}/events?search=${encodeURIComponent(q)}&per_page=50`).then((r) => r.json()),
        fetch(`${BASE}/faq/search?q=${encodeURIComponent(q)}`).then((r) => r.json()),
        fetch(`${BASE}/press-releases/search/query?q=${encodeURIComponent(q)}&per_page=50`).then((r) => r.json()),
      ]);

      const combined: SearchResult[] = [];

      if (artRes.status === "fulfilled" && artRes.value?.success) {
        (artRes.value.data as any[]).forEach((a: any) => combined.push({
          type: "artikel", id: a.id, title: a.title, excerpt: a.excerpt || "",
          slug: a.slug, date: a.published_at, image: a.featured_image, meta: a.authors?.[0]?.name,
        }));
      }
      if (eventRes.status === "fulfilled" && eventRes.value?.success) {
        (eventRes.value.data as any[]).forEach((e: any) => combined.push({
          type: "acara", id: e.id, title: e.judul, excerpt: e.deskripsi || "",
          slug: e.slug, date: e.tanggal_mulai, meta: e.lokasi,
        }));
      }
      if (faqRes.status === "fulfilled" && faqRes.value?.success) {
        (faqRes.value.data as any[]).forEach((f: any) => combined.push({
          type: "faq", id: f.id, title: f.question, excerpt: f.answer || "",
          slug: `faq-${f.id}`, meta: f.category?.name,
        }));
      }
      if (persRes.status === "fulfilled" && persRes.value?.success) {
        (persRes.value.data as any[]).forEach((p: any) => combined.push({
          type: "ruang-pers", id: p.id, title: p.title, excerpt: p.excerpt || "",
          slug: p.slug, date: p.published_at, image: p.featured_image, meta: p.creator?.name,
        }));
      }

      setResults(combined);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setInputValue(initialQuery);
      setActiveQuery(initialQuery);
      setActiveFilter("semua");
      doSearch(initialQuery);
    }
  }, [initialQuery, doSearch]);

  const handleSubmit = () => {
    const q = inputValue.trim();
    if (!q) return;
    setActiveQuery(q);
    setActiveFilter("semua");
    router.push(`/cari?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        padding: "40px 24px 36px", position: "relative", overflow: "hidden",
        backgroundImage: "url('/banner/Mosaik_Budaya_1.png')",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        {/* Overlay — sama dengan rubrik */}
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
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-sans)" }}>Pencarian</span>
            {activeQuery && (
              <>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
                <span style={{ fontSize: "11px", color: "#3b8ed4", fontFamily: "var(--font-sans)" }}>"{activeQuery}"</span>
              </>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "20px" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Pencarian</span>
              <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 0", lineHeight: "1.2" }}>
                {activeQuery
                  ? <>Hasil untuk <span style={{ color: "#3b8ed4" }}>"{activeQuery}"</span></>
                  : "Cari Konten"}
              </h1>
              {searched && !loading && (
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: "6px 0 0" }}>
                  {results.length === 0
                    ? "Tidak ada hasil ditemukan"
                    : `${results.length} hasil ditemukan`}
                  {results.length > 0 && totalPages > 1 && (
                    <span> · Halaman {currentPage} dari {totalPages}</span>
                  )}
                </p>
              )}
            </div>

            {/* Search bar */}
            <div style={{ display: "flex", borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
              <input
                type="text" placeholder="Cari artikel, acara, FAQ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{ padding: "10px 16px", fontSize: "13px", backgroundColor: "rgba(255,255,255,0.06)", border: "none", color: "#fff", fontFamily: "var(--font-sans)", outline: "none", minWidth: "240px" }}
              />
              {inputValue && (
                <button onClick={() => setInputValue("")}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", background: "rgba(255,255,255,0.04)", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              )}
              <button onClick={handleSubmit}
                style={{ padding: "10px 16px", backgroundColor: "#0C57A8", border: "none", color: "#fff", cursor: "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#0a4a8f")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#0C57A8")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULTS ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "36px 24px 72px", minHeight: "50vh", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "28px", alignItems: "start" }} className="search-layout">

            {/* ── Sidebar ── */}
            <div style={{ position: "sticky", top: "96px" }} className="search-sidebar">
              <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "3px", background: "linear-gradient(90deg, #0C57A8, #1e4d7b)" }} />
                <div style={{ padding: "14px 14px 10px" }}>
                  <p style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#6b6966", fontFamily: "var(--font-sans)", margin: "0 0 10px" }}>
                    Filter Tipe
                  </p>
                  {FILTERS.map((f) => {
                    const isActive = activeFilter === f.key;
                    const count    = counts[f.key] ?? 0;
                    const tm       = f.key !== "semua" ? TYPE_META[f.key as Exclude<ResultType, "semua">] : null;
                    const disabled = f.key !== "semua" && !count;
                    return (
                      <button key={f.key} onClick={() => !disabled && handleFilterChange(f.key)}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "9px 10px", marginBottom: "2px", borderRadius: "3px", border: "none",
                          backgroundColor: isActive ? (tm ? tm.bg : "rgba(13,13,13,0.06)") : "transparent",
                          cursor: disabled ? "not-allowed" : "pointer",
                          transition: "all 0.15s", opacity: disabled ? 0.4 : 1,
                        }}
                        onMouseEnter={(e) => { if (!isActive && !disabled) (e.currentTarget as HTMLElement).style.backgroundColor = "#f8f7f5"; }}
                        onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                      >
                        <span style={{ fontSize: "13px", fontWeight: isActive ? "700" : "500", color: isActive ? (tm ? tm.color : "#0d0d0d") : "#3a3a3a", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: "6px" }}>
                          {tm && <span style={{ color: tm.color }}>{tm.icon}</span>}
                          {f.label}
                        </span>
                        {count > 0 && (
                          <span style={{ fontSize: "10px", fontWeight: "700", color: isActive ? (tm ? tm.color : "#0d0d0d") : "#6b6966", backgroundColor: isActive ? (tm ? tm.bg : "rgba(13,13,13,0.08)") : "#f0eeec", padding: "1px 7px", borderRadius: "100px", fontFamily: "var(--font-sans)" }}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div style={{ padding: "10px 14px", borderTop: "1px solid #f5f4f2" }}>
                  <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6b6966", fontFamily: "var(--font-sans)", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#0C57A8")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6966")}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                    Kembali ke Beranda
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Results list ── */}
            <div>
              {/* Section header */}
              <div id="search-results-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px", paddingBottom: "12px", borderBottom: "3px solid #0d0d0d" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0C57A8", fontFamily: "var(--font-sans)" }}>
                    ◆ {activeFilter === "semua" ? "Semua Hasil" : TYPE_META[activeFilter as Exclude<ResultType, "semua">]?.label}
                  </span>
                  {activeQuery && (
                    <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "4px 0 0" }}>
                      "{activeQuery}"
                    </h2>
                  )}
                </div>
                {!loading && searched && filteredAll.length > 0 && (
                  <span style={{ fontSize: "12px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>
                    {filteredAll.length} hasil
                    {totalPages > 1 && ` · hal. ${currentPage}/${totalPages}`}
                  </span>
                )}
              </div>

              {/* Body */}
              {!activeQuery ? (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "60px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: "44px", marginBottom: "14px", opacity: 0.2 }}>🔍</div>
                  <p style={{ fontSize: "14px", color: "#6b6966", fontFamily: "var(--font-sans)", margin: 0 }}>
                    Ketik kata kunci di atas untuk mulai mencari.
                  </p>
                </div>
              ) : loading ? (
                <ResultSkeleton />
              ) : results.length === 0 ? (
                <EmptyState query={activeQuery} />
              ) : filteredAll.length === 0 ? (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "40px 24px", textAlign: "center" }}>
                  <p style={{ fontSize: "14px", color: "#6b6966", fontFamily: "var(--font-sans)", margin: 0 }}>
                    Tidak ada hasil untuk filter ini.
                  </p>
                  <button onClick={() => handleFilterChange("semua")}
                    style={{ marginTop: "12px", padding: "7px 18px", backgroundColor: "#0C57A8", color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
                    Tampilkan Semua
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {pageSlice.map((r) => <ResultCard key={`${r.type}-${r.id}`} result={r} query={activeQuery} />)}
                  </div>
                  <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .search-layout  { grid-template-columns: 1fr !important; }
          .search-sidebar { position: static !important; }
        }
      `}</style>
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f7f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0C57A8" strokeWidth="2" style={{ animation: "spin 0.8s linear infinite" }}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  );
}