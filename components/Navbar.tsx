"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Gallery", href: "#gallery" },
    { label: "About", href: "#why-us" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4 w-full">
      <nav
        className={`w-full mx-auto flex items-center justify-between h-16 px-6 md:px-8 rounded-2xl transition-all duration-700 ${
          scrolled
            ? "bg-obsidian/80 backdrop-blur-xl border border-border-light shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-transparent w-full"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="LEY Beauty"
            width={44}
            height={44}
            className="site-logo rounded-lg transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="px-4 py-2 text-[13px] font-medium text-muted-light hover:text-sand rounded-xl hover:bg-white/[0.03] transition-all duration-300"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl text-muted-light hover:text-gold hover:bg-gold/5 transition-all duration-300"
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </li>
          <li className="ml-1">
            <Link
              href="/booking"
              className="px-6 py-2.5 text-[13px] font-semibold text-white bg-gradient-to-r from-[#c8952a] to-[#e0a830] rounded-xl hover:shadow-[0_8px_24px_rgba(200,149,42,0.3)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Book Now
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-[1.5px] bg-sand rounded transition-all duration-300 origin-center ${
              menuOpen ? "rotate-45 translate-y-[6.5px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-sand rounded transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-sand rounded transition-all duration-300 origin-center ${
              menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden mt-2 mx-auto max-w-6xl overflow-hidden transition-all duration-500 ${
          menuOpen
            ? "max-h-80 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-obsidian/90 backdrop-blur-xl border border-border-light rounded-2xl p-6">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-muted-light hover:text-sand rounded-xl hover:bg-white/[0.03] transition-all"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-border mt-2 flex items-center gap-3">
              <Link
                href="/booking"
                onClick={() => setMenuOpen(false)}
                className="flex-1 block text-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#c8952a] to-[#e0a830] rounded-xl"
              >
                Book Now
              </Link>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-3 rounded-xl text-muted-light hover:text-gold border border-border hover:border-border-light transition-all"
              >
                {theme === "dark" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
