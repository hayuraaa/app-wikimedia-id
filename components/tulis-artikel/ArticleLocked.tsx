import Link from "next/link";
import type { WriterArticle } from "@/lib/writer/types";
import { STATUS_LABEL } from "@/lib/writer/types";
import ArticlePreview from "./ArticlePreview";
import { buttonStyle } from "./styles";

// Artikel yang sedang ditinjau atau sudah terbit: hanya bisa dibaca, ditampilkan seperti halaman artikel
export default function ArticleLocked({ article, authorName }: { article: WriterArticle; authorName: string }) {
  const status = STATUS_LABEL[article.status];
  const published = article.status === "published";

  return (
    <>
      <div style={{ backgroundColor: "#0d0d0d", color: "#fff", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-montserrat)" }}>
            <span style={{ fontSize: "10.5px", fontWeight: 700, padding: "3px 9px", borderRadius: "999px", color: status.color, backgroundColor: "#fff", whiteSpace: "nowrap", flexShrink: 0 }}>{status.label}</span>
            <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.75)" }}>
              {published
                ? "Artikel ini sudah terbit dan tidak dapat diubah lagi dari sini."
                : "Artikel ini sedang ditinjau tim Wikimedia Indonesia. Anda akan menerima email setelah peninjauan selesai."}
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link href="/tulis-artikel" style={{ ...buttonStyle("ghost"), color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 14px" }}>← Artikel Saya</Link>
            {published && <Link href={`/rubrik/${article.slug}`} style={{ ...buttonStyle("primary"), padding: "8px 14px" }}>Lihat di Rubrik</Link>}
          </div>
        </div>
      </div>

      <ArticlePreview
        data={{
          title: article.title,
          content: article.content ?? "",
          featuredImage: article.featured_image,
          authorName: article.authors[0]?.name ?? authorName,
          categories: article.categories,
          keywords: article.keywords,
          publishedAt: article.published_at,
        }}
      />
    </>
  );
}
