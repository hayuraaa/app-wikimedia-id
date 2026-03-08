"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/app/page";

function formatCategory(cat: string) {
  const connectors = new Set(["dan", "atau", "di", "ke", "dari", "untuk", "yang", "dengan"]);
  return cat
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word, i) =>
      i === 0 || !connectors.has(word.toLowerCase())
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase()
    )
    .join(" ");
}

export default function ArticlesSection({ articles }: { articles: Article[] }) {
  const router = useRouter();

  return (
    <section id="artikel-terbaru" style={{ backgroundColor: "#ffffff", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", border: "1px solid rgba(26,58,92,0.06)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", border: "1px solid rgba(26,58,92,0.05)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "220px", height: "220px", borderRadius: "50%", backgroundColor: "rgba(139,26,42,0.03)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="section-border-shimmer reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", paddingBottom: "16px", borderBottom: "3px solid #0d0d0d" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Terkini</span>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "4px" }}>Artikel & Berita Terbaru</h2>
          </div>
          <Link href="/rubrik" style={{ fontSize: "13px", fontWeight: "600", color: "#1e4d7b", textDecoration: "none", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#8b1a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1e4d7b")}>
            Lihat Semua →
          </Link>
        </div>

        {articles.length === 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", backgroundColor: "#fff" }}>
                <div className="skeleton" style={{ height: "160px" }} />
                <div style={{ padding: "20px" }}>
                  <div className="skeleton" style={{ height: "12px", borderRadius: "2px", marginBottom: "12px", width: "40%" }} />
                  <div className="skeleton" style={{ height: "16px", borderRadius: "2px", marginBottom: "8px" }} />
                  <div className="skeleton" style={{ height: "16px", borderRadius: "2px", width: "70%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {articles.map((a) => (
              <Link key={a.id} href={`/rubrik/${a.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <article className="card-glow" style={{ border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", height: "100%", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: "180px", backgroundColor: "#f0eeec", overflow: "hidden", borderBottom: "1px solid #e5e2dd", position: "relative" }}>
                    {a.featured_image ? (
                      <Image
                        src={a.featured_image}
                        alt={a.title}
                        fill
                        sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1280px) calc(50vw - 36px), 320px"
                        style={{ objectFit: "cover", transition: "transform 0.3s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "40px", opacity: 0.2 }}>📰</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                      {a.categories?.length > 0 ? (
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", flex: 1 }}>
                          {a.categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/rubrik/kategori/${cat}`); }}
                              style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.04em", color: "#1e4d7b", backgroundColor: "rgba(30,77,123,0.08)", padding: "2px 8px", borderRadius: "2px", fontFamily: "var(--font-sans)", cursor: "pointer", transition: "all 0.15s", border: "none" }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(30,77,123,0.18)"; e.currentTarget.style.color = "#0d2a4d"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(30,77,123,0.08)"; e.currentTarget.style.color = "#1e4d7b"; }}
                            >
                              {formatCategory(cat)}
                            </button>
                          ))}
                        </div>
                      ) : <span style={{ flex: 1 }} />}
                      <span style={{ fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)", whiteSpace: "nowrap", flexShrink: 0 }}>
                        {new Date(a.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0d0d0d", lineHeight: "1.5", fontFamily: "var(--font-serif)", margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: "12px", color: "#6b6966", lineHeight: "1.6", fontFamily: "var(--font-sans)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0, flex: 1 }}>
                      {a.excerpt}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid #f0eeec", marginTop: "auto" }}>
                      {a.authors?.[0] ? (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/rubrik/author/${a.authors[0].name.toLowerCase().replace(/\s+/g, "-")}`); }}
                          style={{ fontSize: "11px", color: "#5c5a57", fontFamily: "var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%", cursor: "pointer", transition: "color 0.15s", background: "none", border: "none", padding: 0 }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#1e4d7b")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5a57")}
                        >
                          {a.authors[0].name}
                        </button>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#5c5a57", fontFamily: "var(--font-sans)" }}>—</span>
                      )}
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)", flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        {a.views.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}