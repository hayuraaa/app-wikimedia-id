// Sesi penulis: token API dashboard disimpan di cookie httpOnly (tidak bisa dibaca JavaScript browser).

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { writerConfig } from "./config";

export const SESSION_COOKIE = "wmid_writer";
export const OAUTH_COOKIE = "wmid_writer_oauth";

const OAUTH_COOKIE_PATH = "/api/auth/wikimedia";

export async function getWriterToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export function setWriterSession(res: NextResponse, token: string, expiresAt: string | null) {
  const expires = expiresAt ? new Date(expiresAt) : undefined;
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: writerConfig.secureCookies,
    sameSite: "lax",
    path: "/",
    ...(expires && !isNaN(expires.getTime()) ? { expires } : { maxAge: 60 * 60 * 24 * 30 }),
  });
}

export function clearWriterSession(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

// ── State + PKCE selama proses login ke Meta (berlaku 10 menit) ──────────────

export type OAuthState = { state: string; verifier: string };

export function setOAuthState(res: NextResponse, value: OAuthState) {
  res.cookies.set(OAUTH_COOKIE, JSON.stringify(value), {
    httpOnly: true,
    secure: writerConfig.secureCookies,
    sameSite: "lax",
    path: OAUTH_COOKIE_PATH,
    maxAge: 600,
  });
}

export async function readOAuthState(): Promise<OAuthState | null> {
  const raw = (await cookies()).get(OAUTH_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed?.state === "string" && typeof parsed?.verifier === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function clearOAuthState(res: NextResponse) {
  res.cookies.set(OAUTH_COOKIE, "", { path: OAUTH_COOKIE_PATH, maxAge: 0 });
}
