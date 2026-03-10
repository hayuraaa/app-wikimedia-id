import KarierClient from "@/components/karier/KarierClient";
import type { Metadata } from "next";

export const metadata = {
  title: "Karier – Wikimedia Indonesia",
  description: "Lowongan Karier terbaru di Wikimedia Indonesia.",
};

export type Karir = {
  id: number;
  title: string;
  slug: string;
  description: string;
  link_pendaftaran: string;
  published_at: string;
  expires_at: string | null;
  views: number;
  creator: { id: number; name: string } | null;
};

const BASE = "https://dashboard.wikimedia.or.id/api/v1";

export default async function KarirPage() {
  let items: Karir[] = [];
  let total = 0;

  try {
    const res = await fetch(`${BASE}/karir?per_page=50`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success) {
      items = json.data;
      total = json.pagination?.total ?? json.data.length;
    }
  } catch (err) {
    console.error("[KarirPage] fetch error:", err);
  }

  return <KarierClient items={items} total={total} />;
}