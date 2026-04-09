"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import AdminSlotManager from "@/components/AdminSlotManager";
import AcceptButton from "@/components/AcceptButton";
import type { BookingWithSlot } from "@/types";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatTime(t: string): string {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
}

type Tab = "pending" | "availability" | "history";
type FilterStatus = "all" | "accepted" | "declined" | "pending";
type BookingStatus = "pending" | "accepted" | "declined";

function StatusSelect({
  bookingId,
  currentStatus,
  onChanged,
}: {
  bookingId: string;
  currentStatus: BookingStatus;
  onChanged: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<BookingStatus>(currentStatus);

  useEffect(() => {
    setValue(currentStatus);
  }, [currentStatus]);

  async function handleChange(newStatus: BookingStatus) {
    if (newStatus === value || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update status");
      }
      setValue(newStatus);
      onChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred.");
      setValue(currentStatus);
    } finally {
      setLoading(false);
    }
  }

  const statusStyles: Record<BookingStatus, string> = {
    pending: "bg-gold/10 text-gold border-gold/20",
    accepted: "bg-sage/10 text-sage border-sage/20",
    declined: "bg-coral/10 text-coral border-coral/20",
  };

  return (
    <div className="relative inline-flex">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value as BookingStatus)}
        disabled={loading}
        className={`appearance-none cursor-pointer px-3 py-1.5 pr-7 rounded-lg text-[11px] font-semibold tracking-wider uppercase border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:opacity-50 disabled:cursor-wait ${statusStyles[value]}`}
        style={{ backgroundColor: "transparent" }}
      >
        <option value="pending">Pending</option>
        <option value="accepted">Accepted</option>
        <option value="declined">Declined</option>
      </select>
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
        {loading ? (
          <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-50">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        )}
      </div>
    </div>
  );
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) onUnlock();
      else setError("Incorrect password. Please try again.");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[400px] h-[400px] rounded-full bg-gold/[0.03] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-5 shadow-lg border border-gold/10">
            <Image
              src="/logo.png"
              alt="LEY Beauty"
              width={64}
              height={64}
              className="site-logo object-cover w-full h-full"
            />
          </div>
          <h1 className="font-heading text-2xl font-normal text-sand mb-1">
            LEY Beauty
          </h1>
          <p className="text-[12px] text-muted-light tracking-widest uppercase">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="card-modern p-8">
          <div className="mb-5">
            <label className="block text-[11px] tracking-wider uppercase text-muted-light mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Enter admin password"
              className="w-full bg-obsidian/60 border border-border-light rounded-xl px-4 py-3 text-sand text-sm placeholder:text-muted focus:outline-none focus:border-gold/40 transition-all"
              autoFocus
              required
            />
          </div>

          {error && <p className="text-coral text-xs mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full justify-center py-3 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState<Tab>("pending");
  const [bookings, setBookings] = useState<BookingWithSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings?admin=true");
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (unlocked) fetchBookings();
  }, [unlocked, fetchBookings]);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const pending = bookings.filter((b) => b.status === "pending");
  const history = bookings.filter(
    (b) => filterStatus === "all" || b.status === filterStatus
  );

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: "pending", label: "Pending", count: pending.length },
    { id: "availability", label: "Availability" },
    { id: "history", label: "History" },
  ];

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Header */}
      <header className="bg-obsidian-light/80 backdrop-blur-xl border-b border-border px-6 lg:px-10 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="LEY Beauty"
            width={36}
            height={36}
            className="site-logo rounded-xl"
          />
          <div>
            <h1 className="text-sand text-sm font-medium">LEY Beauty</h1>
            <p className="text-[11px] text-muted tracking-wider">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-[12px] text-muted-light hover:text-gold transition-colors px-3 py-1.5 rounded-lg hover:bg-gold/5"
          >
            View Site
          </a>
          <button
            onClick={() => setUnlocked(false)}
            className="text-[12px] text-muted-light hover:text-coral transition-colors px-3 py-1.5 rounded-lg hover:bg-coral/5"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="border-b border-border px-6 lg:px-10 py-7 bg-obsidian-light/40">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: "Pending", value: bookings.filter((b) => b.status === "pending").length, color: "text-gold" },
            { label: "Accepted", value: bookings.filter((b) => b.status === "accepted").length, color: "text-sage" },
            { label: "Declined", value: bookings.filter((b) => b.status === "declined").length, color: "text-coral" },
            { label: "Total", value: bookings.length, color: "text-sand" },
          ].map((stat) => (
            <div key={stat.label} className="card-modern p-5 text-center">
              <p className={`font-heading text-[32px] font-normal ${stat.color} leading-none`}>{stat.value}</p>
              <p className="text-[11px] tracking-wider uppercase text-muted mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        {/* Tabs */}
        <div className="flex gap-1 mb-10 p-1 bg-obsidian-light rounded-xl w-fit border border-border">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 text-[12px] font-medium tracking-wider uppercase rounded-lg transition-all duration-300 ${
                tab === t.id
                  ? "bg-gold/10 text-gold border border-gold/20 shadow-[0_2px_8px_rgba(200,149,42,0.1)]"
                  : "text-muted hover:text-sand border border-transparent"
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className="ml-2 w-5 h-5 rounded-lg bg-gold text-obsidian text-[10px] font-bold inline-flex items-center justify-center">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* PENDING */}
        {tab === "pending" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal text-sand">Pending Requests</h2>
              <button
                onClick={fetchBookings}
                className="flex items-center gap-2 text-[12px] text-muted hover:text-gold transition-colors px-3 py-2 rounded-xl hover:bg-gold/5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                </svg>
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-16 text-muted-light">Loading...</div>
            ) : pending.length === 0 ? (
              <div className="card-modern text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-sage/10 border border-sage/10 flex items-center justify-center mx-auto mb-4 text-sage">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
                <p className="text-muted-light text-sm">No pending requests — all clear!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pending.map((booking) => (
                  <div
                    key={booking.id}
                    className="card-modern p-6 hover:border-gold/20 group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 flex-1">
                        <div>
                          <p className="text-[10px] tracking-wider text-gold/60 uppercase mb-1">Client</p>
                          <p className="text-sand text-sm font-medium">{booking.client_name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-wider text-gold/60 uppercase mb-1">Email</p>
                          <a href={`mailto:${booking.client_email}`} className="text-muted-light text-sm hover:text-gold transition-colors">
                            {booking.client_email}
                          </a>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-wider text-gold/60 uppercase mb-1">Phone</p>
                          <p className="text-muted-light text-sm">{booking.client_phone ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-wider text-gold/60 uppercase mb-1">Service</p>
                          <p className="text-sand text-sm">{booking.service}</p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-wider text-gold/60 uppercase mb-1">Date</p>
                          <p className="text-sand text-sm">{formatDate(booking.slot.date)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-wider text-gold/60 uppercase mb-1">Time</p>
                          <p className="text-sand text-sm">
                            {formatTime(booking.slot.start_time)} – {formatTime(booking.slot.end_time)}
                          </p>
                        </div>
                        {booking.message && (
                          <div className="col-span-2 sm:col-span-3">
                            <p className="text-[10px] tracking-wider text-gold/60 uppercase mb-1">Message</p>
                            <p className="text-muted-light text-sm italic">&ldquo;{booking.message}&rdquo;</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                        <AcceptButton bookingId={booking.id} action="accept" onSuccess={fetchBookings} />
                        <AcceptButton bookingId={booking.id} action="decline" onSuccess={fetchBookings} />
                        <div className="hidden lg:block mt-1">
                          <StatusSelect
                            bookingId={booking.id}
                            currentStatus={booking.status as BookingStatus}
                            onChanged={fetchBookings}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AVAILABILITY */}
        {tab === "availability" && (
          <div>
            <h2 className="font-heading text-2xl font-normal text-sand mb-6">Manage Availability</h2>
            <AdminSlotManager />
          </div>
        )}

        {/* HISTORY */}
        {tab === "history" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="font-heading text-2xl font-normal text-sand">Booking History</h2>
              <div className="flex gap-1.5 p-1 bg-obsidian-light rounded-xl border border-border">
                {(["all", "pending", "accepted", "declined"] as FilterStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-4 py-2 text-[11px] tracking-wider uppercase rounded-lg transition-all ${
                      filterStatus === s
                        ? "bg-gold/10 text-gold border border-gold/15"
                        : "text-muted border border-transparent hover:text-muted-light"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16 text-muted-light">Loading...</div>
            ) : history.length === 0 ? (
              <div className="card-modern text-center py-16 text-muted-light text-sm">
                No bookings found.
              </div>
            ) : (
              <div className="card-modern overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Requested</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <p className="text-sand font-medium">{booking.client_name}</p>
                            <p className="text-muted text-[11px]">{booking.client_email}</p>
                          </td>
                          <td>{booking.service}</td>
                          <td>{formatDate(booking.slot.date)}</td>
                          <td>{formatTime(booking.slot.start_time)} – {formatTime(booking.slot.end_time)}</td>
                          <td>
                            <StatusSelect
                              bookingId={booking.id}
                              currentStatus={booking.status as BookingStatus}
                              onChanged={fetchBookings}
                            />
                          </td>
                          <td className="text-muted text-[11px]">
                            {new Date(booking.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
