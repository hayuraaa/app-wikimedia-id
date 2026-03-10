import type { Metadata } from "next";
import AcaraClient from "@/components/acara/AcaraClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventItem = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  jenis_acara: string;
  status: string;
  links: { id: number; judul_link: string; url: string }[];
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Acara & Kegiatan – Wikimedia Indonesia",
  description:
    "Seluruh kegiatan Wikimedia Indonesia — proyek, komunitas dan organisasi.",
};

// ─── Server Fetch ─────────────────────────────────────────────────────────────

const BASE = "https://dashboard.wikimedia.or.id/api/v1";

export default async function Page() {
  let events: EventItem[] = [];

  try {
    const res = await fetch(`${BASE}/events?upcoming=false&per_page=500`, {
      next: { revalidate: 300 }, // cache 5 menit
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success) {
      events = (json.data as EventItem[]).sort(
        (a, b) =>
          new Date(b.tanggal_mulai).getTime() -
          new Date(a.tanggal_mulai).getTime()
      );
    }
  } catch (err) {
    console.error("[AcaraPage] fetch error:", err);
  }

  return <AcaraClient initialEvents={events} />;
}