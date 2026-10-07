import type { Metadata } from "next";

// Masih uji coba: jangan diindeks mesin pencari (sengaja tidak lewat robots.txt agar path tidak terlihat publik)
export const metadata: Metadata = {
  title: "Tulis Artikel | Wikimedia Indonesia",
  robots: { index: false, follow: false },
};

export default function WriterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
