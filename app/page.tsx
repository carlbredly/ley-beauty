"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import GeometricPattern from "@/components/GeometricPattern";
import { SERVICES } from "@/types";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function AnimatedHeadline({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  const words = text.split(" ");
  return (
    <span className="block">
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.3em]">
          {word.split("").map((char, ci) => (
            <span
              key={ci}
              className="inline-block opacity-0 animate-fade-up"
              style={{
                animationDelay: `${baseDelay + (wi * word.length + ci) * 40}ms`,
                animationFillMode: "forwards",
              }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

function GalleryPlaceholder({ index, tall }: { index: number; tall?: boolean }) {
  const gradients = [
    "from-gold/15 via-obsidian-mid to-coral/5",
    "from-coral/10 via-obsidian-mid to-gold/8",
    "from-sage/10 via-obsidian-mid to-gold/5",
    "from-gold/8 via-obsidian-mid to-sage/8",
    "from-coral/8 via-obsidian-mid to-sand/3",
    "from-gold/20 via-obsidian-mid to-obsidian",
  ];

  return (
    <div
      className={`relative group overflow-hidden rounded-2xl bg-gradient-to-br ${gradients[index % gradients.length]} ${
        tall ? "row-span-2" : ""
      }`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gold/20 group-hover:text-gold/50 transition-all duration-700">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
        <span className="text-[10px] tracking-widest uppercase">LEY Beauty</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute inset-0 scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out" />
    </div>
  );
}

const TESTIMONIALS = [
  {
    name: "Sophia Chen",
    review:
      "Absolutely stunning work. My knotless braids lasted weeks and looked perfect from day one. The studio is a serene escape — I felt like royalty throughout the entire session.",
    rating: 5,
    service: "Knotless Braids",
    location: "Tokyo",
  },
  {
    name: "Aisha Tanaka",
    review:
      "I've been to salons all over the world, and LEY Beauty stands apart. The attention to detail, the quality of products, and the peaceful atmosphere — it's unmatched.",
    rating: 5,
    service: "Fulani Braids",
    location: "Naha",
  },
  {
    name: "Marie Dubois",
    review:
      "A true gem. The Senegalese Twists were immaculate — precise, elegant, and exactly what I envisioned. The booking process was seamless and the team so professional.",
    rating: 5,
    service: "Senegalese Twists",
    location: "Okinawa",
  },
];

const WHY_PILLARS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
    title: "Certified Braiding Artists",
    desc: "Internationally trained artists with deep passion for the craft. Every braid is a work of art.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s6-4 6-9c0 0-4 1-7 5z" />
      </svg>
    ),
    title: "100% Natural Products",
    desc: "Premium, toxin-free products that nourish your hair and scalp. Your health is our priority.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L2 12h3v9h6v-6h2v6h6v-9h3L12 3z" />
      </svg>
    ),
    title: "Exclusive Okinawa Studio",
    desc: "A tranquil sanctuary designed around Japanese principles of space, light, and intentional beauty.",
  },
];

export default function HomePage() {
  const servicesRef = useReveal();
  const whyRef = useReveal();
  const galleryRef = useReveal();
  const testimonialsRef = useReveal();

  return (
    <>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden noise-overlay">
        {/* Background effects */}
        <div className="absolute inset-0 bg-obsidian">
          <GeometricPattern variant="dots" />
          <GeometricPattern variant="mesh" />
        </div>

        {/* Right-side background image with gradient fade */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute top-0 right-0 bottom-0 w-full md:w-[55%] lg:w-[50%]">
            <Image
              src="/hero.jpg"
              alt=""
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
            />
            {/* Left gradient: obsidian → transparent */}
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/90 to-obsidian/10" />
            {/* Bottom gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
            {/* Top gradient for smooth blend */}
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 via-transparent to-transparent" />
            {/* Gold tint overlay */}
            <div className="absolute inset-0 bg-gold/[0.04] mix-blend-overlay" />
          </div>
        </div>

        {/* Hero large glow */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gold/[0.04] blur-[150px] pointer-events-none z-[2]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-coral/[0.03] blur-[120px] pointer-events-none z-[2]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 w-full">
          <div className="max-w-3xl">
            <div>
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-gold mb-8 opacity-0 animate-fade-in"
                style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-[12px] text-gold/90 font-medium tracking-wide">
                  Okinawa, Japan
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-heading text-[48px] sm:text-[56px] lg:text-[68px] font-normal leading-[1.09] mb-6">
                <AnimatedHeadline text="The Art of" baseDelay={400} />
                <span
                  className="shimmer-text block  animate-fade-up"
                  style={{ animationDelay: "700ms", animationFillMode: "forwards" }}
                > Braiding </span>
            
                <span
                  className="text-sand/80 block opacity-0 animate-fade-up"
                  style={{ animationDelay: "1000ms", animationFillMode: "forwards" }}
                >
                  Refined in Okinawa
                </span>
              </h1>

              {/* Subline */}
              <p
                className="text-muted-light text-[16px] leading-relaxed mb-10 max-w-md opacity-0 animate-fade-up"
                style={{ animationDelay: "1300ms", animationFillMode: "forwards" }}
              >
                Handcrafted braids. Natural care. A sanctuary for your beauty in Okinawa.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-wrap items-center gap-4 opacity-0 animate-fade-up"
                style={{ animationDelay: "1500ms", animationFillMode: "forwards" }}
              >
                <Link href="/booking" className="btn-gold">
                  Book Your Appointment
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <a href="#services" className="btn-ghost">
                  Our Services
                </a>
              </div>

              {/* Stats */}
              <div
                className="flex gap-10 mt-14 opacity-0 animate-fade-up"
                style={{ animationDelay: "1800ms", animationFillMode: "forwards" }}
              >
                {[
                  { value: "6+", label: "Styles" },
                  { value: "100%", label: "Natural" },
                  { value: "5.0", label: "Rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-heading text-[32px] font-normal text-gold leading-none">
                      {stat.value}
                    </p>
                    <p className="text-[11px] tracking-wider uppercase text-muted-light mt-1.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold/30 animate-float">
          <span className="text-[10px] tracking-widest uppercase font-medium">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-gold/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-gold/50 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────── */}
      <section id="services" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-obsidian-light z-0" />
        <GeometricPattern variant="grid" className="opacity-60 z-0" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent z-0" />

        <div ref={servicesRef} className="reveal max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-4">What We Offer</p>
            <h2 className="font-heading text-[42px] md:text-[52px] font-normal text-sand mb-5 leading-tight">
              Our Specialties
            </h2>
            <div className="gold-divider mb-6" />
            <p className="text-muted-light max-w-md mx-auto text-[14px] leading-relaxed">
              Each style is crafted with precision, care, and the finest natural
              products — designed to honour your beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service, i) => (
              <ServiceCard
                key={service.name}
                name={service.name}
                duration={service.duration}
                price={service.price}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────── */}
      <section id="why-us" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-obsidian z-0" />
        <GeometricPattern variant="mesh" className="z-0" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent z-0" />

        <div ref={whyRef} className="reveal max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-4">Our Promise</p>
            <h2 className="font-heading text-[42px] md:text-[52px] font-normal text-sand mb-5 leading-tight">
              Why Choose LEY Beauty
            </h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_PILLARS.map((pillar, i) => (
              <div
                key={pillar.title}
                className="card-modern group text-center p-10"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/[0.06] border border-gold/10 mb-7 text-gold/50 group-hover:text-gold group-hover:bg-gold/10 group-hover:border-gold/20 transition-all duration-500">
                  {pillar.icon}
                </div>

                <h3 className="font-heading text-[24px] font-normal text-sand mb-4">
                  {pillar.title}
                </h3>
                <p className="text-muted-light text-[13px] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ───────────────────────────────────────────────────── */}
      <section id="gallery" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-obsidian-light z-0" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent z-0" />

        <div ref={galleryRef} className="reveal max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-4">Our Work</p>
            <h2 className="font-heading text-[42px] md:text-[52px] font-normal text-sand mb-5 leading-tight">
              Gallery
            </h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-[550px]">
            <GalleryPlaceholder index={0} tall />
            <GalleryPlaceholder index={1} />
            <GalleryPlaceholder index={2} />
            <GalleryPlaceholder index={3} />
            <GalleryPlaceholder index={4} tall />
            <GalleryPlaceholder index={5} />
          </div>

          <div className="text-center mt-10">
            <a href="#" className="inline-flex items-center gap-2 text-[13px] text-muted-light hover:text-gold transition-colors">
              <span>Follow us on Instagram for more</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-obsidian z-0" />
        <GeometricPattern variant="dots" className="opacity-50 z-0" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent z-0" />

        <div ref={testimonialsRef} className="reveal max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-4">Client Stories</p>
            <h2 className="font-heading text-[42px] md:text-[52px] font-normal text-sand mb-5 leading-tight">
              What Our Clients Say
            </h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard
                key={t.name}
                name={t.name}
                review={t.review}
                rating={t.rating}
                service={t.service}
                location={t.location}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-obsidian-light z-0" />
        <GeometricPattern variant="mesh" className="z-0" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/[0.04] blur-[150px] pointer-events-none z-0" />

        <div className="relative z-[2] max-w-2xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-2xl overflow-hidden glass-gold shadow-lg">
              <Image
                src="/logo.png"
                alt="LEY Beauty"
                width={80}
                height={80}
                className="site-logo object-cover w-full h-full"
              />
            </div>
          </div>

          <p className="section-label mb-5">Ready to Transform?</p>
          <h2 className="font-heading text-[42px] md:text-[52px] lg:text-[60px] font-normal text-sand mb-5 leading-tight">
            Reserve Your
            <br />
            <span className="shimmer-text">LEY Beauty</span> Experience
          </h2>
          <div className="gold-divider mb-8" />
          <p className="text-muted-light text-[14px] leading-relaxed mb-10 max-w-md mx-auto">
            Secure your appointment today. Our calendar fills quickly —
            <span className="text-sand"> book ahead</span> to guarantee your
            preferred date and time.
          </p>
          <Link href="/booking" className="btn-gold inline-flex">
            Book Your Appointment
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
