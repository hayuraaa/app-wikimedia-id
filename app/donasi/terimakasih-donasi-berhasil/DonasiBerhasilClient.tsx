"use client";

import Link from "next/link";

function SuccessIlustrasi() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", maxHeight: "200px" }}>
      <circle cx="160" cy="120" r="90" fill="rgba(22,163,74,0.06)" />
      <circle cx="160" cy="120" r="65" fill="rgba(22,163,74,0.05)" />

      <circle cx="160" cy="118" r="48" fill="#fff" stroke="#e5e2dd" strokeWidth="1.5" />
      <circle cx="160" cy="118" r="36" fill="rgba(22,163,74,0.08)" stroke="rgba(22,163,74,0.25)" strokeWidth="2" />
      <path d="M145 118 L155 128 L178 105" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

      <path d="M160 78 C160 78 148 66 138 66 C128 66 120 74 120 84 C120 100 160 118 160 118 C160 118 200 100 200 84 C200 74 192 66 182 66 C172 66 160 78 160 78Z" fill="#0C57A8" opacity="0.12" />

      <circle cx="88" cy="96" r="10" fill="#f8f7f5" stroke="#e5e2dd" strokeWidth="1.2" />
      <text x="88" y="100" textAnchor="middle" fontSize="8" fill="#0C57A8" fontWeight="700">Rp</text>
      <circle cx="232" cy="88" r="9" fill="#f8f7f5" stroke="#e5e2dd" strokeWidth="1.2" />
      <text x="232" y="92" textAnchor="middle" fontSize="7" fill="#0C57A8" fontWeight="700">Rp</text>

      <path d="M248 130 L250 124 L252 130 L258 132 L252 134 L250 140 L248 134 L242 132Z" fill="#16a34a" opacity="0.35" />
      <path d="M68 128 L69.5 123 L71 128 L76 129.5 L71 131 L69.5 136 L68 131 L63 129.5Z" fill="#0C57A8" opacity="0.25" />

      <text x="160" y="198" textAnchor="middle" fontSize="10" fill="#6b6966" fontFamily="sans-serif" letterSpacing="0.8">
        Terima kasih atas kebaikan Anda
      </text>
    </svg>
  );
}

export default function DonasiBerhasilClient() {
  return (
    <>
      <section style={{ backgroundColor: "#f8f7f5", padding: "48px 24px 72px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ height: "3px", background: "linear-gradient(90deg, #16a34a, #0C57A8)" }} />

            <div style={{ padding: "40px 36px 32px", textAlign: "center" as const }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(22,163,74,0.1)", border: "2px solid rgba(22,163,74,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>

              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#16a34a", fontFamily: "var(--font-sans)" }}>
                ◆ Pembayaran Berhasil
              </span>
              <h2 style={{ fontSize: "1.35rem", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "10px 0 14px", lineHeight: "1.3" }}>
                Donasi Anda Telah Diterima
              </h2>
              <p style={{ fontSize: "14px", color: "#3a3a3a", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: "0 0 28px" }}>
                Terima kasih atas kepercayaan dan dukungan Anda kepada Wikimedia Indonesia. Kontribusi Anda membantu kami menjalankan program-program pengetahuan terbuka di seluruh Indonesia.
              </p>

              <div style={{ backgroundColor: "#f8f7f5", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "24px 20px", marginBottom: "28px" }}>
                <SuccessIlustrasi />
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const, justifyContent: "center" }}>
                <Link href="/"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 24px", backgroundColor: "#0C57A8", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", transition: "background 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0a4a8f")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0C57A8")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Kembali ke Beranda
                </Link>
                <Link href="/program"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 24px", backgroundColor: "#f0eeec", color: "#3a3a3a", textDecoration: "none", borderRadius: "3px", fontSize: "13px", fontWeight: "600", fontFamily: "var(--font-sans)", transition: "background 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e5e2dd")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f0eeec")}>
                  Lihat Program Kami
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" as const }}>
            <p style={{ fontSize: "13px", color: "#6b6966", fontFamily: "var(--font-sans)", margin: "0 0 6px", lineHeight: "1.6" }}>
              Ada pertanyaan terkait donasi Anda?
            </p>
            <Link href="/tentang#hubungi-kami" style={{ fontSize: "13px", color: "#0C57A8", fontWeight: "600", fontFamily: "var(--font-sans)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              Hubungi kami
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
