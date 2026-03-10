import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PressReleaseClient from "@/components/ruang-pers/PressReleaseClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pr = await getPressRelease(slug);
  if (!pr) return { title: "Siaran Pers Tidak Ditemukan – Wikimedia Indonesia" };
  return {
    title: `${pr.title} – Wikimedia Indonesia`,
    description: pr.content.replace(/<[^>]*>/g, "").substring(0, 160).trim(),
  };
}

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