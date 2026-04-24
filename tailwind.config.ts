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
        navy: {
          DEFAULT: "#0B2A4A",
          light: "#14406F",
        },
        amber: {
          DEFAULT: "#FFB627",
          light: "#FFCB66",
        },
        mint: {
          DEFAULT: "#16C79A",
        },
        ink: {
          DEFAULT: "#1A1D23",
        },
        muted: {
          DEFAULT: "#5B6473",
        },
        cloud: {
          DEFAULT: "#F7F9FC",
        },
        mist: {
          DEFAULT: "#E6EAF2",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "Space Grotesk", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(230, 57, 70, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(230, 57, 70, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
