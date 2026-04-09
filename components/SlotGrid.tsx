"use client";

import type { Slot } from "@/types";

interface SlotGridProps {
  slots: Slot[];
  selectedSlot: Slot | null;
  onSelectSlot: (slot: Slot) => void;
}

function formatTime(t: string): string {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function SlotGrid({ slots, selectedSlot, onSelectSlot }: SlotGridProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-10 text-muted-light text-sm">
        No time slots available for this date.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {slots.map((slot) => {
        const isSelected = selectedSlot?.id === slot.id;
        const isTaken = !slot.is_available;

        if (isTaken) {
          return (
            <div
              key={slot.id}
              className="relative bg-coral/[0.04] border border-coral/10 rounded-xl p-3.5 opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-coral/60" />
                <span className="text-[10px] font-semibold tracking-wider text-coral/80 uppercase">
                  Booked
                </span>
              </div>
              <p className="text-sand/40 text-sm line-through">{formatTime(slot.start_time)}</p>
              <p className="text-muted/30 text-[11px]">– {formatTime(slot.end_time)}</p>
            </div>
          );
        }

        if (isSelected) {
          return (
            <button
              key={slot.id}
              onClick={() => onSelectSlot(slot)}
              className="bg-gold/10 border-2 border-gold rounded-xl p-3.5 text-left shadow-[0_4px_20px_rgba(200,149,42,0.15)] transition-all duration-300"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-[10px] font-semibold tracking-wider text-gold uppercase">Selected</span>
              </div>
              <p className="text-sand font-medium text-sm">{formatTime(slot.start_time)}</p>
              <p className="text-muted-light text-[11px]">– {formatTime(slot.end_time)}</p>
            </button>
          );
        }

        return (
          <button
            key={slot.id}
            onClick={() => onSelectSlot(slot)}
            className="group bg-sage/[0.04] border border-sage/15 hover:border-sage/40 hover:bg-sage/[0.08] rounded-xl p-3.5 text-left transition-all duration-300"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-sage/70 group-hover:scale-125 transition-transform" />
              <span className="text-[10px] font-semibold tracking-wider text-sage/80 uppercase">Available</span>
            </div>
            <p className="text-sand text-sm group-hover:text-gold transition-colors">{formatTime(slot.start_time)}</p>
            <p className="text-muted-light text-[11px]">– {formatTime(slot.end_time)}</p>
          </button>
        );
      })}
    </div>
  );
}
