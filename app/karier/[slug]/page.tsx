import { notFound } from "next/navigation";
import KarirDetailClient from "@/components/karier/KarirDetailClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Karir = {
  id: number;
  title: string;
  slug: string;
  description: string;
  link_pendaftaran: string;
  is_active: boolean;
  published_at: string;
  expires_at: string | null;
  views: number;
  created_at: string;
  creator: { id: number; name: string } | null;
};

// ─── Fetch ────────────────────────────────────────────────────────────────────

const BASE = "https://dashboard.wikimedia.or.id/api/v1";

async function getKarir(slug: string): Promise<Karir | null> {
  try {
    const res = await fetch(`${BASE}/karir/${slug}`, {
      next: { revalidate: 300 },
    });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function KarirDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const karir = await getKarir(slug);

  if (!karir) notFound();

  return <KarirDetailClient karir={karir} />;
}