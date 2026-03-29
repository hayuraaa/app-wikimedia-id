"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PressRelease, Meta } from "@/app/ruang-pers/page";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateLong = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });

const formatDateShort = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

const BASE = "https://dashboard.wikimedia.or.id/api/v1";

// ─── Card ─────────────────────────────────────────────────────────────────────

function PressReleaseCard({ pr, featured = false }: { pr: PressRelease; featured?: boolean }) {
  if (featured) {
    return (
      <Link href={`/ruang-pers/${pr.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <article
          className="card-glow"
          style={{
            border: "1px solid #e5e2dd",
            borderRadius: "4px",
            overflow: "hidden",
            backgroundColor: "#fff",
            display: "grid",
            gridTemplateColumns: pr.featured_image ? "1fr 1fr" : "1fr",
          }}
        >
          {pr.featured_image && (
            <div style={{ height: "280px", overflow: "hidden", position: "relative" }}>
              <Image
                src={pr.featured_image}
                alt={pr.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover", transition: "transform 0.4s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 70%, #fff)", pointerEvents: "none" }} />
            </div>
          )}
          <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", backgroundColor: "rgba(139,26,42,0.08)", padding: "3px 10px", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>
                ◆ Siaran Pers
              </span>
              <span style={{ fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>
                {formatDateLong(pr.published_at)}
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: "700", color: "#0d0d0d", lineHeight: "1.35", fontFamily: "var(--font-serif)", margin: 0 }}>
              {pr.title}
            </h2>
            <p style={{ fontSize: "13px", color: "#5c5a57", lineHeight: "1.7", fontFamily: "var(--font-sans)", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
              {stripHtml(pr.excerpt)}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>
                Baca selengkapnya
              </span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b1a2a" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/ruang-pers/${pr.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
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
          {pr.featured_image ? (
            <Image
              src={pr.featured_image}
              alt={pr.title}
              fill
              sizes="(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 33vw"
              style={{ objectFit: "cover", transition: "transform 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0eeec, #e5e2dd)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c5c3bf" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
          )}
        </div>
        <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>
            {formatDateShort(pr.published_at)}
          </span>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0d0d0d", lineHeight: "1.5", fontFamily: "var(--font-serif)", margin: 0 }}>
            {pr.title}
          </h3>
          <p style={{ fontSize: "12px", color: "#6b6966", lineHeight: "1.6", fontFamily: "var(--font-sans)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", margin: 0, flex: 1 }}>
            {stripHtml(pr.excerpt)}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid #f0eeec", marginTop: "auto" }}>
            <span style={{ fontSize: "11px", color: "#5c5a57", fontFamily: "var(--font-sans)" }}>
              {pr.creator?.name ?? "—"}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {pr.views.toLocaleString("id-ID")}
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
        <div className="skeleton" style={{ height: "10px", borderRadius: "2px", width: "30%" }} />
        <div className="skeleton" style={{ height: "15px", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "15px", borderRadius: "2px", width: "80%" }} />
        <div className="skeleton" style={{ height: "11px", borderRadius: "2px", width: "50%", marginTop: "4px" }} />
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div style={{ border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", backgroundColor: "#fff", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <div className="skeleton" style={{ height: "280px" }} />
      <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div className="skeleton" style={{ height: "12px", width: "40%", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "28px", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "28px", width: "70%", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "13px", borderRadius: "2px", marginTop: "4px" }} />
        <div className="skeleton" style={{ height: "13px", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "13px", width: "60%", borderRadius: "2px" }} />
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`e-${idx}`} style={{ minWidth: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>···</span>
        ) : (
          <button key={p}
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function RuangPersClient({
  initialPressReleases,
  initialMeta,
}: {
  initialPressReleases: PressRelease[];
  initialMeta: Meta | null;
}) {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>(initialPressReleases);
  const [meta, setMeta] = useState<Meta | null>(initialMeta);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PER_PAGE = 9;

  const fetchData = useCallback(async (page: number, query: string) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const url = query
        ? `${BASE}/press-releases/search/query?q=${encodeURIComponent(query)}&per_page=${PER_PAGE}&page=${page}`
        : `${BASE}/press-releases?per_page=${PER_PAGE}&page=${page}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setPressReleases(json.data);
        setMeta(json.meta);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Skip fetch halaman pertama tanpa search — data sudah dari server
  useEffect(() => {
    if (currentPage === 1 && !searchQuery) return;
    fetchData(currentPage, searchQuery);
  }, [currentPage, searchQuery, fetchData]);

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    setSearchQuery(searchInput.trim());
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setCurrentPage(1);
    setPressReleases(initialPressReleases);
    setMeta(initialMeta);
  };

  // First item as featured, rest as grid
  const featured = !loading && pressReleases.length > 0 && currentPage === 1 && !searchQuery ? pressReleases[0] : null;
  const gridItems = featured ? pressReleases.slice(1) : pressReleases;

  return (
    <>
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 24px 36px", position: "relative", overflow: "hidden", backgroundImage: "url('/banner/Mosaik_Budaya_3.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(40,22,6,0.92) 0%, rgba(80,44,8,0.84) 40%, rgba(120,72,10,0.72) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,20,0.28) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "8%", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(180,100,10,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "hsla(0, 0%, 100%, 0.70)", fontFamily: "var(--font-sans)" }}>Ruang Pers</span>
            {searchQuery && (
              <>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
                <span style={{ fontSize: "11px", color: "#f5c842", fontFamily: "var(--font-sans)" }}>Pencarian: "{searchQuery}"</span>
              </>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Ruang Pers</span>
              <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 0", lineHeight: "1.2" }}>
                {searchQuery ? `Hasil: "${searchQuery}"` : "Siaran Pers"}
              </h1>
              {meta && (
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: "6px 0 0" }}>
                  {meta.total.toLocaleString("id-ID")} siaran pers{meta.last_page > 1 && ` · Halaman ${meta.current_page} dari ${meta.last_page}`}
                </p>
              )}
            </div>

            {/* Search */}
            <div style={{ display: "flex", borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(245,200,66,0.25)" }}>
              <input
                type="text" placeholder="Cari siaran pers..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ padding: "10px 16px", fontSize: "13px", backgroundColor: "rgba(255,255,255,0.06)", border: "none", color: "#fff", fontFamily: "var(--font-sans)", outline: "none", minWidth: "220px" }}
              />
              <button
                onClick={handleSearch}
                style={{ padding: "10px 16px", backgroundColor: "#8b1a2a", border: "none", color: "#fff", cursor: "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#a82235")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#8b1a2a")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
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
          {searchQuery && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <span style={{ fontSize: "12px", color: "#5c5a57", fontFamily: "var(--font-sans)" }}>Filter aktif:</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 10px", backgroundColor: "rgba(139,26,42,0.1)", border: "1px solid rgba(139,26,42,0.25)", borderRadius: "100px", fontSize: "12px", fontWeight: "600", color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>
                "{searchQuery}"
                <button onClick={handleClearSearch} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#8b1a2a", display: "flex", alignItems: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </span>
            </div>
          )}

          {/* Section header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", paddingBottom: "12px", borderBottom: "3px solid #0d0d0d" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Terkini</span>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "2px", marginBottom: 0 }}>
                {searchQuery ? "Hasil Pencarian" : "Semua Siaran Pers"}
              </h2>
            </div>
            {meta && <span style={{ fontSize: "12px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>{meta.total.toLocaleString("id-ID")} siaran pers</span>}
          </div>

          {loading ? (
            <>
              <FeaturedSkeleton />
              <div style={{ marginTop: "24px" }} className="pers-grid">
                {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            </>
          ) : pressReleases.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px" }}>
              <span style={{ fontSize: "40px", opacity: 0.2 }}>🔍</span>
              <p style={{ fontSize: "15px", color: "#6b6966", fontFamily: "var(--font-sans)", marginTop: "12px" }}>Tidak ada siaran pers ditemukan.</p>
              <button onClick={handleClearSearch} style={{ marginTop: "16px", padding: "8px 20px", backgroundColor: "#8b1a2a", color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
                Tampilkan Semua
              </button>
            </div>
          ) : (
            <>
              {/* Featured — only first page, no search */}
              {featured && (
                <div style={{ marginBottom: "24px" }}>
                  <PressReleaseCard pr={featured} featured />
                </div>
              )}

              {/* Grid */}
              {gridItems.length > 0 && (
                <div className="pers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                  {gridItems.map((pr) => <PressReleaseCard key={pr.id} pr={pr} />)}
                </div>
              )}

              {meta && meta.last_page > 1 && (
                <Pagination meta={meta} onPageChange={(p) => setCurrentPage(p)} />
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 1100px) {
          .pers-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .pers-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          article[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}