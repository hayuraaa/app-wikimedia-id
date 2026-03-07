"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type SearchResult = {
  type: "artikel" | "acara" | "faq" | "ruang-pers";
  id: number;
  title: string;
  excerpt?: string;
  slug: string;
  date?: string;
  category?: string;
};

// ─── Nav data ─────────────────────────────────────────────────────────────────

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Rubrik", href: "/rubrik" },
  { label: "Program", href: "/program" },
  { label: "Media", href: "/media" },
  { label: "Ruang Pers", href: "/ruang-pers" },
];

const moreItems = [
  { label: "Tentang", href: "/tentang" },
  { label: "Menjadi Anggota", href: "/menjadi-anggota" },
  { label: "Donasi", href: "/donasi" },
  { label: "Karier", href: "/karier" },
  { label: "FAQ", href: "/faq" },
];

const BASE = "https://dashboard.wikimedia.or.id/api/v1";

const TYPE_META: Record<SearchResult["type"], { label: string; color: string; bg: string; href: (slug: string) => string }> = {
  artikel:    { label: "Artikel",    color: "#1e4d7b", bg: "rgba(30,77,123,0.08)",   href: (s) => `/rubrik/${s}` },
  acara:      { label: "Acara",      color: "#16a34a", bg: "rgba(22,163,74,0.08)",   href: (s) => `/acara/${s}` },
  faq:        { label: "FAQ",        color: "#7c3aed", bg: "rgba(124,58,237,0.08)",  href: (s) => `/faq#${s}` },
  "ruang-pers": { label: "Siaran Pers", color: "#b45309", bg: "rgba(180,83,9,0.08)", href: (s) => `/ruang-pers/${s}` },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Search Dropdown ──────────────────────────────────────────────────────────

function SearchDropdown({
  query,
  results,
  loading,
  onClose,
  onNavigate,
}: {
  query: string;
  results: SearchResult[];
  loading: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}) {
  if (!query.trim()) return null;

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  const typeOrder: SearchResult["type"][] = ["artikel", "acara", "ruang-pers", "faq"];

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        border: "1px solid #e5e2dd",
        borderRadius: "4px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        zIndex: 200,
        maxHeight: "480px",
        overflowY: "auto",
        animation: "searchDropIn 0.18s ease",
      }}
    >
      {/* Top accent */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, #8b1a2a, #1e4d7b)" }} />

      {loading ? (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div className="skeleton" style={{ width: "56px", height: "16px", borderRadius: "2px", flexShrink: 0 }} />
              <div className="skeleton" style={{ flex: 1, height: "14px", borderRadius: "2px" }} />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div style={{ padding: "32px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "28px", marginBottom: "8px", opacity: 0.25 }}>🔍</div>
          <p style={{ fontSize: "13px", color: "#9a9690", fontFamily: "var(--font-sans)", margin: 0 }}>
            Tidak ada hasil untuk <strong style={{ color: "#0d0d0d" }}>"{query}"</strong>
          </p>
        </div>
      ) : (
        <>
          {typeOrder.filter((t) => grouped[t]?.length).map((type) => {
            const meta = TYPE_META[type];
            const items = grouped[type];
            return (
              <div key={type}>
                {/* Section label */}
                <div style={{
                  padding: "8px 16px 6px",
                  borderBottom: "1px solid #f5f4f2",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <span style={{
                    fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em",
                    textTransform: "uppercase", color: meta.color,
                    backgroundColor: meta.bg,
                    padding: "2px 7px", borderRadius: "2px",
                    fontFamily: "var(--font-sans)",
                  }}>
                    {meta.label}
                  </span>
                  <span style={{ fontSize: "10px", color: "#c5c3bf", fontFamily: "var(--font-sans)" }}>
                    {items.length} hasil
                  </span>
                </div>

                {/* Items */}
                {items.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => { onNavigate(meta.href(item.slug)); onClose(); }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "10px 16px",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid #faf9f7",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#faf9f7")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {/* Icon */}
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      backgroundColor: meta.bg, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px",
                    }}>
                      {item.type === "artikel" && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
                      )}
                      {item.type === "acara" && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      )}
                      {item.type === "faq" && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      )}
                      {item.type === "ruang-pers" && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: "13px", fontWeight: "600", color: "#0d0d0d",
                        fontFamily: "var(--font-serif)", lineHeight: "1.4",
                        margin: "0 0 3px",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {item.title}
                      </p>
                      {item.excerpt && (
                        <p style={{
                          fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)",
                          lineHeight: "1.5", margin: 0,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {stripHtml(item.excerpt)}
                        </p>
                      )}
                    </div>

                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c5c3bf" strokeWidth="2" style={{ flexShrink: 0, marginTop: "4px" }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                ))}
              </div>
            );
          })}

          {/* Footer */}
          <div style={{
            padding: "10px 16px",
            borderTop: "1px solid #f0eeec",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{ fontSize: "11px", color: "#c5c3bf", fontFamily: "var(--font-sans)" }}>
              {results.length} hasil ditemukan
            </span>
            <span style={{ fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>
              Enter untuk cari semua
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────

export default function Header() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults]       = useState<SearchResult[]>([]);
  const [searching, setSearching]   = useState(false);

  const pathname  = usePathname();
  const router    = useRouter();
  const inputRef  = useRef<HTMLInputElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const debounced = useDebounce(searchQuery, 320);

  const activeItem =
    navItems.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    )?.label ?? "";

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
    else { setSearchQuery(""); setResults([]); }
  }, [searchOpen]);

  // Click outside → close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Esc → close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Debounced search across all sources
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const [artRes, eventRes, faqRes, persRes] = await Promise.allSettled([
        fetch(`${BASE}/articles?search=${encodeURIComponent(q)}&per_page=3`).then((r) => r.json()),
        fetch(`${BASE}/events?search=${encodeURIComponent(q)}&per_page=3`).then((r) => r.json()),
        fetch(`${BASE}/faq/search?q=${encodeURIComponent(q)}`).then((r) => r.json()),
        fetch(`${BASE}/press-releases/search/query?q=${encodeURIComponent(q)}&per_page=3`).then((r) => r.json()),
      ]);

      const combined: SearchResult[] = [];

      if (artRes.status === "fulfilled" && artRes.value?.success) {
        (artRes.value.data as any[]).slice(0, 3).forEach((a: any) => {
          combined.push({
            type: "artikel", id: a.id, title: a.title,
            excerpt: a.excerpt, slug: a.slug, date: a.published_at,
          });
        });
      }
      if (eventRes.status === "fulfilled" && eventRes.value?.success) {
        (eventRes.value.data as any[]).slice(0, 3).forEach((e: any) => {
          combined.push({
            type: "acara", id: e.id, title: e.judul,
            excerpt: e.deskripsi, slug: e.slug, date: e.tanggal_mulai,
          });
        });
      }
      if (faqRes.status === "fulfilled" && faqRes.value?.success) {
        (faqRes.value.data as any[]).slice(0, 3).forEach((f: any) => {
          combined.push({
            type: "faq", id: f.id, title: f.question,
            excerpt: f.answer, slug: `faq-${f.id}`,
          });
        });
      }
      if (persRes.status === "fulfilled" && persRes.value?.success) {
        (persRes.value.data as any[]).slice(0, 3).forEach((p: any) => {
          combined.push({
            type: "ruang-pers", id: p.id, title: p.title,
            excerpt: p.excerpt, slug: p.slug, date: p.published_at,
          });
        });
      }

      setResults(combined);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => { runSearch(debounced); }, [debounced, runSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/cari?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50, transition: "all 0.3s ease",
        backgroundColor: "#ffffff",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.08)" : "0 1px 0 #e5e7eb",
      }}
    >
      {/* Top accent */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, #8b1a2a 0%, #1a3a5c 50%, #1e4d7b 100%)" }} />

      {/* Main bar */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <div style={{ position: "relative", height: "40px", width: "190px" }}>
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Logo_WMID_2018_Mendatar.png"
              alt="Wikimedia Indonesia" fill
              style={{ objectFit: "contain", objectPosition: "left center" }} priority
            />
          </div>
        </Link>

        {/* Desktop Nav — hide when search open */}
        <nav
          style={{
            display: "flex", alignItems: "center", gap: "2px",
            transition: "opacity 0.2s, transform 0.2s",
            opacity: searchOpen ? 0 : 1,
            pointerEvents: searchOpen ? "none" : "auto",
            transform: searchOpen ? "translateX(-8px)" : "translateX(0)",
          }}
          className="hidden-mobile"
        >
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} style={{
              padding: "8px 14px", fontSize: "13px", fontWeight: "600",
              letterSpacing: "0.03em", textTransform: "uppercase", textDecoration: "none",
              color: activeItem === item.label ? "#8b1a2a" : "#3a3a3a",
              borderBottom: activeItem === item.label ? "2px solid #8b1a2a" : "2px solid transparent",
              transition: "all 0.2s", fontFamily: "var(--font-sans)",
            }}
              onMouseEnter={(e) => { if (activeItem !== item.label) e.currentTarget.style.color = "#8b1a2a"; }}
              onMouseLeave={(e) => { if (activeItem !== item.label) e.currentTarget.style.color = "#3a3a3a"; }}
            >
              {item.label}
            </Link>
          ))}

          {/* Dropdown Lainnya */}
          <div className="more-dropdown" style={{ position: "relative" }}>
            <button className="more-btn" style={{
              padding: "8px 14px", fontSize: "13px", fontWeight: "600",
              letterSpacing: "0.03em", textTransform: "uppercase", background: "transparent",
              border: "none", borderBottom: "2px solid transparent", color: "#3a3a3a",
              cursor: "pointer", transition: "all 0.2s", fontFamily: "var(--font-sans)",
              display: "flex", alignItems: "center", gap: "5px",
            }}>
              Lainnya
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div className="more-menu" style={{
              position: "absolute", top: "100%", right: 0, paddingTop: "8px",
              zIndex: 100, opacity: 0, pointerEvents: "none",
              transform: "translateY(-6px)", transition: "all 0.2s ease",
            }}>
              <div style={{
                backgroundColor: "#fff", border: "1px solid #e5e2dd",
                borderRadius: "4px", boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                minWidth: "180px", overflow: "hidden",
              }}>
                <div style={{ height: "3px", background: "linear-gradient(90deg, #8b1a2a, #1e4d7b)" }} />
                {moreItems.map((item, idx) => (
                  <Link key={item.label} href={item.href} style={{
                    display: "block", padding: "10px 16px", fontSize: "13px", fontWeight: "500",
                    color: "#3a3a3a", textDecoration: "none", fontFamily: "var(--font-sans)",
                    borderBottom: idx < moreItems.length - 1 ? "1px solid #f5f4f2" : "none",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#faf9f7"; e.currentTarget.style.color = "#8b1a2a"; e.currentTarget.style.paddingLeft = "20px"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#3a3a3a"; e.currentTarget.style.paddingLeft = "16px"; }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Right side: search + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          {/* ── Search area ── */}
          <div ref={wrapRef} style={{ position: "relative" }} className="hidden-mobile">

            {/* Expanded search bar */}
            <div style={{
              display: "flex", alignItems: "center",
              width: searchOpen ? "340px" : "36px",
              height: "36px",
              borderRadius: searchOpen ? "3px" : "50%",
              border: searchOpen ? "1.5px solid #1a3a5c" : "1px solid #e5e7eb",
              backgroundColor: searchOpen ? "#fff" : "transparent",
              overflow: "hidden",
              transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), border-radius 0.3s, border 0.25s, background 0.2s",
              boxShadow: searchOpen ? "0 2px 12px rgba(26,58,92,0.10)" : "none",
            }}>
              {/* Search icon / submit button */}
              <button
                onClick={() => searchOpen ? (searchQuery.trim() ? router.push(`/cari?q=${encodeURIComponent(searchQuery)}`) : setSearchOpen(false)) : setSearchOpen(true)}
                aria-label="Cari"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "36px", height: "36px", flexShrink: 0,
                  background: searchOpen ? "#8b1a2a" : "transparent",
                  border: "none", cursor: "pointer",
                  color: searchOpen ? "#fff" : "#6b7280",
                  transition: "background 0.2s, color 0.2s",
                  borderRadius: searchOpen ? "0" : "50%",
                }}
                onMouseEnter={(e) => { if (!searchOpen) { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#111"; } }}
                onMouseLeave={(e) => { if (!searchOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; } }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                placeholder="Cari artikel, acara, FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1, height: "100%", border: "none", outline: "none",
                  fontSize: "13px", color: "#0d0d0d", fontFamily: "var(--font-sans)",
                  backgroundColor: "transparent", padding: "0 4px",
                  opacity: searchOpen ? 1 : 0,
                  pointerEvents: searchOpen ? "auto" : "none",
                  transition: "opacity 0.2s",
                }}
              />

              {/* Loading spinner / clear button */}
              {searchOpen && (
                <div style={{ width: "32px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {searching ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a9690" strokeWidth="2"
                      style={{ animation: "spin 0.8s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                  ) : searchQuery ? (
                    <button onClick={() => { setSearchQuery(""); setResults([]); inputRef.current?.focus(); }}
                      style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", borderRadius: "50%", color: "#9a9690", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f3f4f6"; e.currentTarget.style.color = "#0d0d0d"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#9a9690"; }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  ) : null}
                </div>
              )}
            </div>

            {/* Dropdown results */}
            {searchOpen && (
              <SearchDropdown
                query={searchQuery}
                results={results}
                loading={searching && searchQuery.length >= 2}
                onClose={() => setSearchOpen(false)}
                onNavigate={(href) => router.push(href)}
              />
            )}
          </div>

          {/* Hamburger */}
          <button
            aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{ display: "none", flexDirection: "column", gap: "5px", background: "transparent", border: "none", cursor: "pointer", padding: "4px" }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: "block", width: "22px", height: "2px",
                backgroundColor: "#111", transition: "all 0.3s",
                transform: i === 0 && menuOpen ? "translateY(7px) rotate(45deg)" : i === 2 && menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
                opacity: i === 1 && menuOpen ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div style={{ maxHeight: menuOpen ? "600px" : "0", overflow: "hidden", transition: "max-height 0.3s ease", backgroundColor: "#fff", borderTop: menuOpen ? "1px solid #f0f0f0" : "none" }} className="show-mobile-block">
        {/* Mobile search */}
        <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid #f5f4f2" }}>
          <div style={{ display: "flex", borderRadius: "3px", overflow: "hidden", border: "1px solid #e5e2dd" }}>
            <input
              type="text" placeholder="Cari..."
              style={{ flex: 1, padding: "10px 14px", fontSize: "13px", border: "none", outline: "none", fontFamily: "var(--font-sans)", color: "#0d0d0d" }}
              onKeyDown={(e) => { if (e.key === "Enter") { const v = (e.target as HTMLInputElement).value.trim(); if (v) { setMenuOpen(false); router.push(`/cari?q=${encodeURIComponent(v)}`); } } }}
            />
            <button style={{ padding: "10px 14px", backgroundColor: "#8b1a2a", border: "none", color: "#fff", cursor: "pointer" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </div>
        </div>

        <nav style={{ padding: "8px 0 16px" }}>
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{
              display: "block", padding: "12px 24px", fontSize: "14px", fontWeight: "600",
              letterSpacing: "0.04em", textTransform: "uppercase", textDecoration: "none",
              color: activeItem === item.label ? "#8b1a2a" : "#3a3a3a",
              borderLeft: activeItem === item.label ? "3px solid #8b1a2a" : "3px solid transparent",
              transition: "all 0.2s",
            }}>
              {item.label}
            </Link>
          ))}
          <div style={{ margin: "8px 24px", borderTop: "1px solid #f0eeec" }} />
          {moreItems.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{
              display: "block", padding: "10px 24px", fontSize: "13px", fontWeight: "500",
              textDecoration: "none", color: "#5c5a57", borderLeft: "3px solid transparent",
              transition: "all 0.2s", fontFamily: "var(--font-sans)",
            }}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .show-mobile-block { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .show-mobile-block { display: none !important; }
        }
        .more-dropdown:hover .more-menu {
          opacity: 1 !important;
          pointer-events: auto !important;
          transform: translateY(0) !important;
        }
        .more-dropdown:hover .more-btn {
          color: #8b1a2a !important;
        }
        @keyframes searchDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}