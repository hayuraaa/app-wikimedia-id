"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    setSubmitStatus("loading");
    try {
      const res = await fetch("https://dashboard.wikimedia.or.id/api/v1/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitStatus("success");
        setSubmitMessage(json.message ?? "Email berhasil didaftarkan!");
        setEmail("");
      } else {
        setSubmitStatus("error");
        setSubmitMessage(json.message ?? "Gagal mendaftarkan email.");
      }
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Terjadi kesalahan. Coba lagi.");
    }
  };

  return (
    <section style={{ backgroundColor: "#1a3a5c", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "300px", height: "300px", borderRadius: "50%", backgroundColor: "rgba(12,87,168,0.12)" }} />

      <div className="reveal" style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Bergabung</span>
        <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#ffffff", fontFamily: "var(--font-serif)", margin: "12px 0 16px", lineHeight: "1.2" }}>
          Jadilah Bagian dari Gerakan Pengetahuan Bebas
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: "1.8", marginBottom: "40px", fontFamily: "var(--font-sans)" }}>
          Daftarkan email kamu untuk mendapatkan kabar terbaru tentang program, acara, dan perkembangan Wikimedia Indonesia langsung di kotak masukmu.
        </p>

        {submitStatus === "success" ? (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "12px",
            padding: "16px 24px",
            backgroundColor: "rgba(22,163,74,0.12)",
            border: "1px solid rgba(22,163,74,0.3)",
            borderRadius: "4px",
          }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              backgroundColor: "rgba(22,163,74,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p style={{ color: "#4ade80", fontFamily: "var(--font-sans)", fontWeight: "600", fontSize: "15px", margin: 0 }}>
              {submitMessage}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{
              display: "flex", maxWidth: "480px", width: "100%",
              borderRadius: "3px", overflow: "hidden",
              border: submitStatus === "error" ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.2)",
            }}>
              <input
                type="email"
                placeholder="Alamat email kamu"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSubmitStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                style={{
                  flex: 1, padding: "14px 20px", fontSize: "14px",
                  border: "none", outline: "none",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "#ffffff", fontFamily: "var(--font-sans)",
                }}
              />
              <button
                onClick={handleSubscribe}
                disabled={submitStatus === "loading" || !email.trim()}
                style={{
                  padding: "14px 24px",
                  backgroundColor: submitStatus === "loading" ? "#0a4a8f" : "#0C57A8",
                  color: "#fff", border: "none",
                  cursor: submitStatus === "loading" || !email.trim() ? "not-allowed" : "pointer",
                  fontSize: "13px", fontWeight: "700", letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  fontFamily: "var(--font-sans)",
                  display: "flex", alignItems: "center", gap: "7px",
                  transition: "background 0.2s", whiteSpace: "nowrap" as const,
                }}
                onMouseEnter={(e) => { if (submitStatus !== "loading") (e.currentTarget as HTMLElement).style.backgroundColor = "#0a4a8f"; }}
                onMouseLeave={(e) => { if (submitStatus !== "loading") (e.currentTarget as HTMLElement).style.backgroundColor = "#0C57A8"; }}
              >
                {submitStatus === "loading" ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Mendaftarkan...
                  </>
                ) : (
                  <>
                    Bergabung
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            {submitStatus === "error" && (
              <p style={{ fontSize: "12px", color: "#fca5a5", fontFamily: "var(--font-sans)", margin: 0 }}>
                {submitMessage}
              </p>
            )}
          </div>
        )}

        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "16px", fontFamily: "var(--font-sans)" }}>
          Kami tidak akan mengirim spam. Anda dapat berhenti berlangganan kapan saja.
        </p>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes shimmer { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        html { scroll-behavior: smooth; }
      `}</style>
    </section>
  );
}