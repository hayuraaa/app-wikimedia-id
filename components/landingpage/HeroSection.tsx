"use client";

import { useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";

export default function HeroSection() {
  useScrollReveal();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#artikel-terbaru") {
      const el = document.getElementById("artikel-terbaru");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div className="hero-parallax" style={{ position: "absolute", inset: 0, backgroundImage: "url('/Foto_bersama_para_peserta_WikiNusantara_2024.webp')", backgroundSize: "cover", backgroundPosition: "center top", backgroundRepeat: "no-repeat" }} />
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
            <Link href="/#artikel-terbaru" className="btn-ripple" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", backgroundColor: "#8b1a2a", color: "#fff", fontSize: "13px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "all 0.2s", borderRadius: "2px" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a82235")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8b1a2a")}>
              Jelajahi
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
  );
}