import type { CSSProperties } from "react";

// Gaya bersama halaman /tulis-artikel — mengikuti komponen situs (lihat app/kontak/KontakClient.tsx)

export const COLOR = {
  primary: "#0C57A8",
  primaryDark: "#0a4a8f",
  text: "#0d0d0d",
  muted: "#5c5a57",
  subtle: "#9a9690",
  border: "#e5e2dd",
  danger: "#dc2626",
};

export const labelStyle: CSSProperties = {
  fontSize: "11px", fontWeight: 700, color: COLOR.muted, fontFamily: "var(--font-montserrat)",
  letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: "6px",
};

export const inputStyle: CSSProperties = {
  width: "100%", padding: "11px 14px", fontSize: "13px", fontFamily: "var(--font-montserrat)",
  color: COLOR.text, border: `1px solid ${COLOR.border}`, borderRadius: "3px", outline: "none",
  backgroundColor: "#fff", transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box",
};

export const focusStyle = { borderColor: COLOR.primary, boxShadow: "0 0 0 3px rgba(12,87,168,0.08)" };
export const blurStyle = { borderColor: COLOR.border, boxShadow: "none" };

export const cardStyle: CSSProperties = {
  backgroundColor: "#fff", borderRadius: "8px", padding: "32px 36px",
  boxShadow: "0 4px 24px rgba(12,87,168,0.10), 0 1px 4px rgba(0,0,0,0.06)",
  border: "1px solid rgba(12,87,168,0.08)",
};

export const sectionStyle: CSSProperties = {
  background: "linear-gradient(160deg, #f0f5fb 0%, #e8f0fa 50%, #f5f7ff 100%)",
  padding: "48px 24px 72px", position: "relative", minHeight: "60vh",
};

export function buttonStyle(variant: "primary" | "outline" | "ghost" | "danger" = "primary", disabled = false): CSSProperties {
  const base: CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
    padding: "11px 22px", borderRadius: "3px", fontSize: "13px", fontWeight: 700,
    fontFamily: "var(--font-montserrat)", letterSpacing: "0.03em", textDecoration: "none",
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1,
    transition: "background 0.2s, color 0.2s, border-color 0.2s", whiteSpace: "nowrap",
  };
  switch (variant) {
    case "primary": return { ...base, backgroundColor: COLOR.primary, color: "#fff", border: `1px solid ${COLOR.primary}` };
    case "outline": return { ...base, backgroundColor: "#fff", color: COLOR.primary, border: `1px solid ${COLOR.primary}` };
    case "danger":  return { ...base, backgroundColor: "#fff", color: COLOR.danger, border: "1px solid rgba(220,38,38,0.35)" };
    case "ghost":   return { ...base, backgroundColor: "transparent", color: COLOR.muted, border: "1px solid transparent", padding: "8px 12px" };
  }
}

export const alertStyle = (kind: "error" | "success" | "info"): CSSProperties => {
  const palette = {
    error:   { bg: "rgba(220,38,38,0.06)", border: "rgba(220,38,38,0.2)", color: "#b91c1c" },
    success: { bg: "rgba(22,163,74,0.06)", border: "rgba(22,163,74,0.25)", color: "#15803d" },
    info:    { bg: "rgba(12,87,168,0.05)", border: "rgba(12,87,168,0.18)", color: COLOR.primary },
  }[kind];
  return {
    display: "flex", alignItems: "flex-start", gap: "8px", padding: "10px 14px", borderRadius: "3px",
    backgroundColor: palette.bg, border: `1px solid ${palette.border}`, color: palette.color,
    fontSize: "12.5px", fontFamily: "var(--font-montserrat)", lineHeight: 1.55,
  };
};
