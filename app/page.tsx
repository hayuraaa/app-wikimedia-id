// SERVER COMPONENT — fetch data di server, tidak ada "use client"
import HeroSection from "@/components/landingpage/HeroSection";
import ArticlesSection from "@/components/landingpage/ArticlesSection";
import EventsSection from "@/components/landingpage/EventsSection";
import WikiSection from "@/components/landingpage/WikiSection";
import ProgramSection from "@/components/landingpage/ProgramSection";
import NewsletterSection from "@/components/landingpage/NewsletterSection";

// ─── Types (export agar bisa dipakai di komponen) ─────────────────────────────

export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  views: number;
  authors: { id: number; name: string; slug: string }[];
  categories: string[];
};

export type EventItem = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  jenis_acara: string;
  links: { id: number; judul_link: string; url: string }[];
};

export type WikiProject = {
  id: number;
  nama_proyek: string;
  slug: string;
  logo_url: string;
  deskripsi: string;
  urutan: number;
  subprojects: { id: number; nama_bahasa: string; url: string }[];
};

// ─── Server-side fetch ────────────────────────────────────────────────────────

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(
      "https://dashboard.wikimedia.or.id/api/v1/articles?per_page=4",
      { next: { revalidate: 300 } }
    );
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

async function getEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(
      "https://dashboard.wikimedia.or.id/api/v1/events/upcoming/list?limit=5",
      { next: { revalidate: 300 } }
    );
    const json = await res.json();
    if (json.success && json.data?.length > 0) {
      return json.data.slice(0, 5);
    }
    const fallbackRes = await fetch(
      "https://dashboard.wikimedia.or.id/api/v1/events?upcoming=false",
      { next: { revalidate: 300 } }
    );
    const fallback = await fallbackRes.json();
    if (fallback.success) {
      return (fallback.data as EventItem[])
        .sort(
          (a, b) =>
            new Date(b.tanggal_mulai).getTime() -
            new Date(a.tanggal_mulai).getTime()
        )
        .slice(0, 5);
    }
    return [];
  } catch {
    return [];
  }
}

async function getWikiProjects(): Promise<WikiProject[]> {
  try {
    const res = await fetch(
      "https://dashboard.wikimedia.or.id/api/v1/wiki-projects",
      { next: { revalidate: 86400 } }
    );
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const [articles, events, wikiProjects] = await Promise.all([
    getArticles(),
    getEvents(),
    getWikiProjects(),
  ]);

  return (
    <>
      <HeroSection />
      <ArticlesSection articles={articles} />
      <EventsSection events={events} articles={articles} />
      <WikiSection wikiProjects={wikiProjects} />
      <ProgramSection />
      <NewsletterSection />
    </>
  );
}