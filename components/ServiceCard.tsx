"use client";

import Link from "next/link";

interface ServiceCardProps {
  name: string;
  duration: string;
  price: number;
  index: number;
}

export default function ServiceCard({
  name,
  duration,
  price,
  index,
}: ServiceCardProps) {
  return (
    <div
      className="card-modern group relative p-7 flex flex-col h-full"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-gold/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Number badge */}
      <div className="flex items-center justify-between mb-6 relative">
        <span className="text-[11px] font-mono text-gold/40 tracking-widest">
          0{index + 1}
        </span>
        <div className="flex items-center gap-1.5">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-muted-light/60"
          >
            <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
          </svg>
          <span className="text-muted-light text-[12px]">{duration}</span>
        </div>
      </div>

      {/* Service name */}
      <h3 className="font-heading text-[26px] font-normal text-sand mb-3 leading-tight group-hover:text-gold transition-colors duration-400 relative">
        {name}
      </h3>

      {/* Subtle line */}
      <div className="w-10 h-[1px] bg-gradient-to-r from-gold/30 to-transparent mb-6 group-hover:w-16 transition-all duration-500" />

      <div className="mt-auto relative">
        {/* Price + CTA */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-muted-light uppercase tracking-widest mb-1">
              From
            </p>
            <span className="text-gold text-[28px] font-heading font-normal leading-none">
              ${price.toLocaleString()}
            </span>
          </div>
          <Link
            href={`/booking?service=${encodeURIComponent(name)}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold/10 hover:bg-gold/20 text-gold text-[12px] font-medium tracking-wider uppercase rounded-xl border border-gold/20 hover:border-gold/40 transition-all duration-300 group-hover:shadow-[0_4px_16px_rgba(200,149,42,0.15)]"
          >
            Book
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
