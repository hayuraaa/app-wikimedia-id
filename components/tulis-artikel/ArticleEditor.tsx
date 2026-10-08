"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { TextAlign } from "@tiptap/extension-text-align";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import { Figure } from "./FigureExtension";
import { ARTICLE_CONTENT_CSS } from "@/components/rubrik/articleContentStyles";
import type { WriterArticle } from "@/lib/writer/types";
import EditorToolbar from "./EditorToolbar";
import ArticlePreview, { type PreviewData } from "./ArticlePreview";
import { COLOR, alertStyle, blurStyle, buttonStyle, cardStyle, focusStyle, inputStyle, labelStyle } from "./styles";

export type CategoryOption = { value: string; label: string };

const MAX_CATEGORIES = 3;
const MAX_KEYWORDS = 10;
const MAX_FEATURED_BYTES = 10 * 1024 * 1024;

type FieldErrors = Partial<Record<"title" | "content" | "categories" | "keywords" | "featured_image", string>>;

// Ambil pesan pertama per field dari respons validasi Laravel (mis. "categories.0" → categories)
function toFieldErrors(errors: Record<string, string[]> | undefined): FieldErrors {
  const result: FieldErrors = {};
  for (const [key, messages] of Object.entries(errors ?? {})) {
    const field = key.split(".")[0] as keyof FieldErrors;
    if (!result[field]) result[field] = messages[0];
  }
  return result;
}

async function uploadContentImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("image", file);
  const res = await fetch("/api/writer/my/uploads/image", { method: "POST", body, headers: { Accept: "application/json" } });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.data?.url) {
    throw new Error(json?.errors?.image?.[0] ?? json?.message ?? "Gagal mengunggah gambar.");
  }
  return json.data.url;
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "writer-spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <p style={{ fontSize: "12px", color: COLOR.danger, fontFamily: "var(--font-montserrat)", margin: "6px 0 0" }}>{message}</p> : null;

export default function ArticleEditor({ article, categories, authorName }: { article: WriterArticle | null; categories: CategoryOption[]; authorName: string }) {
  const router = useRouter();
  const isNew = !article;

  const [title, setTitle] = useState(article?.title ?? "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(article?.categories ?? []);
  const [keywords, setKeywords] = useState<string[]>(article?.keywords ?? []);
  const [keywordInput, setKeywordInput] = useState("");

  // Gambar utama: URL tersimpan, file baru yang belum diunggah, atau dihapus
  const [savedImage, setSavedImage] = useState<string | null>(article?.featured_image ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const imagePreview = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile]);
  useEffect(() => () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }, [imagePreview]);
  const featuredImage = imagePreview ?? (removeImage ? null : savedImage);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState<null | "draft" | "pending">(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);

  const editor = useEditor({
    immediatelyRender: false, // hindari hydration mismatch (Next.js SSR)
    extensions: [
      // H1 tidak dipakai: judul artikel sudah menjadi H1 di halaman
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https", HTMLAttributes: { rel: "noopener noreferrer nofollow ugc", target: "_blank" } },
      }),
      Figure,
      // <img> tanpa caption dari draft lama tetap bisa dibuka
      Image.configure({ allowBase64: false }),
      TableKit.configure({ table: { resizable: false } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Superscript,
      Subscript,
      // includeChildren: paragraf caption kosong ikut mendapat class is-empty (teksnya diatur lewat CSS)
      Placeholder.configure({ includeChildren: true, showOnlyCurrent: false, placeholder: "Mulai menulis isi artikel di sini…" }),
      CharacterCount,
    ],
    content: article?.content ?? "",
    editorProps: { attributes: { class: "article-content writer-editor-content", "aria-label": "Isi artikel" } },
    onUpdate: () => setDirty(true),
  });

  // Peringatkan bila meninggalkan halaman dengan perubahan yang belum disimpan
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Pratinjau: kunci scroll halaman di belakang overlay, Esc untuk kembali ke editor
  useEffect(() => {
    if (!preview) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPreview(null); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); };
  }, [preview]);

  const openPreview = () => {
    if (!editor) return;
    setPreview({
      title,
      content: editor.getHTML().replace(/(<p><\/p>)+$/, ""),
      featuredImage,
      authorName,
      categories: selectedCategories,
      keywords,
      publishedAt: article?.published_at,
    });
  };

  const touch = useCallback(() => { setDirty(true); setMessage(null); }, []);

  const toggleCategory = (value: string) => {
    touch();
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : prev.length >= MAX_CATEGORIES ? prev : [...prev, value]
    );
  };

  // Tambah satu atau beberapa kata kunci (dipisah koma), tanpa duplikat
  const addKeywords = (raw: string) => {
    const next = [...keywords];
    for (const part of raw.split(",")) {
      const kw = part.trim().slice(0, 50);
      if (kw && next.length < MAX_KEYWORDS && !next.some((k) => k.toLowerCase() === kw.toLowerCase())) next.push(kw);
    }
    if (next.length !== keywords.length) { setKeywords(next); touch(); }
    setKeywordInput("");
  };

  const pickFeaturedImage = (file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|gif|webp)$/.test(file.type)) {
      setErrors((e) => ({ ...e, featured_image: "Format gambar harus JPG, PNG, GIF, atau WebP." }));
    } else if (file.size > MAX_FEATURED_BYTES) {
      setErrors((e) => ({ ...e, featured_image: "Ukuran gambar maksimal 10 MB." }));
    } else {
      setErrors((e) => ({ ...e, featured_image: undefined }));
      setImageFile(file);
      setRemoveImage(false);
      touch();
    }
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const clearFeaturedImage = () => {
    setImageFile(null);
    setRemoveImage(true);
    touch();
  };

  const validate = (submit: boolean): FieldErrors => {
    const e: FieldErrors = {};
    if (!title.trim()) e.title = "Judul wajib diisi.";
    const text = editor?.getText().trim() ?? "";
    const hasImage = editor?.getHTML().includes("<img") ?? false;
    if (!text && !hasImage) e.content = "Isi artikel tidak boleh kosong.";
    else if (submit && text.length < 10) e.content = "Isi artikel terlalu pendek.";
    if (selectedCategories.length === 0) e.categories = "Pilih minimal satu kategori.";
    return e;
  };

  const save = async (intent: "draft" | "pending") => {
    if (!editor || saving) return;
    const clientErrors = validate(intent === "pending");
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) {
      setMessage({ kind: "error", text: "Periksa kembali isian yang ditandai." });
      return;
    }

    setSaving(intent);
    setMessage(null);

    // Simpan draft pada artikel yang ditolak: status dibiarkan (tetap "perlu perbaikan")
    const status = intent === "pending" ? "pending" : isNew || article?.status === "draft" ? "draft" : null;
    // Buang paragraf kosong di akhir (sisa tombol Enter) agar tidak ikut tersimpan
    const content = editor.getHTML().replace(/(<p><\/p>)+$/, "");
    const fields = { title: title.trim(), content, categories: selectedCategories, keywords };

    let res: Response | null = null;
    try {
      const url = isNew ? "/api/writer/my/articles" : `/api/writer/my/articles/${article!.slug}`;
      if (imageFile || removeImage) {
        // multipart: hanya lewat POST (PHP tidak membaca file pada PUT)
        const body = new FormData();
        body.append("title", fields.title);
        body.append("content", fields.content);
        fields.categories.forEach((c) => body.append("categories[]", c));
        fields.keywords.forEach((k) => body.append("keywords[]", k));
        if (status) body.append("status", status);
        if (imageFile) body.append("featured_image", imageFile);
        else if (removeImage && !isNew) body.append("remove_featured_image", "1");
        res = await fetch(url, { method: "POST", body, headers: { Accept: "application/json" } });
      } else {
        res = await fetch(url, {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...fields, ...(status ? { status } : {}) }),
        });
      }
    } catch {
      setMessage({ kind: "error", text: "Gagal menyimpan. Periksa koneksi internet Anda lalu coba lagi." });
      setSaving(null);
      return;
    }

    const json = await res.json().catch(() => null);

    if (res.status === 401) {
      setMessage({ kind: "error", text: "Sesi Anda telah berakhir. Salin tulisan Anda, lalu masuk kembali." });
      setSaving(null);
      return;
    }
    if (!res.ok) {
      setErrors(toFieldErrors(json?.errors));
      setMessage({ kind: "error", text: json?.message && !json?.errors ? json.message : "Periksa kembali isian yang ditandai." });
      setSaving(null);
      return;
    }

    setDirty(false);
    const saved: WriterArticle = json.data;

    if (intent === "pending") {
      router.push("/tulis-artikel?diajukan=1");
      return;
    }
    if (isNew) {
      router.replace(`/tulis-artikel/${saved.slug}?tersimpan=1`);
      return;
    }

    setSavedImage(saved.featured_image);
    setImageFile(null);
    setRemoveImage(false);
    setSaving(null);
    setMessage({ kind: "success", text: "Draft tersimpan." });
    router.refresh();
  };

  // Dihitung ulang setiap isi editor berubah (bukan hanya saat komponen dirender ulang)
  const { characters, words } = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      characters: e?.storage.characterCount.characters() ?? 0,
      words: e?.storage.characterCount.words() ?? 0,
    }),
  }) ?? { characters: 0, words: 0 };

  return (
    <div className="writer-editor-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: "24px", alignItems: "start" }}>
      {/* ── Kolom utama ── */}
      <div className="writer-card" style={{ ...cardStyle, padding: 0, overflow: "visible" }}>
        <div style={{ padding: "28px 32px 8px" }} className="writer-editor-pad">
          {article?.status === "rejected" && article.rejection_reason && (
            <div style={{ ...alertStyle("error"), display: "block", marginBottom: "18px" }}>
              <strong>Catatan peninjau:</strong> {article.rejection_reason}
            </div>
          )}
          <label htmlFor="article-title" style={labelStyle}>Judul artikel <span style={{ color: "#c0392b" }}>*</span></label>
          <textarea id="article-title" value={title} rows={1} maxLength={255} placeholder="Tulis judul yang jelas dan menarik"
            onChange={(e) => { setTitle(e.target.value.replace(/\n/g, " ")); touch(); }}
            style={{ ...inputStyle, border: "none", padding: "4px 0", fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)", fontWeight: 700, lineHeight: 1.3, resize: "none", fieldSizing: "content" } as React.CSSProperties} />
          <FieldError message={errors.title} />
        </div>

        <div style={{ borderTop: `1px solid ${COLOR.border}` }}>
          {editor && <EditorToolbar editor={editor} onUploadImage={uploadContentImage} />}
          <div style={{ padding: "8px 32px 24px", minHeight: "420px" }} className="writer-editor-pad">
            <EditorContent editor={editor} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "10px 32px", borderTop: `1px solid ${COLOR.border}`, fontSize: "11.5px", color: COLOR.subtle, fontFamily: "var(--font-montserrat)" }} className="writer-editor-pad">
            <span>{words.toLocaleString("id-ID")} kata · {characters.toLocaleString("id-ID")} karakter</span>
            {errors.content && <span style={{ color: COLOR.danger, fontWeight: 600 }}>{errors.content}</span>}
          </div>
        </div>
      </div>

      {/* ── Kolom samping ── */}
      <aside className="writer-editor-side" style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "88px" }}>
        <div className="writer-card" style={{ ...cardStyle, padding: "20px" }}>
          {message && <div style={{ ...alertStyle(message.kind), marginBottom: "14px" }}>{message.text}</div>}
          <button type="button" onClick={openPreview} disabled={!editor || !!saving}
            style={{ ...buttonStyle("ghost", !editor || !!saving), width: "100%", border: `1px solid ${COLOR.border}`, color: "#2a2826", padding: "10px 16px", marginBottom: "8px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            Pratinjau
          </button>
          <button type="button" onClick={() => save("pending")} disabled={!!saving} style={{ ...buttonStyle("primary", !!saving), width: "100%" }}>
            {saving === "pending" && <Spinner />} Ajukan untuk review
          </button>
          <button type="button" onClick={() => save("draft")} disabled={!!saving} style={{ ...buttonStyle("outline", !!saving), width: "100%", marginTop: "8px" }}>
            {saving === "draft" && <Spinner />} Simpan draft
          </button>
          <p style={{ fontSize: "11.5px", color: COLOR.subtle, fontFamily: "var(--font-montserrat)", lineHeight: 1.6, margin: "12px 0 0" }}>
            {dirty ? "Ada perubahan yang belum disimpan." : isNew ? "Artikel belum disimpan." : "Semua perubahan tersimpan."}
            {" "}Setelah diajukan, artikel tidak dapat diubah sampai selesai ditinjau.
          </p>
          <Link href="/tulis-artikel" style={{ display: "inline-block", marginTop: "10px", fontSize: "12px", color: COLOR.muted, fontFamily: "var(--font-montserrat)" }}>
            ← Kembali ke Artikel Saya
          </Link>
        </div>

        <div className="writer-card" style={{ ...cardStyle, padding: "20px" }}>
          <span style={labelStyle}>Gambar utama</span>
          {featuredImage ? (
            <div style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featuredImage} alt="Pratinjau gambar utama" style={{ width: "100%", aspectRatio: "1200 / 630", objectFit: "cover", borderRadius: "4px", border: `1px solid ${COLOR.border}`, display: "block" }} />
              <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                <button type="button" onClick={() => imageInputRef.current?.click()} style={{ ...buttonStyle("outline"), padding: "6px 12px", fontSize: "12px" }}>Ganti</button>
                <button type="button" onClick={clearFeaturedImage} style={{ ...buttonStyle("ghost"), fontSize: "12px", color: COLOR.danger }}>Hapus</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => imageInputRef.current?.click()}
              style={{ width: "100%", aspectRatio: "1200 / 630", border: `1.5px dashed ${COLOR.border}`, borderRadius: "4px", backgroundColor: "#faf9f7", color: COLOR.muted, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", fontFamily: "var(--font-montserrat)", fontSize: "12px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
              Pilih gambar
            </button>
          )}
          <p style={{ fontSize: "11px", color: COLOR.subtle, fontFamily: "var(--font-montserrat)", margin: "8px 0 0", lineHeight: 1.5 }}>
            JPG, PNG, GIF, atau WebP · maks 10 MB · dipotong ke rasio 1200×630.
          </p>
          <FieldError message={errors.featured_image} />
          <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" hidden onChange={(e) => pickFeaturedImage(e.target.files?.[0])} />
        </div>

        <div className="writer-card" style={{ ...cardStyle, padding: "20px" }}>
          <span style={labelStyle}>Kategori <span style={{ color: "#c0392b" }}>*</span> <span style={{ textTransform: "none", fontWeight: 500, letterSpacing: 0 }}>(maks {MAX_CATEGORIES})</span></span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {categories.map((c) => {
              const active = selectedCategories.includes(c.value);
              const full = !active && selectedCategories.length >= MAX_CATEGORIES;
              return (
                <button key={c.value} type="button" onClick={() => toggleCategory(c.value)} disabled={full} aria-pressed={active}
                  style={{ padding: "5px 11px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-montserrat)",
                    cursor: full ? "not-allowed" : "pointer", opacity: full ? 0.45 : 1,
                    border: `1px solid ${active ? COLOR.primary : COLOR.border}`, backgroundColor: active ? COLOR.primary : "#fff", color: active ? "#fff" : COLOR.muted }}>
                  {c.label}
                </button>
              );
            })}
          </div>
          <FieldError message={errors.categories} />
        </div>

        <div className="writer-card" style={{ ...cardStyle, padding: "20px" }}>
          <label htmlFor="keyword-input" style={labelStyle}>Kata kunci <span style={{ textTransform: "none", fontWeight: 500, letterSpacing: 0 }}>(opsional, maks {MAX_KEYWORDS})</span></label>
          {keywords.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
              {keywords.map((k) => (
                <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 6px 4px 10px", borderRadius: "999px", backgroundColor: "#f0eeec", fontSize: "12px", fontFamily: "var(--font-montserrat)", color: "#2a2826" }}>
                  {k}
                  <button type="button" aria-label={`Hapus kata kunci ${k}`} onClick={() => { setKeywords(keywords.filter((x) => x !== k)); touch(); }}
                    style={{ border: "none", background: "none", cursor: "pointer", color: COLOR.subtle, fontSize: "14px", lineHeight: 1, padding: "0 2px" }}>×</button>
                </span>
              ))}
            </div>
          )}
          <input id="keyword-input" type="text" value={keywordInput} disabled={keywords.length >= MAX_KEYWORDS}
            placeholder={keywords.length >= MAX_KEYWORDS ? "Batas kata kunci tercapai" : "Ketik lalu tekan Enter"}
            onChange={(e) => (e.target.value.includes(",") ? addKeywords(e.target.value) : setKeywordInput(e.target.value))}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKeywords(keywordInput); } }}
            onBlur={(e) => { Object.assign(e.target.style, blurStyle); if (keywordInput.trim()) addKeywords(keywordInput); }}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            style={{ ...inputStyle, padding: "8px 12px" }} />
          <FieldError message={errors.keywords} />
        </div>
      </aside>

      {preview && (
        <div role="dialog" aria-modal="true" aria-label="Pratinjau artikel"
          style={{ position: "fixed", inset: 0, zIndex: 100, overflowY: "auto", backgroundColor: "#f8f7f5" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 60, backgroundColor: "#0d0d0d", color: "#fff", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-montserrat)" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", padding: "3px 8px", borderRadius: "3px", backgroundColor: "#f59e0b", color: "#0d0d0d" }}>PRATINJAU</span>
              <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.75)" }}>
                Tampilan artikel setelah terbit. {dirty ? "Belum disimpan." : "Tersimpan."} Tidak ada yang diajukan.
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button type="button" onClick={() => setPreview(null)} style={{ ...buttonStyle("ghost"), color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 14px" }}>
                ← Kembali ke editor
              </button>
              <button type="button" onClick={() => { setPreview(null); save("draft"); }} style={{ ...buttonStyle("outline"), padding: "8px 14px" }}>Simpan draft</button>
              <button type="button" onClick={() => { setPreview(null); save("pending"); }} style={{ ...buttonStyle("primary"), padding: "8px 14px" }}>Ajukan untuk review</button>
            </div>
          </div>
          <ArticlePreview data={preview} />
        </div>
      )}

      <style>{`
        ${ARTICLE_CONTENT_CSS}
        @keyframes writer-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .writer-tool:hover:not(:disabled) { background-color: #f0eeec !important; }
        .writer-editor-content { outline: none; max-width: 100%; min-height: 400px; }
        .writer-editor-content > :first-child { margin-top: 0.8em; }
        .writer-editor-content p.is-editor-empty:first-child::before,
        .writer-editor-content .writer-figure figcaption p.is-empty::before {
          content: attr(data-placeholder); color: #9a9690; pointer-events: none; float: left; height: 0;
        }
        .writer-editor-content img.ProseMirror-selectednode { outline: 3px solid rgba(12,87,168,0.45); }
        .writer-editor-content .writer-figure figcaption { margin-top: 8px; }
        .writer-editor-content .writer-figure figcaption p { margin: 0; text-align: center; font-size: 0.82em; color: #7a7874; font-style: italic; font-family: var(--font-montserrat); line-height: 1.45; }
        .writer-editor-content .writer-figure.ProseMirror-selectednode img { outline: 3px solid rgba(12,87,168,0.45); }
        .writer-editor-content .writer-figure figcaption p.is-empty::before { content: "Tulis keterangan gambar (opsional)…"; width: 100%; text-align: center; }
        .writer-editor-content table td, .writer-editor-content table th { border: 1px solid #e5e2dd; position: relative; min-width: 60px; vertical-align: top; }
        .writer-editor-content table th p, .writer-editor-content table td p { margin: 0; }
        .writer-editor-content .selectedCell::after { content: ""; position: absolute; inset: 0; background: rgba(12,87,168,0.12); pointer-events: none; }
        .writer-editor-content .tableWrapper { overflow-x: auto; }
        @media (max-width: 960px) {
          .writer-editor-grid { grid-template-columns: 1fr !important; }
          .writer-editor-side { position: static !important; }
        }
        @media (max-width: 640px) {
          .writer-editor-pad { padding-left: 18px !important; padding-right: 18px !important; }
        }
      `}</style>
    </div>
  );
}
