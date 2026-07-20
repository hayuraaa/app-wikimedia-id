"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Contact Form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({ nama: "", email: "", subjek: "", pesan: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.nama || !form.email || !form.subjek || !form.pesan) {
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
          email: form.email,
          subject: form.subjek,
          message: form.pesan,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        setMsg(json.message || "Pesan Anda berhasil terkirim!");
        setForm({ nama: "", email: "", subjek: "", pesan: "" });
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
    width: "100%", padding: "11px 14px", fontSize: "13px", fontFamily: "var(--font-montserrat)",
    color: "#0d0d0d", border: "1px solid #e5e2dd", borderRadius: "3px", outline: "none",
    backgroundColor: "#fff", transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box" as const,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "11px", fontWeight: "700", color: "#5c5a57", fontFamily: "var(--font-montserrat)",
    letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "block", marginBottom: "6px",
  };
  const focusStyle = { borderColor: "#0C57A8", boxShadow: "0 0 0 3px rgba(12,87,168,0.08)" };
  const blurStyle = { borderColor: "#e5e2dd", boxShadow: "none" };

  if (status === "success") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "48px 24px", textAlign: "center" as const, animation: "slideUp 0.4s cubic-bezier(0.22,1,0.36,1)" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(22,163,74,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(22,163,74,0.3)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <div>
          <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-montserrat)", margin: "0 0 6px" }}>Pesan Terkirim!</h4>
          <p style={{ fontSize: "13px", color: "#5c5a57", fontFamily: "var(--font-montserrat)", margin: 0, lineHeight: "1.65" }}>{msg}</p>
        </div>
        <button onClick={() => setStatus("idle")}
          style={{ fontSize: "12px", fontWeight: "700", color: "#0C57A8", fontFamily: "var(--font-montserrat)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}>
          Kirim pesan lain
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div>
          <label style={labelStyle}>Nama Lengkap <span style={{ color: "#c0392b" }}>*</span></label>
          <input type="text" placeholder="Nama Anda" value={form.nama} onChange={set("nama")} style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)} onBlur={(e) => Object.assign(e.target.style, blurStyle)} />
        </div>
        <div>
          <label style={labelStyle}>Email <span style={{ color: "#c0392b" }}>*</span></label>
          <input type="email" placeholder="email@domain.com" value={form.email} onChange={set("email")} style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)} onBlur={(e) => Object.assign(e.target.style, blurStyle)} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Subjek <span style={{ color: "#c0392b" }}>*</span></label>
        <input type="text" placeholder="Tuliskan subjek pesan Anda..." value={form.subjek} onChange={set("subjek")} style={inputStyle}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)} onBlur={(e) => Object.assign(e.target.style, blurStyle)} />
      </div>
      <div>
        <label style={labelStyle}>Pesan / Komentar <span style={{ color: "#c0392b" }}>*</span></label>
        <textarea placeholder="Tuliskan pesan atau pertanyaan Anda di sini..." value={form.pesan} onChange={set("pesan")} rows={5}
          style={{ ...inputStyle, resize: "vertical" as const, minHeight: "120px" }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)} onBlur={(e) => Object.assign(e.target.style, blurStyle)} />
      </div>
      {status === "error" && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "3px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <span style={{ fontSize: "12px", color: "#dc2626", fontFamily: "var(--font-montserrat)" }}>{msg}</span>
        </div>
      )}
      <button onClick={handleSubmit} disabled={status === "loading"}
        className="btn-ripple"
        style={{
          display: "flex", alignItems: "center", gap: "8px", padding: "13px 28px",
          backgroundColor: status === "loading" ? "#0a4a8f" : "#0C57A8",
          color: "#fff", border: "none", borderRadius: "3px",
          fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-montserrat)",
          letterSpacing: "0.04em", cursor: status === "loading" ? "not-allowed" : "pointer",
          transition: "background 0.2s", alignSelf: "flex-start" as const,
        }}
        onMouseEnter={(e) => { if (status !== "loading") (e.currentTarget as HTMLElement).style.backgroundColor = "#0a4a8f"; }}
        onMouseLeave={(e) => { if (status !== "loading") (e.currentTarget as HTMLElement).style.backgroundColor = "#0C57A8"; }}>
        {status === "loading"
          ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Mengirim...</>
          : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>Kirim Pesan</>}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KontakPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ padding: "40px 24px 36px", position: "relative", overflow: "hidden", backgroundImage: "url('/banner/Mosaik_Budaya_1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-parallax" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.93) 0%, rgba(10,30,65,0.85) 40%, rgba(15,40,80,0.77) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(12,87,168,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-montserrat)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>Beranda</Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-montserrat)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#3b8ed4", fontFamily: "var(--font-montserrat)" }}>Kontak</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: "clamp(1.7rem, 3vw, 2.5rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-montserrat)", margin: "0 0 12px", lineHeight: "1.2" }}>
            Hubungi Kami
          </h1>
          <p className="hero-desc" style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-montserrat)", lineHeight: "1.7", margin: 0, maxWidth: "560px" }}>
            Ada pertanyaan, saran, atau ingin berkolaborasi? Kami siap mendengar Anda.
          </p>
        </div>
      </section>

      {/* ── KONTAK ── */}
      <section id="hubungi-kami" style={{ background: "linear-gradient(160deg, #f0f5fb 0%, #e8f0fa 50%, #f5f7ff 100%)", padding: "72px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", right: "-80px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(12,87,168,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,142,212,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center" as const, marginBottom: "36px" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0C57A8", fontFamily: "var(--font-montserrat)" }}>◆ Hubungi Kami</span>
            <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-montserrat)", margin: "8px 0 10px" }}>
              Ada Pertanyaan? Kami Siap Membantu
            </h2>
            <p style={{ fontSize: "14px", color: "#5c5a57", fontFamily: "var(--font-montserrat)", margin: 0, lineHeight: "1.7" }}>
              Isi formulir di bawah ini dan kami akan menghubungi Anda segera.
            </p>
          </div>
          <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "36px 40px", boxShadow: "0 4px 24px rgba(12,87,168,0.10), 0 1px 4px rgba(0,0,0,0.06)", border: "1px solid rgba(12,87,168,0.08)" }}>
            <ContactForm />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin    { from { transform: rotate(0deg); }  to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
