"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaItem = {
  id: number;
  judul: string;
  slug: string;
  keterangan: string;
  jenis_media: "wikimedia_commons" | "youtube";
  kategori: string[];
  url_media: string;
  thumbnail: string | null;
  views: number;
  created_at: string;
  creator: { id: number; name: string };
};

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const BASE = "https://dashboard.wikimedia.or.id/api/v1";

const KATEGORI_LABELS: Record<string, string> = {
  situs_utama: "Utama",
  situs_datatek: "Data & Teknologi",
  situs_kebudayaan: "Kebudayaan",
  situs_pendidikan: "Pendidikan",
  situs_komunitas: "Komunitas",
};

const DASHBOARD_BASE = "https://dashboard.wikimedia.or.id";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ─── Thumbnail Component ──────────────────────────────────────────────────────

function MediaThumbnail({ item }: { item: MediaItem }) {
  const [ytError, setYtError] = useState(false);
  const isPdf = item.jenis_media === "wikimedia_commons";
  const isYoutube = item.jenis_media === "youtube";

  // Ambil YouTube ID untuk fallback thumbnail
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : "";
  };

  const thumbUrl = item.thumbnail
    ? `${DASHBOARD_BASE}/storage/${item.thumbnail}`
    : isYoutube
    ? `https://img.youtube.com/vi/${getYouTubeId(item.url_media)}/hqdefault.jpg`
    : "";

  const badge = (
    <div style={{ position: "absolute", top: "8px", left: "8px", zIndex: 1 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", backgroundColor: "rgba(220,38,38,0.9)", color: "#fff", fontSize: "10px", fontWeight: "700", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>
        {isPdf ? (
          <>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            PDF
          </>
        ) : (
          <>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z"/></svg>
            YouTube
          </>
        )}
      </span>
    </div>
  );

  if (thumbUrl && !ytError) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {badge}
        <img
          src={thumbUrl}
          alt={item.judul}
          style={{
            width: "100%",
            height: "100%",
            // PDF: contain agar tidak crop, YT: cover
            objectFit: "cover",
            objectPosition: isPdf ? "top" : "center",
            transition: "transform 0.35s",
            backgroundColor: isPdf ? "#f5f4f2" : "transparent",
          }}
          onError={() => { if (isYoutube) setYtError(true); }}
          className="media-thumb-img"
        />
        {isYoutube && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(220,38,38,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback placeholder
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", backgroundColor: "rgba(220,38,38,0.05)" }}>
      {isPdf ? (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1" opacity={0.4}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ) : (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1" opacity={0.4}>
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#dc2626" opacity={0.4} stroke="none"/>
        </svg>
      )}
      <span style={{ fontSize: "10px", color: "#dc2626", opacity: 0.5, fontFamily: "var(--font-sans)", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
        {isPdf ? "PDF" : "YouTube"}
      </span>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function MediaCard({ item }: { item: MediaItem }) {
  return (
    <a
      href={item.url_media}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "block", height: "100%", minWidth: 0 }}
    >
      <article
        className="media-card"
        style={{ border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", height: "100%", minWidth: 0, backgroundColor: "#fff", display: "flex", flexDirection: "column", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.10)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; const img = e.currentTarget.querySelector(".media-thumb-img") as HTMLElement; if (img) img.style.transform = "scale(1.04)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; const img = e.currentTarget.querySelector(".media-thumb-img") as HTMLElement; if (img) img.style.transform = "scale(1)"; }}
      >
        {/* Thumbnail */}
        <div style={{
          height: item.jenis_media === "wikimedia_commons" ? "320px" : "180px",
          flexShrink: 0, backgroundColor: "#f5f4f2", overflow: "hidden",
          borderBottom: "1px solid #e5e2dd", position: "relative",
        }}>
          <MediaThumbnail item={item} />
        </div>

        {/* Content */}
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Kategori tags */}
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "4px" }}>
            {item.kategori.slice(0, 2).map((k) => (
              <span key={k} style={{ fontSize: "10px", fontWeight: "600", color: "#5c5a57", backgroundColor: "#f0eeec", padding: "2px 7px", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>
                {KATEGORI_LABELS[k] ?? k}
              </span>
            ))}
          </div>

          <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#0d0d0d", lineHeight: "1.5", fontFamily: "var(--font-serif)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", wordBreak: "break-word"  }}>
            {item.judul}
          </h3>

          <p style={{ fontSize: "12px", color: "#9a9690", lineHeight: "1.6", fontFamily: "var(--font-sans)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", margin: 0, flex: 1, wordBreak: "break-word"  }}>
            {item.keterangan}
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid #f0eeec", marginTop: "auto" }}>
            <span style={{ fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>
              {formatDate(item.created_at)}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                {item.views.toLocaleString("id-ID")}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#8b1a2a", fontWeight: "600", fontFamily: "var(--font-sans)" }}>
                Buka
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </span>
            </div>
          </div>
        </div>
      </article>
    </a>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div style={{ border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", backgroundColor: "#fff" }}>
      <div className="skeleton" style={{ height: "200px" }} />
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="skeleton" style={{ height: "10px", width: "40%", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "14px", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "14px", width: "70%", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "11px", width: "50%", borderRadius: "2px", marginTop: "4px" }} />
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

  const btn: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", minWidth: "36px", height: "36px", padding: "0 6px", borderRadius: "3px", border: "1px solid #e5e2dd", backgroundColor: "#fff", fontSize: "13px", fontWeight: "500", fontFamily: "var(--font-sans)", cursor: "pointer", transition: "all 0.2s", color: "#3a3a3a" };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", paddingTop: "36px" }}>
      <button style={{ ...btn, color: current_page === 1 ? "#c5c3bf" : "#3a3a3a", cursor: current_page === 1 ? "not-allowed" : "pointer" }} disabled={current_page === 1} onClick={() => onPageChange(current_page - 1)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`e-${idx}`} style={{ minWidth: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#9a9690" }}>···</span>
        ) : (
          <button key={p}
            style={{ ...btn, backgroundColor: p === current_page ? "#8b1a2a" : "#fff", borderColor: p === current_page ? "#8b1a2a" : "#e5e2dd", color: p === current_page ? "#fff" : "#3a3a3a", fontWeight: p === current_page ? "700" : "500" }}
            onClick={() => onPageChange(p as number)}>
            {p}
          </button>
        )
      )}
      <button style={{ ...btn, color: current_page === last_page ? "#c5c3bf" : "#3a3a3a", cursor: current_page === last_page ? "not-allowed" : "pointer" }} disabled={current_page === last_page} onClick={() => onPageChange(current_page + 1)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

const JENIS_FILTER = [
  { value: "", label: "Semua" },
  { value: "wikimedia_commons", label: "PDF / Materi" },
  { value: "youtube", label: "YouTube" },
];

const KATEGORI_FILTER = [
  { value: "", label: "Semua Kategori" },
  { value: "situs_utama", label: "Utama" },
  { value: "situs_datatek", label: "Data & Teknologi" },
  { value: "situs_kebudayaan", label: "Kebudayaan" },
  { value: "situs_pendidikan", label: "Pendidikan" },
  { value: "situs_komunitas", label: "Komunitas" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jenisFilter, setJenisFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const PER_PAGE = 12;

  const fetchData = useCallback(async (page: number, jenis: string, kategori: string, search: string) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      let url = "";
      if (search) {
        url = `${BASE}/media/search/query?q=${encodeURIComponent(search)}&per_page=${PER_PAGE}&page=${page}`;
        if (jenis) url += `&jenis_media=${jenis}`;
        if (kategori) url += `&kategori=${kategori}`;
      } else {
        url = `${BASE}/media?per_page=${PER_PAGE}&page=${page}`;
        if (jenis) url += `&jenis_media=${jenis}`;
        if (kategori) url += `&kategori=${kategori}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setItems(json.data.data ?? json.data);
        setMeta(json.data.meta ?? {
          current_page: json.data.current_page,
          last_page: json.data.last_page,
          per_page: json.data.per_page,
          total: json.data.total,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, jenisFilter, kategoriFilter, searchQuery);
  }, [currentPage, jenisFilter, kategoriFilter, searchQuery, fetchData]);

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    setSearchQuery(searchInput.trim());
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setCurrentPage(1);
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 24px 36px", position: "relative", overflow: "hidden", backgroundImage: "url('/banner/Mosaik_Budaya_1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(20,8,8,0.90) 0%, rgba(45,10,15,0.82) 40%, rgba(60,15,20,0.75) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.20) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#e05070", fontFamily: "var(--font-sans)" }}>Media</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "20px" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Media</span>
              <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 0", lineHeight: "1.2" }}>
                Modul & Materi
              </h1>
              {meta && (
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: "6px 0 0" }}>
                  {meta.total.toLocaleString("id-ID")} materi tersedia
                </p>
              )}
            </div>

            {/* Search */}
            <div style={{ display: "flex", borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
              <input
                type="text" placeholder="Cari materi..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ padding: "10px 16px", fontSize: "13px", backgroundColor: "rgba(255,255,255,0.06)", border: "none", color: "#fff", fontFamily: "var(--font-sans)", outline: "none", minWidth: "200px" }}
              />
              <button onClick={handleSearch}
                style={{ padding: "10px 16px", backgroundColor: "#8b1a2a", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#a82235")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#8b1a2a")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ───────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e5e2dd", padding: "0 24px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", gap: "0", overflowX: "auto" as const }}>
          {/* Jenis filter */}
          <div style={{ display: "flex", borderRight: "1px solid #e5e2dd", flexShrink: 0 }}>
            {JENIS_FILTER.map((f) => (
              <button key={f.value}
                onClick={() => { setJenisFilter(f.value); setCurrentPage(1); }}
                style={{ padding: "14px 18px", fontSize: "12px", fontWeight: jenisFilter === f.value ? "700" : "500", color: jenisFilter === f.value ? "#8b1a2a" : "#5c5a57", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", borderBottom: jenisFilter === f.value ? "2px solid #8b1a2a" : "2px solid transparent", transition: "all 0.15s", whiteSpace: "nowrap" as const }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Kategori filter */}
          <div style={{ display: "flex", flexShrink: 0 }}>
            {KATEGORI_FILTER.map((f) => (
              <button key={f.value}
                onClick={() => { setKategoriFilter(f.value); setCurrentPage(1); }}
                style={{ padding: "14px 16px", fontSize: "12px", fontWeight: kategoriFilter === f.value ? "700" : "500", color: kategoriFilter === f.value ? "#8b1a2a" : "#5c5a57", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", borderBottom: kategoriFilter === f.value ? "2px solid #8b1a2a" : "2px solid transparent", transition: "all 0.15s", whiteSpace: "nowrap" as const }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Clear search chip */}
          {searchQuery && (
            <div style={{ marginLeft: "auto", flexShrink: 0, padding: "0 8px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 10px", backgroundColor: "rgba(139,26,42,0.1)", border: "1px solid rgba(139,26,42,0.25)", borderRadius: "100px", fontSize: "11px", fontWeight: "600", color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>
                "{searchQuery}"
                <button onClick={handleClearSearch} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#8b1a2a", display: "flex", alignItems: "center" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "36px 24px 60px", minHeight: "60vh", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Section header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", paddingBottom: "12px", borderBottom: "3px solid #0d0d0d" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Koleksi</span>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "2px", marginBottom: 0 }}>
                {searchQuery ? `Hasil: "${searchQuery}"` : jenisFilter === "youtube" ? "Video YouTube" : jenisFilter === "wikimedia_commons" ? "PDF & Materi" : "Semua Materi"}
              </h2>
            </div>
            {meta && <span style={{ fontSize: "12px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>{meta.total.toLocaleString("id-ID")} materi</span>}
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }} className="media-grid">
              {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : items.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px" }}>
              <span style={{ fontSize: "40px", opacity: 0.2 }}>🔍</span>
              <p style={{ fontSize: "15px", color: "#9a9690", fontFamily: "var(--font-sans)", marginTop: "12px" }}>Tidak ada materi ditemukan.</p>
              <button onClick={() => { setJenisFilter(""); setKategoriFilter(""); handleClearSearch(); }}
                style={{ marginTop: "16px", padding: "8px 20px", backgroundColor: "#8b1a2a", color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
                Reset Filter
              </button>
            </div>
          ) : (
            <>
              <div className="media-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
                {items.map((item) => <MediaCard key={item.id} item={item} />)}
              </div>
              {meta && meta.last_page > 1 && (
                <Pagination meta={meta} onPageChange={(p) => setCurrentPage(p)} />
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 1280px) { .media-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        @media (max-width: 1100px) { .media-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 768px)  { .media-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px)  { .media-grid { grid-template-columns: 1fr !important; } }
       `}</style>
    </>
  );
}