import Link from "next/link";

type Crumb = { label: string; href?: string };

// Hero halaman /tulis-artikel — sama dengan pola hero halaman lain (mis. /kontak)
export default function WriterHero({ title, description, crumbs }: { title: string; description?: string; crumbs: Crumb[] }) {
  return (
    <section style={{ padding: "40px 24px 36px", position: "relative", overflow: "hidden", backgroundImage: "url('/banner/Mosaik_Budaya_1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(3,78,159,0.93) 0%, rgba(3,78,159,0.85) 40%, rgba(3,78,159,0.77) 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px", flexWrap: "wrap" }}>
          <Link href="/" className="writer-crumb">Beranda</Link>
          {crumbs.map((c) => (
            <span key={c.label} style={{ display: "contents" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-montserrat)" }}>/</span>
              {c.href
                ? <Link href={c.href} className="writer-crumb">{c.label}</Link>
                : <span style={{ fontSize: "11px", color: "#3b8ed4", fontFamily: "var(--font-montserrat)" }}>{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "#fff", fontFamily: "var(--font-montserrat)", margin: "0 0 12px", lineHeight: 1.2 }}>
          {title}
        </h1>
        {description && (
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-source-serif)", lineHeight: 1.7, margin: 0, maxWidth: "620px" }}>
            {description}
          </p>
        )}
      </div>

      <style>{`
        .writer-crumb { font-size: 11px; color: rgba(255,255,255,0.4); text-decoration: none; font-family: var(--font-montserrat); transition: color 0.15s; }
        .writer-crumb:hover { color: rgba(255,255,255,0.85); }
      `}</style>
    </section>
  );
}
