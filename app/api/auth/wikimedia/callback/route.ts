import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { writerConfig, WRITER_PAGE } from "@/lib/writer/config";
import { exchangeWikimediaToken } from "@/lib/writer/dashboard";
import { clearOAuthState, readOAuthState, setWriterSession } from "@/lib/writer/session";

// Kembali ke /tulis-artikel, dengan pesan error bila login gagal
function backToWriter(error?: string) {
  const url = new URL(WRITER_PAGE, writerConfig.siteOrigin);
  if (error) url.searchParams.set("login_error", error);
  const res = NextResponse.redirect(url);
  clearOAuthState(res);
  return res;
}

function sameState(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  // Pengguna menolak memberi izin di Meta
  if (params.get("error")) {
    return backToWriter("Login dibatalkan.");
  }

  const code = params.get("code");
  const state = params.get("state");
  const saved = await readOAuthState();

  if (!code || !state || !saved || !sameState(state, saved.state)) {
    return backToWriter("Sesi login tidak valid atau sudah kedaluwarsa. Silakan coba lagi.");
  }

  // 1. Tukar code dengan access token Meta
  let metaToken: string | undefined;
  try {
    const tokenRes = await fetch(writerConfig.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: writerConfig.redirectUri,
        client_id: writerConfig.clientId,
        client_secret: writerConfig.clientSecret,
        code_verifier: saved.verifier,
      }),
      cache: "no-store",
    });
    const tokenData = await tokenRes.json().catch(() => null);
    metaToken = tokenRes.ok ? tokenData?.access_token : undefined;
    if (!metaToken) {
      console.error("[writer] Gagal menukar code OAuth Meta", tokenRes.status, tokenData?.error);
    }
  } catch (e) {
    console.error("[writer] Meta tidak dapat dihubungi", e);
  }

  if (!metaToken) {
    return backToWriter("Gagal masuk dengan akun Wikimedia. Silakan coba lagi.");
  }

  // 2. Dashboard memverifikasi token ke Meta, mencocokkan akun, lalu menerbitkan token API penulis
  try {
    const { ok, data } = await exchangeWikimediaToken(metaToken);
    if (!ok || !data?.data?.token) {
      return backToWriter(data?.message ?? "Gagal masuk. Silakan coba lagi.");
    }

    const res = backToWriter();
    setWriterSession(res, data.data.token, data.data.expires_at ?? null);
    return res;
  } catch (e) {
    console.error("[writer] Dashboard tidak dapat dihubungi", e);
    return backToWriter("Layanan sedang tidak tersedia. Silakan coba lagi nanti.");
  }
}
