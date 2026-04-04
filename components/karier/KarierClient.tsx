"use client";

import Link from "next/link";
import type { Karir } from "@/app/karier/page";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });

const isExpiringSoon = (exp: string | null) => {
  if (!exp) return false;
  const diff = new Date(exp).getTime() - Date.now();
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
};

// ─── Card ─────────────────────────────────────────────────────────────────────

function KarirCard({ item }: { item: Karir }) {
  const expiring = isExpiringSoon(item.expires_at);
  const excerpt = item.description.replace(/<[^>]*>/g, "").substring(0, 180).trim();

  return (
    <Link href={`/karier/${item.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <article
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e2dd",
          borderRadius: "4px",
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          transition: "box-shadow 0.2s, border-color 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
          el.style.borderColor = "#c5c3bf";
          el.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.boxShadow = "none";
          el.style.borderColor = "#e5e2dd";
          el.style.transform = "translateY(0)";
        }}
      >
        {/* Left */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badges */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" as const }}>
            <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#16a34a", backgroundColor: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", padding: "2px 8px", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>
              ● Dibuka
            </span>
            {expiring && (
              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#d97706", backgroundColor: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", padding: "2px 8px", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>
                ⚡ Segera Berakhir
              </span>
            )}
          </div>

          <h3 style={{ fontSize: "clamp(1rem, 1.5vw, 1.15rem)", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "0 0 8px", lineHeight: "1.35" }}>
            {item.title}
          </h3>

          <p style={{ fontSize: "13px", color: "#5c5a57", lineHeight: "1.7", fontFamily: "var(--font-sans)", margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
            {excerpt}…
          </p>

          {/* Meta */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" as const }}>
            <span style={{ fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: "5px" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Dibuka: {formatDate(item.published_at)}
            </span>
            {item.expires_at && (
              <span style={{ fontSize: "11px", color: expiring ? "#d97706" : "#6b6966", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: "5px" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Batas: {formatDate(item.expires_at)}
              </span>
            )}
          </div>
        </div>

        {/* Right */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 18px", backgroundColor: "#0C57A8", color: "#fff", borderRadius: "3px", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", whiteSpace: "nowrap" as const }}>
            Lihat Detail
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </article>
    </Link>
  );
}

// ─── Client Component ─────────────────────────────────────────────────────────

export default function KarierClient({ items, total }: { items: Karir[]; total: number }) {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        padding: "40px 24px 36px",
        position: "relative", overflow: "hidden",
        backgroundImage: "url('/banner/Mosaik_Teknologi.png')",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.92) 0%, rgba(10,30,65,0.84) 40%, rgba(15,40,80,0.76) 100%)", pointerEvents: "none" }} />
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
            <span style={{ fontSize: "11px", color: "#3b8ed4", fontFamily: "var(--font-sans)" }}>Karier</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 0", lineHeight: "1.2" }}>
            Karier Wikimedia Indonesia
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: "6px 0 0" }}>
            {total > 0 ? `${total} lowongan tersedia` : "Tidak ada lowongan saat ini"}
          </p>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "36px 24px 60px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* ── Keterangan ── */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "32px 36px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "8px 0 16px" }}>
              Karier Wikimedia Indonesia
            </h2>
            <p style={{ fontSize: "14px", color: "#3a3a3a", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: "0 0 14px" }}>
              Wikimedia Indonesia merupakan organisasi nirlaba dan merupakan mitra lokal dari Yayasan Wikimedia di San Fransisco, Amerika Serikat, pengelola situs populer dunia Wikipedia dan proyek-proyek wiki lainnya. Wikimedia Indonesia berdedikasi untuk mendorong pertumbuhan, pengembangan, dan penyebaran pengetahuan dalam bahasa Indonesia dan bahasa lain yang dipertuturkan di Indonesia secara bebas dan gratis.
            </p>
            <p style={{ fontSize: "14px", color: "#3a3a3a", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: 0 }}>
              Sebagai pemberi kerja, Wikimedia Indonesia menjunjung tinggi kesetaraan. Pengangkatan pekerja didasarkan pada kemampuan, pengalaman, dan kualifikasi pribadi tanpa melakukan diskriminasi atas dasar suku, agama, ras, warna kulit, usia, jenis kelamin, identitas gender, orientasi seksual, kebangsaan, disabilitas, ataupun karakteristik personal lainnya yang tidak berhubungan dengan kemampuan kerja.
            </p>
          </div>

          {/* ── Lowongan ── */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", paddingBottom: "12px", borderBottom: "3px solid #0d0d0d" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0C57A8", fontFamily: "var(--font-sans)" }}>◆ Lowongan</span>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "2px", marginBottom: 0 }}>
                  Posisi Tersedia
                </h2>
              </div>
              {total > 0 && (
                <span style={{ fontSize: "12px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>{total} lowongan</span>
              )}
            </div>

            {items.length === 0 ? (
              <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "52px 24px", textAlign: "center" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "#f0eeec", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b6966" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
                </div>
                <p style={{ fontSize: "15px", fontWeight: "600", color: "#3a3a3a", fontFamily: "var(--font-serif)", margin: "0 0 6px" }}>
                  Saat ini tidak ada lowongan tersedia
                </p>
                <p style={{ fontSize: "13px", color: "#6b6966", fontFamily: "var(--font-sans)", margin: 0 }}>
                  Pantau terus halaman ini untuk informasi lowongan terbaru.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {items.map((item) => <KarirCard key={item.id} item={item} />)}
              </div>
            )}
          </div>

          {/* ── Warning ── */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #fbbf24", borderLeft: "4px solid #f59e0b", borderRadius: "4px", padding: "20px 24px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#92400e", fontFamily: "var(--font-sans)", margin: "0 0 4px" }}>Peringatan</p>
              <p style={{ fontSize: "13px", color: "#5c5a57", lineHeight: "1.7", fontFamily: "var(--font-sans)", margin: 0 }}>
                Dalam melakukan perekrutan, Wikimedia Indonesia tidak pernah meminta sejumlah uang untuk alasan apapun. Apabila Anda dimintai sejumlah uang, harap melaporkan kepada kami melalui surel:{" "}
                <a href="mailto:lowongan@wikimedia.or.id" style={{ color: "#0C57A8", fontWeight: "600", textDecoration: "none" }}>
                  lowongan@wikimedia.or.id
                </a>
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}