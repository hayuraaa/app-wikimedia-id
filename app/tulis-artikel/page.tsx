import WriterHero from "@/components/tulis-artikel/WriterHero";
import WriterHome from "@/components/tulis-artikel/WriterHome";
import { getCurrentWriter } from "@/lib/writer/server";

export default async function TulisArtikelPage({ searchParams }: { searchParams: Promise<{ login_error?: string; diajukan?: string }> }) {
  const [writer, { login_error, diajukan }] = await Promise.all([getCurrentWriter(), searchParams]);

  return (
    <>
      <WriterHero
        title="Tulis Artikel"
        description="Bagikan cerita, kegiatan, dan pengetahuan Anda seputar gerakan Wikimedia di Indonesia. Artikel akan ditinjau tim Wikimedia Indonesia sebelum diterbitkan."
        crumbs={[{ label: "Tulis Artikel" }]}
      />
      <WriterHome writer={writer} loginError={login_error ?? null} submitted={!!diajukan} />
    </>
  );
}
