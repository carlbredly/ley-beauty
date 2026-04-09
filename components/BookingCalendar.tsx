"use client";

import { useState, useMemo } from "react";

interface BookingCalendarProps {
  availableDates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export default function BookingCalendar({
  availableDates,
  selectedDate,
  onSelectDate,
}: BookingCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const availableSet = useMemo(() => new Set(availableDates), [availableDates]);

  const daysInMonth = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const last = new Date(viewYear, viewMonth + 1, 0);
    const startPad = first.getDay();
    const cells: (number | null)[] = Array(startPad).fill(null);
    for (let d = 1; d <= last.getDate(); d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  function goToPrev() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function goToNext() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function toDateStr(day: number) {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${viewYear}-${mm}-${dd}`;
  }

  function isPast(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  }

  function isToday(day: number) {
    return day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  }

  const isPrevDisabled =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  return (
    <div className="card-modern p-6 select-none">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrev}
          disabled={isPrevDisabled}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-light hover:text-gold hover:bg-gold/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          aria-label="Previous month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="text-center">
          <p className="font-heading text-xl font-normal text-sand">{MONTHS[viewMonth]}</p>
          <p className="text-[10px] text-muted tracking-widest mt-0.5">{viewYear}</p>
        </div>

        <button
          onClick={goToNext}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-light hover:text-gold hover:bg-gold/5 transition-all"
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-muted py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;

          const dateStr = toDateStr(day);
          const past = isPast(day);
          const available = availableSet.has(dateStr);
          const selected = selectedDate === dateStr;
          const todayDay = isToday(day);

          let cellClass =
            "relative h-9 w-full flex items-center justify-center text-[13px] rounded-xl transition-all duration-300 ";

          if (selected) {
            cellClass += "bg-gold text-obsidian font-semibold shadow-[0_4px_16px_rgba(200,149,42,0.4)]";
          } else if (past) {
            cellClass += "text-muted/30 cursor-not-allowed";
          } else if (available) {
            cellClass += "text-sand cursor-pointer hover:bg-gold/10 hover:text-gold";
            if (todayDay) cellClass += " text-gold font-medium";
          } else {
            cellClass += "text-muted/30 cursor-not-allowed";
          }

          return (
            <button
              key={dateStr}
              onClick={() => !past && available && onSelectDate(dateStr)}
              disabled={past || !available}
              className={cellClass}
              aria-label={`${day} ${MONTHS[viewMonth]}`}
              aria-pressed={selected}
            >
              {day}
              {available && !selected && (
                <span className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-5 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold" />
          <span className="text-[11px] text-muted">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-lg bg-gold" />
          <span className="text-[11px] text-muted">Selected</span>
        </div>
      </div>
    </div>
  );
}
