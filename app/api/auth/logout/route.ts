import { NextRequest, NextResponse } from "next/server";
import { dashboardFetch } from "@/lib/writer/dashboard";
import { clearWriterSession, getWriterToken } from "@/lib/writer/session";
import { isSameOrigin } from "@/lib/writer/origin";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }

  const token = await getWriterToken();
  if (token) {
    // Cabut token di dashboard; sesi lokal tetap dihapus walau gagal
    await dashboardFetch("auth/logout", { method: "POST", token }).catch(() => null);
  }

  const res = NextResponse.json({ success: true });
  clearWriterSession(res);
  return res;
}
