"use client";

import { useEffect, useRef, useState } from "react";
import { Node, mergeAttributes, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from "@tiptap/react";
import { COLOR } from "./styles";

/**
 * Gambar dengan keterangan (caption). Struktur HTML sama dengan editor dashboard
 * (resources/js/Extensions/FigureExtension.js) agar artikel bisa diedit di kedua tempat.
 * Di editor penulis, gambar selalu selebar kolom dan rata tengah (tanpa atur perataan/ukuran):
 *   <figure data-type="image" data-align="center"><img src alt><figcaption><p>…</p></figcaption></figure>
 */

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    figure: { setFigure: (attrs: { src: string; alt?: string }) => ReturnType };
  }
}

function FigureView({ node, updateAttributes, deleteNode, editor }: ReactNodeViewProps) {
  const { src, alt } = node.attrs as { src: string; alt: string | null };
  const figureRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(false);
  const editable = editor.isEditable;

  // Klik di luar gambar: sembunyikan pengaturan gambar
  useEffect(() => {
    if (!selected) return;
    const onDown = (e: MouseEvent) => {
      if (figureRef.current && !figureRef.current.contains(e.target as globalThis.Node)) setSelected(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [selected]);

  return (
    <NodeViewWrapper className="writer-figure" style={{ margin: "1.6em 0" }}>
      <figure ref={figureRef} style={{ margin: 0, width: "100%" }}>
        <div style={{ position: "relative" }}>
          {editable && selected && (
            <button type="button" contentEditable={false} onClick={deleteNode} title="Hapus gambar"
              style={{ position: "absolute", top: "10px", right: "10px", zIndex: 4, height: "30px", padding: "0 12px", border: `1px solid ${COLOR.border}`, borderRadius: "4px", backgroundColor: "#fff", color: COLOR.danger, cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-montserrat)", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
              Hapus gambar
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt ?? ""} draggable={false}
            onClick={() => editable && setSelected(true)}
            style={{ display: "block", width: "100%", height: "auto", margin: 0, cursor: editable ? "pointer" : "default",
              outline: selected ? "3px solid rgba(12,87,168,0.45)" : "none", outlineOffset: "2px" }} />
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
    // src & alt ditulis manual ke <img> di renderHTML, bukan ke <figure>
    return {
      src: { default: null, renderHTML: () => ({}) },
      alt: { default: null, renderHTML: () => ({}) },
    };
  },

  parseHTML() {
    return [
      {
        // figure dari editor dashboard / editor ini; caption diambil dari <figcaption>.
        // Perataan & lebar dari dashboard diabaikan: di sini gambar selalu penuh dan rata tengah.
        tag: "figure",
        getAttrs: (element) => {
          const img = element.querySelector("img");
          if (!img?.getAttribute("src")) return false;
          return { src: img.getAttribute("src"), alt: img.getAttribute("alt") };
        },
        contentElement: (element) => element.querySelector("figcaption") ?? document.createElement("figcaption"),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes(HTMLAttributes, { "data-type": "image", "data-align": "center" }),
      ["img", { src: node.attrs.src, alt: node.attrs.alt || "" }],
      ["figcaption", 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureView);
  },

  addCommands() {
    return {
      setFigure: (attrs) => ({ commands }) =>
        commands.insertContent({ type: this.name, attrs, content: [{ type: "paragraph" }] }),
    };
  },
});
