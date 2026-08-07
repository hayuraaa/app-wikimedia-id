"use client";

import { useState, useEffect, useCallback } from "react";
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

// ─── List Item ────────────────────────────────────────────────────────────────

function PressReleaseItem({ pr }: { pr: PressRelease }) {
  return (
    <Link href={`/ruang-pers/${pr.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <article
        className="pers-item"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "20px",
          padding: "18px 20px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #f0eeec",
          transition: "background 0.15s",
        }}
      >
        {/* Tanggal */}
        <div style={{ flexShrink: 0, width: "70px", textAlign: "center", paddingTop: "2px" }}>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#0C57A8", lineHeight: 1, fontFamily: "var(--font-montserrat)" }}>
            {new Date(pr.published_at).toLocaleDateString("id-ID", { day: "numeric", timeZone: "Asia/Jakarta" })}
          </div>
          <div style={{ fontSize: "10px", fontWeight: "600", color: "#a5a3a0", textTransform: "uppercase" as const, letterSpacing: "0.08em", fontFamily: "var(--font-montserrat)", marginTop: "2px" }}>
            {new Date(pr.published_at).toLocaleDateString("id-ID", { month: "short", year: "numeric", timeZone: "Asia/Jakarta" })}
          </div>
        </div>

        {/* Divider vertikal */}
        <div style={{ width: "1px", alignSelf: "stretch", backgroundColor: "#e5e2dd", flexShrink: 0 }} />

        {/* Konten */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0d0d0d", lineHeight: "1.45", fontFamily: "var(--font-montserrat)", margin: "0 0 6px" }}>
            {pr.title}
          </h3>
          <p style={{ fontSize: "13px", color: "#6b6966", lineHeight: "1.65", fontFamily: "var(--font-source-serif)", margin: "0 0 8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
            {stripHtml(pr.excerpt)}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11px", color: "#a5a3a0", fontFamily: "var(--font-montserrat)" }}>
              {pr.creator?.name ?? "—"}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", color: "#a5a3a0", fontFamily: "var(--font-montserrat)" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {pr.views.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", paddingTop: "2px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c5c3bf" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </article>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ListSkeleton() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", padding: "18px 20px", backgroundColor: "#fff", borderBottom: "1px solid #f0eeec" }}>
      <div style={{ flexShrink: 0, width: "70px", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
        <div className="skeleton" style={{ height: "22px", width: "32px", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "10px", width: "50px", borderRadius: "2px" }} />
      </div>
      <div style={{ width: "1px", alignSelf: "stretch", backgroundColor: "#e5e2dd", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="skeleton" style={{ height: "16px", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "16px", borderRadius: "2px", width: "75%" }} />
        <div className="skeleton" style={{ height: "12px", borderRadius: "2px", width: "40%", marginTop: "2px" }} />
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
    fontFamily: "var(--font-montserrat)", cursor: "pointer", transition: "all 0.2s", color: "#3a3a3a",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", paddingTop: "36px" }}>
      <button
        style={{ ...btn, color: current_page === 1 ? "#c5c3bf" : "#3a3a3a", cursor: current_page === 1 ? "not-allowed" : "pointer" }}
        disabled={current_page === 1} onClick={() => onPageChange(current_page - 1)}
        onMouseEnter={(e) => { if (current_page !== 1) (e.currentTarget as HTMLElement).style.borderColor = "#0C57A8"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`e-${idx}`} style={{ minWidth: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#6b6966", fontFamily: "var(--font-montserrat)" }}>···</span>
        ) : (
          <button key={p}
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


  return (
    <>
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 24px 36px", position: "relative", overflow: "hidden", backgroundImage: "url('/banner/Mosaik_Budaya_3.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(3,78,159,0.92) 0%, rgba(3,78,159,0.84) 40%, rgba(3,78,159,0.76) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,20,0.28) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "8%", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(180,100,10,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-montserrat)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-montserrat)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#3b8ed4", fontFamily: "var(--font-montserrat)" }}>Ruang Pers</span>
            {searchQuery && (
              <>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-montserrat)" }}>/</span>
                <span style={{ fontSize: "11px", color: "#f5c842", fontFamily: "var(--font-montserrat)" }}>Pencarian: "{searchQuery}"</span>
              </>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-montserrat)", margin: "6px 0 0", lineHeight: "1.2" }}>
                {searchQuery ? `Hasil: "${searchQuery}"` : "Siaran Pers"}
              </h1>
              {meta && (
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-source-serif)", margin: "6px 0 0" }}>
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
                style={{ padding: "10px 16px", fontSize: "13px", backgroundColor: "rgba(255,255,255,0.06)", border: "none", color: "#fff", fontFamily: "var(--font-montserrat)", outline: "none", minWidth: "220px" }}
              />
              <button
                onClick={handleSearch}
                style={{ padding: "10px 16px", backgroundColor: "#0C57A8", border: "none", color: "#fff", cursor: "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#0a4a8f")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#0C57A8")}
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
              <span style={{ fontSize: "12px", color: "#5c5a57", fontFamily: "var(--font-montserrat)" }}>Filter aktif:</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 10px", backgroundColor: "rgba(12,87,168,0.1)", border: "1px solid rgba(12,87,168,0.25)", borderRadius: "100px", fontSize: "12px", fontWeight: "600", color: "#0C57A8", fontFamily: "var(--font-montserrat)" }}>
                "{searchQuery}"
                <button onClick={handleClearSearch} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#0C57A8", display: "flex", alignItems: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </span>
            </div>
          )}

          {/* Section header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", paddingBottom: "12px", borderBottom: "3px solid #0d0d0d" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0C57A8", fontFamily: "var(--font-montserrat)" }}>◆ Terkini</span>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-montserrat)", marginTop: "2px", marginBottom: 0 }}>
                {searchQuery ? "Hasil Pencarian" : "Semua Siaran Pers"}
              </h2>
            </div>
            {meta && <span style={{ fontSize: "12px", color: "#6b6966", fontFamily: "var(--font-montserrat)" }}>{meta.total.toLocaleString("id-ID")} siaran pers</span>}
          </div>

          {loading ? (
            <div style={{ border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
              {[...Array(9)].map((_, i) => <ListSkeleton key={i} />)}
            </div>
          ) : pressReleases.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px" }}>
              <span style={{ fontSize: "40px", opacity: 0.2 }}>🔍</span>
              <p style={{ fontSize: "15px", color: "#6b6966", fontFamily: "var(--font-source-serif)", marginTop: "12px" }}>Tidak ada siaran pers ditemukan.</p>
              <button onClick={handleClearSearch} style={{ marginTop: "16px", padding: "8px 20px", backgroundColor: "#0C57A8", color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-montserrat)", cursor: "pointer" }}>
                Tampilkan Semua
              </button>
            </div>
          ) : (
            <>
              <div style={{ border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                {pressReleases.map((pr) => <PressReleaseItem key={pr.id} pr={pr} />)}
              </div>

              {meta && meta.last_page > 1 && (
                <Pagination meta={meta} onPageChange={(p) => setCurrentPage(p)} />
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        .pers-item:hover { background-color: #f8f7f5 !important; }
        .pers-item:last-child { border-bottom: none !important; }
      `}</style>
    </>
  );
}