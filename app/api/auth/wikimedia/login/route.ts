import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { writerConfig } from "@/lib/writer/config";
import { setOAuthState } from "@/lib/writer/session";

// Mulai login: arahkan ke halaman persetujuan OAuth2 Meta-Wiki (dengan state + PKCE)
export async function GET() {
  const state = randomBytes(24).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  const url = new URL(writerConfig.authorizeUrl);
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: writerConfig.clientId,
    redirect_uri: writerConfig.redirectUri,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  }).toString();

  const res = NextResponse.redirect(url);
  setOAuthState(res, { state, verifier });
  return res;
}
