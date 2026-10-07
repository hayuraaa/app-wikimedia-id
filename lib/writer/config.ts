// Konfigurasi fitur penulis artikel (/tulis-artikel). Hanya dipakai di server.

const META_OAUTH = "https://meta.wikimedia.org/w/rest.php/oauth2";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Env ${name} belum diisi`);
  return value;
}

export const writerConfig = {
  get clientId() { return required("WIKIMEDIA_OAUTH_CLIENT_ID"); },
  get clientSecret() { return required("WIKIMEDIA_OAUTH_CLIENT_SECRET"); },
  get redirectUri() { return required("WIKIMEDIA_OAUTH_REDIRECT_URI"); },
  get dashboardUrl() { return required("DASHBOARD_API_URL").replace(/\/+$/, ""); },
  get clientKey() { return required("WIKI_WRITER_CLIENT_KEY"); },

  // Origin situs diambil dari redirect URI, karena di balik proxy cPanel
  // req.url bisa berisi host internal (mis. http://localhost:3xxx)
  get siteOrigin() { return new URL(this.redirectUri).origin; },
  get secureCookies() { return this.siteOrigin.startsWith("https://"); },

  authorizeUrl: `${META_OAUTH}/authorize`,
  tokenUrl: `${META_OAUTH}/access_token`,
};

export const WRITER_PAGE = "/tulis-artikel";
