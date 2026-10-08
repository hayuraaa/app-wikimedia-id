"use client";

import { useEffect, useRef, useState } from "react";
import { Node, mergeAttributes, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from "@tiptap/react";
import { COLOR } from "./styles";

/**
 * Gambar dengan keterangan (caption). Output HTML sama dengan editor dashboard
 * (resources/js/Extensions/FigureExtension.js) agar artikel bisa diedit di kedua tempat:
 *   <figure data-type="image" data-align="center"><img src alt style="width: 400px"><figcaption><p>…</p></figcaption></figure>
 */

type Align = "left" | "center" | "right";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    figure: { setFigure: (attrs: { src: string; alt?: string; align?: Align }) => ReturnType };
  }
}

const MIN_WIDTH = 80;

function FigureView({ node, updateAttributes, deleteNode, editor }: ReactNodeViewProps) {
  const { src, alt, align, width } = node.attrs as { src: string; alt: string | null; align: Align; width: string | null };
  const figureRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [selected, setSelected] = useState(false);
  // Lebar sementara selama diseret; di luar itu memakai atribut width
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const liveWidth = dragWidth ?? (width ? parseInt(width, 10) : null);
  const editable = editor.isEditable;

  // Klik di luar gambar: sembunyikan toolbar gambar
  useEffect(() => {
    if (!selected) return;
    const onDown = (e: MouseEvent) => {
      if (figureRef.current && !figureRef.current.contains(e.target as globalThis.Node)) setSelected(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [selected]);

  // Seret handle di pojok untuk mengubah lebar; sign -1 = handle kiri
  const startResize = (sign: 1 | -1) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = imgRef.current?.offsetWidth ?? 300;
    const maxWidth = figureRef.current?.parentElement?.offsetWidth ?? 800;
    let current = startWidth;

    const onMove = (ev: MouseEvent) => {
      current = Math.max(MIN_WIDTH, Math.min(startWidth + (ev.clientX - startX) * sign, maxWidth));
      setDragWidth(current);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      updateAttributes({ width: `${Math.round(current)}px` });
      setDragWidth(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const justify = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
  const handle = (pos: React.CSSProperties, cursor: string, sign: 1 | -1) => (
    <span onMouseDown={startResize(sign)} title="Seret untuk mengubah ukuran" contentEditable={false}
      style={{ position: "absolute", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#fff", border: `2px solid ${COLOR.primary}`, boxShadow: "0 1px 3px rgba(0,0,0,0.25)", cursor, zIndex: 3, ...pos }} />
  );
  const toolButton = (active: boolean): React.CSSProperties => ({
    height: "28px", minWidth: "28px", padding: "0 7px", border: "none", borderRadius: "3px", cursor: "pointer",
    fontSize: "11.5px", fontWeight: 600, fontFamily: "var(--font-montserrat)",
    backgroundColor: active ? "rgba(12,87,168,0.12)" : "transparent", color: active ? COLOR.primary : "#2a2826",
  });

  return (
    <NodeViewWrapper className="writer-figure" style={{ display: "flex", justifyContent: justify, margin: "1.6em 0" }}>
      <figure ref={figureRef} style={{ position: "relative", margin: 0, maxWidth: "100%", width: liveWidth ? `${liveWidth}px` : undefined }}>
        {/* Wadah gambar: toolbar & titik ubah-ukuran menempel ke gambar, bukan ke caption */}
        <div style={{ position: "relative" }}>
        {editable && selected && (
          <div contentEditable={false} style={{ position: "absolute", top: "10px", right: "10px", zIndex: 4, display: "flex", alignItems: "center", gap: "2px", padding: "4px", backgroundColor: "#fff", border: `1px solid ${COLOR.border}`, borderRadius: "6px", boxShadow: "0 4px 14px rgba(0,0,0,0.12)", whiteSpace: "nowrap" }}>
            {(["left", "center", "right"] as Align[]).map((a) => (
              <button key={a} type="button" style={toolButton(align === a)} onClick={() => updateAttributes({ align: a })}
                title={a === "left" ? "Rata kiri" : a === "center" ? "Rata tengah" : "Rata kanan"}>
                {a === "left" ? "Kiri" : a === "center" ? "Tengah" : "Kanan"}
              </button>
            ))}
            {width && <button type="button" style={toolButton(false)} onClick={() => updateAttributes({ width: null })} title="Kembalikan ukuran asli">Ukuran asli</button>}
            <button type="button" style={{ ...toolButton(false), color: COLOR.danger }} onClick={deleteNode} title="Hapus gambar">Hapus</button>
          </div>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={src} alt={alt ?? ""} draggable={false}
          onClick={() => editable && setSelected(true)}
          style={{ display: "block", width: liveWidth ? `${liveWidth}px` : "100%", maxWidth: "100%", height: "auto", margin: 0, cursor: editable ? "pointer" : "default",
            outline: selected ? `3px solid rgba(12,87,168,0.45)` : "none", outlineOffset: "2px" }} />

        {editable && selected && (
          <>
            {handle({ top: "-7px", left: "-7px" }, "nwse-resize", -1)}
            {handle({ top: "-7px", right: "-7px" }, "nesw-resize", 1)}
            {handle({ bottom: "-7px", left: "-7px" }, "nesw-resize", -1)}
            {handle({ bottom: "-7px", right: "-7px" }, "nwse-resize", 1)}
          </>
        )}
        </div>

        {editable && selected && (
          <div contentEditable={false} style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
            <label style={{ fontSize: "10.5px", fontWeight: 700, color: COLOR.muted, fontFamily: "var(--font-montserrat)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>TEKS ALT</label>
            <input type="text" value={alt ?? ""} maxLength={200} placeholder="Deskripsi gambar untuk pembaca layar"
              onChange={(e) => updateAttributes({ alt: e.target.value })}
              style={{ flex: 1, minWidth: 0, padding: "5px 8px", fontSize: "12px", fontFamily: "var(--font-montserrat)", border: `1px solid ${COLOR.border}`, borderRadius: "3px" }} />
          </div>
        )}

        <figcaption>
          <NodeViewContent />
        </figcaption>
      </figure>
    </NodeViewWrapper>
  );
}

export const Figure = Node.create({
  name: "figure",
  group: "block",
  content: "paragraph+",
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      align: { default: "left" },
      width: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        // figure dari editor dashboard / editor ini; caption diambil dari <figcaption>
        tag: "figure",
        getAttrs: (element) => {
          const img = element.querySelector("img");
          if (!img?.getAttribute("src")) return false;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            align: element.getAttribute("data-align") || "left",
            width: img.style.width || (img.getAttribute("width") ? `${img.getAttribute("width")}px` : null),
          };
        },
        contentElement: (element) => element.querySelector("figcaption") ?? document.createElement("figcaption"),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const img: Record<string, string> = { src: node.attrs.src, alt: node.attrs.alt || "" };
    if (node.attrs.width) img.style = `width: ${node.attrs.width}`;
    return [
      "figure",
      mergeAttributes(HTMLAttributes, { "data-type": "image", "data-align": node.attrs.align }),
      ["img", img],
      ["figcaption", 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureView);
  },

  addCommands() {
    return {
      setFigure: (attrs) => ({ commands }) =>
        commands.insertContent({ type: this.name, attrs: { align: "left", ...attrs }, content: [{ type: "paragraph" }] }),
    };
  },
});
