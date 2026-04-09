"use client";

interface TestimonialCardProps {
  name: string;
  review: string;
  rating?: number;
  location?: string;
  service?: string;
}

export default function TestimonialCard({
  name,
  review,
  rating = 5,
  location,
  service,
}: TestimonialCardProps) {
  return (
    <div className="card-modern group p-8 flex flex-col h-full">
      {/* Stars */}
      <div className="flex gap-1 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`transition-colors duration-300 ${
              i < rating
                ? "text-gold group-hover:text-gold-light"
                : "text-muted/20"
            }`}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      {/* Review text */}
      <p className="text-sand/70 text-[14px] leading-[1.75] flex-1 mb-8 font-body">
        &ldquo;{review}&rdquo;
      </p>

      {/* Client info */}
      <div className="flex items-center gap-3">
        {/* Avatar placeholder */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center flex-shrink-0 border border-gold/10">
          <span className="text-gold text-sm font-heading font-medium">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-sand text-sm font-medium">{name}</p>
          {(location || service) && (
            <p className="text-muted-light text-[11px] tracking-wide mt-0.5">
              {service}
              {location && service && " · "}
              {location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
