"use client";


const programs = [
  {
    key: "kebudayaan",
    title: "Program Kebudayaan",
    desc: "Dokumentasi dan pelestarian budaya Indonesia melalui platform terbuka serta aktif dalam gerakan budaya terbuka di Indonesia.",
    accent: "#0C57A8",
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

export default function ProgramSection() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div className="section-border-shimmer reveal" style={{ marginBottom: "48px", paddingBottom: "16px", borderBottom: "3px solid #0d0d0d" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0C57A8", fontFamily: "var(--font-sans)" }}>◆ Inisiatif</span>
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
  );
}