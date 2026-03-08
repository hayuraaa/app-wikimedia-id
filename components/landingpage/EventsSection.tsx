"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article, EventItem } from "@/app/page";

function getEventStatus(ev: EventItem): "berlangsung" | "mendatang" | "selesai" {
  const now = new Date();
  const mulai = new Date(ev.tanggal_mulai);
  const selesai = new Date(ev.tanggal_selesai);
  if (now > selesai) return "selesai";
  if (now >= mulai && now <= selesai) return "berlangsung";
  return "mendatang";
}

function formatTanggal(mulai: string, selesai: string) {
  const tMulai = new Date(mulai);
  const tSelesai = new Date(selesai);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  if (tMulai.toDateString() === tSelesai.toDateString()) return tMulai.toLocaleDateString("id-ID", opts);
  if (tMulai.getMonth() === tSelesai.getMonth() && tMulai.getFullYear() === tSelesai.getFullYear()) {
    return `${tMulai.getDate()}–${tSelesai.toLocaleDateString("id-ID", opts)}`;
  }
  return `${tMulai.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} – ${tSelesai.toLocaleDateString("id-ID", opts)}`;
}

export default function EventsSection({
  events,
  articles,
}: {
  events: EventItem[];
  articles: Article[];
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const articleImages = articles.filter((a) => a.featured_image).slice(0, 3);
    if (articleImages.length < 2) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % articleImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [articles]);

  return (
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
            {events.length === 0 ? (
              [...Array(3)].map((_, i) => (
                <div key={i} style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "20px 24px" }}>
                  <div className="skeleton" style={{ height: "12px", borderRadius: "2px", marginBottom: "10px", width: "30%" }} />
                  <div className="skeleton" style={{ height: "16px", borderRadius: "2px", marginBottom: "8px" }} />
                  <div className="skeleton" style={{ height: "12px", borderRadius: "2px", width: "50%" }} />
                </div>
              ))
            ) : events.length === 0 ? (
              <div style={{ padding: "40px 24px", textAlign: "center", color: "#6b6966 ", fontFamily: "var(--font-sans)", fontSize: "14px" }}>
                Tidak ada acara mendatang saat ini.
              </div>
            ) : (
              events.map((ev) => {
                const status = getEventStatus(ev);
                const borderColor = status === "berlangsung" ? "#16a34a" : status === "selesai" ? "#c5c3bf" : "#1a3a5c";
                const badgeColor = status === "berlangsung" ? "#16a34a" : status === "selesai" ? "#6b6966 " : "#1e4d7b";
                const badgeBg = status === "berlangsung" ? "rgba(22,163,74,0.08)" : status === "selesai" ? "rgba(0,0,0,0.05)" : "rgba(30,77,123,0.08)";
                const badgeLabel = status === "berlangsung" ? "● Berlangsung" : status === "selesai" ? "Selesai" : "Mendatang";
                const dateColor = status === "berlangsung" ? "#16a34a" : status === "selesai" ? "#6b6966 " : "#1a3a5c";
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
                        <div style={{ fontSize: "9px", fontWeight: "600", color: "#6b6966 ", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-sans)", marginTop: "1px" }}>
                          {new Date(ev.tanggal_mulai).toLocaleDateString("id-ID", { month: "short" })}
                        </div>
                      </div>
                      <div style={{ width: "1px", backgroundColor: "#e5e2dd", flexShrink: 0, alignSelf: "stretch" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase", color: badgeColor, backgroundColor: badgeBg, padding: "1px 6px", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>
                            {badgeLabel}
                          </span>
                          <span style={{ fontSize: "10px", color: "#6b6966 ", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: "3px" }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {ev.lokasi}
                          </span>
                        </div>
                        <h3 style={{ fontSize: "13px", fontWeight: "600", color: status === "selesai" ? "#5c5a57" : "#0d0d0d", fontFamily: "var(--font-serif)", lineHeight: "1.35", margin: 0 }}>{ev.judul}</h3>
                        <p style={{ fontSize: "10px", color: "#6b6966 ", fontFamily: "var(--font-sans)", marginTop: "2px" }}>
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
                      <Image
                        src={a.featured_image!}
                        alt={a.title}
                        fill
                        sizes="480px"
                        style={{ objectFit: "cover" }}
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
                      <button key={idx} onClick={() => setActiveSlide(idx)} aria-label={`Slide ${idx + 1}`} style={{
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

      <style>{`
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
    </section>
  );
}