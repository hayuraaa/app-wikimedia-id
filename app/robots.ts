import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/unsubscribe/"],
      },
    ],
    sitemap: [
      "https://wikimedia.or.id/sitemap.xml",
      "https://wikimedia.or.id/news-sitemap.xml",
    ],
  };
}
