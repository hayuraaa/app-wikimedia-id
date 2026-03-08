import RuangPersClient from "@/components/ruang-pers/RuangPersClient";

export type PressRelease = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  views: number;
  creator: { id: number; name: string };
};

export type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const BASE = "https://dashboard.wikimedia.or.id/api/v1";
const PER_PAGE = 9;

async function getPressReleases(): Promise<{ pressReleases: PressRelease[]; meta: Meta | null }> {
  try {
    const res = await fetch(`${BASE}/press-releases?per_page=${PER_PAGE}&page=1`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    if (!json.success) return { pressReleases: [], meta: null };
    return { pressReleases: json.data, meta: json.meta };
  } catch {
    return { pressReleases: [], meta: null };
  }
}

export default async function RuangPersPage() {
  const { pressReleases, meta } = await getPressReleases();

  return (
    <RuangPersClient
      initialPressReleases={pressReleases}
      initialMeta={meta}
    />
  );
}