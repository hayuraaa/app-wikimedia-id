import { redirect } from "next/navigation";
import WriterHero from "@/components/tulis-artikel/WriterHero";
import ArticleEditor from "@/components/tulis-artikel/ArticleEditor";
import { sectionStyle } from "@/components/tulis-artikel/styles";
import { getCurrentWriter, getWriterCategories } from "@/lib/writer/server";

export default async function TulisArtikelBaruPage() {
  const writer = await getCurrentWriter();
  if (!writer || writer.needs_name) redirect("/tulis-artikel");

  const categories = await getWriterCategories();

  return (
    <>
      <WriterHero title="Tulis Artikel Baru" crumbs={[{ label: "Tulis Artikel", href: "/tulis-artikel" }, { label: "Baru" }]} />
      <section style={sectionStyle}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <ArticleEditor article={null} categories={categories} authorName={writer.author?.name ?? ""} />
        </div>
      </section>
    </>
  );
}
