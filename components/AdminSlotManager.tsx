"use client";

import { useState, useEffect, useCallback } from "react";
import type { Slot } from "@/types";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatTime(t: string): string {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function AdminSlotManager() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slotsForDate, setSlotsForDate] = useState<Slot[]>([]);
  const [allSlots, setAllSlots] = useState<Slot[]>([]);
  const [newStart, setNewStart] = useState("10:00");
  const [newEnd, setNewEnd] = useState("11:30");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const fetchAllSlots = useCallback(async () => {
    try {
      const res = await fetch("/api/slots?all=true");
      if (res.ok) {
        const data = await res.json();
        setAllSlots(data.slots ?? []);
      }
    } catch {}
  }, []);

  useEffect(() => { fetchAllSlots(); }, [fetchAllSlots]);

  useEffect(() => {
    if (selectedDate) setSlotsForDate(allSlots.filter((s) => s.date === selectedDate));
  }, [selectedDate, allSlots]);

  const daysInMonth = (() => {
    const first = new Date(viewYear, viewMonth, 1);
    const last = new Date(viewYear, viewMonth + 1, 0);
    const cells: (number | null)[] = Array(first.getDay()).fill(null);
    for (let d = 1; d <= last.getDate(); d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  })();

  function goToPrev() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function goToNext() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  const slotsOnDate = (day: number) => {
    const ds = toDateStr(viewYear, viewMonth, day);
    return allSlots.filter((s) => s.date === ds).length;
  };

  async function handleAddSlot() {
    if (!selectedDate) return;
    if (newStart >= newEnd) { setMessage("Start time must be before end time."); return; }
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, start_time: newStart, end_time: newEnd }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Failed to create slot");
      }
      setMessage("Slot added successfully.");
      await fetchAllSlots();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error adding slot.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSlot(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/slots/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete slot.");
      setMessage("Slot removed.");
      await fetchAllSlots();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error.");
    } finally {
      setDeleting(null);
    }
  }

  const inputClass =
    "bg-obsidian/60 border border-border-light rounded-xl px-3 py-2.5 text-sand text-sm focus:outline-none focus:border-gold/40 transition-all";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Mini Calendar */}
      <div className="card-modern p-6">
        <h3 className="text-[12px] font-medium tracking-wider uppercase text-gold/80 mb-5">Select Date</h3>

        <div className="flex items-center justify-between mb-5">
          <button onClick={goToPrev} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-light hover:text-gold hover:bg-gold/5 transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-heading text-lg font-normal text-sand">{MONTHS[viewMonth]} {viewYear}</span>
          <button onClick={goToNext} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-light hover:text-gold hover:bg-gold/5 transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] text-muted py-1 font-medium">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} />;
            const ds = toDateStr(viewYear, viewMonth, day);
            const count = slotsOnDate(day);
            const sel = selectedDate === ds;
            return (
              <button
                key={ds}
                onClick={() => { setSelectedDate(ds); setMessage(""); }}
                className={`relative h-8 w-full flex items-center justify-center text-[12px] rounded-lg transition-all ${
                  sel
                    ? "bg-gold text-obsidian font-semibold"
                    : "text-sand/80 hover:bg-gold/8 hover:text-gold"
                }`}
              >
                {day}
                {count > 0 && !sel && (
                  <span className="absolute -top-0.5 -right-0.5 text-[8px] text-gold/60 font-bold">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slot manager */}
      <div className="card-modern p-6">
        {!selectedDate ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center text-gold/30 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.89 3 3.01 3.9 3.01 5L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
            </div>
            <p className="text-muted-light text-sm">Select a date to manage slots</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[12px] font-medium tracking-wider uppercase text-gold/80">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "short", month: "short", day: "numeric",
                })}
              </h3>
              <span className="text-[11px] text-muted px-2.5 py-1 bg-muted/10 rounded-lg">
                {slotsForDate.length} slot{slotsForDate.length !== 1 ? "s" : ""}
              </span>
            </div>

            {slotsForDate.length > 0 ? (
              <ul className="space-y-2 mb-6">
                {slotsForDate.map((slot) => (
                  <li
                    key={slot.id}
                    className="flex items-center justify-between bg-obsidian/40 border border-border rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${slot.is_available ? "bg-sage" : "bg-coral"}`} />
                      <span className="text-sand text-sm">
                        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] tracking-wider ${slot.is_available ? "text-sage" : "text-coral"}`}>
                        {slot.is_available ? "Free" : "Booked"}
                      </span>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        disabled={!slot.is_available || deleting === slot.id}
                        className="text-muted hover:text-coral disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-1 rounded-lg hover:bg-coral/5"
                        title={slot.is_available ? "Delete slot" : "Cannot delete booked slot"}
                      >
                        {deleting === slot.id ? (
                          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-light text-sm mb-6">No slots for this date.</p>
            )}

            <div className="border-t border-border pt-5">
              <p className="text-[11px] tracking-wider uppercase text-muted-light mb-3">Add New Slot</p>
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label className="block text-[10px] text-muted mb-1">Start</label>
                  <input type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)} className={inputClass + " w-full"} />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-muted mb-1">End</label>
                  <input type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className={inputClass + " w-full"} />
                </div>
              </div>

              {message && (
                <p className={`text-[11px] mb-3 ${message.includes("success") || message.includes("removed") ? "text-sage" : "text-coral"}`}>
                  {message}
                </p>
              )}

              <button
                onClick={handleAddSlot}
                disabled={saving}
                className="btn-gold w-full justify-center py-2.5 text-[12px] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Slot"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
