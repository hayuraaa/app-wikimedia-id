"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";

export default function HeroSection() {
  useScrollReveal();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

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
    <section style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "center", overflow: "hidden", backgroundColor: "#07111f" }}>

      <style>{`
        @media (max-width: 768px) {
          .hero-layout { flex-direction: column !important; gap: 40px !important; }
          .hero-video-col { width: 100% !important; }
          .hero-text-col { width: 100% !important; text-align: center; }
          .hero-buttons-wrap { justify-content: center !important; }
        }
      `}</style>

      {/* Foto background — sangat disaramkan */}
      <div className="hero-parallax" style={{ position: "absolute", inset: 0, backgroundImage: "url('/Pulau_padar.webp')", backgroundSize: "cover", backgroundPosition: "center top", backgroundRepeat: "no-repeat", opacity: 0.18 }} />
      {/* Overlay gelap merata */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(255, 255, 255, 0)", pointerEvents: "none" }} />
      {/* Vignette: tepi lebih gelap, tengah sedikit lebih terang */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(194, 212, 232, 0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px", width: "100%", position: "relative", zIndex: 1 }}>
        <div className="hero-layout" style={{ display: "flex", alignItems: "center", gap: "64px" }}>

          {/* ── Kiri: Teks ── */}
          <div className="hero-text-col" style={{ flex: "1 1 0", minWidth: 0 }}>
            <h1 className="hero-title" style={{ fontSize: "clamp(2rem, 3.5vw, 3.4rem)", fontWeight: "700", color: "#ffffff", lineHeight: "1.18", margin: "14px 0 22px", fontFamily: "var(--font-serif)", letterSpacing: "-0.01em" }}>
              Membangun{" "}
              <span style={{ backgroundColor: "rgba(12,87,168,0.50)", color: "#ffffff", padding: "2px 5px", borderRadius: "2px", boxShadow: "0 0 0 1px rgba(12,87,168,0.75)" }}>Ekosistem</span>{" "}
              Pengetahuan Terbuka di Indonesia
            </h1>

            <p className="hero-desc" style={{ fontSize: "15px", color: "rgba(255,255,255,0.68)", lineHeight: "1.85", marginBottom: "40px", fontFamily: "var(--font-sans)" }}>
              Wikimedia Indonesia adalah organisasi nirlaba yang berdedikasi untuk memajukan gerakan pengetahuan terbuka di Indonesia.
            </p>

            <div className="hero-buttons hero-buttons-wrap" style={{ display: "flex", gap: "14px", flexWrap: "wrap" as const }}>
              <Link
                href="/#artikel-terbaru"
                className="btn-ripple"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", backgroundColor: "#0C57A8", color: "#fff", fontSize: "13px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "var(--font-sans)", transition: "all 0.2s", borderRadius: "2px" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0a4a8f")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0C57A8")}
              >
                Jelajahi
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                href="/tentang"
                className="btn-ripple"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", backgroundColor: "transparent", color: "#ffffff", fontSize: "13px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "var(--font-sans)", border: "1px solid rgba(255,255,255,0.45)", transition: "all 0.2s", borderRadius: "2px" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)"; }}
              >
                Tentang Kami
              </Link>
            </div>
          </div>

          {/* ── Kanan: Video ── */}
          <div className="hero-video-col" style={{ flex: "1 1 0", minWidth: 0, position: "relative" }}>
            {/* Glow di belakang video */}
            <div style={{ position: "absolute", inset: "-12px", borderRadius: "12px", background: "radial-gradient(ellipse at center, rgba(12,87,168,0.25) 0%, transparent 75%)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1, borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(12,87,168,0.2)" }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", display: "block", objectFit: "cover" }}
              >
                <source src="/0204.webm" type="video/webm" />
              </video>

              {/* Tombol Play/Pause pojok kiri bawah */}
              <button
                onClick={togglePlay}
                title={playing ? "Pause" : "Play"}
                style={{ position: "absolute", bottom: "12px", left: "12px", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "50%", border: "none", backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", cursor: "pointer", backdropFilter: "blur(6px)", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.80)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.55)")}
              >
                {playing
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                }
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
