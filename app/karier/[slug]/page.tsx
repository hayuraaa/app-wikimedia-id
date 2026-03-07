"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

type Karir = {
  id: number;
  title: string;
  slug: string;
  description: string;
  link_pendaftaran: string;
  is_active: boolean;
  published_at: string;
  expires_at: string | null;
  views: number;
  created_at: string;
  creator: { id: number; name: string } | null;
};

const BASE = "https://dashboard.wikimedia.or.id/api/v1";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const isExpired = (exp: string | null) => exp ? new Date(exp) < new Date() : false;

const isExpiringSoon = (exp: string | null) => {
  if (!exp) return false;
  const diff = new Date(exp).getTime() - Date.now();
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
};

// ─── Reading Progress ─────────────────────────────────────────────────────────

function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setP(el.scrollHeight - el.clientHeight > 0 ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "3px", backgroundColor: "rgba(139,26,42,0.15)", zIndex: 9999, pointerEvents: "none" }}>
      <div style={{ height: "100%", width: `${p}%`, background: "linear-gradient(90deg, #8b1a2a, #e05070)", transition: "width 0.1s linear" }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KarirDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [karir, setKarir] = useState<Karir | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/karir/${slug}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setKarir(json.data);
          fetch(`${BASE}/karir/${slug}/views`, { method: "POST" }).catch(() => {});
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ backgroundColor: "#f8f7f5", minHeight: "100vh", padding: "60px 24px" }}>
      <ReadingProgress />
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div className="skeleton" style={{ height: "12px", width: "25%", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "36px", width: "65%", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "13px", width: "40%", borderRadius: "2px", marginBottom: "20px" }} />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: "14px", borderRadius: "2px", width: i % 4 === 3 ? "55%" : "100%" }} />
        ))}
      </div>
    </div>
  );

  if (notFound || !karir) return (
    <div style={{ backgroundColor: "#f8f7f5", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "15px", color: "#9a9690", fontFamily: "var(--font-sans)", marginBottom: "20px" }}>Lowongan tidak ditemukan.</p>
        <Link href="/karier" style={{ padding: "10px 24px", backgroundColor: "#8b1a2a", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)" }}>
          ← Kembali ke Karier
        </Link>
      </div>
    </div>
  );

  const expired = isExpired(karir.expires_at);
  const expiring = isExpiringSoon(karir.expires_at);

  return (
    <>
      <ReadingProgress />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        padding: "40px 24px 32px",
        position: "relative", overflow: "hidden",
        backgroundImage: "url('/banner/Mosaik_Teknologi.png')",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.92) 0%, rgba(10,30,65,0.84) 40%, rgba(15,40,80,0.76) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.20) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", flexWrap: "wrap" as const }}>
            {[
              { label: "Beranda", href: "/" },
              { label: "Karier", href: "/karier" },
            ].map((b, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Link href={b.href} style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                  {b.label}
                </Link>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
              </span>
            ))}
            <span style={{ fontSize: "11px", color: "#e05070", fontFamily: "var(--font-sans)" }}>{karir.title}</span>
          </div>

          {/* Status */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" as const }}>
            {expired ? (
              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", padding: "3px 10px", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>
                ✕ Ditutup
              </span>
            ) : (
              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#fff", backgroundColor: "rgba(22,163,74,0.3)", border: "1px solid rgba(22,163,74,0.4)", padding: "3px 10px", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>
                ● Dibuka
              </span>
            )}
            {expiring && (
              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#fbbf24", backgroundColor: "rgba(217,119,6,0.2)", border: "1px solid rgba(217,119,6,0.35)", padding: "3px 10px", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>
                ⚠ Segera Tutup
              </span>
            )}
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "0 0 20px", lineHeight: "1.2" }}>
            {karir.title}
          </h1>

          {/* Meta */}
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "16px", paddingBottom: "28px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Dibuka: {formatDate(karir.published_at)}
            </span>
            {karir.expires_at && (
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: expiring ? "#fbbf24" : "rgba(255,255,255,0.5)", fontWeight: expiring ? "600" : "400", fontFamily: "var(--font-sans)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Ditutup: {formatDate(karir.expires_at)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "0 24px 60px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="karir-layout" style={{ display: "grid", gridTemplateColumns: "1fr 268px", gap: "40px", alignItems: "start" }}>

            {/* ── Konten ── */}
            <div>
              {/* Expired banner */}
              {expired && (
                <div style={{ marginTop: "36px", backgroundColor: "#fff", border: "1px solid #fca5a5", borderLeft: "4px solid #ef4444", borderRadius: "4px", padding: "14px 18px", display: "flex", gap: "10px", alignItems: "center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p style={{ fontSize: "13px", color: "#991b1b", fontFamily: "var(--font-sans)", margin: 0, fontWeight: "600" }}>
                    Lowongan ini sudah ditutup pada {formatDate(karir.expires_at!)}.
                  </p>
                </div>
              )}

              {/* Description */}
              <div
                className="karir-content"
                style={{ paddingTop: "36px" }}
                dangerouslySetInnerHTML={{ __html: karir.description }}
              />

              {/* Back */}
              <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "2px solid #0d0d0d" }}>
                <Link href="/karier" style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: "#5c5a57", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#8b1a2a")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5a57")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  Kembali ke Karier
                </Link>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="karir-sidebar" style={{ position: "sticky", top: "88px", marginTop: "36px", display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* CTA */}
              {!expired && karir.link_pendaftaran && (
                <div style={{ backgroundColor: "#0d0d0d", borderRadius: "4px", padding: "22px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "0 0 6px" }}>Tertarik Melamar?</h4>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", lineHeight: "1.6", margin: "0 0 16px" }}>
                    Baca seluruh deskripsi dengan cermat sebelum mengirimkan lamaran.
                  </p>
                  <a href={karir.link_pendaftaran} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "11px 16px", backgroundColor: "#8b1a2a", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", transition: "background 0.2s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#a82235")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#8b1a2a")}>
                    Daftar Sekarang
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
              )}

              {/* Info */}
              <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ padding: "13px 18px", borderBottom: "3px solid #0d0d0d" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Info Lowongan</span>
                </div>
                <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "0" }}>
                  {[
                    { label: "Tanggal Dibuka", value: formatDate(karir.published_at), icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9a9690" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
                    ...(karir.expires_at ? [{ label: "Batas Pendaftaran", value: formatDate(karir.expires_at), highlight: expiring, icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={expiring ? "#d97706" : "#9a9690"} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }] : []),
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 0", ...(i > 0 ? { borderTop: "1px solid #f0eeec" } : {}) }}>
                      <span style={{ flexShrink: 0, marginTop: "3px" }}>{row.icon}</span>
                      <div>
                        <span style={{ fontSize: "10px", fontWeight: "700", color: "#9a9690", fontFamily: "var(--font-sans)", letterSpacing: "0.05em", textTransform: "uppercase" as const, display: "block" }}>{row.label}</span>
                        <span style={{ fontSize: "12px", color: (row as any).highlight ? "#d97706" : "#0d0d0d", fontFamily: "var(--font-sans)", marginTop: "2px", display: "block", fontWeight: (row as any).highlight ? "600" : "400" }}>
                          {row.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fbbf24", borderRadius: "4px", padding: "14px 16px" }}>
                <p style={{ fontSize: "11px", color: "#92400e", lineHeight: "1.65", fontFamily: "var(--font-sans)", margin: 0 }}>
                  <strong>⚠ Peringatan:</strong> Wikimedia Indonesia tidak pernah meminta uang dalam proses rekrutmen. Laporkan ke{" "}
                  <a href="mailto:lowongan@wikimedia.or.id" style={{ color: "#8b1a2a", fontWeight: "600", textDecoration: "none" }}>
                    lowongan@wikimedia.or.id
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        .karir-content { font-family: var(--font-sans); font-size: 15px; line-height: 1.85; color: #1a1a18; }
        .karir-content p { margin: 0 0 1em; }
        .karir-content h2 { font-size: 1.15em; font-weight: 700; color: #0d0d0d; margin: 1.6em 0 0.5em; font-family: var(--font-serif); }
        .karir-content h3 { font-size: 1.05em; font-weight: 700; color: #0d0d0d; margin: 1.4em 0 0.4em; font-family: var(--font-serif); }
        .karir-content ol, .karir-content ul { margin: 0 0 1em; padding-left: 1.5em; }
        .karir-content li { margin-bottom: 0.35em; }
        .karir-content li p { margin: 0; }
        .karir-content strong { font-weight: 700; color: #0d0d0d; }
        .karir-content a { color: #1e4d7b; text-underline-offset: 2px; }
        .karir-content a:hover { color: #8b1a2a; }
        @media (max-width: 800px) {
          .karir-layout { grid-template-columns: 1fr !important; }
          .karir-sidebar { position: static !important; order: -1; }
        }
      `}</style>
    </>
  );
}