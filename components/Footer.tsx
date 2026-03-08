// ✅ SERVER COMPONENT — hapus "use client"
// Hover effects pindah ke CSS class, tidak butuh JS

import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  "SITE MENU": [
    { label: "Menjadi Anggota", href: "/menjadi-anggota" },
    { label: "Donasi", href: "/donasi" },
    { label: "Acara", href: "/acara" },
    { label: "Karier", href: "/karier" },
  ],
  Program: [
    { label: "Pendidikan", href: "https://pendidikan.wikimedia.or.id" },
    { label: "Teknologi & Data", href: "https://datatek.wikimedia.or.id" },
    { label: "Kebudayaan", href: "https://kebudayaan.wikimedia.or.id" },
    { label: "Komunitas", href: "https://komunitas.wikimedia.or.id" },
  ],
  Informasi: [
    { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
    { label: "Syarat Penggunaan", href: "/syarat-penggunaan" },
    { label: "FAQ", href: "/faq" },
  ],
};

const socialLinks = [
  {
    label: "Twitter/X",
    href: "https://x.com/wikimediaid",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://web.facebook.com/wikimedia.indonesia",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/wikimediaid/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/c/WikimediaIndonesia",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://id.linkedin.com/company/wikimediaid",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Telegram",
    href: "https://t.me/wikimediaid",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#0d0d0d", color: "#f8f8f6" }}>
      <div
        style={{
          height: "3px",
          background:
            "linear-gradient(90deg, #8b1a2a 0%, #1a3a5c 50%, #1e4d7b 100%)",
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "56px 24px 40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "40px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                position: "relative",
                height: "38px",
                width: "170px",
                marginBottom: "16px",
              }}
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Logo_WMID_2018_Mendatar.png"
                alt="Wikimedia Indonesia"
                fill
                style={{
                  objectFit: "contain",
                  objectPosition: "left",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: "1.7",
                  fontFamily: "var(--font-sans)",
                  margin: 0,
                }}
              >
                TCC Batavia Tower One, Lt. 6
                <br />
                Jalan K.H. Mas Mansyur No. 126
                <br />
                Karet Tengsin, Tanah Abang
                <br />
                Jakarta Pusat 10220, Indonesia
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <a
                href="mailto:info@wikimedia.or.id"
                className="footer-email"
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "var(--font-sans)",
                  textDecoration: "none",
                }}
              >
                info@wikimedia.or.id
              </a>
            </div>

            {/* Social icons — hover via CSS */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#f8f8f6",
                  marginBottom: "14px",
                  fontFamily: "var(--font-sans)",
                  paddingBottom: "10px",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {title}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={
                        link.href.startsWith("https://") ? "_blank" : undefined
                      }
                      rel={
                        link.href.startsWith("https://")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="footer-nav-link"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 24px" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.35)",
              fontFamily: "var(--font-sans)",
              margin: 0,
            }}
          >
            © {currentYear} Wikimedia Indonesia. Semua konten situs ini dirilis
            di bawah{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-cc-link"
            >
              Lisensi Creative Commons Attribution-ShareAlike
            </a>{" "}
            kecuali dinyatakan lain.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Kebijakan Privasi", "Syarat Penggunaan", "Peta Situs"].map(
              (t) => (
                <Link key={t} href="#" className="footer-bottom-link">
                  {t}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* ✅ Semua hover via CSS — tidak butuh JS/useClient */}
      <style>{`
        .footer-email {
          transition: color 0.2s;
        }
        .footer-email:hover {
          color: #f8f8f6 !important;
        }
        .footer-social {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: all 0.2s;
        }
        .footer-social:hover {
          background-color: #8b1a2a;
          border-color: #8b1a2a;
          color: #fff;
        }
        .footer-nav-link {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-family: var(--font-sans);
          transition: color 0.2s;
        }
        .footer-nav-link:hover {
          color: #f8f8f6;
        }
        .footer-cc-link {
          color: rgba(255,255,255,0.5);
          text-decoration: underline;
          transition: color 0.2s;
        }
        .footer-cc-link:hover {
          color: #f8f8f6;
        }
        .footer-bottom-link {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          font-family: var(--font-sans);
          transition: color 0.2s;
        }
        .footer-bottom-link:hover {
          color: #f8f8f6;
        }
      `}</style>
    </footer>
  );
}