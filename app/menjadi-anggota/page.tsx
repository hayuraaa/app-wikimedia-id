"use client";

import { useState } from "react";
import Link from "next/link";

const BASE = "https://dashboard.wikimedia.or.id/api/v1";

const DAFTAR_URL = "https://wmid.info/anggotabaru2026/";
const PERPANJANG_URL = "http://wmid.info/perpanjanganggota2026/";


// ─── Logika Periode ───────────────────────────────────────────────────────────

function getPeriodeStatus() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const isDaftarOpen = (month === 1) || (month === 2 && day <= 28);
  const isPerpanjangOpen = month === 11 || month === 12;

  return { isDaftarOpen, isPerpanjangOpen, year };
}

// ─── Registration Card ────────────────────────────────────────────────────────

function RegistrationCard() {
  const { isDaftarOpen, isPerpanjangOpen, year } = getPeriodeStatus();

  return (
    <>
      {/* Pendaftaran */}
      <div style={{ backgroundColor: "#0d0d0d", borderRadius: "4px", padding: "22px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
        <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Pendaftaran Baru</span>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "8px 0 10px", lineHeight: "1.35" }}>
          Pendaftaran Anggota Baru
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "3px", marginBottom: "10px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e05070" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-sans)", fontWeight: "600" }}>Setiap tahun: 1 Januari – 28 Februari</span>
        </div>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-sans)", margin: "0 0 14px", lineHeight: "1.65" }}>
          {isDaftarOpen
            ? `Pendaftaran anggota baru ${year} sedang dibuka! Segera daftarkan diri Anda sebelum 28 Februari ${year}.`
            : `Pendaftaran anggota baru dibuka setiap tahun pada 1 Januari hingga 28 Februari. Pantau terus halaman ini.`}
        </p>
        {isDaftarOpen ? (
          <a href={DAFTAR_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "10px 16px", backgroundColor: "#8b1a2a", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", transition: "background 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#a82235")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#8b1a2a")}>
            Daftar Sekarang
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 16px", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "3px", fontSize: "12px", fontWeight: "600", fontFamily: "var(--font-sans)", color: "rgba(255,255,255,0.3)", cursor: "not-allowed" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Pendaftaran Belum Dibuka
          </div>
        )}
      </div>

      {/* Perpanjangan */}
      <div style={{
        backgroundColor: "#fff",
        border: `1px solid ${isPerpanjangOpen ? "#fbbf24" : "#e5e2dd"}`,
        borderLeft: `4px solid ${isPerpanjangOpen ? "#f59e0b" : "#e5e2dd"}`,
        borderRadius: "4px", padding: "18px 20px",
      }}>
        <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: isPerpanjangOpen ? "#92400e" : "#9a9690", fontFamily: "var(--font-sans)" }}>
          {isPerpanjangOpen ? "⚠ Perpanjangan" : "◆ Perpanjangan"}
        </span>
        <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "8px 0 6px", lineHeight: "1.4" }}>
          Perpanjangan Keanggotaan
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9a9690" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span style={{ fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)", fontWeight: "600" }}>Setiap tahun: 1 November – 31 Desember</span>
        </div>
        <p style={{ fontSize: "12px", color: "#5c5a57", fontFamily: "var(--font-sans)", margin: "0 0 12px", lineHeight: "1.65" }}>
          {isPerpanjangOpen
            ? `Perpanjangan keanggotaan ${year} sedang dibuka! Segera perpanjang sebelum 31 Desember ${year}.`
            : `Perpanjangan keanggotaan dibuka setiap tahun pada 1 November hingga 31 Desember.`}
        </p>
        {isPerpanjangOpen ? (
          <a href={PERPANJANG_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "9px 14px", backgroundColor: "#f59e0b", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", transition: "background 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#d97706")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f59e0b")}>
            Perpanjang Sekarang
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        ) : (
          <div style={{ fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)", fontStyle: "italic" }}>
            Tombol perpanjangan akan muncul saat periode dibuka.
          </div>
        )}
      </div>
    </>
  );
}

// ─── Pendaftaran & Perpanjangan Section ──────────────────────────────────────

function PendaftaranPerpanjanganSection() {
  const { isDaftarOpen, isPerpanjangOpen, year } = getPeriodeStatus();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ paddingBottom: "10px", borderBottom: "3px solid #0d0d0d" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Periode</span>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "4px", marginBottom: 0 }}>Pendaftaran & Perpanjangan</h2>
      </div>

      {/* Pendaftaran Anggota Baru */}
      <div style={{
        backgroundColor: "#fff", borderRadius: "4px", padding: "22px 24px",
        border: isDaftarOpen ? "1px solid rgba(139,26,42,0.25)" : "1px solid #e5e2dd",
        borderLeft: isDaftarOpen ? "4px solid #8b1a2a" : "4px solid #e5e2dd",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" as const,
      }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{
              fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "100px",
              fontFamily: "var(--font-sans)", letterSpacing: "0.05em", textTransform: "uppercase" as const,
              backgroundColor: isDaftarOpen ? "rgba(139,26,42,0.1)" : "#f0eeec",
              color: isDaftarOpen ? "#8b1a2a" : "#9a9690",
              border: isDaftarOpen ? "1px solid rgba(139,26,42,0.2)" : "1px solid #e5e2dd",
            }}>
              {isDaftarOpen ? `\u25CF Dibuka \u2014 ${year}` : "Belum Dibuka"}
            </span>
          </div>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "0 0 6px" }}>
            Pendaftaran Anggota Baru
          </h3>
          <p style={{ fontSize: "13px", color: "#5c5a57", fontFamily: "var(--font-sans)", margin: "0 0 4px", lineHeight: "1.65" }}>
            Dibuka setiap tahun pada <strong>1 Januari &ndash; 28 Februari</strong>.
          </p>
          <p style={{ fontSize: "13px", color: isDaftarOpen ? "#8b1a2a" : "#9a9690", fontFamily: "var(--font-sans)", margin: 0, lineHeight: "1.65", fontWeight: isDaftarOpen ? "600" : "400" }}>
            {isDaftarOpen
              ? `Pendaftaran anggota baru ${year} sedang berlangsung. Segera daftarkan diri Anda sebelum 28 Februari ${year}!`
              : `Pendaftaran akan dibuka kembali pada 1 Januari ${year + 1}. Daftarkan email Anda untuk mendapat pengingat.`}
          </p>
        </div>
        {isDaftarOpen && (
          <a href={DAFTAR_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 18px", backgroundColor: "#8b1a2a", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", whiteSpace: "nowrap" as const, flexShrink: 0, alignSelf: "center" as const, transition: "background 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#a82235")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#8b1a2a")}>
            Daftar Sekarang
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        )}
      </div>

      {/* Perpanjangan */}
      <div style={{
        backgroundColor: "#fff", borderRadius: "4px", padding: "22px 24px",
        border: isPerpanjangOpen ? "1px solid rgba(245,158,11,0.35)" : "1px solid #e5e2dd",
        borderLeft: isPerpanjangOpen ? "4px solid #f59e0b" : "4px solid #e5e2dd",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" as const,
      }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{
              fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "100px",
              fontFamily: "var(--font-sans)", letterSpacing: "0.05em", textTransform: "uppercase" as const,
              backgroundColor: isPerpanjangOpen ? "rgba(245,158,11,0.1)" : "#f0eeec",
              color: isPerpanjangOpen ? "#92400e" : "#9a9690",
              border: isPerpanjangOpen ? "1px solid rgba(245,158,11,0.3)" : "1px solid #e5e2dd",
            }}>
              {isPerpanjangOpen ? `\u25CF Dibuka \u2014 ${year}` : "Belum Dibuka"}
            </span>
          </div>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "0 0 6px" }}>
            Perpanjangan Keanggotaan
          </h3>
          <p style={{ fontSize: "13px", color: "#5c5a57", fontFamily: "var(--font-sans)", margin: "0 0 4px", lineHeight: "1.65" }}>
            Dibuka setiap tahun pada <strong>1 November &ndash; 31 Desember</strong>.
          </p>
          <p style={{ fontSize: "13px", color: isPerpanjangOpen ? "#92400e" : "#9a9690", fontFamily: "var(--font-sans)", margin: 0, lineHeight: "1.65", fontWeight: isPerpanjangOpen ? "600" : "400" }}>
            {isPerpanjangOpen
              ? `Perpanjangan keanggotaan ${year} sedang berlangsung. Segera perpanjang sebelum 31 Desember ${year}!`
              : `Perpanjangan akan dibuka kembali pada 1 November ${year}. Keanggotaan aktif berlaku hingga 31 Desember setiap tahunnya.`}
          </p>
        </div>
        {isPerpanjangOpen && (
          <a href={PERPANJANG_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 18px", backgroundColor: "#f59e0b", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", whiteSpace: "nowrap" as const, flexShrink: 0, alignSelf: "center" as const, transition: "background 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#d97706")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f59e0b")}>
            Perpanjang Sekarang
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Subscribe Form ───────────────────────────────────────────────────────────

function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(`${BASE}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        setMessage(json.message ?? "Email berhasil didaftarkan!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(json.message ?? "Gagal mendaftarkan email.");
      }
    } catch {
      setStatus("error");
      setMessage("Terjadi kesalahan. Coba lagi.");
    }
  };

  return (
    <div>
      {status === "success" ? (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", backgroundColor: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: "4px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "rgba(22,163,74,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <p style={{ fontSize: "13px", color: "#15803d", fontFamily: "var(--font-sans)", margin: 0, fontWeight: "600" }}>{message}</p>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", borderRadius: "3px", overflow: "hidden", border: "1px solid #e5e2dd", maxWidth: "480px" }}>
            <input
              type="email"
              placeholder="Masukkan alamat email Anda..."
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{ flex: 1, padding: "12px 16px", fontSize: "13px", border: "none", outline: "none", fontFamily: "var(--font-sans)", color: "#0d0d0d", backgroundColor: "#fff" }}
            />
            <button
              onClick={handleSubmit}
              disabled={status === "loading" || !email.trim()}
              style={{ padding: "12px 20px", backgroundColor: status === "loading" ? "#a82235" : "#8b1a2a", color: "#fff", border: "none", cursor: status === "loading" ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "7px", transition: "background 0.2s", whiteSpace: "nowrap" as const }}
              onMouseEnter={(e) => { if (status !== "loading") (e.currentTarget as HTMLElement).style.backgroundColor = "#a82235"; }}
              onMouseLeave={(e) => { if (status !== "loading") (e.currentTarget as HTMLElement).style.backgroundColor = "#8b1a2a"; }}
            >
              {status === "loading" ? (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Mendaftarkan...</>
              ) : (
                <>Daftarkan<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              )}
            </button>
          </div>
          {status === "error" && (
            <p style={{ fontSize: "12px", color: "#dc2626", fontFamily: "var(--font-sans)", margin: "8px 0 0" }}>{message}</p>
          )}
          <p style={{ fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)", margin: "10px 0 0", lineHeight: "1.6" }}>
            Kami tidak akan mengirim spam. Anda dapat berhenti berlangganan kapan saja.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MenjadiAnggotaPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        padding: "40px 24px 36px",
        position: "relative", overflow: "hidden",
        backgroundImage: "url('/banner/Mosaik_Budaya_1.png')",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.92) 0%, rgba(10,30,65,0.84) 40%, rgba(15,40,80,0.76) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.20) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#e05070", fontFamily: "var(--font-sans)" }}>Menjadi Anggota</span>
          </div>

          <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Keanggotaan</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 0", lineHeight: "1.2" }}>
            Menjadi Anggota
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: "6px 0 0" }}>
            Bergabunglah dengan komunitas sukarelawan yang berdedikasi membebaskan pengetahuan untuk seluruh masyarakat Indonesia.
          </p>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "36px 24px 60px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="anggota-layout" style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "32px", alignItems: "start" }}>

            {/* ── Main ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Tentang */}
              <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderLeft: "4px solid #0d0d0d", borderRadius: "4px", padding: "28px 32px" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Tentang</span>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "8px 0 14px" }}>Menjadi Anggota</h2>
                <p style={{ fontSize: "14px", color: "#3a3a3a", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: 0 }}>
                  Wikimedia Indonesia adalah organisasi independen yang didirikan pada tahun 2008. Di tahun yang sama dengan pendiriannya, Wikimedia Indonesia diakui sebagai mitra lokal Yayasan Wikimedia (Wikimedia Foundation) yang berlokasi di Amerika Serikat. Wikimedia Indonesia memiliki tujuan yang seiring sejalan, tetapi bukanlah cabang dari Yayasan Wikimedia.
                </p>
              </div>

              {/* Jadwal Pendaftaran & Perpanjangan */}
              <PendaftaranPerpanjanganSection />

              {/* Keanggotaan */}
              <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderLeft: "4px solid #0d0d0d", borderRadius: "4px", padding: "28px 32px" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Ketentuan</span>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "8px 0 16px" }}>Keanggotaan</h2>
                <p style={{ fontSize: "13px", color: "#5c5a57", fontFamily: "var(--font-sans)", margin: "0 0 14px", fontStyle: "italic" }}>Berdasarkan AD/ART Perkumpulan:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    "Anggota Wikimedia Indonesia terbuka bagi Warga Negara Indonesia maupun Warga Negara Asing.",
                    "Hak suara, hak memilih, dan hak dipilih sebagai Dewan Pengurus atau Dewan Pengawas hanya dimiliki oleh anggota berusia minimal 21 tahun (dewasa menurut KUH Perdata).",
                    "Berdasarkan keputusan Rapat Dewan Pengurus tanggal 27 Januari 2012, usia minimal untuk mendaftar sebagai anggota adalah 17 tahun.",
                  ].map((point, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#8b1a2a", flexShrink: 0, marginTop: "8px" }} />
                      <span style={{ fontSize: "14px", color: "#3a3a3a", lineHeight: "1.75", fontFamily: "var(--font-sans)" }}>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biaya */}
              <div>
                <div style={{ paddingBottom: "12px", marginBottom: "16px", borderBottom: "3px solid #0d0d0d" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Biaya</span>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "4px", marginBottom: 0 }}>Biaya Keanggotaan Tahunan</h2>
                </div>
                <div className="biaya-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    { label: "Opsi 1", title: "Keanggotaan + Suvenir", color: "#8b1a2a", umum: "Rp250.000", pelajar: "Rp150.000" },
                    { label: "Opsi 2", title: "Keanggotaan", color: "#1e4d7b", umum: "Rp150.000", pelajar: "Rp100.000" },
                  ].map((opsi) => (
                    <div key={opsi.label} style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderTop: `3px solid ${opsi.color}`, borderRadius: "4px", padding: "22px" }}>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: opsi.color, fontFamily: "var(--font-sans)", letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "block", marginBottom: "4px" }}>{opsi.label}</span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", display: "block", marginBottom: "14px" }}>{opsi.title}</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ padding: "11px 14px", backgroundColor: "#f8f7f5", borderRadius: "3px", border: "1px solid #e5e2dd" }}>
                          <span style={{ fontSize: "10px", fontWeight: "700", color: "#5c5a57", fontFamily: "var(--font-sans)", display: "block", marginBottom: "2px" }}>UMUM</span>
                          <span style={{ fontSize: "17px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-sans)" }}>{opsi.umum}</span>
                        </div>
                        <div style={{ padding: "11px 14px", backgroundColor: "#f8f7f5", borderRadius: "3px", border: "1px solid #e5e2dd" }}>
                          <span style={{ fontSize: "10px", fontWeight: "700", color: "#5c5a57", fontFamily: "var(--font-sans)", display: "block", marginBottom: "2px" }}>PELAJAR / MAHASISWA (S1)</span>
                          <span style={{ fontSize: "17px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-sans)" }}>{opsi.pelajar}</span>
                          <span style={{ fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)", display: "block", marginTop: "3px" }}>*lampirkan kartu tanda pelajar/mahasiswa yang masih berlaku</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pembayaran */}
              <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderLeft: "4px solid #0d0d0d", borderRadius: "4px", padding: "28px 32px" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Pembayaran</span>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "8px 0 14px" }}>Cara Pembayaran</h2>
                <p style={{ fontSize: "14px", color: "#5c5a57", fontFamily: "var(--font-sans)", margin: "0 0 16px", lineHeight: "1.7" }}>
                  Pembayaran keanggotaan dapat dikirimkan melalui:
                </p>
                <div style={{ backgroundColor: "#f8f7f5", border: "1px solid #e5e2dd", borderRadius: "3px", padding: "18px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "3px", backgroundColor: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-sans)" }}>Bank Mandiri</span>
                    <span style={{ fontSize: "12px", color: "#5c5a57", fontFamily: "var(--font-sans)" }}>KCP Jakarta Wisma Bisnis Indonesia</span>
                    <span style={{ fontSize: "12px", color: "#5c5a57", fontFamily: "var(--font-sans)" }}>a.n. <strong>Wikimedia Indonesia</strong></span>
                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-sans)", letterSpacing: "0.06em", marginTop: "4px" }}>121-00-0050038-3</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ── Sidebar ── */}
            <div className="anggota-sidebar" style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <RegistrationCard />

              {/* Ringkasan */}
              <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ padding: "13px 18px", borderBottom: "3px solid #0d0d0d" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Ringkasan</span>
                </div>
                <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: "0" }}>
                  {[
                    { label: "Usia Minimal", value: "17 tahun" },
                    { label: "Hak Suara", value: "≥ 21 tahun" },
                    { label: "Periode Daftar", value: "Jan – Feb" },
                    { label: "Periode Perpanjang", value: "Nov – Des" },
                    { label: "Masa Berlaku", value: "1 tahun" },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", ...(i > 0 ? { borderTop: "1px solid #f0eeec" } : {}) }}>
                      <span style={{ fontSize: "12px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>{row.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-sans)" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Subscribe ── */}
          <div style={{ marginTop: "40px", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
            <div className="subscribe-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: "36px 40px", borderRight: "1px solid #e5e2dd" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Newsletter</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "8px 0 10px", lineHeight: "1.3" }}>
                  Daftarkan Email Anda
                </h3>
                <p style={{ fontSize: "14px", color: "#5c5a57", fontFamily: "var(--font-sans)", lineHeight: "1.75", margin: 0 }}>
                  Daftarkan email Anda untuk mendapatkan kabar terbaru seputar pendaftaran dan perpanjangan anggota Wikimedia Indonesia langsung ke kotak masuk Anda.
                </p>
              </div>
              <div style={{ padding: "36px 40px", backgroundColor: "#fafaf9", display: "flex", alignItems: "center" }}>
                <div style={{ width: "100%" }}><SubscribeForm /></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 860px) {
          .anggota-layout { grid-template-columns: 1fr !important; }
          .anggota-sidebar { position: static !important; }
        }
        @media (max-width: 600px) {
          .biaya-grid { grid-template-columns: 1fr !important; }
        }
        .subscribe-layout { grid-template-columns: 1fr 1fr; }
        @media (max-width: 680px) {
          .subscribe-layout { grid-template-columns: 1fr !important; }
          .subscribe-layout > div:first-child { border-right: none !important; border-bottom: 1px solid #e5e2dd; }
        }
      `}</style>
    </>
  );
}