"use client";

interface GeometricPatternProps {
  className?: string;
  variant?: "dots" | "grid" | "mesh";
}

export default function GeometricPattern({
  className = "",
  variant = "dots",
}: GeometricPatternProps) {
  if (variant === "mesh") {
    return (
      <div
        className={`absolute inset-0 pointer-events-none ${className}`}
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-coral/[0.02] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-sage/[0.02] blur-[80px]" />
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="modern-grid"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(200,149,42,0.04)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#modern-grid)" />
      </svg>
    );
  }

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="dot-pattern"
          x="0"
          y="0"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="16" cy="16" r="0.8" fill="rgba(200,149,42,0.12)" />
        </pattern>
        <radialGradient id="dot-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="dot-mask">
          <rect width="100%" height="100%" fill="url(#dot-fade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" mask="url(#dot-mask)" />
    </svg>
  );
}
