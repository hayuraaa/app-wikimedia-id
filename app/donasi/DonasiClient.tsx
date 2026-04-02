"use client";

import Link from "next/link";

const DONASI_URL = "https://pay.doku.com/p-link/p/cf45ju2tPk";

// ─── Ilustrasi SVG ────────────────────────────────────────────────────────────

function DonasiIlustrasi() {
  return (
    <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", maxHeight: "300px" }}>
      {/* Background circle */}
      <circle cx="210" cy="160" r="130" fill="rgba(12,87,168,0.06)" />
      <circle cx="210" cy="160" r="95" fill="rgba(12,87,168,0.05)" />

      {/* Globe */}
      <circle cx="210" cy="152" r="68" fill="#fff" stroke="#e5e2dd" strokeWidth="1.5" />
      <ellipse cx="210" cy="152" rx="30" ry="68" fill="none" stroke="#e5e2dd" strokeWidth="1" />
      <ellipse cx="210" cy="152" rx="68" ry="22" fill="none" stroke="#e5e2dd" strokeWidth="1" />
      <line x1="142" y1="152" x2="278" y2="152" stroke="#e5e2dd" strokeWidth="1" />
      {/* Continents simplified */}
      <path d="M175 128 Q183 120 194 124 Q202 118 212 122 Q220 116 228 120 Q235 126 230 134 Q226 142 218 140 Q210 148 200 144 Q190 148 182 142 Q172 136 175 128Z" fill="#d4e8c2" opacity="0.8" />
      <path d="M220 155 Q228 150 236 154 Q242 160 238 168 Q232 174 224 170 Q216 164 220 155Z" fill="#d4e8c2" opacity="0.8" />
      <path d="M168 158 Q174 154 180 158 Q184 164 180 170 Q174 174 168 168 Q164 162 168 158Z" fill="#d4e8c2" opacity="0.8" />

      {/* Heart */}
      <path d="M210 108 C210 108 196 94 184 94 C172 94 164 102 164 112 C164 130 210 152 210 152 C210 152 256 130 256 112 C256 102 248 94 236 94 C224 94 210 108 210 108Z" fill="#0C57A8" opacity="0.15" />
      <path d="M210 112 C210 112 200 102 192 102 C184 102 178 107 178 115 C178 128 210 145 210 145 C210 145 242 128 242 115 C242 107 236 102 228 102 C220 102 210 112 210 112Z" fill="#0C57A8" opacity="0.9" />

      {/* Floating coins */}
      <circle cx="130" cy="110" r="16" fill="#f8f7f5" stroke="#e5e2dd" strokeWidth="1.5" />
      <text x="130" y="115" textAnchor="middle" fontSize="13" fill="#0C57A8" fontWeight="700">Rp</text>

      <circle cx="290" cy="100" r="14" fill="#f8f7f5" stroke="#e5e2dd" strokeWidth="1.5" />
      <text x="290" y="105" textAnchor="middle" fontSize="11" fill="#0C57A8" fontWeight="700">Rp</text>

      <circle cx="308" cy="188" r="11" fill="#f8f7f5" stroke="#e5e2dd" strokeWidth="1.5" />
      <text x="308" y="193" textAnchor="middle" fontSize="9" fill="#0C57A8" fontWeight="700">Rp</text>

      <circle cx="112" cy="190" r="12" fill="#f8f7f5" stroke="#e5e2dd" strokeWidth="1.5" />
      <text x="112" y="195" textAnchor="middle" fontSize="9" fill="#0C57A8" fontWeight="700">Rp</text>

      {/* Dotted lines from coins to globe */}
      <line x1="144" y1="118" x2="168" y2="138" stroke="#0C57A8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      <line x1="276" y1="106" x2="256" y2="130" stroke="#0C57A8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      <line x1="296" y1="182" x2="272" y2="170" stroke="#0C57A8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      <line x1="122" y1="185" x2="150" y2="172" stroke="#0C57A8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

      {/* Stars / sparkles */}
      <path d="M336 140 L338 134 L340 140 L346 142 L340 144 L338 150 L336 144 L330 142Z" fill="#0C57A8" opacity="0.3" />
      <path d="M80 148 L81.5 143 L83 148 L88 149.5 L83 151 L81.5 156 L80 151 L75 149.5Z" fill="#0C57A8" opacity="0.25" />
      <path d="M268 68 L269 64 L270 68 L274 69 L270 70 L269 74 L268 70 L264 69Z" fill="#0C57A8" opacity="0.2" />

      {/* People icons below globe */}
      {[170, 200, 230, 260].map((x, i) => (
        <g key={i} opacity={0.6 + i * 0.1}>
          <circle cx={x} cy={228} r="7" fill="#f8f7f5" stroke="#e5e2dd" strokeWidth="1" />
          <path d={`M${x - 10} 248 Q${x} 238 ${x + 10} 248`} fill="#f8f7f5" stroke="#e5e2dd" strokeWidth="1" />
        </g>
      ))}
      <line x1="160" y1="258" x2="275" y2="258" stroke="#e5e2dd" strokeWidth="1" />

      {/* Tagline at bottom */}
      <text x="210" y="280" textAnchor="middle" fontSize="10" fill="#6b6966" fontFamily="sans-serif" letterSpacing="1">
        Bersama membebaskan pengetahuan
      </text>
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DonasiPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        padding: "40px 24px 36px", position: "relative", overflow: "hidden",
        backgroundImage: "url('/banner/Mosaik_Budaya_1.png')",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.92) 0%, rgba(10,30,65,0.84) 40%, rgba(15,40,80,0.76) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(12,87,168,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "8%", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(30,77,123,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#3b8ed4", fontFamily: "var(--font-sans)" }}>Donasi</span>
          </div>

          <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Donasi</span>
          <h1 style={{ fontSize: "clamp(1.7rem, 3vw, 2.5rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 10px", lineHeight: "1.2" }}>
            Dukung Pengetahuan Bebas
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)", lineHeight: "1.7", margin: 0, maxWidth: "560px" }}>
            Setiap donasi Anda membantu kami menyebarluaskan pengetahuan terbuka untuk seluruh masyarakat Indonesia.
          </p>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "36px 24px 60px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="donasi-layout" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start" }}>

            {/* ── Main ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Tentang */}
              <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderLeft: "4px solid #0C57A8", borderRadius: "4px", padding: "32px 36px" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0C57A8", fontFamily: "var(--font-sans)" }}>◆ Tentang Wikimedia Indonesia</span>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: "10px 0 16px", lineHeight: "1.3" }}>
                  Organisasi Nirlaba untuk Pengetahuan Bebas
                </h2>
                <p style={{ fontSize: "14px", color: "#3a3a3a", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: "0 0 14px" }}>
                  Wikimedia Indonesia adalah organisasi perkumpulan nirlaba yang bertujuan untuk membina pengetahuan pada umumnya, dan sumber terbuka pada khususnya, berbasis keanggotaan atas dasar kesukarelaan, kekeluargaan, dan kejujuran.
                </p>
                <p style={{ fontSize: "14px", color: "#3a3a3a", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: 0 }}>
                  Proyek kami ditujukan untuk menyebarluaskan materi-materi pengetahuan bersumber terbuka dalam bahasa Indonesia dan bahasa-bahasa lain yang dipertuturkan di Indonesia melalui partisipasi masyarakat.
                </p>
              </div>

              {/* Cara Donasi */}
              <div>
                <div style={{ paddingBottom: "10px", marginBottom: "16px", borderBottom: "3px solid #0d0d0d" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0C57A8", fontFamily: "var(--font-sans)" }}>◆ Cara Berdonasi</span>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "4px", marginBottom: 0 }}>
                    Anda dapat memberikan donasi melalui tautan di bawah ini
                  </h2>
                </div>

                {/* CTA Card */}
                <div style={{ backgroundColor: "#0d0d0d", borderRadius: "4px", padding: "32px 36px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" as const }}>
                  <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(12,87,168,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: "-30px", left: "30%", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(30,77,123,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b8ed4" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#3b8ed4", fontFamily: "var(--font-sans)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Donasi Sekarang</span>
                    </div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "0 0 8px", lineHeight: "1.3" }}>
                      Dukung kami membebaskan pengetahuan
                    </h3>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: 0, lineHeight: "1.65" }}>
                      Donasi Anda akan digunakan untuk mendukung program-program Wikimedia Indonesia.
                    </p>
                  </div>
                  <a href={DONASI_URL} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 28px", backgroundColor: "#0C57A8", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "14px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", transition: "background 0.2s", position: "relative", zIndex: 1, flexShrink: 0, whiteSpace: "nowrap" as const }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#0a4a8f")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#0C57A8")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    Donasi Sekarang
                  </a>
                </div>
              </div>


              {/* Peringatan */}
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "18px 20px", backgroundColor: "#fff", border: "1px solid #fbbf24", borderLeft: "4px solid #f59e0b", borderRadius: "4px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(245,158,11,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#92400e", fontFamily: "var(--font-sans)", letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "block", marginBottom: "5px" }}>⚠ Peringatan</span>
                  <p style={{ fontSize: "13px", color: "#5c5a57", fontFamily: "var(--font-sans)", margin: 0, lineHeight: "1.7" }}>
                    Jika Anda menerima pesan mencurigakan yang mengatasnamakan Wikimedia Indonesia, abaikan dan segera laporkan melalui email{" "}
                    <a href="mailto:info@wikimedia.or.id" style={{ color: "#0C57A8", fontWeight: "600", textDecoration: "underline", textUnderlineOffset: "2px" }}>info@wikimedia.or.id</a>.
                  </p>
                </div>
              </div>

            </div>

            {/* ── Sidebar ── */}
            <div className="donasi-sidebar" style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Ilustrasi */}
              <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", padding: "24px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DonasiIlustrasi />
              </div>

              {/* Tombol donasi */}
              <a href={DONASI_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px 24px", backgroundColor: "#0C57A8", color: "#fff", textDecoration: "none", borderRadius: "4px", fontSize: "15px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", transition: "background 0.2s", textAlign: "center" as const }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#0a4a8f")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#0C57A8")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                Donasi Sekarang
              </a>

              {/* Contact */}
              <Link href="/tentang#hubungi-kami" style={{ padding: "16px 18px", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", textDecoration: "none", display: "block", transition: "border-color 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0C57A8"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e2dd"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-sans)" }}>Ada pertanyaan?</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0C57A8" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <p style={{ fontSize: "12px", color: "#5c5a57", fontFamily: "var(--font-sans)", margin: 0, lineHeight: "1.6" }}>
                    Kunjungi halaman <span style={{ color: "#0C57A8", fontWeight: "600" }}>Kontak Kami</span> dan isi formulir.
                </p>
                </Link>

            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 960px) {
          .donasi-layout { grid-template-columns: 1fr !important; }
          .donasi-sidebar { position: static !important; }
        }
        @media (max-width: 600px) {
          .dampak-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}