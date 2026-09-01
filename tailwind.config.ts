import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#071426",
          dark: "#020617",
          navy: "#0B2545",
          light: "#134074",
        },
        gold: {
          DEFAULT: "#D4AF37",
          bright: "#F5C542",
          light: "#FBF3D5",
          dark: "#A9811C",
          gradient: "linear-gradient(135deg, #D4AF37 0%, #F5C542 50%, #D4AF37 100%)",
        },
        bste: {
          navy: {
            DEFAULT: "#0B2545",
            50: "#F0F4F8",
            100: "#D9E2EC",
            200: "#BCCCDC",
            300: "#9FB3C8",
            400: "#627D98",
            500: "#486581",
            600: "#334E68",
            700: "#134074",
            800: "#0B2545",
            900: "#071426",
            950: "#020617",
          },
          gold: {
            DEFAULT: "#D4AF37",
            50: "#FDFBF5",
            100: "#FAF4E1",
            200: "#F4E6BD",
            300: "#EED798",
            400: "#E5C56B",
            500: "#D4AF37",
            600: "#B89223",
            700: "#8C6D15",
            800: "#5E480A",
            900: "#312503",
          },
          emerald: {
            DEFAULT: "#059669",
            50: "#ECFDF5",
            100: "#D1FAE5",
            500: "#10B981",
            600: "#059669",
            700: "#047857",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "gold-sm": "0 0 15px -3px rgba(212, 175, 55, 0.25)",
        "gold-md": "0 0 25px -5px rgba(212, 175, 55, 0.35)",
        "gold-lg": "0 0 40px -8px rgba(212, 175, 55, 0.45)",
        "navy-lg": "0 20px 40px -15px rgba(2, 6, 23, 0.4)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "shimmer": "shimmer 2.5s infinite",
        "scan": "scan 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        scan: {
          "0%, 100%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
