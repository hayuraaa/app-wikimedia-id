"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventItem = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  jenis_acara: string;
  status: string;
  links: { id: number; judul_link: string; url: string }[];
  creator?: { id: number; name: string };
};

type EventStatus = "berlangsung" | "mendatang" | "selesai";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const getStatus = (ev: EventItem): EventStatus => {
  const now = new Date();
  const mulai = new Date(ev.tanggal_mulai);
  const selesai = new Date(ev.tanggal_selesai);
  if (now > selesai) return "selesai";
  if (now >= mulai && now <= selesai) return "berlangsung";
  return "mendatang";
};

const formatTanggalLong = (mulai: string, selesai: string) => {
  const tMulai = new Date(mulai);
  const tSelesai = new Date(selesai);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  if (tMulai.toDateString() === tSelesai.toDateString())
    return tMulai.toLocaleDateString("id-ID", opts);
  if (tMulai.getMonth() === tSelesai.getMonth() && tMulai.getFullYear() === tSelesai.getFullYear())
    return `${tMulai.getDate()}–${tSelesai.toLocaleDateString("id-ID", opts)}`;
  return `${tMulai.toLocaleDateString("id-ID", { day: "numeric", month: "long" })} – ${tSelesai.toLocaleDateString("id-ID", opts)}`;
};

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }) + " WIB";

const getDuration = (mulai: string, selesai: string) => {
  const diff = new Date(selesai).getTime() - new Date(mulai).getTime();
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days} hari`;
  if (hours > 0 && mins > 0) return `${hours} jam ${mins} menit`;
  if (hours > 0) return `${hours} jam`;
  return `${mins} menit`;
};

const statusCfg = {
  berlangsung: { label: "● Sedang Berlangsung", color: "#16a34a", bg: "rgba(22,163,74,0.1)",  border: "#16a34a" },
  mendatang:   { label: "Mendatang",            color: "#1e4d7b", bg: "rgba(30,77,123,0.1)",  border: "#1e4d7b" },
  selesai:     { label: "Telah Selesai",         color: "#9a9690", bg: "rgba(0,0,0,0.05)",    border: "#c5c3bf" },
};

const jenisCfg: Record<string, { label: string; color: string; desc: string }> = {
  daring: { label: "Daring",  color: "#2a6399", desc: "Kegiatan dilaksanakan secara online" },
  luring: { label: "Luring",  color: "#784e14", desc: "Kegiatan dilaksanakan secara tatap muka" },
  hybrid: { label: "Hybrid",  color: "#502878", desc: "Kombinasi daring dan tatap muka" },
};

// ─── Countdown ────────────────────────────────────────────────────────────────

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <div style={{ backgroundColor: "rgba(30,77,123,0.08)", border: "1px solid rgba(30,77,123,0.2)", borderRadius: "4px", padding: "16px 20px" }}>
      <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#1e4d7b", fontFamily: "var(--font-sans)", margin: "0 0 12px" }}>⏱ Hitung Mundur</p>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        {[
          { val: timeLeft.days,    label: "Hari" },
          { val: timeLeft.hours,   label: "Jam" },
          { val: timeLeft.minutes, label: "Menit" },
          { val: timeLeft.seconds, label: "Detik" },
        ].map(({ val, label }) => (
          <div key={label} style={{ flex: 1, textAlign: "center", backgroundColor: "#1e4d7b", borderRadius: "4px", padding: "10px 4px" }}>
            <div style={{ fontSize: "22px", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", lineHeight: 1 }}>
              {String(val).padStart(2, "0")}
            </div>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-sans)", marginTop: "3px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AcaraDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [event, setEvent]       = useState<EventItem | null>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [otherEvents, setOtherEvents] = useState<EventItem[]>([]);

  const BASE = "https://dashboard.wikimedia.or.id/api/v1";

  useEffect(() => {
    fetch(`${BASE}/events/${slug}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((json) => {
        if (json.success) setEvent(json.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    // Fetch other events for sidebar
    fetch(`${BASE}/events/upcoming/list?limit=5`)
      .then((r) => r.json())
      .then((json) => { if (json.success) setOtherEvents(json.data.filter((e: EventItem) => e.slug !== slug).slice(0, 4)); })
      .catch(() => {});
  }, [slug]);

  // ── Not found ──
  if (!loading && notFound) {
    return (
      <div style={{ backgroundColor: "#f8f7f5", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "16px 0 8px" }}>Acara Tidak Ditemukan</h2>
          <p style={{ fontSize: "14px", color: "#9a9690", fontFamily: "var(--font-sans)", marginBottom: "24px" }}>Acara yang kamu cari tidak ditemukan atau telah dihapus.</p>
          <Link href="/acara" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 24px", backgroundColor: "#8b1a2a", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)" }}>
            ← Kembali ke Acara
          </Link>
        </div>
      </div>
    );
  }

  const status = event ? getStatus(event) : "selesai";
  const cfg    = statusCfg[status];
  const jenis  = event ? (jenisCfg[event.jenis_acara] ?? { label: event.jenis_acara, color: "#5c5a57", desc: "" }) : null;

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section style={{
        padding: "40px 24px 36px",
        position: "relative",
        overflow: "hidden",
        backgroundImage: "url('/banner/Mosaik_Budaya_1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        {/* Overlay gradient warm */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(40,22,6,0.92) 0%, rgba(80,44,8,0.84) 40%, rgba(120,72,10,0.72) 100%)", pointerEvents: "none" }} />
        {/* Grid pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        {/* Glow kuning kanan atas */}
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,20,0.28) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* Glow amber kiri bawah */}
        <div style={{ position: "absolute", bottom: "-40px", left: "8%", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(180,100,10,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px", flexWrap: "wrap" as const }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>Beranda</Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)" }}>/</span>
            <Link href="/acara" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>Acara</Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#f5c842", fontFamily: "var(--font-sans)" }}>Detail</span>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="skeleton" style={{ height: "16px", width: "120px", borderRadius: "2px" }} />
              <div className="skeleton" style={{ height: "40px", width: "70%", borderRadius: "2px" }} />
              <div className="skeleton" style={{ height: "14px", width: "40%", borderRadius: "2px" }} />
            </div>
          ) : event && (
            <>

              <h1 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", fontWeight: "700", color: "#ffffff", fontFamily: "var(--font-serif)", margin: "0 0 16px", lineHeight: "1.2", maxWidth: "860px" }}>
                {event.judul}
              </h1>

              {/* Meta row */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" as const }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-sans)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {formatTanggalLong(event.tanggal_mulai, event.tanggal_selesai)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-sans)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {formatTime(event.tanggal_mulai)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-sans)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {event.lokasi}
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "40px 24px 60px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="detail-layout" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px", alignItems: "start" }}>

            {/* ── Kiri: konten ── */}
            <div>
              {loading ? (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: "14px", borderRadius: "2px", width: i % 3 === 2 ? "60%" : "100%" }} />)}
                </div>
              ) : event && (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ padding: "16px 24px", borderBottom: "3px solid #0d0d0d" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Tentang Acara</span>
                  </div>
                  <div style={{ padding: "28px 32px" }}>
                    <div style={{ fontSize: "15px", color: "#2c2c2c", fontFamily: "var(--font-sans)", lineHeight: "1.9", whiteSpace: "pre-line" as const }}>
                      {event.deskripsi}
                    </div>
                  </div>
                </div>
              )}

              {/* Links section */}
              {!loading && event && event.links.length > 0 && (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", marginTop: "20px" }}>
                  <div style={{ padding: "16px 24px", borderBottom: "3px solid #0d0d0d" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Tautan Terkait</span>
                  </div>
                  <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {event.links.map((l) => (
                      <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 16px", border: "1px solid #e5e2dd", borderRadius: "3px", textDecoration: "none", backgroundColor: "#fafaf9", transition: "all 0.15s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#1e4d7b"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(30,77,123,0.04)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; (e.currentTarget as HTMLElement).style.backgroundColor = "#fafaf9"; }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "3px", backgroundColor: "rgba(30,77,123,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e4d7b" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                          </div>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: "600", color: "#0d0d0d", fontFamily: "var(--font-sans)" }}>{l.judul_link}</div>
                            <div style={{ fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, maxWidth: "340px" }}>{l.url}</div>
                          </div>
                        </div>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1e4d7b" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Back button */}
              <div style={{ marginTop: "24px" }}>
                <Link href="/acara"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", border: "1px solid #e5e2dd", borderRadius: "3px", backgroundColor: "#fff", color: "#3a3a3a", textDecoration: "none", fontSize: "12px", fontWeight: "600", fontFamily: "var(--font-sans)", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#8b1a2a"; (e.currentTarget as HTMLElement).style.color = "#8b1a2a"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; (e.currentTarget as HTMLElement).style.color = "#3a3a3a"; }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  Kembali ke Daftar Acara
                </Link>
              </div>
            </div>

            {/* ── Kanan: sidebar ── */}
            <aside style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Info card */}
              {loading ? (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: "14px", borderRadius: "2px" }} />)}
                </div>
              ) : event && (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "3px solid #0d0d0d" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Info Acara</span>
                  </div>
                  <div style={{ padding: "0" }}>
                    {[
                      {
                        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                        label: "Tanggal",
                        value: formatTanggalLong(event.tanggal_mulai, event.tanggal_selesai),
                      },
                      {
                        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                        label: "Waktu Mulai",
                        value: formatTime(event.tanggal_mulai),
                      },
                      {
                        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                        label: "Waktu Selesai",
                        value: formatTime(event.tanggal_selesai),
                      },
                      {
                        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                        label: "Lokasi",
                        value: event.lokasi,
                      },
                      {
                        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
                        label: "Jenis",
                        value: jenis?.label ?? event.jenis_acara,
                        extra: jenis?.color,
                      },
                    ].map(({ icon, label, value, extra }, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 18px", borderBottom: "1px solid #f0eeec" }}>
                        <div style={{ color: "#8b1a2a", flexShrink: 0, marginTop: "1px" }}>{icon}</div>
                        <div>
                          <div style={{ fontSize: "10px", fontWeight: "600", color: "#9a9690", textTransform: "uppercase" as const, letterSpacing: "0.06em", fontFamily: "var(--font-sans)", marginBottom: "2px" }}>{label}</div>
                          <div style={{ fontSize: "13px", color: extra ?? "#0d0d0d", fontFamily: "var(--font-sans)", fontWeight: extra ? "600" : "400" }}>{value}</div>
                        </div>
                      </div>
                    ))}

                    {/* Status */}
                    <div style={{ padding: "14px 18px" }}>
                      <div style={{ fontSize: "10px", fontWeight: "600", color: "#9a9690", textTransform: "uppercase" as const, letterSpacing: "0.06em", fontFamily: "var(--font-sans)", marginBottom: "8px" }}>Status</div>
                      <span style={{ display: "inline-flex", alignItems: "center", fontSize: "12px", fontWeight: "700", color: cfg.color, backgroundColor: cfg.bg, padding: "5px 14px", borderRadius: "3px", fontFamily: "var(--font-sans)", border: `1px solid ${cfg.border}30` }}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Countdown — hanya untuk acara mendatang */}
              {!loading && event && status === "mendatang" && (
                <Countdown targetDate={event.tanggal_mulai} />
              )}

              {/* Acara lainnya */}
              {otherEvents.length > 0 && (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "3px solid #0d0d0d" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Acara Lainnya</span>
                  </div>
                  <div style={{ padding: "8px 0" }}>
                    {otherEvents.map((ev) => {
                      const st = getStatus(ev);
                      const c = statusCfg[st];
                      return (
                        <Link key={ev.id} href={`/acara/${ev.slug}`} style={{ textDecoration: "none" }}>
                          <div style={{ padding: "10px 18px", borderLeft: "3px solid transparent", transition: "all 0.15s", cursor: "pointer" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(139,26,42,0.04)"; (e.currentTarget as HTMLElement).style.borderLeftColor = "#8b1a2a"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent"; }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
                              <span style={{ fontSize: "9px", fontWeight: "700", color: c.color, backgroundColor: c.bg, padding: "1px 6px", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>{c.label}</span>
                            </div>
                            <div style={{ fontSize: "12px", fontWeight: "600", color: "#0d0d0d", fontFamily: "var(--font-serif)", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                              {ev.judul}
                            </div>
                            <div style={{ fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)", marginTop: "3px" }}>
                              {new Date(ev.tanggal_mulai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div style={{ padding: "10px 18px", borderTop: "1px solid #f0eeec" }}>
                    <Link href="/acara" style={{ fontSize: "12px", fontWeight: "600", color: "#1e4d7b", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#8b1a2a")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#1e4d7b")}>
                      Lihat semua acara →
                    </Link>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .detail-layout { grid-template-columns: 1fr !important; }
          .detail-layout aside { position: static !important; }
        }
      `}</style>
    </>
  );
}