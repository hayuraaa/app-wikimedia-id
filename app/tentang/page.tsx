"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type GalleryItem = {
  id: number;
  title: string;
  image_url: string;
  image_type: string;
  order: number;
};

// ─── Placeholder image (pakai warna solid jika gambar belum ada) ──────────────

const PALETTES = [
  { color: "#1a3a2a", accent: "#4ade80" },
  { color: "#1a2a3a", accent: "#60a5fa" },
  { color: "#2a1a2a", accent: "#c084fc" },
  { color: "#1a1a3a", accent: "#fb923c" },
  { color: "#2a1a1a", accent: "#f87171" },
  { color: "#1a2a1a", accent: "#34d399" },
  { color: "#2a2a1a", accent: "#fbbf24" },
  { color: "#1a2a2a", accent: "#22d3ee" },
];

function GalleryImg({ src, alt, color }: { src: string; alt: string; color: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: color }}>
      <img
        src={src}
        alt={alt}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

// ─── Stunning Masonry Gallery ─────────────────────────────────────────────────

function MasonryGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // ── Fetch dari API ──
  useEffect(() => {
    fetch("https://dashboard.wikimedia.or.id/api/v1/galeri")
      .then((r) => r.json())
      .then((json) => { if (json.success) setGallery(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);


  // Keyboard nav
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setLightbox((p) => p !== null ? (p - 1 + gallery.length) % gallery.length : null);
      if (e.key === "ArrowRight") setLightbox((p) => p !== null ? (p + 1) % gallery.length : null);
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, gallery.length]);

  const palette = (idx: number) => PALETTES[idx % PALETTES.length];

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[424, 208, 208, 208, 208].map((h, i) => (
          <div key={i} style={{
            height: h, borderRadius: "6px", backgroundColor: "#e8e6e3",
            gridColumn: i === 0 ? "1" : undefined,
            gridRow: i === 0 ? "1 / 3" : undefined,
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>
    );
  }

  if (!gallery.length) return null;

  const Cell = ({ idx, height }: { idx: number; height: number }) => {
    if (idx >= gallery.length) return null;
    const item = gallery[idx];
    const { color } = palette(idx);

    return (
      <div
        onClick={() => setLightbox(idx)}
        style={{ height, borderRadius: "6px", overflow: "hidden", position: "relative", cursor: "pointer" }}
        className="gallery-cell"
      >
        <GalleryImg src={item.image_url} alt={item.title} color={color} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
        {height > 120 && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: height > 200 ? "24px 16px 14px" : "14px 12px 10px" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#fff", fontFamily: "var(--font-serif)", lineHeight: 1.35,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {item.title}
            </div>
          </div>
        )}
      </div>
    );
  };

  const StripCell = ({ idx }: { idx: number }) => {
    const item = gallery[idx % gallery.length];
    const { color } = palette(idx % gallery.length);
    return (
      <div
        onClick={() => setLightbox(idx % gallery.length)}
        className="gallery-strip-cell"
        style={{ flexShrink: 0, width: "130px", height: "86px", borderRadius: "5px", overflow: "hidden", position: "relative", cursor: "pointer" }}
      >
        <GalleryImg src={item.image_url} alt={item.title} color={color} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
      </div>
    );
  };

  return (
    <div ref={ref}>
      {/* ── Main mosaic ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto auto", gap: "8px" }}>
        <div style={{ gridColumn: "1", gridRow: "1 / 3" }}><Cell idx={0} height={424} /></div>
        <div style={{ gridColumn: "2", gridRow: "1" }}><Cell idx={1} height={208} /></div>
        <div style={{ gridColumn: "3", gridRow: "1" }}><Cell idx={2} height={208} /></div>
        <div style={{ gridColumn: "2 / 4", gridRow: "2", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <Cell idx={3} height={208} />
          <Cell idx={4} height={208} />
        </div>
      </div>

      {/* ── Horizontal filmstrip ── */}
      <div style={{
        marginTop: "10px", overflowX: "auto", scrollbarWidth: "none",
        paddingBottom: "6px", paddingTop: "2px",
        maskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)",
      }}>
        <div style={{ display: "flex", gap: "7px", paddingLeft: "2px", paddingRight: "2px" }}>
          {[...gallery, ...gallery, ...gallery].map((_, i) => (
            <StripCell key={i} idx={i} />
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && (() => {
        const item = gallery[lightbox];
        const { color, accent } = palette(lightbox);
        return (
          <div
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              backgroundColor: "rgba(0,0,0,0.95)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px", animation: "fadeIn 0.25s ease", backdropFilter: "blur(6px)",
            }}
          >
            <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + gallery.length) % gallery.length); }}
              style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.06)", color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)")}>‹</button>

            <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % gallery.length); }}
              style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.06)", color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)")}>›</button>

            <button onClick={() => setLightbox(null)}
              style={{ position: "absolute", top: "20px", right: "20px", width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>✕</button>

            <div onClick={(e) => e.stopPropagation()} style={{ animation: "slideUp 0.35s cubic-bezier(0.22,1,0.36,1)", maxWidth: "840px", width: "100%" }}>
              <div style={{ height: "3px", background: `linear-gradient(90deg, ${accent}, transparent)`, borderRadius: "2px 2px 0 0" }} />
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", backgroundColor: color, overflow: "hidden" }}>
                <GalleryImg src={item.image_url} alt={item.title} color={color} />
                <div style={{ position: "absolute", top: "14px", left: "14px", padding: "4px 10px", backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", borderRadius: "2px", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#fff", fontFamily: "var(--font-sans)", letterSpacing: "0.08em" }}>{lightbox + 1} / {gallery.length}</span>
                </div>
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", maxWidth: "70%", lineHeight: 1.4 }}>{item.title}</div>
                <div style={{ display: "flex", gap: "5px" }}>
                  {gallery.map((_, i) => (
                    <button key={i} onClick={() => setLightbox(i)}
                      style={{ width: i === lightbox ? "22px" : "6px", height: "6px", borderRadius: "3px", border: "none", padding: 0, cursor: "pointer", backgroundColor: i === lightbox ? accent : "rgba(255,255,255,0.2)", transition: "all 0.3s ease" }} />
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "5px", marginTop: "6px" }}>
                {gallery.map((g, i) => {
                  const { color: c, accent: a } = palette(i);
                  return (
                    <div key={i} onClick={() => setLightbox(i)}
                      style={{ flex: 1, height: "52px", borderRadius: "3px", overflow: "hidden", position: "relative", cursor: "pointer", outline: i === lightbox ? `2px solid ${accent}` : "2px solid transparent", outlineOffset: "1px", opacity: i === lightbox ? 1 : 0.45, transition: "outline 0.2s, opacity 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = "0.85"}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = i === lightbox ? "1" : "0.45"}>
                      <GalleryImg src={g.image_url} alt={g.title} color={c} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({ nama: "", email: "", telepon: "", subjek: "", pesan: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.nama || !form.email || !form.telepon || !form.subjek || !form.pesan) {
      setStatus("error");
      setMsg("Harap lengkapi semua kolom yang wajib diisi.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("https://dashboard.wikimedia.or.id/api/v1/contact/situs-utama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.nama,
          phone: form.telepon,
          email: form.email,
          message: `Subjek: ${form.subjek}\n\n${form.pesan}`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        setMsg(json.message || "Pesan Anda berhasil terkirim!");
        setForm({ nama: "", email: "", telepon: "", subjek: "", pesan: "" });
      } else {
        setStatus("error");
        setMsg(json.message || "Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch {
      setStatus("error");
      setMsg("Gagal mengirim pesan. Periksa koneksi internet Anda.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", fontSize: "13px", fontFamily: "var(--font-sans)",
    color: "#0d0d0d", border: "1px solid #e5e2dd", borderRadius: "3px", outline: "none",
    backgroundColor: "#fff", transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box" as const,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "11px", fontWeight: "700", color: "#5c5a57", fontFamily: "var(--font-sans)",
    letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "block", marginBottom: "6px",
  };
  const focusStyle = { borderColor: "#8b1a2a", boxShadow: "0 0 0 3px rgba(139,26,42,0.08)" };
  const blurStyle = { borderColor: "#e5e2dd", boxShadow: "none" };

  if (status === "success") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "48px 24px", textAlign: "center" as const, animation: "slideUp 0.4s cubic-bezier(0.22,1,0.36,1)" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(22,163,74,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(22,163,74,0.3)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <div>
          <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "0 0 6px" }}>Pesan Terkirim!</h4>
          <p style={{ fontSize: "13px", color: "#5c5a57", fontFamily: "var(--font-sans)", margin: 0, lineHeight: "1.65" }}>{msg}</p>
        </div>
        <button onClick={() => setStatus("idle")}
          style={{ fontSize: "12px", fontWeight: "700", color: "#8b1a2a", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}>
          Kirim pesan lain
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div>
          <label style={labelStyle}>Nama Lengkap <span style={{ color: "#8b1a2a" }}>*</span></label>
          <input type="text" placeholder="Nama Anda" value={form.nama} onChange={set("nama")} style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)} onBlur={(e) => Object.assign(e.target.style, blurStyle)} />
        </div>
        <div>
          <label style={labelStyle}>Email <span style={{ color: "#8b1a2a" }}>*</span></label>
          <input type="email" placeholder="email@domain.com" value={form.email} onChange={set("email")} style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)} onBlur={(e) => Object.assign(e.target.style, blurStyle)} />
        </div>
      </div>
      <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div>
          <label style={labelStyle}>Nomor Telepon <span style={{ color: "#8b1a2a" }}>*</span></label>
          <input type="tel" placeholder="+62 8xx xxxx xxxx" value={form.telepon} onChange={set("telepon")} style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)} onBlur={(e) => Object.assign(e.target.style, blurStyle)} />
        </div>
        <div>
          <label style={labelStyle}>Subjek <span style={{ color: "#8b1a2a" }}>*</span></label>
          <input type="text" placeholder="Tuliskan subjek pesan Anda..." value={form.subjek} onChange={set("subjek")} style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)} onBlur={(e) => Object.assign(e.target.style, blurStyle)} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Pesan / Komentar <span style={{ color: "#8b1a2a" }}>*</span></label>
        <textarea placeholder="Tuliskan pesan atau pertanyaan Anda di sini..." value={form.pesan} onChange={set("pesan")} rows={5}
          style={{ ...inputStyle, resize: "vertical" as const, minHeight: "120px" }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)} onBlur={(e) => Object.assign(e.target.style, blurStyle)} />
      </div>
      {status === "error" && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "3px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <span style={{ fontSize: "12px", color: "#dc2626", fontFamily: "var(--font-sans)" }}>{msg}</span>
        </div>
      )}
      <button onClick={handleSubmit} disabled={status === "loading"}
        className="btn-ripple"
        style={{
          display: "flex", alignItems: "center", gap: "8px", padding: "13px 28px",
          backgroundColor: status === "loading" ? "#a82235" : "#8b1a2a",
          color: "#fff", border: "none", borderRadius: "3px",
          fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)",
          letterSpacing: "0.04em", cursor: status === "loading" ? "not-allowed" : "pointer",
          transition: "background 0.2s", alignSelf: "flex-start" as const,
        }}
        onMouseEnter={(e) => { if (status !== "loading") (e.currentTarget as HTMLElement).style.backgroundColor = "#a82235"; }}
        onMouseLeave={(e) => { if (status !== "loading") (e.currentTarget as HTMLElement).style.backgroundColor = "#8b1a2a"; }}>
        {status === "loading"
          ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Mengirim...</>
          : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>Kirim Pesan</>}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TentangPage() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible"); }),
      { threshold: 0.08 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#hubungi-kami") {
      const el = document.getElementById("hubungi-kami");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
    }
  }, []);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 24px 36px", position: "relative", overflow: "hidden", backgroundImage: "url('/banner/Mosaik_Budaya_1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-parallax" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.93) 0%, rgba(10,30,65,0.85) 40%, rgba(15,40,80,0.77) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div className="hero-dots" />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>Beranda</Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#e05070", fontFamily: "var(--font-sans)" }}>Tentang Kami</span>
          </div>
          <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "14px", padding: "6px 14px", border: "1px solid rgba(139,26,42,0.6)", borderRadius: "2px", backgroundColor: "rgba(139,26,42,0.12)" }}>
            <span className="hero-badge-dot" style={{ display: "block", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#e05070" }} />
            <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>Tentang Kami</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: "clamp(1.7rem, 3vw, 2.5rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "0 0 12px", lineHeight: "1.2" }}>
            Tentang Wikimedia Indonesia
          </h1>
          <p className="hero-desc" style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-sans)", lineHeight: "1.7", margin: 0, maxWidth: "560px" }}>
            Organisasi nirlaba mitra lokal Wikimedia Foundation yang berdedikasi menyebarluaskan pengetahuan bebas di Indonesia sejak 2008.
          </p>
        </div>
      </section>

      {/* ── SEJARAH & VIDEO ──────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "52px 24px 0", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="tentang-layout" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px", alignItems: "start" }}>
            <div className="reveal">
              <div className="section-border-shimmer" style={{ paddingBottom: "10px", marginBottom: "24px", borderBottom: "3px solid #0d0d0d" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Sejarah</span>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "4px", marginBottom: 0 }}>Perjalanan Wikimedia Indonesia</h2>
              </div>
              <div style={{ marginBottom: "32px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <p style={{ fontSize: "14px", color: "#3a3a3a", lineHeight: "1.9", fontFamily: "var(--font-sans)", margin: 0 }}>
                  Wikimedia Indonesia dicetuskan untuk didirikan pada pertemuan (kopi darat) sukarelawan penulis Wikipedia bahasa Indonesia pada 22 November 2006 yang dihadiri oleh tujuh orang pengguna. Setelah melalui kurang lebih empat belas pertemuan, pada 2 Mei 2008 upaya ini dikukuhkan dengan penulisan Anggaran Dasar dan Anggaran Rumah Tangga organisasi. Pada awalnya, bentuk organisasi adalah yayasan. Namun, setelah berkonsultasi, bentuk organisasi yang paling tepat adalah perkumpulan dengan kekuasaan terbesar berada di tangan anggota. Wikimedia Indonesia didirikan oleh 19 orang yang kemudian dikenal sebagai "pendiri". Wikimedia Indonesia mengumpulkan dana dari ke-19 pendiri ini sebesar lima juta rupiah. Organisasi berdiri tanpa dukungan dana dari luar dan murni inisiatif para pendirinya.
                </p>
                <p style={{ fontSize: "14px", color: "#3a3a3a", lineHeight: "1.9", fontFamily: "var(--font-sans)", margin: 0 }}>
                  Pada 5 September 2008, Wikimedia Indonesia resmi berdiri dan disahkan melalui akta notaris. Di akhir tahun 2010, revisi anggaran dasar dari pemerintah Indonesia melalui Menteri Hukum dan Hak Asasi Manusia diadopsi oleh organisasi dan disahkan pada tahun 2011. Jabatan Direktur Eksekutif pertama (yang kemudian diubah melalui AD/ART revisi tahun 2011 menjadi Ketua Umum) adalah Ivan Lanin. Riwayat orang yang menjabat sebagai Ketua Umum dapat dilihat{" "}
                  <a href="https://id.wikimedia.org/wiki/Ketua_Umum" target="_blank" rel="noopener noreferrer" style={{ color: "#1e4d7b", fontWeight: "600", textDecoration: "underline", textUnderlineOffset: "2px" }}>di sini</a>.
                </p>
              </div>
              <div style={{ backgroundColor: "#0d0d0d", borderRadius: "4px", padding: "28px 32px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: "30px 30px", pointerEvents: "none" }} />
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Tujuan Kami</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "10px 0 12px", lineHeight: "1.4", position: "relative", zIndex: 1 }}>
                  Mendorong Pengetahuan Bebas untuk Semua
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-sans)", margin: 0, lineHeight: "1.8", position: "relative", zIndex: 1 }}>
                  Mendorong pertumbuhan, pengembangan & penyebaran pengetahuan dalam bahasa Indonesia dan bahasa lainnya yang dipertuturkan di Indonesia secara bebas dan gratis.
                </p>
              </div>
            </div>

            <div className="reveal" style={{ position: "sticky", top: "88px" }}>
              <div className="section-border-shimmer" style={{ paddingBottom: "10px", marginBottom: "16px", borderBottom: "3px solid #0d0d0d" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Video</span>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "4px", marginBottom: 0 }}>Mengenal Wikimedia Indonesia</h3>
              </div>
              <div style={{ borderRadius: "6px", overflow: "hidden", position: "relative", aspectRatio: "16/9", backgroundColor: "#0d0d0d", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
                <iframe
                  src="https://www.youtube.com/embed/NSULY1eMMn8"
                  title="Wikimedia Indonesia"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALERI ───────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "52px 24px 56px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="section-border-shimmer reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: "12px", marginBottom: "24px", borderBottom: "3px solid #0d0d0d" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Galeri</span>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "4px", marginBottom: 0 }}>Kegiatan Wikimedia Indonesia</h2>
            </div>
            <span style={{ fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>Klik foto · Gunakan ← → atau ESC</span>
          </div>
          <MasonryGallery />
        </div>
      </section>

      {/* ── KONTAK ───────────────────────────────────────────────────────── */}
      <section id="hubungi-kami" style={{ backgroundColor: "#0d0d0d", padding: "72px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(30,77,123,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="reveal" style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center" as const, marginBottom: "36px" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Hubungi Kami</span>
            <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "8px 0 10px" }}>
              Ada Pertanyaan? Kami Siap Membantu
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-sans)", margin: 0, lineHeight: "1.7" }}>
              Isi formulir di bawah ini dan kami akan menghubungi Anda segera.
            </p>
          </div>
          <div style={{ backgroundColor: "#fff", borderRadius: "6px", padding: "36px 40px", boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}>
            <ContactForm />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin    { from { transform: rotate(0deg); }  to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; }               to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .gallery-cell { transition: opacity 0.2s ease; }
        .gallery-cell:hover { opacity: 0.9; }
        .gallery-strip-cell { transition: opacity 0.2s ease; }
        .gallery-strip-cell:hover { opacity: 0.8; }

        @media (max-width: 1000px) {
          .tentang-layout { grid-template-columns: 1fr !important; }
          .tentang-layout > div:last-child { position: static !important; }
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}