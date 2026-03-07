"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventItem = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  jenis_acara: string;
  status: string;
  links: { id: number; judul_link: string; url: string }[];
};

type EventStatus = "berlangsung" | "mendatang" | "selesai";
type ViewMode = "list" | "calendar";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS_ID = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const PER_PAGE = 15;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getStatus = (ev: EventItem): EventStatus => {
  const now = new Date();
  const mulai = new Date(ev.tanggal_mulai);
  const selesai = new Date(ev.tanggal_selesai);
  if (now > selesai) return "selesai";
  if (now >= mulai && now <= selesai) return "berlangsung";
  return "mendatang";
};

const formatTanggal = (mulai: string, selesai: string) => {
  const tMulai = new Date(mulai);
  const tSelesai = new Date(selesai);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  if (tMulai.toDateString() === tSelesai.toDateString()) return tMulai.toLocaleDateString("id-ID", opts);
  if (tMulai.getMonth() === tSelesai.getMonth() && tMulai.getFullYear() === tSelesai.getFullYear())
    return `${tMulai.getDate()}–${tSelesai.toLocaleDateString("id-ID", opts)}`;
  return `${tMulai.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} – ${tSelesai.toLocaleDateString("id-ID", opts)}`;
};

const statusCfg = {
  berlangsung: { label: "● Berlangsung", color: "#16a34a", bg: "rgba(22,163,74,0.1)",  border: "#16a34a" },
  mendatang:   { label: "Mendatang",     color: "#1e4d7b", bg: "rgba(30,77,123,0.1)",  border: "#1e4d7b" },
  selesai:     { label: "Selesai",       color: "#9a9690", bg: "rgba(0,0,0,0.05)",     border: "#c5c3bf" },
};

const jenisCfg: Record<string, { label: string; color: string }> = {
  daring: { label: "Daring", color: "#2a6399" },
  luring: { label: "Luring", color: "#784e14" },
  hybrid: { label: "Hybrid", color: "#502878" },
};

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({ ev }: { ev: EventItem }) {
  const router = useRouter();
  const status = getStatus(ev);
  const cfg = statusCfg[status];
  const jenis = jenisCfg[ev.jenis_acara] ?? { label: ev.jenis_acara, color: "#5c5a57" };
  const mulai = new Date(ev.tanggal_mulai);

  return (
    <div onClick={() => router.push(`/acara/${ev.slug}`)} style={{ textDecoration: "none", display: "block", cursor: "pointer" }}>
      <div
        style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderLeft: `3px solid ${cfg.border}`, borderRadius: "4px", padding: "18px 22px", display: "flex", gap: "18px", alignItems: "flex-start", transition: "all 0.2s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateX(4px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
      >
        <div style={{ flexShrink: 0, textAlign: "center", width: "42px" }}>
          <div style={{ fontSize: "20px", fontWeight: "700", color: cfg.color, fontFamily: "var(--font-serif)", lineHeight: 1 }}>{mulai.getDate()}</div>
          <div style={{ fontSize: "9px", fontWeight: "700", color: "#9a9690", textTransform: "uppercase" as const, letterSpacing: "0.06em", fontFamily: "var(--font-sans)", marginTop: "2px" }}>{MONTHS_ID[mulai.getMonth()].slice(0, 3)}</div>
          <div style={{ fontSize: "9px", color: "#c5c3bf", fontFamily: "var(--font-sans)", marginTop: "1px" }}>{mulai.getFullYear()}</div>
        </div>
        <div style={{ width: "1px", backgroundColor: "#e5e2dd", alignSelf: "stretch", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" as const, marginBottom: "5px" }}>
            <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase" as const, color: cfg.color, backgroundColor: cfg.bg, padding: "2px 8px", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>{cfg.label}</span>
            <span style={{ fontSize: "9px", fontWeight: "600", textTransform: "uppercase" as const, color: jenis.color, backgroundColor: `${jenis.color}18`, padding: "2px 8px", borderRadius: "2px", fontFamily: "var(--font-sans)" }}>{jenis.label}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {ev.lokasi}
            </span>
          </div>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: status === "selesai" ? "#5c5a57" : "#0d0d0d", fontFamily: "var(--font-serif)", lineHeight: "1.4", margin: "0 0 3px" }}>{ev.judul}</h3>
          <p style={{ fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)", margin: "0 0 6px" }}>{formatTanggal(ev.tanggal_mulai, ev.tanggal_selesai)}</p>
          <p style={{ fontSize: "12px", color: "#7a7874", fontFamily: "var(--font-sans)", lineHeight: "1.6", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
            {ev.deskripsi.replace(/\n/g, " ").trim()}
          </p>
          {ev.links.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const, marginTop: "8px" }}>
              {ev.links.map((l) => (
                <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: "10px", fontWeight: "600", color: "#1e4d7b", backgroundColor: "rgba(30,77,123,0.08)", padding: "2px 10px", borderRadius: "2px", textDecoration: "none", fontFamily: "var(--font-sans)", display: "inline-flex", alignItems: "center", gap: "4px", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(30,77,123,0.18)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(30,77,123,0.08)"; }}>
                  {l.judul_link}
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              ))}
            </div>
          )}
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c5c3bf" strokeWidth="2" style={{ flexShrink: 0, marginTop: "4px" }}><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function EventSkeleton() {
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderLeft: "3px solid #e5e2dd", borderRadius: "4px", padding: "18px 22px", display: "flex", gap: "18px" }}>
      <div style={{ flexShrink: 0, width: "42px", display: "flex", flexDirection: "column", gap: "4px" }}>
        <div className="skeleton" style={{ height: "20px", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "10px", borderRadius: "2px" }} />
      </div>
      <div style={{ width: "1px", backgroundColor: "#e5e2dd", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "7px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div className="skeleton" style={{ height: "16px", width: "80px", borderRadius: "2px" }} />
          <div className="skeleton" style={{ height: "16px", width: "60px", borderRadius: "2px" }} />
        </div>
        <div className="skeleton" style={{ height: "16px", borderRadius: "2px", width: "65%" }} />
        <div className="skeleton" style={{ height: "12px", borderRadius: "2px" }} />
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const pages: (number | "...")[] = [];
  if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); }
  else {
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }
  const btn = (active: boolean, disabled = false): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "center", minWidth: "36px", height: "36px", padding: "0 6px",
    borderRadius: "3px", border: `1px solid ${active ? "#8b1a2a" : "#e5e2dd"}`,
    backgroundColor: active ? "#8b1a2a" : "#fff", color: disabled ? "#c5c3bf" : active ? "#fff" : "#3a3a3a",
    fontSize: "13px", fontWeight: active ? "700" : "500", fontFamily: "var(--font-sans)",
    cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", paddingTop: "32px" }}>
      <button style={btn(false, current === 1)} disabled={current === 1} onClick={() => onChange(current - 1)}
        onMouseEnter={(e) => { if (current !== 1) (e.currentTarget as HTMLElement).style.borderColor = "#8b1a2a"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      {pages.map((p, i) => p === "..." ? (
        <span key={`e${i}`} style={{ minWidth: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>···</span>
      ) : (
        <button key={p} style={btn(p === current)} onClick={() => onChange(p as number)}
          onMouseEnter={(e) => { if (p !== current) { (e.currentTarget as HTMLElement).style.borderColor = "#8b1a2a"; (e.currentTarget as HTMLElement).style.color = "#8b1a2a"; } }}
          onMouseLeave={(e) => { if (p !== current) { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; (e.currentTarget as HTMLElement).style.color = "#3a3a3a"; } }}>
          {p}
        </button>
      ))}
      <button style={btn(false, current === total)} disabled={current === total} onClick={() => onChange(current + 1)}
        onMouseEnter={(e) => { if (current !== total) (e.currentTarget as HTMLElement).style.borderColor = "#8b1a2a"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  );
}

// ─── Calendar View ────────────────────────────────────────────────────────────

function CalendarView({ events }: { events: EventItem[] }) {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  // Map: dayNum → array of events active on that day
  const eventsByDate = useMemo(() => {
    const map = new Map<number, EventItem[]>();
    for (const ev of events) {
      const mulai = new Date(ev.tanggal_mulai);
      const selesai = new Date(ev.tanggal_selesai);
      const cur = new Date(mulai);
      while (cur <= selesai) {
        if (cur.getFullYear() === calYear && cur.getMonth() === calMonth) {
          const d = cur.getDate();
          if (!map.has(d)) map.set(d, []);
          if (!map.get(d)!.find((e) => e.id === ev.id)) map.get(d)!.push(ev);
        }
        cur.setDate(cur.getDate() + 1);
      }
    }
    return map;
  }, [events, calYear, calMonth]);

  // For each event, compute which days in this month it spans
  // Returns: Map<eventId, { startDay, endDay, isMultiDay }>
  const eventRanges = useMemo(() => {
    const map = new Map<number, { startDay: number; endDay: number; isMultiDay: boolean }>();
    for (const ev of events) {
      const mulai = new Date(ev.tanggal_mulai);
      const selesai = new Date(ev.tanggal_selesai);
      if (mulai.toDateString() === selesai.toDateString()) {
        // single day
        if (mulai.getFullYear() === calYear && mulai.getMonth() === calMonth) {
          map.set(ev.id, { startDay: mulai.getDate(), endDay: mulai.getDate(), isMultiDay: false });
        }
      } else {
        // multi-day: clamp to current month
        const monthStart = new Date(calYear, calMonth, 1);
        const monthEnd = new Date(calYear, calMonth + 1, 0);
        const clampedStart = mulai < monthStart ? monthStart : mulai;
        const clampedEnd = selesai > monthEnd ? monthEnd : selesai;
        if (clampedStart <= monthEnd && clampedEnd >= monthStart) {
          map.set(ev.id, {
            startDay: clampedStart.getDate(),
            endDay: clampedEnd.getDate(),
            isMultiDay: true,
          });
        }
      }
    }
    return map;
  }, [events, calYear, calMonth]);

  const selectedEvents = selectedDay ? (eventsByDate.get(selectedDay) ?? []) : [];

  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1); setSelectedDay(null); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1); setSelectedDay(null); };

  const monthEventCount = useMemo(() => {
    const seen = new Set<number>();
    for (const evs of eventsByDate.values()) for (const ev of evs) seen.add(ev.id);
    return seen.size;
  }, [eventsByDate]);

  // Get highlight ranges for the calendar grid
  // For a given cell (dayNum), determine range highlight info:
  // - which events span this day (for multi-day)
  // - is it start, middle, end of a range
  type RangeInfo = {
    color: string;
    isStart: boolean;
    isEnd: boolean;
    isMiddle: boolean;
    eventName: string;
  };

  const getRangeInfos = (dayNum: number): RangeInfo[] => {
    const infos: RangeInfo[] = [];
    for (const ev of events) {
      const range = eventRanges.get(ev.id);
      if (!range) continue;
      if (dayNum >= range.startDay && dayNum <= range.endDay) {
        const status = getStatus(ev);
        const color = statusCfg[status].border;
        if (range.isMultiDay) {
          infos.push({
            color,
            isStart: dayNum === range.startDay,
            isEnd: dayNum === range.endDay,
            isMiddle: dayNum > range.startDay && dayNum < range.endDay,
            eventName: ev.judul,
          });
        }
      }
    }
    return infos;
  };

  // Get single-day events for a given dayNum (non-multi-day)
  const getSingleDayEvents = (dayNum: number): EventItem[] => {
    return (eventsByDate.get(dayNum) ?? []).filter((ev) => {
      const range = eventRanges.get(ev.id);
      return range && !range.isMultiDay;
    });
  };


  // ── Mobile: compact dot-based calendar ──────────────────────────────────────
  if (isMobile) {
    const monthEventsFlat = Array.from(eventsByDate.entries())
      .sort((a: [number, EventItem[]], b: [number, EventItem[]]) => a[0] - b[0])
      .flatMap(([, evs]: [number, EventItem[]]) => evs)
      .filter((ev: EventItem, idx: number, arr: EventItem[]) => arr.findIndex((e: EventItem) => e.id === ev.id) === idx);

    return (
      <div>
        {/* Calendar card */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
          {/* Nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: "1px solid #e5e2dd" }}>
            <button onClick={prevMonth} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", border: "1px solid #e5e2dd", borderRadius: "3px", background: "#fff", cursor: "pointer", color: "#3a3a3a" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)" }}>{MONTHS_ID[calMonth]} {calYear}</div>
              <div style={{ fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)", marginTop: "1px" }}>{monthEventCount} acara bulan ini</div>
            </div>
            <button onClick={nextMonth} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", border: "1px solid #e5e2dd", borderRadius: "3px", background: "#fff", cursor: "pointer", color: "#3a3a3a" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #e5e2dd" }}>
            {DAYS_ID.map((d, i) => (
              <div key={d} style={{ padding: "6px 2px", textAlign: "center", fontSize: "9px", fontWeight: "700", letterSpacing: "0.04em", textTransform: "uppercase" as const, color: i === 0 ? "#8b1a2a" : "#9a9690", fontFamily: "var(--font-sans)" }}>{d}</div>
            ))}
          </div>
          {/* Cells — mobile: angka + dot indicator */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {Array.from({ length: totalCells }).map((_, i) => {
              const dayNum = i - firstDay + 1;
              const isValid = dayNum >= 1 && dayNum <= daysInMonth;
              const isToday = isValid && calYear === today.getFullYear() && calMonth === today.getMonth() && dayNum === today.getDate();
              const isSunday = i % 7 === 0;
              const dayEvs = isValid ? (eventsByDate.get(dayNum) ?? []) : [];
              const hasEvs = dayEvs.length > 0;
              const isSelected = selectedDay === dayNum && isValid;
              const firstEvColor = hasEvs ? statusCfg[getStatus(dayEvs[0])].border : null;
              const dateColor = isSelected ? "#fff"
                : hasEvs ? firstEvColor!
                : isToday ? "#1e4d7b"
                : isSunday ? "#c0392b"
                : "#3a3a3a";
              return (
                <div key={i}
                  onClick={() => { if (isValid && hasEvs) setSelectedDay(isSelected ? null : dayNum); }}
                  style={{
                    height: "46px",
                    borderRight: (i + 1) % 7 !== 0 ? "1px solid #f0eeec" : "none",
                    borderBottom: i < totalCells - 7 ? "1px solid #f0eeec" : "none",
                    backgroundColor: isSelected ? "#fef2f4" : isToday ? "rgba(30,77,123,0.03)" : "#fff",
                    cursor: isValid && hasEvs ? "pointer" : "default",
                    display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "3px",
                  }}
                >
                  {isValid && (
                    <>
                      <span style={{
                        fontSize: "13px", fontWeight: hasEvs || isToday ? "700" : "400",
                        color: dateColor,
                        width: "28px", height: "28px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "50%", fontFamily: "var(--font-sans)",
                        backgroundColor: isSelected ? "#8b1a2a"
                          : isToday && !hasEvs ? "rgba(30,77,123,0.12)"
                          : hasEvs ? `${firstEvColor}18`
                          : "transparent",
                      }}>
                        {dayNum}
                      </span>
                      {hasEvs && (
                        <div style={{ display: "flex", gap: "2px" }}>
                          {dayEvs.slice(0, 3).map((ev: EventItem, idx: number) => (
                            <div key={idx} style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: isSelected ? "rgba(139,26,42,0.5)" : statusCfg[getStatus(ev)].border }} />
                          ))}
                          {dayEvs.length > 3 && <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#c5c3bf" }} />}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend mobile */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const, marginBottom: "14px", padding: "8px 12px", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px" }}>
          {Object.entries(statusCfg).map(([key, cfg]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: cfg.border }} />
              <span style={{ fontSize: "10px", color: "#5c5a57", fontFamily: "var(--font-sans)" }}>{cfg.label.replace("● ", "")}</span>
            </div>
          ))}
        </div>

        {/* Selected day panel */}
        {selectedDay !== null && selectedEvents.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", paddingBottom: "8px", borderBottom: "2px solid #e5e2dd" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#8b1a2a", fontFamily: "var(--font-serif)" }}>
                {selectedDay} {MONTHS_ID[calMonth]} {calYear}
              </span>
              <span style={{ fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>· {selectedEvents.length} acara</span>
              <button onClick={() => setSelectedDay(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9a9690", padding: "4px", display: "flex" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {selectedEvents.map((ev) => <EventCard key={ev.id} ev={ev} />)}
            </div>
          </div>
        )}

        {/* Daftar acara bulan ini (kalau tidak ada hari yang dipilih) */}
        {selectedDay === null && monthEventCount === 0 && (
          <div style={{ padding: "24px", textAlign: "center", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px" }}>
            <p style={{ fontSize: "13px", color: "#9a9690", fontFamily: "var(--font-sans)", margin: 0 }}>Tidak ada acara di {MONTHS_ID[calMonth]} {calYear}.</p>
          </div>
        )}
        {selectedDay === null && monthEventCount > 0 && (
          <div>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#9a9690", letterSpacing: "0.08em", textTransform: "uppercase" as const, fontFamily: "var(--font-sans)", marginBottom: "8px" }}>
              Acara {MONTHS_ID[calMonth]} {calYear}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {monthEventsFlat.map((ev: EventItem) => <EventCard key={ev.id} ev={ev} />)}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Desktop calendar ─────────────────────────────────────────────────────────

  return (
    <div>
      {/* Calendar card */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden", marginBottom: "16px" }}>
        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e5e2dd" }}>
          <button onClick={prevMonth}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", border: "1px solid #e5e2dd", borderRadius: "3px", background: "#fff", cursor: "pointer", transition: "all 0.15s", color: "#3a3a3a" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#8b1a2a"; (e.currentTarget as HTMLElement).style.color = "#8b1a2a"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; (e.currentTarget as HTMLElement).style.color = "#3a3a3a"; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)" }}>{MONTHS_ID[calMonth]} {calYear}</div>
            <div style={{ fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)", marginTop: "1px" }}>{monthEventCount} acara bulan ini</div>
          </div>
          <button onClick={nextMonth}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", border: "1px solid #e5e2dd", borderRadius: "3px", background: "#fff", cursor: "pointer", transition: "all 0.15s", color: "#3a3a3a" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#8b1a2a"; (e.currentTarget as HTMLElement).style.color = "#8b1a2a"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; (e.currentTarget as HTMLElement).style.color = "#3a3a3a"; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #e5e2dd" }}>
          {DAYS_ID.map((d, i) => (
            <div key={d} style={{ padding: "8px 4px", textAlign: "center", fontSize: "10px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: i === 0 ? "#8b1a2a" : "#9a9690", fontFamily: "var(--font-sans)" }}>{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {Array.from({ length: totalCells }).map((_, i) => {
            const dayNum = i - firstDay + 1;
            const isValid = dayNum >= 1 && dayNum <= daysInMonth;
            const isToday = isValid && calYear === today.getFullYear() && calMonth === today.getMonth() && dayNum === today.getDate();
            const isSunday = i % 7 === 0;
            const dayEvs = isValid ? (eventsByDate.get(dayNum) ?? []) : [];
            const hasEvs = dayEvs.length > 0;
            const isSelected = selectedDay === dayNum && isValid;

            const rangeInfos = isValid ? getRangeInfos(dayNum) : [];
            const singleEvs = isValid ? getSingleDayEvents(dayNum) : [];

            // For date number color: pick first event's status color if any events
            const dateColor = hasEvs
              ? statusCfg[getStatus(dayEvs[0])].border
              : isSelected
                ? "#8b1a2a"
                : isToday
                  ? "#1e4d7b"
                  : isSunday
                    ? "#c0392b"
                    : "#3a3a3a";

            // Column index (0-6) for range highlight edge rounding
            const colIdx = i % 7;

            return (
              <div key={i}
                onClick={() => { if (isValid && hasEvs) setSelectedDay(isSelected ? null : dayNum); }}
                style={{
                  minHeight: "80px",
                  padding: "0",
                  borderRight: (i + 1) % 7 !== 0 ? "1px solid #f0eeec" : "none",
                  borderBottom: i < totalCells - 7 ? "1px solid #f0eeec" : "none",
                  backgroundColor: isSelected ? "#fef2f4" : isToday ? "rgba(30,77,123,0.03)" : "#fff",
                  cursor: isValid && hasEvs ? "pointer" : "default",
                  transition: "background 0.15s",
                  position: "relative" as const,
                  overflow: "visible",
                }}
                onMouseEnter={(e) => { if (isValid && hasEvs && !isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(139,26,42,0.04)"; }}
                onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = isToday ? "rgba(30,77,123,0.03)" : "#fff"; }}
              >
                {isValid && (
                  <div style={{ padding: "6px 4px 4px", display: "flex", flexDirection: "column", height: "100%", gap: "2px" }}>
                    {/* Date number */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "2px" }}>
                      <span style={{
                        fontSize: "12px",
                        fontWeight: hasEvs ? "700" : isToday ? "700" : "400",
                        color: dateColor,
                        width: "22px", height: "22px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "50%",
                        fontFamily: "var(--font-sans)",
                        backgroundColor: isToday && !hasEvs
                          ? "rgba(30,77,123,0.12)"
                          : hasEvs
                            ? `${dateColor}18`
                            : "transparent",
                        outline: isSelected ? `1.5px solid ${dateColor}` : "none",
                      }}>
                        {dayNum}
                      </span>
                    </div>

                    {/* Multi-day range bars */}
                    {rangeInfos.slice(0, 2).map((ri, idx) => (
                      <div key={idx} style={{
                        position: "relative",
                        height: "16px",
                        marginLeft: ri.isStart ? "4px" : colIdx === 0 ? "0px" : "-1px",
                        marginRight: ri.isEnd ? "4px" : colIdx === 6 ? "0px" : "-1px",
                        backgroundColor: `${ri.color}22`,
                        borderRadius: ri.isStart && ri.isEnd ? "3px"
                          : ri.isStart ? "3px 0 0 3px"
                          : ri.isEnd ? "0 3px 3px 0"
                          : "0",
                        borderLeft: ri.isStart ? `2px solid ${ri.color}` : "none",
                        borderRight: ri.isEnd ? `2px solid ${ri.color}` : "none",
                        borderTop: `1px solid ${ri.color}44`,
                        borderBottom: `1px solid ${ri.color}44`,
                        display: "flex", alignItems: "center",
                        paddingLeft: ri.isStart ? "4px" : "2px",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}>
                        {(ri.isStart || colIdx === 0) && (
                          <span style={{
                            fontSize: "8px",
                            fontWeight: "600",
                            color: ri.color,
                            fontFamily: "var(--font-sans)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            lineHeight: 1,
                            maxWidth: "100%",
                          }}>
                            {ri.eventName}
                          </span>
                        )}
                      </div>
                    ))}

                    {/* Single-day events (small labels) */}
                    {singleEvs.slice(0, 2 - rangeInfos.length).map((ev, idx) => {
                      const color = statusCfg[getStatus(ev)].border;
                      return (
                        <div key={ev.id} style={{
                          height: "16px",
                          marginLeft: "4px",
                          marginRight: "4px",
                          backgroundColor: `${color}18`,
                          borderRadius: "3px",
                          borderLeft: `2px solid ${color}`,
                          display: "flex", alignItems: "center",
                          paddingLeft: "4px",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}>
                          <span style={{
                            fontSize: "8px",
                            fontWeight: "600",
                            color,
                            fontFamily: "var(--font-sans)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            lineHeight: 1,
                          }}>
                            {ev.judul}
                          </span>
                        </div>
                      );
                    })}

                    {/* Overflow indicator */}
                    {dayEvs.length > 2 && (
                      <div style={{ paddingLeft: "6px" }}>
                        <span style={{ fontSize: "8px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>+{dayEvs.length - 2} lagi</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" as const, marginBottom: "20px", padding: "10px 14px", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px" }}>
        {Object.entries(statusCfg).map(([key, cfg]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: cfg.border }} />
            <span style={{ fontSize: "11px", color: "#5c5a57", fontFamily: "var(--font-sans)" }}>{cfg.label.replace("● ", "")}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "auto" }}>
          <span style={{ fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>Klik tanggal untuk melihat detail acara</span>
        </div>
      </div>

      {/* Selected day events */}
      {selectedDay !== null && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", paddingBottom: "10px", borderBottom: "2px solid #e5e2dd" }}>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#8b1a2a", fontFamily: "var(--font-serif)" }}>
              {selectedDay} {MONTHS_ID[calMonth]} {calYear}
            </span>
            <span style={{ fontSize: "12px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>· {selectedEvents.length} acara</span>
            <button onClick={() => setSelectedDay(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9a9690", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontFamily: "var(--font-sans)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Tutup
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {selectedEvents.map((ev) => <EventCard key={ev.id} ev={ev} />)}
          </div>
        </div>
      )}

      {selectedDay === null && monthEventCount === 0 && (
        <div style={{ padding: "32px", textAlign: "center", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px" }}>
          <p style={{ fontSize: "13px", color: "#9a9690", fontFamily: "var(--font-sans)", margin: 0 }}>Tidak ada acara di {MONTHS_ID[calMonth]} {calYear}.</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AcaraPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");

  const [filterStatus, setFilterStatus] = useState<"semua" | EventStatus>("semua");
  const [filterJenis, setFilterJenis]   = useState<"semua" | string>("semua");
  const [filterYear, setFilterYear]     = useState<number | "semua">("semua");
  const [filterMonth, setFilterMonth]   = useState<number | "semua">("semua");
  const [search, setSearch]             = useState("");
  const [searchInput, setSearchInput]   = useState("");
  const [page, setPage]                 = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const BASE = "https://dashboard.wikimedia.or.id/api/v1";

  useEffect(() => {
    fetch(`${BASE}/events?upcoming=false&per_page=500`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setEvents((json.data as EventItem[]).sort(
            (a, b) => new Date(b.tanggal_mulai).getTime() - new Date(a.tanggal_mulai).getTime()
          ));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => setSearch(searchInput.trim());

  const availableYears = useMemo(() => {
    const years = new Set(events.map((e) => new Date(e.tanggal_mulai).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((ev) => {
      const status = getStatus(ev);
      const mulai = new Date(ev.tanggal_mulai);
      if (filterStatus !== "semua" && status !== filterStatus) return false;
      if (filterJenis !== "semua" && ev.jenis_acara !== filterJenis) return false;
      if (filterYear !== "semua" && mulai.getFullYear() !== filterYear) return false;
      if (filterMonth !== "semua" && mulai.getMonth() !== filterMonth) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!ev.judul.toLowerCase().includes(q) && !ev.lokasi.toLowerCase().includes(q) && !ev.deskripsi.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [events, filterStatus, filterJenis, filterYear, filterMonth, search]);

  useEffect(() => { setPage(1); }, [filterStatus, filterJenis, filterYear, filterMonth, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const grouped = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const ev of paginated) {
      const d = new Date(ev.tanggal_mulai);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return Array.from(map.entries()).map(([key, evs]) => {
      const [year, month] = key.split("-").map(Number);
      return { year, month, events: evs };
    });
  }, [paginated]);

  const resetFilter = () => { setFilterStatus("semua"); setFilterJenis("semua"); setFilterYear("semua"); setFilterMonth("semua"); setSearch(""); setSearchInput(""); };
  const hasFilter   = filterStatus !== "semua" || filterJenis !== "semua" || filterYear !== "semua" || !!search;

  const sidebarBtn = (active: boolean): React.CSSProperties => ({
    width: "100%", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
    background: active ? "rgba(139,26,42,0.05)" : "transparent", border: "none",
    borderLeft: `3px solid ${active ? "#8b1a2a" : "transparent"}`, cursor: "pointer", transition: "all 0.15s",
  });

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{
        padding: "40px 24px 36px",
        position: "relative",
        overflow: "hidden",
        backgroundImage: "url('/banner/Mosaik_Budaya_1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        {/* Overlay gradient warm — gelap coklat-tua ke kuning tua */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(40,22,6,0.92) 0%, rgba(80,44,8,0.84) 40%, rgba(120,72,10,0.72) 100%)",
          pointerEvents: "none"
        }} />
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          pointerEvents: "none"
        }} />
        {/* Glow kuning di kanan atas */}
        <div style={{
          position: "absolute", top: "-60px", right: "-60px",
          width: "260px", height: "260px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,160,20,0.28) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        {/* Glow amber di kiri bawah */}
        <div style={{
          position: "absolute", bottom: "-40px", left: "8%",
          width: "180px", height: "180px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,100,10,0.18) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#f5c842", fontFamily: "var(--font-sans)" }}>Acara</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#f5c842", fontFamily: "var(--font-sans)" }}>◆ Kalender Kegiatan</span>
              <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 0", lineHeight: "1.2" }}>
                Acara & Kegiatan
              </h1>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: "6px 0 0" }}>
                Seluruh kegiatan Wikimedia Indonesia — masa lalu, berlangsung, maupun mendatang.
              </p>
            </div>

            {/* Search bar di hero */}
            <div className="hero-search-wrap" style={{ display: "flex", borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(245,200,66,0.25)", width: "100%", maxWidth: "320px" }}>
              <input
                type="text"
                placeholder="Cari acara..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ flex: 1, padding: "10px 14px", fontSize: "13px", backgroundColor: "rgba(255,255,255,0.06)", border: "none", color: "#fff", fontFamily: "var(--font-sans)", outline: "none", minWidth: 0 }}
              />
              <button
                onClick={handleSearch}
                style={{ flexShrink: 0, padding: "10px 14px", backgroundColor: "#c8960a", border: "none", color: "#fff", cursor: "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#daa80c")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#c8960a")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "36px 24px 60px", minHeight: "60vh", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Mobile: filter toggle bar */}
          <div className="mobile-filter-bar" style={{ display: "none", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" as const }}>
            <button
              onClick={() => setShowMobileFilter(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: (hasFilter || showMobileFilter) ? "#8b1a2a" : "#fff", border: `1px solid ${hasFilter || showMobileFilter ? "#8b1a2a" : "#e5e2dd"}`, borderRadius: "3px", color: (hasFilter || showMobileFilter) ? "#fff" : "#3a3a3a", fontSize: "12px", fontWeight: "600", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
              Filter {hasFilter ? "· aktif" : ""}
            </button>
            {hasFilter && (
              <button onClick={resetFilter} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "8px 12px", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "3px", color: "#8b1a2a", fontSize: "11px", fontWeight: "600", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                Reset
              </button>
            )}
            <span style={{ marginLeft: "auto", fontSize: "11px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>{filtered.length} acara</span>
          </div>

          {/* Mobile: filter drawer */}
          {showMobileFilter && (
            <div className="mobile-filter-drawer" style={{ display: "none", marginBottom: "14px", padding: "14px", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", flexDirection: "column" as const, gap: "12px" }}>
              {/* Status */}
              <div>
                <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)", marginBottom: "6px" }}>Status</div>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px" }}>
                  {(["semua","mendatang","berlangsung","selesai"] as const).map((s) => {
                    const labels: Record<string,string> = { semua:"Semua", mendatang:"Mendatang", berlangsung:"Berlangsung", selesai:"Selesai" };
                    const active = filterStatus === s;
                    return <button key={s} onClick={() => { setFilterStatus(s); }} style={{ padding: "5px 12px", borderRadius: "20px", border: `1px solid ${active ? "#8b1a2a" : "#e5e2dd"}`, backgroundColor: active ? "#8b1a2a" : "#fff", color: active ? "#fff" : "#3a3a3a", fontSize: "11px", fontWeight: "600", fontFamily: "var(--font-sans)", cursor: "pointer" }}>{labels[s]}</button>;
                  })}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)", marginBottom: "6px" }}>Jenis</div>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px" }}>
                  {(["semua","daring","luring","hybrid"] as const).map((j) => {
                    const labels: Record<string,string> = { semua:"Semua", daring:"Daring", luring:"Luring", hybrid:"Hybrid" };
                    const active = filterJenis === j;
                    return <button key={j} onClick={() => { setFilterJenis(j); }} style={{ padding: "5px 12px", borderRadius: "20px", border: `1px solid ${active ? "#8b1a2a" : "#e5e2dd"}`, backgroundColor: active ? "#8b1a2a" : "#fff", color: active ? "#fff" : "#3a3a3a", fontSize: "11px", fontWeight: "600", fontFamily: "var(--font-sans)", cursor: "pointer" }}>{labels[j]}</button>;
                  })}
                </div>
              </div>
              {availableYears.length > 0 && (
                <div>
                  <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)", marginBottom: "6px" }}>Tahun</div>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px" }}>
                    <button onClick={() => { setFilterYear("semua"); setFilterMonth("semua"); }} style={{ padding: "5px 12px", borderRadius: "20px", border: `1px solid ${filterYear === "semua" ? "#8b1a2a" : "#e5e2dd"}`, backgroundColor: filterYear === "semua" ? "#8b1a2a" : "#fff", color: filterYear === "semua" ? "#fff" : "#3a3a3a", fontSize: "11px", fontWeight: "600", fontFamily: "var(--font-sans)", cursor: "pointer" }}>Semua</button>
                    {availableYears.map(y => {
                      const active = filterYear === y;
                      return <button key={y} onClick={() => { setFilterYear(y); setFilterMonth("semua"); }} style={{ padding: "5px 12px", borderRadius: "20px", border: `1px solid ${active ? "#8b1a2a" : "#e5e2dd"}`, backgroundColor: active ? "#8b1a2a" : "#fff", color: active ? "#fff" : "#3a3a3a", fontSize: "11px", fontWeight: "600", fontFamily: "var(--font-sans)", cursor: "pointer" }}>{y}</button>;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="acara-layout" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "28px", alignItems: "start" }}>

            {/* ── Sidebar ── */}
            <aside style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Status */}
              <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ padding: "11px 16px", borderBottom: "3px solid #0d0d0d" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Status</span>
                </div>
                <div style={{ padding: "6px 0" }}>
                  {(["semua","mendatang","berlangsung","selesai"] as const).map((s) => {
                    const labels: Record<string,string> = { semua:"Semua", mendatang:"Mendatang", berlangsung:"Berlangsung", selesai:"Selesai" };
                    const colors: Record<string,string> = { semua:"#0d0d0d", mendatang:"#1e4d7b", berlangsung:"#16a34a", selesai:"#9a9690" };
                    const active = filterStatus === s;
                    return (
                      <button key={s} onClick={() => setFilterStatus(s)} style={sidebarBtn(active)}
                        onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.03)"; }}
                        onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                        <span style={{ fontSize: "12px", color: active ? "#8b1a2a" : colors[s], fontFamily: "var(--font-sans)", fontWeight: active ? "700" : "500" }}>{labels[s]}</span>
                        {s !== "semua" && !loading && (
                          <span style={{ fontSize: "10px", color: "#9a9690", backgroundColor: "#f0eeec", padding: "1px 7px", borderRadius: "10px", fontFamily: "var(--font-sans)" }}>
                            {events.filter((e) => getStatus(e) === s).length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Jenis */}
              <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ padding: "11px 16px", borderBottom: "3px solid #0d0d0d" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Jenis</span>
                </div>
                <div style={{ padding: "6px 0" }}>
                  {(["semua","daring","luring","hybrid"] as const).map((j) => {
                    const labels: Record<string,string> = { semua:"Semua", daring:"Daring", luring:"Luring", hybrid:"Hybrid" };
                    const active = filterJenis === j;
                    return (
                      <button key={j} onClick={() => setFilterJenis(j)} style={sidebarBtn(active)}
                        onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.03)"; }}
                        onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                        <span style={{ fontSize: "12px", color: active ? "#8b1a2a" : "#3a3a3a", fontFamily: "var(--font-sans)", fontWeight: active ? "700" : "500" }}>{labels[j]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tahun */}
              {availableYears.length > 0 && (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ padding: "11px 16px", borderBottom: "3px solid #0d0d0d" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Tahun</span>
                  </div>
                  <div style={{ padding: "6px 0", maxHeight: "200px", overflowY: "auto" as const }}>
                    <button onClick={() => { setFilterYear("semua"); setFilterMonth("semua"); }} style={sidebarBtn(filterYear === "semua")}>
                      <span style={{ fontSize: "12px", color: filterYear === "semua" ? "#8b1a2a" : "#3a3a3a", fontFamily: "var(--font-sans)", fontWeight: filterYear === "semua" ? "700" : "500" }}>Semua Tahun</span>
                    </button>
                    {availableYears.map((y) => (
                      <button key={y} onClick={() => { setFilterYear(y); setFilterMonth("semua"); }} style={sidebarBtn(filterYear === y)}>
                        <span style={{ fontSize: "12px", color: filterYear === y ? "#8b1a2a" : "#3a3a3a", fontFamily: "var(--font-sans)", fontWeight: filterYear === y ? "700" : "500" }}>{y}</span>
                        <span style={{ fontSize: "10px", color: "#9a9690", backgroundColor: "#f0eeec", padding: "1px 7px", borderRadius: "10px", fontFamily: "var(--font-sans)" }}>
                          {events.filter((e) => new Date(e.tanggal_mulai).getFullYear() === y).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bulan */}
              {filterYear !== "semua" && (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ padding: "11px 16px", borderBottom: "3px solid #0d0d0d" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Bulan</span>
                  </div>
                  <div style={{ padding: "6px 0" }}>
                    <button onClick={() => setFilterMonth("semua")} style={sidebarBtn(filterMonth === "semua")}>
                      <span style={{ fontSize: "12px", color: filterMonth === "semua" ? "#8b1a2a" : "#3a3a3a", fontFamily: "var(--font-sans)", fontWeight: filterMonth === "semua" ? "700" : "500" }}>Semua Bulan</span>
                    </button>
                    {MONTHS_ID.map((m, idx) => {
                      const hasEvs = events.some((e) => { const d = new Date(e.tanggal_mulai); return d.getFullYear() === filterYear && d.getMonth() === idx; });
                      if (!hasEvs) return null;
                      const active = filterMonth === idx;
                      return (
                        <button key={idx} onClick={() => setFilterMonth(idx)} style={sidebarBtn(active)}>
                          <span style={{ fontSize: "12px", color: active ? "#8b1a2a" : "#3a3a3a", fontFamily: "var(--font-sans)", fontWeight: active ? "700" : "500" }}>{m}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {hasFilter && (
                <button onClick={resetFilter}
                  style={{ width: "100%", padding: "8px 16px", borderRadius: "3px", border: "1px solid #e5e2dd", backgroundColor: "#fff", color: "#3a3a3a", fontSize: "12px", fontWeight: "600", fontFamily: "var(--font-sans)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#8b1a2a"; (e.currentTarget as HTMLElement).style.color = "#8b1a2a"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dd"; (e.currentTarget as HTMLElement).style.color = "#3a3a3a"; }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                  Reset Filter
                </button>
              )}
            </aside>

            {/* ── Main ── */}
            <div>
              {/* Toolbar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "3px solid #0d0d0d", flexWrap: "wrap" as const, gap: "10px" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8b1a2a", fontFamily: "var(--font-sans)" }}>◆ Agenda</span>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "2px", marginBottom: 0 }}>
                    {filterYear !== "semua" ? `${filterMonth !== "semua" ? MONTHS_ID[filterMonth as number] + " " : ""}${filterYear}` : "Semua Acara"}
                  </h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {!loading && <span style={{ fontSize: "12px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>{filtered.length} acara</span>}
                  {/* Toggle */}
                  <div style={{ display: "flex", border: "1px solid #e5e2dd", borderRadius: "3px", overflow: "hidden" }}>
                    {(["list","calendar"] as ViewMode[]).map((mode) => {
                      const active = viewMode === mode;
                      return (
                        <button key={mode} onClick={() => setViewMode(mode)}
                          style={{ padding: "7px 14px", border: "none", borderRight: mode === "list" ? "1px solid #e5e2dd" : "none", backgroundColor: active ? "#0d0d0d" : "#fff", color: active ? "#fff" : "#9a9690", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "600", fontFamily: "var(--font-sans)", transition: "all 0.15s" }}
                          onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "#f8f7f5"; }}
                          onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "#fff"; }}>
                          {mode === "list" ? (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                          ) : (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          )}
                          <span className="toggle-btn-label">{mode === "list" ? "List" : "Kalender"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Views */}
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[...Array(6)].map((_, i) => <EventSkeleton key={i} />)}
                </div>
              ) : viewMode === "calendar" ? (
                <CalendarView events={filtered} />
              ) : filtered.length === 0 ? (
                <div style={{ padding: "60px 24px", textAlign: "center", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderRadius: "4px" }}>
                  <p style={{ fontSize: "15px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>Tidak ada acara yang sesuai filter.</p>
                  <button onClick={resetFilter} style={{ marginTop: "12px", padding: "8px 20px", borderRadius: "3px", border: "none", backgroundColor: "#8b1a2a", color: "#fff", fontSize: "12px", fontWeight: "700", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
                    Reset Filter
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                    {grouped.map(({ year, month, events: evs }) => (
                      <div key={`${year}-${month}`}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
                            <span style={{ fontSize: "15px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)" }}>{MONTHS_ID[month]}</span>
                            <span style={{ fontSize: "12px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>{year}</span>
                          </div>
                          <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e2dd" }} />
                          <span style={{ fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)" }}>{evs.length} acara</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {evs.map((ev) => <EventCard key={ev.id} ev={ev} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination current={page} total={totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* ── Skeleton animation ── */
        .skeleton {
          background: linear-gradient(90deg, #f0eeec 25%, #e8e5e0 50%, #f0eeec 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── Desktop: sidebar muncul, mobile filter tersembunyi ── */
        @media (min-width: 901px) {
          .mobile-filter-bar    { display: none !important; }
          .mobile-filter-drawer { display: none !important; }
        }

        /* ── Tablet / Mobile (<= 900px) ── */
        @media (max-width: 900px) {
          .acara-layout         { grid-template-columns: 1fr !important; }
          .acara-layout aside   { display: none !important; }
          .mobile-filter-bar    { display: flex !important; }
          .mobile-filter-drawer { display: flex !important; }
          .hero-search-wrap     { max-width: 100% !important; }
        }

        /* ── Small mobile (<= 480px) ── */
        @media (max-width: 480px) {
          .toggle-btn-label { display: none; }
        }
      `}</style>
    </>
  );
}