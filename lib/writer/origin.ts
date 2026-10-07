import type { NextRequest } from "next/server";
import { writerConfig } from "./config";

/**
 * Request yang mengubah data (POST/PUT/DELETE) harus datang dari halaman situs ini sendiri.
 * Melengkapi cookie SameSite=Lax sebagai perlindungan CSRF.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (origin) return origin === writerConfig.siteOrigin;

  // Sebagian browser tidak mengirim Origin; jatuh ke Referer
  const referer = req.headers.get("referer");
  if (!referer) return false;
  try {
    return new URL(referer).origin === writerConfig.siteOrigin;
  } catch {
    return false;
  }
}
