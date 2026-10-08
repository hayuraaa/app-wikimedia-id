"use client";

import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { COLOR, alertStyle, inputStyle } from "./styles";

// Toolbar editor artikel. Hanya format yang diterima sanitizer dashboard (App\Services\HtmlSanitizer).

const ICONS: Record<string, React.ReactNode> = {
  bold: <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />,
  italic: <><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></>,
  underline: <><path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" y1="20" x2="20" y2="20" /></>,
  strike: <><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" y1="12" x2="20" y2="12" /></>,
  superscript: <><path d="m4 19 8-8M12 19l-8-8" /><path d="M20 12h-4c0-1.5.44-2 1.5-2.5S20 8.33 20 7.5a1.5 1.5 0 0 0-3 0" /></>,
  subscript: <><path d="m4 5 8 8M12 5l-8 8" /><path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14.5a1.5 1.5 0 0 0-3 0" /></>,
  code: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
  codeBlock: <><rect x="3" y="4" width="18" height="16" rx="2" /><polyline points="10 9 7 12 10 15" /><polyline points="14 9 17 12 14 15" /></>,
  alignLeft: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" /></>,
  alignCenter: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>,
  alignRight: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="9" y1="12" x2="21" y2="12" /><line x1="6" y1="18" x2="21" y2="18" /></>,
  alignJustify: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
  bullet: <><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>,
  ordered: <><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></>,
  indent: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="11" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /><polyline points="3 9 6 12 3 15" /></>,
  outdent: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="11" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /><polyline points="6 9 3 12 6 15" /></>,
  quote: <path d="M3 21c3 0 7-1 7-8V5H3v8h4M14 21c3 0 7-1 7-8V5h-7v8h4" />,
  hr: <line x1="3" y1="12" x2="21" y2="12" />,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
  unlink: <><path d="M18.84 12.25 20.56 10.54a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="m5.17 11.75-1.71 1.71a5 5 0 0 0 7.07 7.07l1.71-1.71" /><line x1="8" y1="2" x2="8" y2="5" /><line x1="2" y1="8" x2="5" y2="8" /><line x1="16" y1="19" x2="16" y2="22" /><line x1="19" y1="16" x2="22" y2="16" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
  table: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="12" y1="3" x2="12" y2="21" /></>,
  clear: <><path d="M4 7V4h16v3M9 20h6M12 4v16" /><line x1="3" y1="21" x2="21" y2="3" /></>,
  undo: <><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></>,
  redo: <><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" /></>,
};

// Warna yang selaras dengan situs; warna lain bisa dipilih lewat "Warna lain…"
const TEXT_COLORS = ["#0d0d0d", "#5c5a57", "#0C57A8", "#1e4d7b", "#15803d", "#b45309", "#b91c1c", "#7c3aed"];
const HIGHLIGHT_COLORS = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fbcfe8", "#fed7aa", "#e5e2dd"];

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

/** Tombol warna dengan palet: dipakai untuk warna teks dan warna sorot */
function ColorPicker({ kind, current, colors, onPick, onClear }: {
  kind: "text" | "highlight"; current: string | null; colors: string[]; onPick: (c: string) => void; onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = kind === "text" ? "Warna teks" : "Sorot teks";

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button type="button" title={label} aria-label={label} aria-expanded={open} className="writer-tool"
        onMouseDown={(e) => e.preventDefault()} onClick={() => setOpen((o) => !o)}
        style={{ width: "32px", height: "32px", display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1px", border: "none", borderRadius: "3px", backgroundColor: open ? "#f0eeec" : "transparent", cursor: "pointer" }}>
        {kind === "text"
          ? <span style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-montserrat)", lineHeight: 1, color: "#2a2826" }}>A</span>
          : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2a2826" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11-6 6v3h9l3-3" /><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" /></svg>}
        <span style={{ width: "16px", height: "3px", borderRadius: "1px", backgroundColor: current ?? (kind === "text" ? "#0d0d0d" : "#fef08a") }} />
      </button>

      {open && (
        <div role="dialog" aria-label={label} style={{ position: "absolute", top: "36px", left: 0, zIndex: 20, width: "196px", padding: "10px", backgroundColor: "#fff", border: `1px solid ${COLOR.border}`, borderRadius: "6px", boxShadow: "0 6px 20px rgba(0,0,0,0.12)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px" }}>
            {colors.map((c) => (
              <button key={c} type="button" title={c} aria-label={`${label} ${c}`} onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onPick(c); setOpen(false); }}
                style={{ width: "24px", height: "24px", borderRadius: "4px", border: current === c ? `2px solid ${COLOR.primary}` : "1px solid rgba(0,0,0,0.12)", backgroundColor: c, cursor: "pointer", padding: 0 }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
            <label style={{ ...textButton, flex: 1, textAlign: "center", position: "relative", overflow: "hidden" }}>
              Warna lain…
              <input type="color" value={current ?? "#0C57A8"} onChange={(e) => onPick(e.target.value)}
                style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
            </label>
            <button type="button" style={textButton} onMouseDown={(e) => e.preventDefault()} onClick={() => { onClear(); setOpen(false); }}>Hapus</button>
          </div>
        </div>
      )}
    </div>
  );
}

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
      superscript: e.isActive("superscript"), subscript: e.isActive("subscript"),
      code: e.isActive("code"), codeBlock: e.isActive("codeBlock"),
      align: (["center", "right", "justify"] as const).find((a) => e.isActive({ textAlign: a })) ?? "left",
      bullet: e.isActive("bulletList"), ordered: e.isActive("orderedList"), quote: e.isActive("blockquote"),
      canIndent: e.can().sinkListItem("listItem"), canOutdent: e.can().liftListItem("listItem"),
      link: e.isActive("link"), table: e.isActive("table"),
      textColor: (e.getAttributes("textStyle").color as string | undefined) ?? null,
      highlight: (e.getAttributes("highlight").color as string | undefined) ?? null,
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
      // Gambar disisipkan dengan kotak keterangan (caption) seperti editor dashboard
      chain().setFigure({ src: url, alt: file.name.replace(/\.[^.]+$/, ""), align: "center" }).run();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah gambar.");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const alignButton = (value: "left" | "center" | "right" | "justify", icon: string, label: string) => (
    <ToolButton icon={icon} label={label} active={state.align === value}
      onClick={() => (value === "left" ? chain().unsetTextAlign().run() : chain().setTextAlign(value).run())} />
  );

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
        <ToolButton icon="superscript" label="Superskrip (mis. catatan¹)" active={state.superscript} onClick={() => chain().toggleSuperscript().run()} />
        <ToolButton icon="subscript" label="Subskrip (mis. H₂O)" active={state.subscript} onClick={() => chain().toggleSubscript().run()} />
        <ColorPicker kind="text" current={state.textColor} colors={TEXT_COLORS}
          onPick={(c) => chain().setColor(c).run()} onClear={() => chain().unsetColor().run()} />
        <ColorPicker kind="highlight" current={state.highlight} colors={HIGHLIGHT_COLORS}
          onPick={(c) => chain().setHighlight({ color: c }).run()} onClear={() => chain().unsetHighlight().run()} />
        <Divider />
        {alignButton("left", "alignLeft", "Rata kiri")}
        {alignButton("center", "alignCenter", "Rata tengah")}
        {alignButton("right", "alignRight", "Rata kanan")}
        {alignButton("justify", "alignJustify", "Rata kiri-kanan")}
        <Divider />
        <ToolButton icon="bullet" label="Daftar berbutir" active={state.bullet} onClick={() => chain().toggleBulletList().run()} />
        <ToolButton icon="ordered" label="Daftar bernomor" active={state.ordered} onClick={() => chain().toggleOrderedList().run()} />
        <ToolButton icon="indent" label="Masukkan ke dalam (Tab)" disabled={!state.canIndent} onClick={() => chain().sinkListItem("listItem").run()} />
        <ToolButton icon="outdent" label="Keluarkan (Shift+Tab)" disabled={!state.canOutdent} onClick={() => chain().liftListItem("listItem").run()} />
        <ToolButton icon="quote" label="Kutipan" active={state.quote} onClick={() => chain().toggleBlockquote().run()} />
        <ToolButton icon="code" label="Kode dalam baris" active={state.code} onClick={() => chain().toggleCode().run()} />
        <ToolButton icon="codeBlock" label="Blok kode" active={state.codeBlock} onClick={() => chain().toggleCodeBlock().run()} />
        <ToolButton icon="hr" label="Garis pemisah" onClick={() => chain().setHorizontalRule().run()} />
        <Divider />
        <ToolButton icon="link" label="Tautan" active={state.link} onClick={openLink} />
        <ToolButton icon="unlink" label="Hapus tautan" disabled={!state.link} onClick={() => chain().extendMarkRange("link").unsetLink().run()} />
        <ToolButton icon="image" label={uploading ? "Mengunggah gambar…" : "Sisipkan gambar dengan keterangan"} disabled={uploading} onClick={() => fileRef.current?.click()} />
        <ToolButton icon="table" label="Sisipkan tabel" active={state.table} onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
        <Divider />
        <ToolButton icon="clear" label="Hapus format" onClick={() => chain().unsetAllMarks().clearNodes().run()} />
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
          <button type="button" style={textButton} onClick={() => chain().toggleHeaderRow().run()}>Baris judul</button>
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
