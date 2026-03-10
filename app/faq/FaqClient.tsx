"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  order: number;
};

type FaqCategory = {
  id: number;
  name: string;
  order: number;
  items: FaqItem[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE = "https://dashboard.wikimedia.or.id/api/v1";

// ─── Accordion Item ───────────────────────────────────────────────────────────

function AccordionItem({ item, isOpen, onToggle }: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div style={{
      borderBottom: "1px solid #e5e2dd",
      backgroundColor: isOpen ? "#fafaf9" : "#fff",
      transition: "background-color 0.2s",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          gap: "16px", padding: "18px 24px", background: "none", border: "none", cursor: "pointer",
          textAlign: "left" as const,
        }}
      >
        <span style={{
          fontSize: "14px", fontWeight: isOpen ? "700" : "600",
          color: isOpen ? "#8b1a2a" : "#0d0d0d",
          fontFamily: "var(--font-sans)", lineHeight: "1.55", flex: 1,
          transition: "color 0.2s",
        }}>
          {item.question}
        </span>
        <span style={{
          flexShrink: 0, width: "22px", height: "22px", borderRadius: "50%",
          border: `1px solid ${isOpen ? "#8b1a2a" : "#e5e2dd"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: isOpen ? "#8b1a2a" : "transparent",
          transition: "all 0.25s", marginTop: "1px",
        }}>
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke={isOpen ? "#fff" : "#6b6966"} strokeWidth="2.5"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </span>
      </button>

      <div style={{ height: `${height}px`, overflow: "hidden", transition: "height 0.3s ease" }}>
        <div ref={contentRef}>
          <div
            className="faq-answer"
            style={{ padding: "0 24px 20px" }}
            dangerouslySetInnerHTML={{ __html: item.answer }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <div className="skeleton" style={{ height: "14px", width: `${55 + (i % 3) * 15}%`, borderRadius: "2px" }} />
          <div className="skeleton" style={{ width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FaqPage() {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<(FaqItem & { category: { id: number; name: string } })[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/faq`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCategories(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (id: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSearch = async () => {
    const q = searchInput.trim();
    if (!q) { setSearchQuery(""); setSearchResults([]); return; }
    setSearchQuery(q);
    setSearchLoading(true);
    try {
      const res = await fetch(`${BASE}/faq/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.success) setSearchResults(json.data);
    } catch {}
    finally { setSearchLoading(false); }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        padding: "40px 24px 36px", position: "relative", overflow: "hidden",
        backgroundImage: "url('/banner/Mosaik_Budaya_1.png')",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.92) 0%, rgba(10,30,65,0.84) 40%, rgba(15,40,80,0.76) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "10%", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(30,77,123,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#e05070", fontFamily: "var(--font-sans)" }}>FAQ</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "20px" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ FAQ</span>
              <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 0", lineHeight: "1.2" }}>
                Pertanyaan yang Sering Ditanyakan
              </h1>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: "6px 0 0" }}>
                Temukan jawaban seputar Wikimedia Indonesia dan program-program kami
              </p>
            </div>

            {/* Search */}
            <div style={{ display: "flex", borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ padding: "10px 16px", fontSize: "13px", backgroundColor: "rgba(255,255,255,0.06)", border: "none", color: "#fff", fontFamily: "var(--font-sans)", outline: "none", minWidth: "200px" }}
              />
              {searchQuery && (
                <button onClick={clearSearch}
                  style={{ padding: "10px 14px", backgroundColor: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              )}
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

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "36px 24px 60px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* ── Search Results ── */}
          {searchQuery && (
            <div style={{ marginBottom: "36px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", paddingBottom: "12px", borderBottom: "3px solid #0d0d0d" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Hasil Pencarian</span>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "2px", marginBottom: 0 }}>
                    "{searchQuery}"
                  </h2>
                </div>
                <span style={{ fontSize: "12px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>
                  {searchResults.length} hasil
                </span>
              </div>

              {searchLoading ? (
                <Skeleton />
              ) : searchResults.length === 0 ? (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "40px 24px", textAlign: "center" }}>
                  <p style={{ fontSize: "14px", color: "#6b6966", fontFamily: "var(--font-sans)", margin: 0 }}>
                    Tidak ada hasil untuk "<strong>{searchQuery}</strong>"
                  </p>
                </div>
              ) : (
                <div style={{ border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", backgroundColor: "#fff" }}>
                  {searchResults.map((item, i) => (
                    <div key={item.id}>
                      {i > 0 && <div style={{ height: "0", borderTop: "1px solid #e5e2dd" }} />}
                      <div style={{ padding: "6px 0" }}>
                        <div style={{ padding: "10px 24px 0" }}>
                          <span style={{ fontSize: "10px", fontWeight: "700", color: "#8b1a2a", backgroundColor: "rgba(139,26,42,0.08)", border: "1px solid rgba(139,26,42,0.15)", padding: "2px 8px", borderRadius: "2px", fontFamily: "var(--font-sans)", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
                            {item.category.name}
                          </span>
                        </div>
                        <AccordionItem
                          item={item}
                          isOpen={openItems.has(item.id)}
                          onToggle={() => handleToggle(item.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── FAQ List (all categories, no filter) ── */}
          {!searchQuery && (
            loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="skeleton" style={{ height: "12px", width: "30%", borderRadius: "2px", marginBottom: "12px" }} />
                    <Skeleton />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {categories.map((category) => (
                  <div key={category.id} id={`cat-${category.id}`}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "10px", paddingBottom: "10px", borderBottom: "3px solid #0d0d0d" }}>
                      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: 0 }}>
                        {category.name}
                      </h2>
                      <span style={{ fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>
                        {category.items.length} pertanyaan
                      </span>
                    </div>

                    <div style={{ border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", backgroundColor: "#fff" }}>
                      {category.items.map((item) => (
                        <AccordionItem
                          key={item.id}
                          item={item}
                          isOpen={openItems.has(item.id)}
                          onToggle={() => handleToggle(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── Contact CTA ── */}
          {!loading && (
            <div style={{ marginTop: "40px", backgroundColor: "#0d0d0d", borderRadius: "4px", padding: "32px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" as const, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Masih Ada Pertanyaan?</span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 6px" }}>
                  Tidak menemukan jawaban yang Anda cari?
                </h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: 0, lineHeight: "1.65" }}>
                  Hubungi kami langsung melalui halaman kontak.
                </p>
              </div>
              <Link href="/kontak"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", backgroundColor: "#8b1a2a", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", transition: "background 0.2s", flexShrink: 0, position: "relative", zIndex: 1 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#a82235")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#8b1a2a")}>
                Hubungi Kami
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          )}

        </div>
      </section>

      <style>{`
        .faq-answer {
          font-family: var(--font-sans);
          font-size: 14px;
          line-height: 1.8;
          color: #3a3a3a;
        }
        .faq-answer p { margin: 0 0 0.8em; }
        .faq-answer p:last-child { margin-bottom: 0; }
        .faq-answer a { color: #1e4d7b; text-underline-offset: 2px; }
        .faq-answer a:hover { color: #8b1a2a; }
        .faq-answer strong { font-weight: 700; color: #0d0d0d; }
      `}</style>
    </>
  );
}