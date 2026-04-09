"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingCalendar from "@/components/BookingCalendar";
import SlotGrid from "@/components/SlotGrid";
import BookingForm from "@/components/BookingForm";
import GeometricPattern from "@/components/GeometricPattern";
import type { Slot } from "@/types";

function StepIndicator({ step, label, active }: { step: number; label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-semibold transition-all duration-500 ${
          active
            ? "bg-gold text-obsidian shadow-[0_4px_16px_rgba(200,149,42,0.3)]"
            : "bg-gold/10 text-gold/50 border border-gold/10"
        }`}
      >
        {step}
      </div>
      <h2 className="font-heading text-xl font-normal text-sand">{label}</h2>
    </div>
  );
}

function BookingPageContent() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") ?? "";

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slotsForDate, setSlotsForDate] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchDates() {
      try {
        const res = await fetch("/api/slots");
        const data = await res.json();
        const dates = Array.from(new Set<string>((data.slots as Slot[]).map((s) => s.date)));
        setAvailableDates(dates);
      } catch {}
    }
    fetchDates();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSelectedSlot(null);

    async function fetchSlots() {
      try {
        const res = await fetch(`/api/slots?date=${selectedDate}`);
        const data = await res.json();
        setSlotsForDate(data.slots ?? []);
      } catch {
        setSlotsForDate([]);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDate]);

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSuccess(false);
  }

  function handleSelectSlot(slot: Slot) {
    setSelectedSlot((prev) => (prev?.id === slot.id ? null : slot));
    setSuccess(false);
  }

  function handleSuccess() {
    setSuccess(true);
    setSelectedSlot(null);
    if (selectedDate) {
      fetch(`/api/slots?date=${selectedDate}`)
        .then((r) => r.json())
        .then((d) => setSlotsForDate(d.slots ?? []))
        .catch(() => {});
    }
  }

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden noise-overlay">
        <div className="absolute inset-0 bg-obsidian">
          <GeometricPattern variant="dots" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gold/[0.03] blur-[120px] pointer-events-none" />
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-gold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[12px] text-gold/90 font-medium tracking-wide">
              Secure Your Spot
            </span>
          </div>
          <h1 className="font-heading text-[40px] md:text-[50px] font-normal text-sand mb-4 leading-tight">
            Book an Appointment
          </h1>
          <div className="gold-divider mb-6" />
          <p className="text-muted-light text-[14px] max-w-md mx-auto leading-relaxed">
            Select your preferred date and time. We&apos;ll confirm within 24 hours
            and send payment instructions to your email.
          </p>
        </div>
      </section>

      {/* Booking */}
      <section className="relative bg-obsidian-light py-16 px-6 min-h-[60vh]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

        <div className="max-w-6xl mx-auto">
          {success ? (
            <div className="max-w-lg mx-auto text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
              <h2 className="font-heading text-[32px] font-normal text-sand mb-4">
                Request Received
              </h2>
              <div className="gold-divider mb-6" />
              <p className="text-muted-light text-[14px] leading-relaxed mb-8">
                Your request has been received. We&apos;ll confirm within 24 hours
                with payment instructions and appointment details.
              </p>
              <p className="text-muted text-xs mb-8">
                Please check your email inbox (and spam folder) for confirmation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setSelectedDate(null);
                    setSelectedSlot(null);
                  }}
                  className="btn-ghost"
                >
                  Book Another
                </button>
                <a href="/" className="btn-gold justify-center">
                  Return Home
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Step 1 */}
              <div className="lg:col-span-4">
                <StepIndicator step={1} label="Choose a Date" active={true} />
                <BookingCalendar
                  availableDates={availableDates}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                />
              </div>

              {/* Step 2 */}
              <div className="lg:col-span-4">
                <StepIndicator step={2} label="Select a Time" active={!!selectedDate} />
                {!selectedDate ? (
                  <div className="card-modern p-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-muted/10 flex items-center justify-center mx-auto mb-4 text-muted">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                      </svg>
                    </div>
                    <p className="text-muted-light text-sm">
                      Select a date to see available time slots.
                    </p>
                  </div>
                ) : loadingSlots ? (
                  <div className="card-modern p-8 text-center">
                    <svg
                      className="animate-spin mx-auto text-gold"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                  </div>
                ) : (
                  <div className="card-modern p-5">
                    <SlotGrid
                      slots={slotsForDate}
                      selectedSlot={selectedSlot}
                      onSelectSlot={handleSelectSlot}
                    />
                  </div>
                )}
              </div>

              {/* Step 3 */}
              <div className="lg:col-span-4">
                <StepIndicator step={3} label="Your Details" active={!!selectedSlot} />
                {!selectedSlot ? (
                  <div className="card-modern p-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-muted/10 flex items-center justify-center mx-auto mb-4 text-muted">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <p className="text-muted-light text-sm">
                      Select a time slot to fill in your details.
                    </p>
                  </div>
                ) : (
                  <BookingForm
                    selectedSlot={selectedSlot}
                    preselectedService={preselectedService}
                    onSuccess={handleSuccess}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info bar */}
      <section className="bg-obsidian py-12 px-6">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: "M12 2a10 10 0 100 20A10 10 0 0012 2zm.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
              label: "Confirmed within 24h",
              desc: "We review every request personally.",
            },
            {
              icon: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
              label: "Email confirmation",
              desc: "Payment details sent on acceptance.",
            },
            {
              icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z",
              label: "Secure booking",
              desc: "Your data is safe and private.",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold/[0.06] border border-gold/10 flex items-center justify-center flex-shrink-0 text-gold/50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d={item.icon} />
                </svg>
              </div>
              <div>
                <p className="text-sand text-sm font-medium">{item.label}</p>
                <p className="text-muted-light text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-obsidian flex items-center justify-center">
          <svg
            className="animate-spin text-gold"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
