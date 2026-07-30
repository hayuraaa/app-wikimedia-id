import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        backgroundColor: "#f8f7f5",
      }}
    >
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "390px", aspectRatio: "2726 / 2884", margin: "0 auto 8px" }}>
          <Image
            src="/404WMID.png"
            alt="Ilustrasi halaman tidak ditemukan"
            fill
            sizes="(max-width: 480px) 75vw, 390px"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <h1
          style={{
            fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
            fontWeight: "700",
            color: "#0d0d0d",
            fontFamily: "var(--font-montserrat)",
            margin: "0 0 10px",
            lineHeight: "1.3",
          }}
        >
          Halaman ini tidak dapat ditemukan
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#6b6966",
            fontFamily: "var(--font-source-serif)",
            lineHeight: "1.7",
            margin: "0 0 28px",
          }}
        >
          Tautan yang Anda tuju mungkin sudah pindah atau tidak lagi tersedia.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 28px",
            backgroundColor: "#0C57A8",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "3px",
            fontSize: "13px",
            fontWeight: "700",
            fontFamily: "var(--font-montserrat)",
            letterSpacing: "0.04em",
            transition: "background 0.2s",
          }}
        >
          Kembali ke Beranda
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
