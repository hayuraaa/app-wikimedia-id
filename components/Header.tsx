"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Rubrik", href: "/rubrik" },
  { label: "Program", href: "/program" },
  { label: "Media", href: "/media" },
  { label: "Ruang Pers", href: "/ruang-pers" },
];

const moreItems = [
  { label: "Tentang", href: "/tentang" },
  { label: "Menjadi Anggota", href: "/anggota" },
  { label: "Donasi", href: "/donasi" },
  { label: "Karier", href: "/karier" },
  { label: "FAQ", href: "/faq" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const activeItem =
    navItems.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    )?.label ?? "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        backgroundColor: "#ffffff",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.08)" : "0 1px 0 #e5e7eb",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, #8b1a2a 0%, #1a3a5c 50%, #1e4d7b 100%)" }} />

      {/* Main header */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "68px",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <div style={{ position: "relative", height: "40px", width: "190px" }}>
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Logo_WMID_2018_Mendatar.png"
              alt="Wikimedia Indonesia"
              fill
              style={{ objectFit: "contain", objectPosition: "left center" }}
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: "2px", position: "relative" }}
          className="hidden-mobile"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: "0.03em",
                textTransform: "uppercase" as const,
                textDecoration: "none",
                color: activeItem === item.label ? "#8b1a2a" : "#3a3a3a",
                borderBottom: activeItem === item.label ? "2px solid #8b1a2a" : "2px solid transparent",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => { if (activeItem !== item.label) e.currentTarget.style.color = "#8b1a2a"; }}
              onMouseLeave={(e) => { if (activeItem !== item.label) e.currentTarget.style.color = "#3a3a3a"; }}
            >
              {item.label}
            </Link>
          ))}

          {/* Dropdown Lainnya */}
          <div className="more-dropdown" style={{ position: "relative" }}>
            <button
              className="more-btn"
              style={{
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: "0.03em",
                textTransform: "uppercase" as const,
                background: "transparent",
                border: "none",
                borderBottom: "2px solid transparent",
                color: "#3a3a3a",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-sans)",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              Lainnya
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Outer wrapper — transparan, paddingTop jadi jembatan hover */}
            <div
              className="more-menu"
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                paddingTop: "8px",
                zIndex: 100,
                opacity: 0,
                pointerEvents: "none",
                transform: "translateY(-6px)",
                transition: "all 0.2s ease",
              }}
            >
              {/* Inner wrapper — ini yang punya visual styling */}
              <div
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e2dd",
                  borderRadius: "4px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                  minWidth: "180px",
                  overflow: "hidden",
                }}
              >
                <div style={{ height: "3px", background: "linear-gradient(90deg, #8b1a2a, #1e4d7b)" }} />
                {moreItems.map((item, idx) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      display: "block",
                      padding: "10px 16px",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#3a3a3a",
                      textDecoration: "none",
                      fontFamily: "var(--font-sans)",
                      borderBottom: idx < moreItems.length - 1 ? "1px solid #f5f4f2" : "none",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#faf9f7";
                      e.currentTarget.style.color = "#8b1a2a";
                      e.currentTarget.style.paddingLeft = "20px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#3a3a3a";
                      e.currentTarget.style.paddingLeft = "16px";
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Search + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            aria-label="Cari"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid #e5e7eb",
              background: "transparent",
              color: "#6b7280",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          <button
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{
              display: "none",
              flexDirection: "column",
              gap: "5px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  backgroundColor: "#111",
                  transition: "all 0.3s",
                  transform:
                    i === 0 && menuOpen
                      ? "translateY(7px) rotate(45deg)"
                      : i === 2 && menuOpen
                      ? "translateY(-7px) rotate(-45deg)"
                      : "none",
                  opacity: i === 1 && menuOpen ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        style={{
          maxHeight: menuOpen ? "600px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
          backgroundColor: "#fff",
          borderTop: menuOpen ? "1px solid #f0f0f0" : "none",
        }}
        className="show-mobile-block"
      >
        <nav style={{ padding: "8px 0 16px" }}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
                textDecoration: "none",
                color: activeItem === item.label ? "#8b1a2a" : "#3a3a3a",
                borderLeft: activeItem === item.label ? "3px solid #8b1a2a" : "3px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {item.label}
            </Link>
          ))}
          {/* Divider */}
          <div style={{ margin: "8px 24px", borderTop: "1px solid #f0eeec" }} />
          {moreItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "10px 24px",
                fontSize: "13px",
                fontWeight: "500",
                textDecoration: "none",
                color: "#5c5a57",
                borderLeft: "3px solid transparent",
                transition: "all 0.2s",
                fontFamily: "var(--font-sans)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .show-mobile-block { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .show-mobile-block { display: none !important; }
        }
        .more-dropdown:hover .more-menu {
          opacity: 1 !important;
          pointer-events: auto !important;
          transform: translateY(0) !important;
        }
        .more-dropdown:hover .more-btn {
          color: #8b1a2a !important;
        }
      `}</style>
    </header>
  );
}