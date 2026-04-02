"use client";

import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const programs = [
  {
    id: "pendidikan",
    label: "Pendidikan",
    url: "https://pendidikan.wikimedia.or.id",
    banner: "/program/20240915_Wikilatih_Wikidata_Komunitas_Wikimedia_Palembang.jpg",
    color: "#1e4d7b",
    colorLight: "rgba(30,77,123,0.08)",
    colorBorder: "rgba(30,77,123,0.2)",
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/1/13/Logo_Pendidikan_WMID_Lejas.png" width="32" height="32" />,
    description: "Menyediakan materi dan pelatihan terbuka dan edukatif tentang penggunaan serta kontribusi ke proyek Wikimedia serta berpartisipasi aktif dalam gerakan pendidikan terbuka di Indonesia.",
    points: [
      "Mengembangkan dan menyebarkan panduan, modul, dan sumber belajar tentang cara menggunakan serta berkontribusi ke proyek Wikimedia.",
      "Kemitraan dengan sekolah & universitas untuk inklusi kurikulum berbasis pengetahuan terbuka.",
      "Menyelenggarakan WikiLatih untuk meningkatkan keterampilan menulis, berpikir kritis, serta penggunaan teknologi digital secara produktif dan etis.",
    ],
  },
  {
    id: "data-teknologi",
    label: "Data dan Teknologi",
    url: "https://datatek.wikimedia.or.id",
    banner: "/program/251124_WikiLatihWikidataPerpusdikdasmen_1.jpg",
    color: "#2a6399",
    colorLight: "rgba(42,99,153,0.08)",
    colorBorder: "rgba(42,99,153,0.2)",
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Ikon_Data_dan_Teknologi_WMID_-_Warna.svg" width="32" height="32" />,
    description: "Pengembangan dan pemanfaatan teknologi untuk mendukung penyebaran informasi dan pengelolaan data serta aktif dalam gerakan data terbuka di Indonesia.",
    points: [
      "Memperkenalkan proyek Wikidata, Wikifunction, MediaWiki dan Wikibase kepada publik.",
      "Mendorong pemanfaatan dan integrasi Wikidata dalam berbagai inisiatif lokal seperti proyek pendidikan, kebudayaan dan kampanye konten.",
      "Dukungan untuk pengembangan tool lokal agar kontribusi lebih mudah dan inklusif.",
      "Menjaga transparansi dan keamanan data komunitas serta platform.",
    ],
  },
  {
    id: "kebudayaan",
    label: "Kebudayaan",
    url: "https://kebudayaan.wikimedia.or.id",
    banner: "/program/GLAM_Indonesia_volunteers'_meeting_in_Jakarta;_March_2020_(25).jpg",
    color: "#784e14",
    colorLight: "rgba(120,78,20,0.08)",
    colorBorder: "rgba(120,78,20,0.2)",
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Ikon_Kebudayaan_WMID.svg" width="32" height="32" />,
    description: "Dokumentasi dan pelestarian budaya Indonesia melalui platform terbuka serta aktif dalam gerakan budaya terbuka di Indonesia.",
    points: [
      "Kolaborasi dengan lembaga budaya seperti GLAM (Galeri, Perpustakaan, Arsip dan Museum) untuk digitalisasi koleksi.",
      "Program penulisan konten budaya daerah.",
      "Kampanye kesadaran budaya lewat Wikipedia, Wiktionary, Wikimedia Commons, Wikisource dan Wikidata.",
    ],
  },
  {
    id: "komunitas",
    label: "Komunitas",
    url: "https://komunitas.wikimedia.or.id",
    banner: "/program/Foto_Bersama_WikiNusantara_2023.jpg",
    color: "#502878",
    colorLight: "rgba(80,40,120,0.08)",
    colorBorder: "rgba(80,40,120,0.2)",
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Ikon_Komunitas_Wikimedia_Indonesia.svg" width="32" height="32" />,
    description: "Mendorong partisipasi sukarelawan dan mendukung komunitas yang aktif menyunting, berbagi, dan menjaga kualitas informasi.",
    points: [
      "Program mentorship bagi anggota komunitas.",
      "Penguatan komunitas daerah melalui hibah dan pertemuan.",
      "Forum daring dan luring untuk diskusi terbuka.",
    ],
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function PlaceholderImage({ color, label }: { color: string; label: string }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px",
    }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" opacity={0.3}>
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span style={{ fontSize: "11px", color, opacity: 0.4, fontFamily: "var(--font-sans)", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
        Foto {label}
      </span>
    </div>
  );
}

function ProgramImage({ banner, color, label }: { banner: string | null; color: string; label: string }) {
  if (banner) {
    return (
      <img
        src={banner}
        alt={label}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    );
  }
  return <PlaceholderImage color={color} label={label} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgramPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        padding: "48px 24px 40px", position: "relative", overflow: "hidden",
        backgroundImage: "url('/banner/Mosaik_Budaya_1.png')",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.92) 0%, rgba(10,30,65,0.84) 40%, rgba(15,40,80,0.76) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20,100,50,0.20) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#3b8ed4", fontFamily: "var(--font-sans)" }}>Program</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "24px" }}>
            <div>
              <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 8px", lineHeight: "1.2" }}>
                Program Kami
              </h1>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: 0 }}>
                Wikimedia Indonesia
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px" }}>
              {programs.map((p) => (
                <a key={p.id} href={`#${p.id}`}
                  style={{ padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.8)", fontSize: "12px", fontWeight: "600", fontFamily: "var(--font-sans)", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = p.color; e.currentTarget.style.borderColor = p.color; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                >
                  {p.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAM LIST ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "48px 24px 72px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          {programs.map((program, idx) => (
            <div
              key={program.id}
              id={program.id}
              className="program-card"
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e2dd",
                borderRadius: "4px",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: idx % 2 === 0 ? "1fr 400px" : "400px 1fr",
              }}
            >
              {idx % 2 !== 0 && (
                <div className="program-img" style={{ minHeight: "340px", position: "relative", borderRight: "1px solid #e5e2dd", overflow: "hidden" }}>
                  <ProgramImage banner={program.banner} color={program.color} label={program.label} />
                </div>
              )}

              <div style={{ padding: "44px 48px", display: "flex", flexDirection: "column", gap: "18px", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "4px", backgroundColor: program.colorLight, border: `1px solid ${program.colorBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: program.color }}>
                    {program.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: program.color, fontFamily: "var(--font-sans)", display: "block", marginBottom: "4px" }}>
                      Program
                    </span>
                    <h2 style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: 0, lineHeight: "1.25" }}>
                      {program.label}
                    </h2>
                  </div>
                </div>

                <p style={{ fontSize: "14px", color: "#5c5a57", lineHeight: "1.75", fontFamily: "var(--font-sans)", margin: 0 }}>
                  {program.description}
                </p>

                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {program.points.map((point, i) => (
                    <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: program.color, flexShrink: 0, marginTop: "7px" }} />
                      <span style={{ fontSize: "13px", color: "#3a3a3a", lineHeight: "1.65", fontFamily: "var(--font-sans)" }}>{point}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ paddingTop: "4px", borderTop: "1px solid #f0eeec" }}>
                  <a href={program.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", border: `1px solid ${program.colorBorder}`, backgroundColor: program.colorLight, color: program.color, textDecoration: "none", borderRadius: "3px", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = program.color; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = program.color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = program.colorLight; e.currentTarget.style.color = program.color; e.currentTarget.style.borderColor = program.colorBorder; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    {program.url.replace("https://", "")}
                  </a>
                </div>
              </div>

              {idx % 2 === 0 && (
                <div className="program-img" style={{ minHeight: "340px", position: "relative", borderLeft: "1px solid #e5e2dd", overflow: "hidden" }}>
                  <ProgramImage banner={program.banner} color={program.color} label={program.label} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#0d0d0d", padding: "64px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(12,87,168,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Bergabung</span>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "10px 0 14px", lineHeight: "1.2" }}>
            Jadilah Bagian dari Gerakan Pengetahuan Terbuka
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)", lineHeight: "1.7", marginBottom: "28px" }}>
            Bergabunglah dengan ribuan sukarelawan dan mitra yang bersama-sama membangun ekosistem pengetahuan terbuka untuk Indonesia.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" as const }}>
            <Link href="/menjadi-anggota"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", backgroundColor: "#0C57A8", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0a4a8f")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0C57A8")}>
              Menjadi Anggota
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="https://id.wikimedia.org/wiki/Halaman_Utama" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", backgroundColor: "transparent", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.backgroundColor = "transparent"; }}>
              Wikimedia Indonesia
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .program-card { grid-template-columns: 1fr !important; }
          .program-img { min-height: 220px !important; border-left: none !important; border-right: none !important; border-bottom: 1px solid #e5e2dd !important; }
        }
        @media (max-width: 640px) {
          .program-card > div[style*="padding: 44px"] { padding: 28px 24px !important; }
        }
      `}</style>
    </>
  );
}