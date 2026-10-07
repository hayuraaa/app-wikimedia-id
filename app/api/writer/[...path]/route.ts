import { NextRequest, NextResponse } from "next/server";
import { dashboardFetch } from "@/lib/writer/dashboard";
import { clearWriterSession, getWriterToken } from "@/lib/writer/session";
import { isSameOrigin } from "@/lib/writer/origin";

// Proxy browser → Writer API dashboard. Kunci klien & token ditambahkan di server.
// Hanya path & method di bawah ini yang diteruskan.
const ROUTES: { pattern: RegExp; methods: string[] }[] = [
  { pattern: /^me$/, methods: ["GET"] },
  { pattern: /^me\/profile$/, methods: ["PUT"] },
  { pattern: /^my\/categories$/, methods: ["GET"] },
  { pattern: /^my\/uploads\/image$/, methods: ["POST"] },
  { pattern: /^my\/articles$/, methods: ["GET", "POST"] },
  { pattern: /^my\/articles\/[a-z0-9-]+$/, methods: ["GET", "PUT", "POST", "DELETE"] },
];

type Context = { params: Promise<{ path: string[] }> };

async function handle(req: NextRequest, { params }: Context) {
  const path = (await params).path.join("/");
  const method = req.method;

  const route = ROUTES.find((r) => r.pattern.test(path));
  if (!route) {
    return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
  }
  if (!route.methods.includes(method)) {
    return NextResponse.json({ success: false, message: "Method not allowed." }, { status: 405 });
  }
  if (method !== "GET" && !isSameOrigin(req)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }

  const token = await getWriterToken();
  if (!token) {
    return NextResponse.json({ success: false, message: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  let upstream: Response;
  try {
    upstream = await dashboardFetch(path + req.nextUrl.search, {
      method,
      token,
      body: method === "GET" ? null : await req.arrayBuffer(),
      contentType: req.headers.get("content-type"),
    });
  } catch (e) {
    console.error("[writer] Dashboard tidak dapat dihubungi", e);
    return NextResponse.json({ success: false, message: "Layanan sedang tidak tersedia. Silakan coba lagi nanti." }, { status: 503 });
  }

  const body = await upstream.text();
  const res = new NextResponse(body, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });

  // Token kedaluwarsa/dicabut: hapus sesi agar halaman kembali ke tampilan login
  if (upstream.status === 401) clearWriterSession(res);

  return res;
}

export { handle as GET, handle as POST, handle as PUT, handle as DELETE };
