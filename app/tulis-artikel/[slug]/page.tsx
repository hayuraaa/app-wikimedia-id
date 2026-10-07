import { notFound, redirect } from "next/navigation";
import WriterHero from "@/components/tulis-artikel/WriterHero";
import ArticleEditor from "@/components/tulis-artikel/ArticleEditor";
import ArticleLocked from "@/components/tulis-artikel/ArticleLocked";
import { alertStyle, sectionStyle } from "@/components/tulis-artikel/styles";
import { getCurrentWriter, getMyArticle, getWriterCategories } from "@/lib/writer/server";
import { EDITABLE_STATUSES } from "@/lib/writer/types";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ tersimpan?: string }> };

export default async function EditArtikelPage({ params, searchParams }: Props) {
  const writer = await getCurrentWriter();
  if (!writer || writer.needs_name) redirect("/tulis-artikel");

  const [{ slug }, { tersimpan }] = await Promise.all([params, searchParams]);
  const article = await getMyArticle(slug);
  if (!article) notFound();

  const authorName = writer.author?.name ?? "";

  // Menunggu review / sudah terbit: tampil seperti halaman artikel, tanpa editor
  if (!EDITABLE_STATUSES.includes(article.status)) {
    return <ArticleLocked article={article} authorName={authorName} />;
  }

  const categories = await getWriterCategories();

  return (
    <>
      <WriterHero title="Edit Artikel" crumbs={[{ label: "Tulis Artikel", href: "/tulis-artikel" }, { label: "Edit" }]} />
      <section style={sectionStyle}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {tersimpan && (
            <div style={{ ...alertStyle("success"), marginBottom: "16px" }}>Draft tersimpan. Anda dapat melanjutkan menulis kapan saja.</div>
          )}
          <ArticleEditor key={article.id} article={article} categories={categories} authorName={authorName} />
        </div>
      </section>
    </>
  );
}
