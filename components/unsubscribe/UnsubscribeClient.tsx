"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const BASE = "https://dashboard.wikimedia.or.id/api/v1";

type Status = "loading" | "confirm" | "already" | "notfound" | "invalid" | "success" | "error";

export default function UnsubscribeClient({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/unsubscribe/${token}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) {
          if (json.message?.includes("tidak ditemukan")) setStatus("notfound");
          else if (json.message?.includes("tidak valid")) setStatus("invalid");
          else setStatus("invalid");
          return;
        }
        setEmail(json.data.email);
        if (!json.data.is_active) {
          setStatus("already");
        } else {
          setStatus("confirm");
        }
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  const handleUnsubscribe = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`${BASE}/unsubscribe/${token}`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setProcessing(false);
    }
  };

  const handleResubscribe = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`${BASE}/resubscribe/${token}`, { method: "POST" });
      const json = await res.json();
      if (json.success) setStatus("confirm");
    } catch {}
    finally { setProcessing(false); }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f7f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "440px", width: "100%", backgroundColor: "#fff", borderRadius: "6px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <div style={{ height: "3px", background: "linear-gradient(90deg, #0C57A8, #1e4d7b)" }} />
        <div style={{ padding: "40px 36px", textAlign: "center" }}>

          {/* LOADING */}
          {status === "loading" && (
            <>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(12,87,168,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0C57A8" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </div>
              <p style={{ fontSize: "14px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>Memverifikasi...</p>
            </>
          )}

          {/* CONFIRM */}
          {status === "confirm" && (
            <>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(234,179,8,0.1)", border: "2px solid rgba(234,179,8,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginBottom: "8px" }}>Berhenti Berlangganan?</h1>
              <p style={{ fontSize: "13px", color: "#6b6966", fontFamily: "var(--font-sans)", marginBottom: "16px", lineHeight: "1.7" }}>
                Anda yakin ingin berhenti berlangganan newsletter dari:
              </p>
              <div style={{ backgroundColor: "#f8f7f5", borderRadius: "4px", padding: "12px 16px", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#0d0d0d", fontFamily: "var(--font-sans)", margin: 0 }}>{email}</p>
              </div>
              <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: "var(--font-sans)", marginBottom: "28px", lineHeight: "1.6" }}>
                Anda tidak akan menerima update artikel, acara, dan informasi dari kami.
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleUnsubscribe}
                  disabled={processing}
                  style={{ flex: 1, padding: "12px", backgroundColor: "#0C57A8", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)", cursor: processing ? "not-allowed" : "pointer", opacity: processing ? 0.7 : 1, transition: "background 0.2s" }}
                  onMouseEnter={(e) => { if (!processing) (e.currentTarget as HTMLElement).style.backgroundColor = "#0a4a8f"; }}
                  onMouseLeave={(e) => { if (!processing) (e.currentTarget as HTMLElement).style.backgroundColor = "#0C57A8"; }}
                >
                  {processing ? "Memproses..." : "Ya, Berhenti"}
                </button>
                <Link href="https://wikimedia.or.id" style={{ flex: 1, padding: "12px", backgroundColor: "#f0eeec", color: "#3a3a3a", borderRadius: "4px", fontSize: "13px", fontWeight: "600", fontFamily: "var(--font-sans)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  Batal
                </Link>
              </div>
            </>
          )}

          {/* SUCCESS */}
          {status === "success" && (
            <>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(22,163,74,0.1)", border: "2px solid rgba(22,163,74,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginBottom: "8px" }}>Berhasil Berhenti</h1>
              <p style={{ fontSize: "13px", color: "#6b6966", fontFamily: "var(--font-sans)", marginBottom: "8px", lineHeight: "1.7" }}>
                Email <strong>{email}</strong> telah dihapus dari daftar newsletter kami.
              </p>
              <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: "var(--font-sans)", marginBottom: "28px" }}>
                Anda dapat berlangganan kembali kapan saja.
              </p>
              <Link href="https://wikimedia.or.id" style={{ display: "inline-block", padding: "12px 28px", backgroundColor: "#0C57A8", color: "#fff", borderRadius: "4px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)", textDecoration: "none" }}>
                Kembali ke Beranda
              </Link>
            </>
          )}

          {/* ALREADY UNSUBSCRIBED */}
          {status === "already" && (
            <>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(107,105,102,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b6966" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </div>
              <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginBottom: "8px" }}>Sudah Tidak Berlangganan</h1>
              <p style={{ fontSize: "13px", color: "#6b6966", fontFamily: "var(--font-sans)", marginBottom: "28px", lineHeight: "1.7" }}>
                Email <strong>{email}</strong> sudah tidak aktif berlangganan.
              </p>
              <button
                onClick={handleResubscribe}
                disabled={processing}
                style={{ padding: "12px 28px", backgroundColor: "#1e4d7b", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)", cursor: "pointer", marginBottom: "12px" }}
              >
                {processing ? "Memproses..." : "Berlangganan Kembali"}
              </button>
              <br />
              <Link href="https://wikimedia.or.id" style={{ fontSize: "12px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>
                Kembali ke Beranda
              </Link>
            </>
          )}

          {/* NOT FOUND / INVALID */}
          {(status === "notfound" || status === "invalid" || status === "error") && (
            <>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(220,38,38,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </div>
              <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginBottom: "8px" }}>
                {status === "notfound" ? "Email Tidak Ditemukan" : "Link Tidak Valid"}
              </h1>
              <p style={{ fontSize: "13px", color: "#6b6966", fontFamily: "var(--font-sans)", marginBottom: "28px", lineHeight: "1.7" }}>
                {status === "notfound"
                  ? "Email Anda tidak ditemukan dalam daftar subscriber kami."
                  : "Link unsubscribe tidak valid atau telah kedaluwarsa."}
              </p>
              <Link href="https://wikimedia.or.id" style={{ display: "inline-block", padding: "12px 28px", backgroundColor: "#0d0d0d", color: "#fff", borderRadius: "4px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)", textDecoration: "none" }}>
                Kembali ke Beranda
              </Link>
            </>
          )}

        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}