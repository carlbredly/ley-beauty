"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-obsidian overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/[0.02] blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 relative">
        {/* Top section: Logo + CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="LEY Beauty"
              width={48}
              height={48}
              className="site-logo rounded-xl"
            />
            <div>
              <p className="text-sand font-medium text-lg">LEY Beauty</p>
              <p className="text-muted-light text-sm">Okinawa, Japan</p>
            </div>
          </div>
          <Link
            href="/booking"
            className="btn-gold"
          >
            Book an Appointment
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* About */}
          <div>
            <h4 className="text-sand text-sm font-medium mb-5">About</h4>
            <p className="text-muted-light text-sm leading-relaxed">
              Handcrafted braids and natural care in our exclusive Okinawa
              studio. A sanctuary for your beauty.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sand text-sm font-medium mb-5">Hours</h4>
            <ul className="space-y-2.5 text-sm text-muted-light">
              <li className="flex justify-between">
                <span>Mon – Fri</span>
                <span className="text-sand/80">10:00 – 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-sand/80">10:00 – 17:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-coral/80">Closed</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sand text-sm font-medium mb-5">Contact</h4>
            <ul className="space-y-2.5 text-sm text-muted-light">
              <li>Okinawa, Japan</li>
              <li>
                <a
                  href="mailto:hello@leybeauty.jp"
                  className="hover:text-gold transition-colors"
                >
                  hello@leybeauty.jp
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sand text-sm font-medium mb-5">Follow Us</h4>
            <div className="flex flex-col gap-2.5">
              {["Instagram", "TikTok", "Facebook"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-sm text-muted-light hover:text-gold transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">
            &copy; {new Date().getFullYear()} LEY Beauty. All rights reserved.
          </p>
          <p className="text-muted text-xs">
            Crafted with care in Okinawa, Japan
          </p>
        </div>
      </div>
    </footer>
  );
}
