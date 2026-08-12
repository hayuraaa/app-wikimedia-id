"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "model"; text: string };

const SUGGESTIONS = [
  "Apa itu Wikimedia Indonesia?",
  "Bagaimana cara mendaftar WikiLatih?",
  "Bagaimana cara ikut kopdar?",
  "Bagaimana cara menjadi sukarelawan?",
];

const MAX_HISTORY = 20;

// sessionStorage: bertahan selama tab masih terbuka, hilang saat ditutup —
// jadi refresh halaman tidak menghapus percakapan yang sedang berlangsung.
const SESSION_KEY = "wmid_chat_session";

type StoredSession = { messages: Message[] };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Muat sesi tersimpan sekali saat komponen dipasang di klien.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const stored: StoredSession = JSON.parse(raw);
        if (Array.isArray(stored.messages)) setMessages(stored.messages);
      }
    } catch {
      // abaikan sessionStorage yang rusak/tidak tersedia
    } finally {
      setHydrated(true);
    }
  }, []);

  // Simpan sesi setiap kali percakapan berubah, setelah hidrasi awal selesai.
  useEffect(() => {
    if (!hydrated) return;
    try {
      const stored: StoredSession = { messages };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(stored));
    } catch {
      // abaikan bila sessionStorage penuh/tidak tersedia
    }
  }, [messages, hydrated]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    const history: Message[] = [...messages, { role: "user", text: trimmed }];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-MAX_HISTORY) }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setMessages((prev) => [
          ...prev,
          { role: "model", text: err?.error ?? "Maaf, terjadi gangguan. Silakan coba lagi." },
        ]);
        return;
      }

      setMessages((prev) => [...prev, { role: "model", text: "" }]);
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, text: last.text + chunk };
          return next;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Maaf, koneksi terputus. Silakan coba lagi." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Panel chat */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "92px",
            right: "20px",
            width: expanded ? "min(600px, calc(100vw - 40px))" : "min(380px, calc(100vw - 40px))",
            height: expanded ? "min(700px, calc(100vh - 110px))" : "min(560px, calc(100vh - 130px))",
            backgroundColor: "#fff",
            border: "1px solid #e5e2dd",
            borderRadius: "8px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
            fontFamily: "var(--font-montserrat)",
            animation: "chatSlideUp 0.25s cubic-bezier(0.22,1,0.36,1)",
            transition: "width 0.25s cubic-bezier(0.22,1,0.36,1), height 0.25s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "10px 16px",
              background: "linear-gradient(135deg, #0a4d99 0%, #0C57A8 60%, #1468c0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    border: "2.5px solid rgba(255,255,255,0.8)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Neutral_Baby_Globe-1.gif"
                    alt="WMID"
                    style={{ width: "54px", height: "54px", objectFit: "contain" }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "1px",
                    right: "1px",
                    width: "13px",
                    height: "13px",
                    borderRadius: "50%",
                    backgroundColor: "#4CAF50",
                    border: "2px solid #fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
              {/* Teks */}
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>
                  Tanya Baby Globe
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#4CAF50",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)" }}>
                    Online · siap membantu
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "Perkecil chat" : "Perbesar chat"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                }}
              >
                {expanded ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                    <path d="M4 14h6m0 0v6m0-6l-7 7M20 10h-6m0 0V4m0 6l7-7" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                    <path d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup chat"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <>
              {/* Daftar pesan */}
              <div
                ref={listRef}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  backgroundColor: "#f8f7f5",
                }}
              >
                <div style={bubbleStyle("model")}>
                  Halo, Kawan Wiki! 👋 Saya asisten virtual Wikimedia Indonesia. Silakan tanya seputar
                  program dan kegiatan kami.
                </div>

                {messages.length === 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        style={{
                          textAlign: "left",
                          fontSize: "12px",
                          fontFamily: "var(--font-montserrat)",
                          color: "#0C57A8",
                          backgroundColor: "#fff",
                          border: "1px solid rgba(12,87,168,0.25)",
                          borderRadius: "14px",
                          padding: "8px 12px",
                          cursor: "pointer",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map((m, i) => (
                  <div key={i} style={bubbleStyle(m.role)}>
                    {m.text ? (
                      m.role === "model" ? (
                        renderRichText(m.text)
                      ) : (
                        m.text
                      )
                    ) : loading && i === messages.length - 1 ? (
                      <TypingDots />
                    ) : (
                      ""
                    )}
                  </div>
                ))}

                {loading && messages[messages.length - 1]?.role === "user" && (
                  <div style={bubbleStyle("model")}>
                    <TypingDots />
                  </div>
                )}
              </div>

              {/* Input */}
              <div style={{ padding: "12px", borderTop: "1px solid #e5e2dd", backgroundColor: "#fff" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") send(input);
                    }}
                    placeholder="Tulis pertanyaan Anda…"
                    maxLength={2000}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      fontSize: "13px",
                      fontFamily: "var(--font-montserrat)",
                      border: "1px solid #e5e2dd",
                      borderRadius: "20px",
                      outline: "none",
                      color: "#0d0d0d",
                    }}
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={loading || !input.trim()}
                    aria-label="Kirim"
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      backgroundColor: loading || !input.trim() ? "#c9d7e8" : "#0C57A8",
                      border: "none",
                      cursor: loading || !input.trim() ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#a5a3a0",
                    fontFamily: "var(--font-montserrat)",
                    textAlign: "center",
                    marginTop: "8px",
                    lineHeight: 1.5,
                  }}
                >
                  Jawaban dibuat oleh AI dan bisa keliru. Untuk informasi resmi, hubungi{" "}
                  <a href="mailto:info@wikimedia.or.id" style={{ color: "#8a8885" }}>
                    info@wikimedia.or.id
                  </a>
                </div>
              </div>
          </>
        </div>
      )}

      {/* Tombol bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup chat" : "Buka chat"}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          zIndex: 9999,
          transition: "transform 0.2s",
          lineHeight: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? (
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#0C57A8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(12,87,168,0.4)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ) : (
          <div style={{ position: "relative", width: "80px", height: "80px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Neutral_Baby_Globe-1.gif"
                alt="Asisten WMID"
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
          </div>
        )}
      </button>

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingBounce {
          0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </>
  );
}

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: "4px", alignItems: "center", padding: "3px 2px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: "#a5a3a0",
            display: "inline-block",
            animation: `typingBounce 1.2s ${i * 0.15}s infinite ease-in-out`,
          }}
        />
      ))}
    </span>
  );
}

// Perender format ringan untuk balasan bot: **tebal**, *miring*,
// [teks](url), URL/domain wikimedia, dan alamat surel menjadi tautan klik.
const INLINE_RE =
  /\[([^\]]+)\]\(((?:https?:\/\/)?[^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)|(https?:\/\/[^\s<>()]+)|\b((?:[a-zA-Z0-9-]+\.)*wikimedia\.(?:or\.id|org)(?:\/[^\s<>()]*)?)/g;

const linkStyle: React.CSSProperties = {
  color: "#0C57A8",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
  fontWeight: 600,
  wordBreak: "break-all",
};

function pushUrl(nodes: React.ReactNode[], raw: string, href: string, key: number) {
  // Pisahkan tanda baca di ujung agar tidak ikut menjadi tautan
  const trail = raw.match(/[.,;:!?]+$/)?.[0] ?? "";
  const clean = trail ? raw.slice(0, -trail.length) : raw;
  const cleanHref = trail ? href.slice(0, href.length - trail.length) : href;
  nodes.push(
    <a key={key} href={cleanHref} target="_blank" rel="noopener noreferrer" style={linkStyle}>
      {clean}
    </a>
  );
  if (trail) nodes.push(trail);
}

// Pemrosesan blok: kelompokkan baris "- item" menjadi <ul> dan "1. item"
// menjadi <ol> agar daftar rapi dengan indentasi gantung; sisanya teks biasa.
const BULLET_RE = /^\s*[-*•]\s+(.*)/;
const NUMBER_RE = /^\s*\d+[.)]\s+(.*)/;

function renderRichText(text: string): React.ReactNode[] {
  const blocks: React.ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const ordered = NUMBER_RE.test(lines[i]);
    if (ordered || BULLET_RE.test(lines[i])) {
      const itemRe = ordered ? NUMBER_RE : BULLET_RE;
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(itemRe);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      const listStyle: React.CSSProperties = {
        margin: "4px 0",
        paddingLeft: "20px",
        display: "block",
        whiteSpace: "normal",
      };
      const listItems = items.map((it, j) => (
        <li key={j} style={{ marginBottom: "4px" }}>
          {renderInline(it)}
        </li>
      ));
      blocks.push(
        ordered ? (
          <ol key={key++} style={listStyle}>
            {listItems}
          </ol>
        ) : (
          <ul key={key++} style={{ ...listStyle, listStyleType: "disc" }}>
            {listItems}
          </ul>
        )
      );
    } else {
      const buf: string[] = [];
      while (i < lines.length && !BULLET_RE.test(lines[i]) && !NUMBER_RE.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      const chunk = buf.join("\n").replace(/^\n+/, "").replace(/\n+$/, "");
      if (chunk) blocks.push(<span key={key++}>{renderInline(chunk)}</span>);
    }
  }
  return blocks;
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    if (m.index! > last) nodes.push(text.slice(last, m.index));
    const [, mdText, mdUrl, bold, italic, email, url, domain] = m;
    if (mdText && mdUrl) {
      // Model kadang menulis tautan tanpa skema (mis. "id.wikimedia.org/...")
      const href = /^https?:\/\//.test(mdUrl) ? mdUrl : `https://${mdUrl}`;
      nodes.push(
        <a key={key++} href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          {mdText}
        </a>
      );
    } else if (bold !== undefined) {
      nodes.push(<strong key={key++}>{bold}</strong>);
    } else if (italic !== undefined) {
      nodes.push(<em key={key++}>{italic}</em>);
    } else if (email !== undefined) {
      nodes.push(
        <a key={key++} href={`mailto:${email}`} style={linkStyle}>
          {email}
        </a>
      );
    } else if (url !== undefined) {
      pushUrl(nodes, url, url, key++);
      key++;
    } else if (domain !== undefined) {
      pushUrl(nodes, domain, `https://${domain}`, key++);
      key++;
    }
    last = m.index! + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function bubbleStyle(role: "user" | "model"): React.CSSProperties {
  const isUser = role === "user";
  return {
    alignSelf: isUser ? "flex-end" : "flex-start",
    maxWidth: "85%",
    padding: "10px 14px",
    borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
    backgroundColor: isUser ? "#0C57A8" : "#fff",
    color: isUser ? "#fff" : "#2a2a28",
    border: isUser ? "none" : "1px solid #e5e2dd",
    fontSize: "13px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };
}
