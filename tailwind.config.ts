import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "var(--bg-primary)",
        "obsidian-light": "var(--bg-secondary)",
        "obsidian-mid": "#141920",
        surface: "var(--bg-surface)",
        "surface-light": "#1C2128",
        border: "var(--border-base)",
        "border-light": "var(--border-accent)",
        gold: "var(--gold)",
        "gold-light": "var(--gold-light)",
        "gold-dim": "#8A6520",
        sand: "var(--text-primary)",
        "sand-dim": "var(--text-secondary)",
        coral: "#C4593A",
        sage: "#6B8F71",
        muted: "var(--text-muted)",
        "muted-light": "var(--text-secondary)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "Helvetica", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fadeIn 1s ease forwards",
        "pulse-gold": "pulseGold 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "glow-border": "glowBorder 4s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "gradient-x": "gradientX 6s ease infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(200,149,42,0)" },
          "50%": { boxShadow: "0 0 40px 8px rgba(200,149,42,0.15)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glowBorder: {
          "0%, 100%": { borderColor: "rgba(200,149,42,0.2)" },
          "50%": { borderColor: "rgba(200,149,42,0.6)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #C8952A, #E0A830, #C4593A, #C8952A)",
        "dark-gradient":
          "linear-gradient(180deg, #080B0F 0%, #0D1117 50%, #080B0F 100%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(200,149,42,0.05) 0%, rgba(200,149,42,0) 100%)",
        "mesh-gradient":
          "radial-gradient(at 40% 20%, rgba(200,149,42,0.08) 0%, transparent 50%), radial-gradient(at 80% 80%, rgba(196,89,58,0.06) 0%, transparent 50%), radial-gradient(at 10% 80%, rgba(107,143,113,0.05) 0%, transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
