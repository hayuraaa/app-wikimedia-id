// Helper untuk Server Component halaman /tulis-artikel

import { dashboardFetch } from "./dashboard";
import { getWriterToken } from "./session";
import type { WriterArticle, WriterUser } from "./types";

/** Penulis yang sedang login, atau null bila belum login / token tidak berlaku */
export async function getCurrentWriter(): Promise<WriterUser | null> {
  const token = await getWriterToken();
  if (!token) return null;

  try {
    const res = await dashboardFetch("me", { token });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch (e) {
    console.error("[writer] Gagal memuat profil penulis", e);
    return null;
  }
}

/** Kategori yang boleh dipilih penulis */
export async function getWriterCategories(): Promise<{ value: string; label: string }[]> {
  const token = await getWriterToken();
  if (!token) return [];
  try {
    const res = await dashboardFetch("my/categories", { token });
    return res.ok ? ((await res.json())?.data ?? []) : [];
  } catch (e) {
    console.error("[writer] Gagal memuat kategori", e);
    return [];
  }
}

/** Artikel milik penulis yang login; null bila tidak ada / bukan miliknya */
export async function getMyArticle(slug: string): Promise<WriterArticle | null> {
  const token = await getWriterToken();
  if (!token || !/^[a-z0-9-]+$/.test(slug)) return null;
  const res = await dashboardFetch(`my/articles/${slug}`, { token });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Gagal memuat artikel (${res.status})`);
  return (await res.json())?.data ?? null;
}
