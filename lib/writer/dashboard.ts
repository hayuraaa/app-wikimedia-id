// Panggilan server-ke-server ke Writer API di dashboard.
// Browser tidak pernah memanggil dashboard langsung.

import { writerConfig } from "./config";

type DashboardRequest = {
  method?: string;
  token?: string | null;
  body?: BodyInit | null;
  contentType?: string | null;
};

export async function dashboardFetch(path: string, { method = "GET", token, body, contentType }: DashboardRequest = {}) {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Writer-Client-Key": writerConfig.clientKey,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (contentType) headers["Content-Type"] = contentType;

  return fetch(`${writerConfig.dashboardUrl}/api/v1/${path}`, {
    method,
    headers,
    body: body ?? undefined,
    cache: "no-store",
  });
}

/** Tukar access token Meta dengan token API penulis */
export async function exchangeWikimediaToken(accessToken: string) {
  const res = await dashboardFetch("auth/wikimedia", {
    method: "POST",
    body: JSON.stringify({ access_token: accessToken }),
    contentType: "application/json",
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}
