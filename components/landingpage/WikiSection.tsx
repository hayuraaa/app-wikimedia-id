"use client";

import { useState } from "react";
import Image from "next/image";
import type { WikiProject } from "@/app/page";

export default function WikiSection({ wikiProjects }: { wikiProjects: WikiProject[] }) {
  const [activeWikiTab, setActiveWikiTab] = useState<number>(0);

  return (
    <section className="section-dark" style={{ backgroundColor: "#1a3a5c", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(30,77,123,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="reveal" style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="section-border-shimmer reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", paddingBottom: "16px", borderBottom: "3px solid rgba(255,255,255,0.85)" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Ekosistem</span>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: "700", color: "#ffffff", fontFamily: "var(--font-serif)", marginTop: "4px" }}>Proyek Wikimedia</h2>
          </div>
          <a href="https://id.wikimedia.org/wiki/Halaman_Utama" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.65)", textDecoration: "none", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e05070")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}>
            Selengkapnya →
          </a>
        </div>

        {wikiProjects.length === 0 ? (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "36px", width: "120px", borderRadius: "4px" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", borderBottom: "2px solid rgba(255,255,255,0.12)", paddingBottom: "0", marginBottom: "0" }}>
              {wikiProjects.map((p, idx) => {
                const isActive = activeWikiTab === idx;
                return (
                  <button key={p.id} className="wiki-tab-btn" onClick={() => setActiveWikiTab(idx)}
                    style={{
                      padding: "8px 16px", border: "none",
                      borderBottom: isActive ? "2px solid #e05070" : "2px solid transparent",
                      marginBottom: "-2px",
                      background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                      cursor: "pointer",
                      color: isActive ? "#ffffff" : "rgba(255,255,255,0.66)",
                      borderRadius: "4px 4px 0 0",
                    }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}>
                    <span style={{ fontSize: "14px", fontWeight: isActive ? "700" : "500", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>
                      {p.nama_proyek}
                    </span>
                  </button>
                );
              })}
            </div>

            {wikiProjects[activeWikiTab] && (() => {
              const active = wikiProjects[activeWikiTab];
              return (
                <div style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderTop: "none", borderRadius: "0 0 4px 4px", overflow: "hidden", backdropFilter: "blur(8px)" }}>
                  <div style={{ padding: "28px 32px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "flex-start", gap: "20px" }}>
                    <Image src={active.logo_url} alt={active.nama_proyek} width={48} height={48} style={{ objectFit: "contain", flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#ffffff", fontFamily: "var(--font-serif)", margin: "0 0 6px" }}>{active.nama_proyek}</h3>
                      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", fontFamily: "var(--font-sans)", margin: 0 }}>{active.deskripsi}</p>
                    </div>
                  </div>
                  <div style={{ padding: "20px 32px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {active.subprojects.map((sp) => (
                        <a key={sp.id} href={sp.url} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "2px", fontSize: "12px", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-sans)", textDecoration: "none", fontWeight: "500", transition: "all 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}>
                          {sp.nama_bahasa}
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
}