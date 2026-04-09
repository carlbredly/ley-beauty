"use client";

import { useState } from "react";
import type { Slot } from "@/types";
import { SERVICES } from "@/types";

interface BookingFormProps {
  selectedSlot: Slot;
  preselectedService?: string;
  onSuccess: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(t: string): string {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function BookingForm({
  selectedSlot,
  preselectedService = "",
  onSuccess,
}: BookingFormProps) {
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    service: preselectedService,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim()) { setError("Please enter your full name."); return; }
    if (!form.email.trim() || !form.email.includes("@")) { setError("Please enter a valid email."); return; }
    if (!form.service) { setError("Please select a service."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: selectedSlot.id,
          client_name: form.fullName.trim(),
          client_email: form.email.trim(),
          client_phone: form.phone.trim(),
          service: form.service,
          message: form.message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to submit booking.");
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-obsidian/60 border border-border-light rounded-xl px-4 py-3 text-sand text-[13px] placeholder:text-muted focus:outline-none focus:border-gold/40 focus:shadow-[0_0_0_3px_rgba(200,149,42,0.06)] transition-all duration-300";

  return (
    <div className="card-modern p-7">
      {/* Selected slot summary */}
      <div className="mb-7 p-4 bg-gold/[0.04] border border-gold/10 rounded-xl">
        <p className="text-[11px] font-medium tracking-widest uppercase text-gold/80 mb-2">
          Your Selected Appointment
        </p>
        <p className="text-sand text-sm">{formatDate(selectedSlot.date)}</p>
        <p className="text-muted-light text-[13px] mt-0.5">
          {formatTime(selectedSlot.start_time)} – {formatTime(selectedSlot.end_time)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] tracking-wider uppercase text-muted-light mb-1.5">
            Full Name <span className="text-coral">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            className={inputClass}
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-wider uppercase text-muted-light mb-1.5">
            Email <span className="text-coral">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={inputClass}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-wider uppercase text-muted-light mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+81 90-0000-0000"
            className={inputClass}
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-wider uppercase text-muted-light mb-1.5">
            Service <span className="text-coral">*</span>
          </label>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className={`${inputClass} cursor-pointer appearance-none`}
            required
          >
            <option value="" disabled>Select a service</option>
            {SERVICES.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} — {s.duration} — ¥{s.price.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] tracking-wider uppercase text-muted-light mb-1.5">
            Message (optional)
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Any special requests..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 bg-coral/[0.06] border border-coral/15 rounded-xl text-coral text-[13px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-gold w-full justify-center py-4 mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              Send Booking Request
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
