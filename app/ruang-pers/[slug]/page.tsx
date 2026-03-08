import { notFound } from "next/navigation";
import PressReleaseClient from "@/components/ruang-pers/PressReleaseClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PressRelease = {
  id: number;
  title: string;
  slug: string;
  content: string;
  featured_image: string | null;
  published_at: string;
  views: number;
  creator: { id: number; name: string; email: string };
};

export type RelatedPR = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  views: number;
};

// ─── Fetch ────────────────────────────────────────────────────────────────────

const BASE_URL = "https://dashboard.wikimedia.or.id";

async function getPressRelease(slug: string): Promise<PressRelease | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/press-releases/${slug}`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

async function getLatest(currentSlug: string): Promise<RelatedPR[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/press-releases/latest/list?limit=6`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    if (!json.success) return [];
    return json.data.filter((a: RelatedPR) => a.slug !== currentSlug).slice(0, 5);
  } catch {
    return [];
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PressReleaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [pr, latest] = await Promise.all([
    getPressRelease(slug),
    getLatest(slug),
  ]);

  if (!pr) notFound();

  return <PressReleaseClient pr={pr} latest={latest} />;
}