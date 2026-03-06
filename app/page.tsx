"use client";

import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  views: number;
  authors: { id: number; name: string }[];
  categories: string[];
};

type EventItem = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  jenis_acara: string;
  links: { id: number; judul_link: string; url: string }[];
};

type WikiProject = {
  id: number;
  nama_proyek: string;
  slug: string;
  logo_url: string;
  deskripsi: string;
  urutan: number;
  subprojects: { id: number; nama_bahasa: string; url: string }[];
};

const programs = [
  {
    key: "kebudayaan",
    title: "Program Kebudayaan",
    desc: "Dokumentasi dan pelestarian budaya Indonesia melalui platform terbuka serta aktif dalam gerakan budaya terbuka di Indonesia.",
    accent: "#8b1a2a",
    href: "https://kebudayaan.wikimedia.or.id",
  },
  {
    key: "pendidikan",
    title: "Program Pendidikan",
    desc: "Menyediakan materi dan pelatihan terbuka tentang penggunaan serta kontribusi ke proyek Wikimedia dan berpartisipasi aktif dalam gerakan pendidikan terbuka di Indonesia.",
    accent: "#1a3a5c",
    href: "https://pendidikan.wikimedia.or.id/",
  },
  {
    key: "komunitas",
    title: "Program Komunitas",
    desc: "Mendorong partisipasi sukarelawan dan mendukung komunitas yang aktif menyunting, berbagi, dan menjaga kualitas informasi.",
    accent: "#1e4d7b",
    href: "https://komunitas.wikimedia.or.id/",
  },
  {
    key: "data-teknologi",
    title: "Data & Teknologi",
    desc: "Pengembangan dan pemanfaatan teknologi untuk mendukung penyebaran informasi dan pengelolaan data serta aktif dalam gerakan data terbuka di Indonesia.",
    accent: "#2a6399",
    href: "https://datatek.wikimedia.or.id/",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  useScrollReveal();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [wikiProjects, setWikiProjects] = useState<WikiProject[]>([]);
  const [wikiLoading, setWikiLoading] = useState(true);
  const [activeWikiTab, setActiveWikiTab] = useState<number>(0);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetch("https://dashboard.wikimedia.or.id/api/v1/articles?per_page=4")
      .then((res) => res.json())
      .then((json) => { if (json.success) setArticles(json.data); })
      .catch(() => {})
      .finally(() => setArticlesLoading(false));

    fetch("https://dashboard.wikimedia.or.id/api/v1/events/upcoming/list?limit=5")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length > 0) {
          setEvents(json.data.slice(0, 5));
        } else {
          return fetch("https://dashboard.wikimedia.or.id/api/v1/events?upcoming=false")
            .then((res) => res.json())
            .then((fallback) => {
              if (fallback.success) {
                const sorted = (fallback.data as EventItem[])
                  .sort((a, b) => new Date(b.tanggal_mulai).getTime() - new Date(a.tanggal_mulai).getTime());
                setEvents(sorted.slice(0, 5));
              }
            });
        }
      })
      .catch(() => {})
      .finally(() => setEventsLoading(false));

    fetch("https://dashboard.wikimedia.or.id/api/v1/wiki-projects")
      .then((res) => res.json())
      .then((json) => { if (json.success) setWikiProjects(json.data); })
      .catch(() => {})
      .finally(() => setWikiLoading(false));
  }, []);

  useEffect(() => {
    const articleImages = articles.filter((a) => a.featured_image).slice(0, 3);
    if (articleImages.length < 2) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % articleImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [articles]);

  const getEventStatus = (ev: EventItem): "berlangsung" | "mendatang" | "selesai" => {
    const now = new Date();
    const mulai = new Date(ev.tanggal_mulai);
    const selesai = new Date(ev.tanggal_selesai);
    if (now > selesai) return "selesai";
    if (now >= mulai && now <= selesai) return "berlangsung";
    return "mendatang";
  };

  const formatTanggal = (mulai: string, selesai: string) => {
    const tMulai = new Date(mulai);
    const tSelesai = new Date(selesai);
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    if (tMulai.toDateString() === tSelesai.toDateString()) return tMulai.toLocaleDateString("id-ID", opts);
    if (tMulai.getMonth() === tSelesai.getMonth() && tMulai.getFullYear() === tSelesai.getFullYear()) {
      return `${tMulai.getDate()}–${tSelesai.toLocaleDateString("id-ID", opts)}`;
    }
    return `${tMulai.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} – ${tSelesai.toLocaleDateString("id-ID", opts)}`;
  };

  const handleSubscribe = () => {
    if (email) setSubmitted(true);
  };

  const formatCategory = (cat: string) => {
    const connectors = new Set(["dan", "atau", "di", "ke", "dari", "untuk", "yang", "dengan"]);
    return cat
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word, i) =>
        i === 0 || !connectors.has(word.toLowerCase())
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : word.toLowerCase()
      )
      .join(" ");
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div className="hero-parallax" style={{ position: "absolute", inset: 0, backgroundImage: "url('/Foto_bersama_para_peserta_WikiNusantara_2024.png')", backgroundSize: "cover", backgroundPosition: "center top", backgroundRepeat: "no-repeat" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.72) 35%, rgba(8,8,8,0.3) 60%, rgba(8,8,8,0.05) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div className="hero-dots" />

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "700px", width: "100%" }}>
            <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "24px", padding: "6px 14px", border: "1px solid rgba(139,26,42,0.6)", borderRadius: "2px", backgroundColor: "rgba(139,26,42,0.12)" }}>
              <span className="hero-badge-dot" style={{ display: "block", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#e05070" }} />
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#e05070", fontFamily: "var(--font-sans)" }}>Pengetahuan Bebas untuk Semua</span>
            </div>

            <h1 className="hero-title" style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)", fontWeight: "700", color: "#ffffff", lineHeight: "1.15", marginBottom: "24px", fontFamily: "var(--font-serif)", letterSpacing: "-0.01em" }}>
              Membangun{" "}
              <span style={{ backgroundColor: "rgba(139,26,42,0.55)", color: "#ffffff", padding: "2px 4px", borderRadius: "1px", boxShadow: "0 0 0 1px rgba(139,26,42,0.8)" }}>Ekosistem</span>{" "}
              Pengetahuan Terbuka di Indonesia
            </h1>

            <p className="hero-desc" style={{ fontSize: "16px", color: "rgba(255,255,255,0.72)", lineHeight: "1.8", marginBottom: "40px", fontFamily: "var(--font-sans)" }}>
              Wikimedia Indonesia adalah organisasi nirlaba yang berdedikasi untuk memajukan gerakan pengetahuan terbuka di Indonesia.
            </p>

            <div className="hero-buttons" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/program" className="btn-ripple" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", backgroundColor: "#8b1a2a", color: "#fff", fontSize: "13px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "all 0.2s", borderRadius: "2px" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a82235")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8b1a2a")}>
                Jelajahi Program
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/tentang" className="btn-ripple" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", backgroundColor: "transparent", color: "#ffffff", fontSize: "13px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", fontFamily: "var(--font-sans)", border: "1px solid rgba(255,255,255,0.5)", transition: "all 0.2s", borderRadius: "2px" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.borderColor = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}>
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTIKEL TERBARU ──────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", border: "1px solid rgba(26,58,92,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", border: "1px solid rgba(26,58,92,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "220px", height: "220px", borderRadius: "50%", backgroundColor: "rgba(139,26,42,0.03)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="section-border-shimmer reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", paddingBottom: "16px", borderBottom: "3px solid #0d0d0d" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Terkini</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "4px" }}>Artikel & Berita Terbaru</h2>
            </div>
            <Link href="/rubrik" style={{ fontSize: "13px", fontWeight: "600", color: "#1e4d7b", textDecoration: "none", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#8b1a2a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#1e4d7b")}>
              Lihat Semua →
            </Link>
          </div>

          {articlesLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", backgroundColor: "#fff" }}>
                  <div className="skeleton" style={{ height: "160px" }} />
                  <div style={{ padding: "20px" }}>
                    <div className="skeleton" style={{ height: "12px", borderRadius: "2px", marginBottom: "12px", width: "40%" }} />
                    <div className="skeleton" style={{ height: "16px", borderRadius: "2px", marginBottom: "8px" }} />
                    <div className="skeleton" style={{ height: "16px", borderRadius: "2px", width: "70%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {articles.map((a) => (
                <Link key={a.id} href={`/rubrik/${a.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <article className="card-glow" style={{ border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", height: "100%", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
                    <div style={{ height: "180px", backgroundColor: "#f0eeec", overflow: "hidden", borderBottom: "1px solid #e5e2dd", position: "relative" }}>
                      {a.featured_image ? (
                        <img src={a.featured_image} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: "40px", opacity: 0.2 }}>📰</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                      {/* Categories + date row */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                        {a.categories?.length > 0 ? (
                          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", flex: 1 }}>
                            {a.categories.map((cat) => (
                              <span
                                key={cat}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/rubrik/kategori/${cat}`); }}
                                style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.04em", color: "#1e4d7b", backgroundColor: "rgba(30,77,123,0.08)", padding: "2px 8px", borderRadius: "2px", fontFamily: "var(--font-sans)", cursor: "pointer", transition: "all 0.15s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(30,77,123,0.18)"; e.currentTarget.style.color = "#0d2a4d"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(30,77,123,0.08)"; e.currentTarget.style.color = "#1e4d7b"; }}
                              >
                                {formatCategory(cat)}
                              </span>
                            ))}
                          </div>
                        ) : <span style={{ flex: 1 }} />}
                        <span style={{ fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)", whiteSpace: "nowrap", flexShrink: 0 }}>
                          {new Date(a.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0d0d0d", lineHeight: "1.5", fontFamily: "var(--font-serif)", margin: 0 }}>{a.title}</h3>
                      <p style={{ fontSize: "12px", color: "#9a9690", lineHeight: "1.6", fontFamily: "var(--font-sans)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0, flex: 1 }}>
                        {a.excerpt}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid #f0eeec", marginTop: "auto" }}>
                        {a.authors?.[0] ? (
                          <span
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/rubrik/author/${a.authors[0].name.toLowerCase().replace(/\s+/g, "-")}`); }}
                            style={{ fontSize: "11px", color: "#5c5a57", fontFamily: "var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%", cursor: "pointer", transition: "color 0.15s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#1e4d7b")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5a57")}
                          >
                            {a.authors[0].name}
                          </span>
                        ) : (
                          <span style={{ fontSize: "11px", color: "#5c5a57", fontFamily: "var(--font-sans)" }}>—</span>
                        )}
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)", flexShrink: 0 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          {a.views.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ACARA MENDATANG ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 12px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "linear-gradient(180deg, #8b1a2a, transparent)", opacity: 0.3, pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="section-border-shimmer reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", paddingBottom: "16px", borderBottom: "3px solid #0d0d0d" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Kalender</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "4px" }}>Acara Mendatang</h2>
            </div>
            <Link href="/acara" style={{ fontSize: "13px", fontWeight: "600", color: "#1e4d7b", textDecoration: "none", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#8b1a2a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#1e4d7b")}>
              Lihat Semua →
            </Link>
          </div>

          <div className="events-grid" style={{ display: "grid", gridTemplateColumns: "1fr 480px", gap: "36px", alignItems: "center" }}>
            <div className="reveal-stagger" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {eventsLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "20px 24px" }}>
                    <div className="skeleton" style={{ height: "12px", borderRadius: "2px", marginBottom: "10px", width: "30%" }} />
                    <div className="skeleton" style={{ height: "16px", borderRadius: "2px", marginBottom: "8px" }} />
                    <div className="skeleton" style={{ height: "12px", borderRadius: "2px", width: "50%" }} />
                  </div>
                ))
              ) : events.length === 0 ? (
                <div style={{ padding: "40px 24px", textAlign: "center", color: "#9a9690", fontFamily: "var(--font-sans)", fontSize: "14px" }}>
                  Tidak ada acara mendatang saat ini.
                </div>
              ) : (
                events.map((ev) => {
                  const status = getEventStatus(ev);
                  const borderColor = status === "berlangsung" ? "#16a34a" : status === "selesai" ? "#c5c3bf" : "#1a3a5c";
                  const badgeColor = status === "berlangsung" ? "#16a34a" : status === "selesai" ? "#9a9690" : "#1e4d7b";
                  const badgeBg = status === "berlangsung" ? "rgba(22,163,74,0.08)" : status === "selesai" ? "rgba(0,0,0,0.05)" : "rgba(30,77,123,0.08)";
                  const badgeLabel = status === "berlangsung" ? "● Berlangsung" : status === "selesai" ? "Selesai" : "Mendatang";
                  const dateColor = status === "berlangsung" ? "#16a34a" : status === "selesai" ? "#9a9690" : "#1a3a5c";
                  return (
                    <Link key={ev.id} href={`/acara/${ev.slug}`} style={{ textDecoration: "none" }}>
                      <div className="event-card" style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e2dd",
                        borderLeft: `3px solid ${borderColor}`,
                        borderRadius: "4px",
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        cursor: "pointer",
                      }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"; (e.currentTarget as HTMLElement).style.transform = "translateX(4px)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                        <div style={{ flexShrink: 0, textAlign: "center", minWidth: "36px" }}>
                          <div style={{ fontSize: "18px", fontWeight: "700", color: dateColor, fontFamily: "var(--font-serif)", lineHeight: 1 }}>
                            {new Date(ev.tanggal_mulai).getDate()}
                          </div>
                          <div style={{ fontSize: "9px", fontWeight: "600", color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-sans)", marginTop: "1px" }}>
                            {new Date(ev.tanggal_mulai).toLocaleDateString("id-ID", { month: "short" })}
                          </div>
                        </div>
                        <div style={{ width: "1px", backgroundColor: "#e5e2dd", flexShrink: 0, alignSelf: "stretch" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase", color: badgeColor, backgroundColor: badgeBg, padding: "1px 6px", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>
                              {badgeLabel}
                            </span>
                            <span style={{ fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: "3px" }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              {ev.lokasi}
                            </span>
                          </div>
                          <h3 style={{ fontSize: "13px", fontWeight: "600", color: status === "selesai" ? "#5c5a57" : "#0d0d0d", fontFamily: "var(--font-serif)", lineHeight: "1.35", margin: 0 }}>{ev.judul}</h3>
                          <p style={{ fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)", marginTop: "2px" }}>
                            {formatTanggal(ev.tanggal_mulai, ev.tanggal_selesai)}
                          </p>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c5c3bf" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            <div className="events-illustration" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "480px" }}>
              {(() => {
                const slideImages = articles.filter((a) => a.featured_image).slice(0, 3);
                if (slideImages.length === 0) return null;
                return (
                  <div style={{ position: "relative", width: "100%", maxWidth: "480px", height: "460px", borderRadius: "6px", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.18)", border: "1px solid rgba(0,0,0,0.08)" }}>
                    {slideImages.map((a, idx) => (
                      <div key={a.id} style={{
                        position: "absolute", inset: 0,
                        opacity: idx === activeSlide ? 1 : 0,
                        transition: "opacity 0.8s ease-in-out",
                        pointerEvents: idx === activeSlide ? "auto" : "none",
                      }}>
                        <img
                          src={a.featured_image!}
                          alt={a.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        <div style={{
                          position: "absolute", bottom: 0, left: 0, right: 0,
                          background: "linear-gradient(transparent, rgba(0,0,0,0.72))",
                          padding: "28px 16px 14px",
                        }}>
                          <p style={{
                            fontSize: "12px", fontWeight: "600", color: "#fff",
                            fontFamily: "var(--font-serif)", lineHeight: "1.4", margin: 0,
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                          }}>
                            {a.title}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div style={{ position: "absolute", bottom: "10px", right: "12px", display: "flex", gap: "5px", zIndex: 10 }}>
                      {slideImages.map((_, idx) => (
                        <button key={idx} onClick={() => setActiveSlide(idx)} style={{
                          width: idx === activeSlide ? "18px" : "6px",
                          height: "6px", borderRadius: "3px",
                          backgroundColor: idx === activeSlide ? "#e05070" : "rgba(255,255,255,0.5)",
                          border: "none", cursor: "pointer", padding: 0,
                          transition: "all 0.3s ease",
                        }} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROYEK WIKIMEDIA ──────────────────────────────────────────────── */}
      <section className="section-dark" style={{ backgroundColor: "#1a3a5c", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(30,77,123,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="reveal" style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="section-border-shimmer reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", paddingBottom: "16px", borderBottom: "3px solid rgba(255,255,255,0.85)" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Ekosistem</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: "700", color: "#ffffff", fontFamily: "var(--font-serif)", marginTop: "4px" }}>Proyek Wikimedia</h2>
            </div>
            <a href="https://id.wikimedia.org/wiki/Halaman_Utama" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.65)", textDecoration: "none", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e05070")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}>
              Selengkapnya →
            </a>
          </div>

          {wikiLoading ? (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "36px", width: "120px", borderRadius: "4px" }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", borderBottom: "2px solid rgba(255,255,255,0.12)", paddingBottom: "0", marginBottom: "0" }}>
                {wikiProjects.map((p, idx) => {
                  const isActive = activeWikiTab === idx;
                  return (
                    <button key={p.id} className="wiki-tab-btn" onClick={() => setActiveWikiTab(idx)}
                      style={{
                        padding: "8px 16px", border: "none",
                        borderBottom: isActive ? "2px solid #e05070" : "2px solid transparent",
                        marginBottom: "-2px",
                        background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                        cursor: "pointer",
                        color: isActive ? "#ffffff" : "rgba(255,255,255,0.66)",
                        borderRadius: "4px 4px 0 0",
                      }}
                      onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}
                      onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}>
                      <span style={{ fontSize: "14px", fontWeight: isActive ? "700" : "500", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>
                        {p.nama_proyek}
                      </span>
                    </button>
                  );
                })}
              </div>

              {wikiProjects[activeWikiTab] && (() => {
                const active = wikiProjects[activeWikiTab];
                return (
                  <div style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderTop: "none", borderRadius: "0 0 4px 4px", overflow: "hidden", backdropFilter: "blur(8px)" }}>
                    <div style={{ padding: "28px 32px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "flex-start", gap: "20px" }}>
                      <img src={active.logo_url} alt={active.nama_proyek} style={{ width: "48px", height: "48px", objectFit: "contain", flexShrink: 0 }} />
                      <div>
                        <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#ffffff", fontFamily: "var(--font-serif)", margin: "0 0 6px" }}>{active.nama_proyek}</h3>
                        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", fontFamily: "var(--font-sans)", margin: 0 }}>{active.deskripsi}</p>
                      </div>
                    </div>
                    <div style={{ padding: "20px 32px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {active.subprojects.map((sp) => (
                          <a key={sp.id} href={sp.url} target="_blank" rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "2px", fontSize: "12px", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-sans)", textDecoration: "none", fontWeight: "500", transition: "all 0.15s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}>
                            {sp.nama_bahasa}
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </section>

      {/* ── SOROTAN PROGRAM ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="section-border-shimmer reveal" style={{ marginBottom: "48px", paddingBottom: "16px", borderBottom: "3px solid #0d0d0d" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Inisiatif</span>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "4px" }}>Program Kami</h2>
          </div>

          <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
            {programs.map((p) => (
              <a key={p.key} href={p.href} target={p.href.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                <div className="program-card" style={{ border: "1px solid #e5e2dd", borderRadius: "4px", padding: "32px", height: "100%", borderTop: `3px solid ${p.accent}` }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                  <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginBottom: "10px" }}>{p.title}</h3>
                  <p style={{ fontSize: "13px", color: "#5c5a57", lineHeight: "1.7", fontFamily: "var(--font-sans)", marginBottom: "20px" }}>{p.desc}</p>
                  <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", color: p.accent, fontFamily: "var(--font-sans)" }}>
                    Selengkapnya →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA NEWSLETTER ────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#1a3a5c", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "300px", height: "300px", borderRadius: "50%", backgroundColor: "rgba(139,26,42,0.12)" }} />

        <div className="reveal" style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Bergabung</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#ffffff", fontFamily: "var(--font-serif)", margin: "12px 0 16px", lineHeight: "1.2" }}>
            Jadilah Bagian dari Gerakan Pengetahuan Bebas
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: "1.8", marginBottom: "40px", fontFamily: "var(--font-sans)" }}>
            Daftarkan email kamu untuk mendapatkan kabar terbaru tentang program, acara, dan perkembangan Wikimedia Indonesia langsung di kotak masukmu.
          </p>

          {!submitted ? (
            <div style={{ display: "flex", maxWidth: "480px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
              <input
                className="newsletter-input"
                type="email"
                placeholder="Alamat email kamu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1, minWidth: "240px", padding: "14px 20px", fontSize: "14px",
                  border: "1px solid rgba(255,255,255,0.2)", borderRadius: "2px",
                  backgroundColor: "rgba(255,255,255,0.08)", color: "#ffffff",
                  fontFamily: "var(--font-sans)", outline: "none",
                }}
              />
              <button
                className="btn-ripple"
                onClick={handleSubscribe}
                style={{
                  padding: "14px 28px", backgroundColor: "#8b1a2a", color: "#fff",
                  fontSize: "13px", fontWeight: "700", letterSpacing: "0.06em",
                  textTransform: "uppercase", border: "none", cursor: "pointer",
                  fontFamily: "var(--font-sans)", transition: "background 0.2s", borderRadius: "2px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a82235")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8b1a2a")}
              >
                Berlangganan
              </button>
            </div>
          ) : (
            <div style={{ padding: "20px 32px", backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", borderRadius: "4px", display: "inline-block" }}>
              <p style={{ color: "#4ade80", fontFamily: "var(--font-sans)", fontWeight: "600", fontSize: "15px" }}>
                ✓ Terima kasih! Kamu sudah terdaftar.
              </p>
            </div>
          )}

          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "16px", fontFamily: "var(--font-sans)" }}>
            Atau{" "}
            <Link href="/komunitas/bergabung" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "underline" }}>bergabung sebagai kontributor</Link>
            {" "}dan mulai berkontribusi hari ini.
          </p>
        </div>
      </section>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes shimmer { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

        @media (max-width: 768px) {
          .events-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .events-illustration {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}