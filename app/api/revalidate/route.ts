import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { path, tag } = body as { path?: string; tag?: string };

  if (tag) {
    revalidateTag(tag, "max");
    return Response.json({ revalidated: true, tag });
  }

  if (path) {
    revalidatePath(path);
    return Response.json({ revalidated: true, path });
  }

  // Revalidate semua halaman yang menampilkan artikel
  revalidateTag("articles", "max");
  revalidateTag("events", "max");
  revalidatePath("/");
  revalidatePath("/rubrik");
  revalidatePath("/rubrik/[slug]", "page");
  revalidatePath("/acara");
  revalidatePath("/acara/[slug]", "page");

  return Response.json({ revalidated: true, scope: "all" });
}
