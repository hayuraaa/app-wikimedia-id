import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await req.json().catch(() => ({ path: null }));

  if (path) {
    revalidatePath(path);
  } else {
    // Revalidate semua halaman yang berkaitan dengan events
    revalidatePath("/acara");
    revalidatePath("/acara/[slug]", "page");
    revalidatePath("/");
  }

  return Response.json({ revalidated: true, path: path ?? "all" });
}
