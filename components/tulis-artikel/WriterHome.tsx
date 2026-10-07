"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ArticleStatus, Paginated, WriterArticle, WriterUser } from "@/lib/writer/types";
import { EDITABLE_STATUSES, STATUS_LABEL } from "@/lib/writer/types";
import {
  COLOR, alertStyle, blurStyle, buttonStyle, cardStyle, focusStyle, inputStyle, labelStyle, sectionStyle,
} from "./styles";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Sama dengan components/rubrik/ArticleClient.tsx: "data-dan-teknologi" → "Data dan Teknologi"
const CONNECTORS = new Set(["dan", "atau", "di", "ke", "dari", "untuk", "yang", "dengan"]);
const formatCategory = (cat: string) =>
  cat.split("-").map((w, i) => (i > 0 && CONNECTORS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(" ");

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });

function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "writer-spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// ─── Belum login ──────────────────────────────────────────────────────────────

function LoginCard({ error }: { error: string | null }) {
  const [redirecting, setRedirecting] = useState(false);

  return (
    <div className="writer-card" style={{ ...cardStyle, maxWidth: "620px", margin: "0 auto", textAlign: "center" }}>
      <div style={{ width: "56px", height: "56px", borderRadius: "50%", margin: "0 auto 18px", backgroundColor: "rgba(12,87,168,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={COLOR.primary} strokeWidth="1.8"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
      </div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLOR.text, fontFamily: "var(--font-montserrat)", margin: "0 0 10px" }}>
        Masuk untuk mulai menulis
      </h2>
      <p style={{ fontSize: "14px", color: COLOR.muted, fontFamily: "var(--font-source-serif)", lineHeight: 1.7, margin: "0 0 24px" }}>
        Gunakan akun Wikimedia Anda (akun yang sama untuk Wikipedia, Wikimedia Commons, dan proyek lainnya).
        Pastikan email akun Anda sudah terkonfirmasi.
      </p>

      {error && <div style={{ ...alertStyle("error"), textAlign: "left", marginBottom: "20px" }}>{error}</div>}

      <a href="/api/auth/wikimedia/login" onClick={() => setRedirecting(true)} style={{ ...buttonStyle("primary"), padding: "13px 28px" }}>
        {redirecting ? <Spinner /> : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
        )}
        Masuk dengan akun Wikimedia
      </a>

      <ol style={{ listStyle: "decimal", textAlign: "left", margin: "28px 0 0", padding: "20px 20px 4px 40px", backgroundColor: "#f8f7f5", borderRadius: "6px", fontSize: "13px", color: COLOR.muted, fontFamily: "var(--font-source-serif)", lineHeight: 1.7 }}>
        <li style={{ marginBottom: "10px" }}>Masuk dan beri izin di halaman Meta-Wiki.</li>
        <li style={{ marginBottom: "10px" }}>Tulis artikel, lihat pratinjaunya, lalu simpan sebagai draft atau ajukan untuk ditinjau.</li>
        <li style={{ marginBottom: "10px" }}>Tim Wikimedia Indonesia meninjau artikel Anda. Hasilnya dikirim ke email Anda.</li>
      </ol>
    </div>
  );
}

// ─── Akun baru: isi nama penulis ──────────────────────────────────────────────

function NameForm({ writer }: { writer: WriterUser }) {
  const router = useRouter();
  // Akun yang tertaut ke penulis tamu: isi awal dengan nama yang ada, tinggal diperiksa
  const existingName = writer.author?.name ?? "";
  const [name, setName] = useState(existingName);
  const looksLikeUsername = !!writer.wiki_username && name.trim().toLowerCase() === writer.wiki_username.toLowerCase();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/writer/me/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        router.refresh();
        return;
      }
      if (res.status === 401) router.refresh();
      setError(json?.errors?.name?.[0] ?? json?.message ?? "Gagal menyimpan nama. Silakan coba lagi.");
    } catch {
      setError("Gagal menyimpan nama. Periksa koneksi internet Anda.");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="writer-card" style={{ ...cardStyle, maxWidth: "560px", margin: "0 auto" }}>
      <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: COLOR.primary, fontFamily: "var(--font-montserrat)" }}>
        ◆ Selamat datang{writer.wiki_username ? `, ${writer.wiki_username}` : ""}
      </span>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLOR.text, fontFamily: "var(--font-montserrat)", margin: "8px 0 8px" }}>
        {existingName ? "Konfirmasi nama lengkap Anda" : "Satu langkah lagi"}
      </h2>
      <p style={{ fontSize: "14px", color: COLOR.muted, fontFamily: "var(--font-source-serif)", lineHeight: 1.7, margin: "0 0 22px" }}>
        {existingName
          ? "Kami menemukan data penulis dengan email Anda. Periksa nama di bawah ini dan perbaiki bila perlu. "
          : "Tuliskan nama lengkap yang akan ditampilkan sebagai penulis pada artikel Anda. "}
        Gunakan nama lengkap, <strong>bukan username Wikimedia</strong>. Nama ini hanya dapat diisi sekali;
        untuk mengubahnya kemudian, hubungi tim Wikimedia Indonesia.
      </p>

      <label htmlFor="writer-name" style={labelStyle}>Nama penulis <span style={{ color: "#c0392b" }}>*</span></label>
      <input id="writer-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Siti Nurhaliza"
        required minLength={3} maxLength={100} autoComplete="name" style={inputStyle}
        onFocus={(e) => Object.assign(e.target.style, focusStyle)} onBlur={(e) => Object.assign(e.target.style, blurStyle)} />

      {looksLikeUsername && !error && (
        <div style={{ ...alertStyle("info"), marginTop: "14px" }}>
          Nama ini sama dengan username Wikimedia Anda. Pastikan ini memang nama lengkap Anda.
        </div>
      )}
      {error && <div style={{ ...alertStyle("error"), marginTop: "14px" }}>{error}</div>}

      <button type="submit" disabled={saving || name.trim().length < 3} style={{ ...buttonStyle("primary", saving || name.trim().length < 3), marginTop: "20px" }}>
        {saving && <Spinner />} Simpan &amp; lanjutkan
      </button>
    </form>
  );
}

// ─── Daftar artikel saya ──────────────────────────────────────────────────────

const FILTERS: { value: ArticleStatus | "all"; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Menunggu review" },
  { value: "rejected", label: "Perlu perbaikan" },
  { value: "published", label: "Terbit" },
];

function StatusBadge({ status }: { status: ArticleStatus }) {
  const s = STATUS_LABEL[status];
  return (
    <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: "999px", fontSize: "10.5px", fontWeight: 700, fontFamily: "var(--font-montserrat)", letterSpacing: "0.03em", color: s.color, backgroundColor: s.bg, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

function ArticleRow({ article, onDeleted }: { article: WriterArticle; onDeleted: () => void }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editable = EDITABLE_STATUSES.includes(article.status);

  const remove = async () => {
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/writer/my/articles/${article.slug}`, { method: "DELETE", headers: { Accept: "application/json" } }).catch(() => null);
    if (res?.ok) return onDeleted();
    if (res?.status === 401) return router.refresh();
    const json = await res?.json().catch(() => null);
    setError(json?.message ?? "Gagal menghapus artikel.");
    setDeleting(false);
    setConfirming(false);
  };

  return (
    <li className="writer-row" style={{ display: "grid", gridTemplateColumns: "96px 1fr auto", gap: "18px", alignItems: "start", padding: "18px 0", borderTop: `1px solid ${COLOR.border}` }}>
      <div style={{ width: "96px", height: "64px", borderRadius: "4px", overflow: "hidden", backgroundColor: "#f0eeec", flexShrink: 0 }}>
        {article.featured_image
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={article.featured_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: COLOR.subtle }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
            </div>}
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
          <StatusBadge status={article.status} />
          <span style={{ fontSize: "11px", color: COLOR.subtle, fontFamily: "var(--font-montserrat)" }}>
            {article.status === "published" && article.published_at ? `Terbit ${formatDate(article.published_at)}` : `Diubah ${formatDate(article.updated_at)}`}
          </span>
        </div>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: COLOR.text, fontFamily: "var(--font-montserrat)", margin: "0 0 4px", lineHeight: 1.4, wordBreak: "break-word" }}>
          {article.title}
        </h3>
        {article.categories.length > 0 && (
          <p style={{ fontSize: "11.5px", color: COLOR.muted, fontFamily: "var(--font-montserrat)", margin: 0 }}>
            {article.categories.map(formatCategory).join(" · ")}
          </p>
        )}
        {article.status === "rejected" && article.rejection_reason && (
          <div style={{ ...alertStyle("error"), marginTop: "10px", display: "block" }}>
            <strong>Catatan peninjau:</strong> {article.rejection_reason}
          </div>
        )}
        {error && <div style={{ ...alertStyle("error"), marginTop: "10px" }}>{error}</div>}
      </div>

      <div className="writer-row-actions" style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
        {confirming ? (
          <>
            <span style={{ fontSize: "12px", color: COLOR.muted, fontFamily: "var(--font-montserrat)" }}>Hapus artikel ini?</span>
            <button onClick={remove} disabled={deleting} style={{ ...buttonStyle("danger", deleting), padding: "7px 12px", fontSize: "12px" }}>
              {deleting && <Spinner size={12} />} Ya, hapus
            </button>
            <button onClick={() => setConfirming(false)} disabled={deleting} style={{ ...buttonStyle("ghost"), fontSize: "12px" }}>Batal</button>
          </>
        ) : (
          <>
            {article.status === "published" && (
              <Link href={`/rubrik/${article.slug}`} style={{ ...buttonStyle("outline"), padding: "7px 14px", fontSize: "12px" }}>Lihat</Link>
            )}
            {article.status === "pending" && (
              <Link href={`/tulis-artikel/${article.slug}`} style={{ ...buttonStyle("outline"), padding: "7px 14px", fontSize: "12px" }}>Lihat</Link>
            )}
            {editable && (
              <>
                <Link href={`/tulis-artikel/${article.slug}`} style={{ ...buttonStyle("primary"), padding: "7px 14px", fontSize: "12px" }}>Edit</Link>
                <button onClick={() => setConfirming(true)} style={{ ...buttonStyle("ghost"), fontSize: "12px", color: COLOR.danger }}>Hapus</button>
              </>
            )}
          </>
        )}
      </div>
    </li>
  );
}

function MyArticles() {
  const router = useRouter();
  const [filter, setFilter] = useState<ArticleStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Paginated<WriterArticle> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(page), per_page: "10" });
    if (filter !== "all") params.set("status", filter);
    try {
      const res = await fetch(`/api/writer/my/articles?${params}`, { cache: "no-store", headers: { Accept: "application/json" } });
      if (res.status === 401) return router.refresh();
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError("Gagal memuat daftar artikel. Silakan muat ulang halaman.");
    }
    setLoading(false);
  }, [filter, page, router]);

  useEffect(() => { load(); }, [load]);

  const articles = result?.data ?? [];
  const meta = result?.meta;

  return (
    <div className="writer-card" style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "18px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: COLOR.text, fontFamily: "var(--font-montserrat)", margin: 0 }}>Artikel Saya</h2>
        <Link href="/tulis-artikel/baru" style={buttonStyle("primary")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Tulis artikel baru
        </Link>
      </div>

      <div role="tablist" style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button key={f.value} role="tab" aria-selected={active} onClick={() => { setFilter(f.value); setPage(1); }}
              style={{ padding: "6px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-montserrat)", cursor: "pointer",
                border: `1px solid ${active ? COLOR.primary : COLOR.border}`, backgroundColor: active ? COLOR.primary : "#fff", color: active ? "#fff" : COLOR.muted }}>
              {f.label}
            </button>
          );
        })}
      </div>

      {error && <div style={{ ...alertStyle("error"), marginTop: "16px" }}>{error}</div>}

      {loading && !result ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "40px 0", justifyContent: "center", color: COLOR.subtle, fontSize: "13px", fontFamily: "var(--font-montserrat)" }}>
          <Spinner /> Memuat artikel…
        </div>
      ) : articles.length === 0 && !error ? (
        <div style={{ textAlign: "center", padding: "44px 16px 20px" }}>
          <p style={{ fontSize: "14px", color: COLOR.muted, fontFamily: "var(--font-source-serif)", margin: "0 0 4px" }}>
            {filter === "all" ? "Anda belum memiliki artikel." : "Tidak ada artikel dengan status ini."}
          </p>
          {filter === "all" && (
            <p style={{ fontSize: "13px", color: COLOR.subtle, fontFamily: "var(--font-source-serif)", margin: 0 }}>
              Mulai dengan menekan tombol <strong>Tulis artikel baru</strong>.
            </p>
          )}
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0, opacity: loading ? 0.5 : 1, transition: "opacity 0.15s" }}>
          {articles.map((a) => <ArticleRow key={a.id} article={a} onDeleted={load} />)}
        </ul>
      )}

      {meta && meta.last_page > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px", paddingTop: "16px", borderTop: `1px solid ${COLOR.border}` }}>
          <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1} style={{ ...buttonStyle("outline", page <= 1), padding: "7px 14px", fontSize: "12px" }}>← Sebelumnya</button>
          <span style={{ fontSize: "12px", color: COLOR.muted, fontFamily: "var(--font-montserrat)" }}>Halaman {meta.current_page} dari {meta.last_page}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= meta.last_page} style={{ ...buttonStyle("outline", page >= meta.last_page), padding: "7px 14px", fontSize: "12px" }}>Berikutnya →</button>
        </div>
      )}
    </div>
  );
}

// ─── Halaman ──────────────────────────────────────────────────────────────────

function AccountBar({ writer }: { writer: WriterUser }) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const logout = async () => {
    setLeaving(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.refresh();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
      <div style={{ fontSize: "13px", color: COLOR.muted, fontFamily: "var(--font-montserrat)" }}>
        Masuk sebagai <strong style={{ color: COLOR.text }}>{writer.author?.name}</strong>
        {writer.wiki_username && <span style={{ color: COLOR.subtle }}> · Wikimedia: {writer.wiki_username}</span>}
      </div>
      <button onClick={logout} disabled={leaving} style={{ ...buttonStyle("ghost", leaving), fontSize: "12px" }}>
        {leaving && <Spinner size={12} />} Keluar
      </button>
    </div>
  );
}

export default function WriterHome({ writer, loginError, submitted }: { writer: WriterUser | null; loginError: string | null; submitted: boolean }) {
  return (
    <section style={sectionStyle}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {!writer ? (
          <LoginCard error={loginError} />
        ) : writer.needs_name ? (
          <NameForm writer={writer} />
        ) : (
          <>
            <AccountBar writer={writer} />
            {submitted && (
              <div style={{ ...alertStyle("success"), marginBottom: "16px" }}>
                Artikel berhasil diajukan. Tim Wikimedia Indonesia akan meninjaunya, dan hasilnya dikirim ke email Anda.
              </div>
            )}
            <MyArticles />
          </>
        )}
      </div>

      <style>{`
        @keyframes writer-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .writer-card { padding: 24px 20px !important; }
          .writer-row { grid-template-columns: 72px 1fr !important; }
          .writer-row > div:first-child { width: 72px !important; height: 52px !important; }
          .writer-row-actions { grid-column: 1 / -1; justify-content: flex-start !important; }
        }
      `}</style>
    </section>
  );
}
