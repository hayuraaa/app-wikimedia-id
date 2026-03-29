import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AcaraDetailClient from "@/components/acara/AcaraDetailClient";

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
  creator?: { id: number; name: string };
};

// ─── Server Fetch ─────────────────────────────────────────────────────────────

const BASE = "https://dashboard.wikimedia.or.id/api/v1";

async function getEvent(slug: string): Promise<EventItem | null> {
  try {
    const res = await fetch(`${BASE}/events/${slug}`, {
      next: { revalidate: 300, tags: ["events"] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

async function getOtherEvents(slug: string): Promise<EventItem[]> {
  try {
    const res = await fetch(`${BASE}/events/upcoming/list?limit=5`, {
      next: { revalidate: 300, tags: ["events"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success
      ? json.data.filter((e: EventItem) => e.slug !== slug).slice(0, 4)
      : [];
  } catch {
    return [];
  }
}

// ─── Metadata Dinamis ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: "Acara Tidak Ditemukan – Wikimedia Indonesia",
    };
  }

  return {
    title: `${event.judul} – Wikimedia Indonesia`,
    description: event.deskripsi.replace(/\n/g, " ").substring(0, 160).trim(),
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [event, otherEvents] = await Promise.all([
    getEvent(slug),
    getOtherEvents(slug),
  ]);

  if (!event) notFound();

  return <AcaraDetailClient event={event} otherEvents={otherEvents} />;
}