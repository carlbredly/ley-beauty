"use client";

import { useState } from "react";

interface AcceptButtonProps {
  bookingId: string;
  action: "accept" | "decline";
  onSuccess: () => void;
}

export default function AcceptButton({ bookingId, action, onSuccess }: AcceptButtonProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    if (loading || done) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/${action}`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Action failed");
      }
      setDone(true);
      onSuccess();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const isAccept = action === "accept";

  const baseClass =
    "inline-flex items-center gap-2 px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ";

  const variantClass = isAccept
    ? "bg-sage/10 border border-sage/20 text-sage hover:bg-sage/20 hover:border-sage/40"
    : "bg-coral/[0.06] border border-coral/15 text-coral hover:bg-coral/10 hover:border-coral/30";

  return (
    <button onClick={handleClick} disabled={loading || done} className={baseClass + variantClass}>
      {loading ? (
        <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        </svg>
      ) : done ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
      ) : isAccept ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      )}
      {loading ? "..." : done ? "Done" : isAccept ? "Accept" : "Decline"}
    </button>
  );
}
