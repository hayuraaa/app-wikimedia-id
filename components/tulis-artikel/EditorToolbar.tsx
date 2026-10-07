"use client";

import { useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { COLOR, alertStyle, inputStyle } from "./styles";

// Toolbar editor artikel. Hanya format yang diterima sanitizer dashboard (App\Services\HtmlSanitizer).

const ICONS: Record<string, React.ReactNode> = {
  bold: <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />,
  italic: <><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></>,
  underline: <><path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" y1="20" x2="20" y2="20" /></>,
  strike: <><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" y1="12" x2="20" y2="12" /></>,
  bullet: <><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>,
  ordered: <><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></>,
  quote: <path d="M3 21c3 0 7-1 7-8V5H3v8h4M14 21c3 0 7-1 7-8V5h-7v8h4" />,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
  table: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="12" y1="3" x2="12" y2="21" /></>,
  hr: <line x1="3" y1="12" x2="21" y2="12" />,
  undo: <><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></>,
  redo: <><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" /></>,
};

function ToolButton({ icon, label, active, disabled, onClick }: { icon: string; label: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button type="button" title={label} aria-label={label} aria-pressed={active} disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // jangan hilangkan seleksi teks di editor
      onClick={onClick}
      className="writer-tool"
      style={{
        width: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center",
        border: "none", borderRadius: "3px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.35 : 1,
        backgroundColor: active ? "rgba(12,87,168,0.12)" : "transparent", color: active ? COLOR.primary : "#2a2826",
      }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{ICONS[icon]}</svg>
    </button>
  );
}

const Divider = () => <span style={{ width: "1px", height: "20px", backgroundColor: COLOR.border, margin: "0 4px" }} />;

const textButton: React.CSSProperties = {
  padding: "5px 9px", fontSize: "11.5px", fontWeight: 600, fontFamily: "var(--font-montserrat)", border: `1px solid ${COLOR.border}`,
  borderRadius: "3px", backgroundColor: "#fff", color: "#2a2826", cursor: "pointer", whiteSpace: "nowrap",
};

export default function EditorToolbar({ editor, onUploadImage }: { editor: Editor; onUploadImage: (file: File) => Promise<string> }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Render ulang toolbar hanya bila status format berubah
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      block: e.isActive("heading", { level: 2 }) ? "h2" : e.isActive("heading", { level: 3 }) ? "h3" : e.isActive("heading", { level: 4 }) ? "h4" : "p",
      bold: e.isActive("bold"), italic: e.isActive("italic"), underline: e.isActive("underline"), strike: e.isActive("strike"),
      bullet: e.isActive("bulletList"), ordered: e.isActive("orderedList"), quote: e.isActive("blockquote"),
      link: e.isActive("link"), table: e.isActive("table"),
      canUndo: e.can().undo(), canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  const setBlock = (value: string) => {
    if (value === "p") chain().setParagraph().run();
    else chain().setHeading({ level: Number(value.slice(1)) as 2 | 3 | 4 }).run();
  };

  const openLink = () => {
    setLinkUrl(editor.getAttributes("link").href ?? "");
    setLinkOpen(true);
  };

  const applyLink = () => {
    const url = linkUrl.trim();
    if (!url) {
      chain().extendMarkRange("link").unsetLink().run();
    } else {
      const href = /^(https?:\/\/|mailto:)/i.test(url) ? url : `https://${url}`;
      chain().extendMarkRange("link").setLink({ href }).run();
    }
    setLinkOpen(false);
  };

  const pickImage = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!/^image\/(jpeg|png|gif|webp)$/.test(file.type)) return setError("Format gambar harus JPG, PNG, GIF, atau WebP.");
    if (file.size > 5 * 1024 * 1024) return setError("Ukuran gambar maksimal 5 MB.");
    setUploading(true);
    try {
      const url = await onUploadImage(file);
      chain().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah gambar.");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div style={{ position: "sticky", top: "72px", zIndex: 5, backgroundColor: "#fff", borderBottom: `1px solid ${COLOR.border}`, borderRadius: "6px 6px 0 0" }}>
      <div role="toolbar" aria-label="Format teks" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "2px", padding: "6px 8px" }}>
        <select aria-label="Gaya paragraf" value={state.block} onChange={(e) => setBlock(e.target.value)}
          style={{ ...textButton, padding: "6px 8px", marginRight: "4px" }}>
          <option value="p">Paragraf</option>
          <option value="h2">Judul bagian</option>
          <option value="h3">Subjudul</option>
          <option value="h4">Subjudul kecil</option>
        </select>
        <Divider />
        <ToolButton icon="bold" label="Tebal (Ctrl+B)" active={state.bold} onClick={() => chain().toggleBold().run()} />
        <ToolButton icon="italic" label="Miring (Ctrl+I)" active={state.italic} onClick={() => chain().toggleItalic().run()} />
        <ToolButton icon="underline" label="Garis bawah (Ctrl+U)" active={state.underline} onClick={() => chain().toggleUnderline().run()} />
        <ToolButton icon="strike" label="Coret" active={state.strike} onClick={() => chain().toggleStrike().run()} />
        <Divider />
        <ToolButton icon="bullet" label="Daftar berbutir" active={state.bullet} onClick={() => chain().toggleBulletList().run()} />
        <ToolButton icon="ordered" label="Daftar bernomor" active={state.ordered} onClick={() => chain().toggleOrderedList().run()} />
        <ToolButton icon="quote" label="Kutipan" active={state.quote} onClick={() => chain().toggleBlockquote().run()} />
        <ToolButton icon="hr" label="Garis pemisah" onClick={() => chain().setHorizontalRule().run()} />
        <Divider />
        <ToolButton icon="link" label="Tautan" active={state.link} onClick={openLink} />
        <ToolButton icon="image" label={uploading ? "Mengunggah gambar…" : "Sisipkan gambar"} disabled={uploading} onClick={() => fileRef.current?.click()} />
        <ToolButton icon="table" label="Sisipkan tabel" active={state.table} onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
        <Divider />
        <ToolButton icon="undo" label="Urungkan (Ctrl+Z)" disabled={!state.canUndo} onClick={() => chain().undo().run()} />
        <ToolButton icon="redo" label="Ulangi (Ctrl+Shift+Z)" disabled={!state.canRedo} onClick={() => chain().redo().run()} />
        {uploading && <span style={{ fontSize: "11.5px", color: COLOR.muted, fontFamily: "var(--font-montserrat)", marginLeft: "6px" }}>Mengunggah gambar…</span>}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" hidden onChange={(e) => pickImage(e.target.files?.[0])} />
      </div>

      {state.table && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "6px 10px", borderTop: `1px dashed ${COLOR.border}`, backgroundColor: "#faf9f7" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: COLOR.muted, fontFamily: "var(--font-montserrat)", alignSelf: "center", marginRight: "4px" }}>TABEL</span>
          <button type="button" style={textButton} onClick={() => chain().addRowAfter().run()}>+ Baris</button>
          <button type="button" style={textButton} onClick={() => chain().addColumnAfter().run()}>+ Kolom</button>
          <button type="button" style={textButton} onClick={() => chain().deleteRow().run()}>− Baris</button>
          <button type="button" style={textButton} onClick={() => chain().deleteColumn().run()}>− Kolom</button>
          <button type="button" style={{ ...textButton, color: COLOR.danger }} onClick={() => chain().deleteTable().run()}>Hapus tabel</button>
        </div>
      )}

      {linkOpen && (
        <div style={{ display: "flex", gap: "6px", padding: "8px 10px", borderTop: `1px dashed ${COLOR.border}`, backgroundColor: "#faf9f7", flexWrap: "wrap" }}>
          <input autoFocus type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://id.wikipedia.org/wiki/…"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyLink(); } if (e.key === "Escape") setLinkOpen(false); }}
            style={{ ...inputStyle, flex: "1 1 260px", padding: "7px 10px", fontSize: "12.5px" }} />
          <button type="button" style={{ ...textButton, backgroundColor: COLOR.primary, color: "#fff", borderColor: COLOR.primary }} onClick={applyLink}>
            {linkUrl.trim() ? "Pasang tautan" : "Hapus tautan"}
          </button>
          <button type="button" style={textButton} onClick={() => setLinkOpen(false)}>Batal</button>
        </div>
      )}

      {error && <div style={{ ...alertStyle("error"), margin: "0 10px 8px" }}>{error}</div>}
    </div>
  );
}
