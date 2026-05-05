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
        background: "#F0F9FF",
        foreground: "#2C3E50",
        "brand-sky": "#4DB8E5",
        "brand-deep": "#1E5AA8",
        "brand-soft": "#F0F9FF",
        "brand-yellow": "#FFD43B",
        "brand-orange": "#FFA726",
        "brand-pink": "#FF4D6D",
        "brand-orange-end": "#FF8C42",
        "brand-text": "#2C3E50",
        "brand-subtext": "#6C8AA6",
        "brand-border": "#D6ECF8",
      },
      fontFamily: {
        display: ["var(--font-avant-garde)", "sans-serif"],
        body: ["var(--font-avant-garde)", "sans-serif"],
        handwritten: ["var(--font-cooper)", "cursive"],
        serif: ["var(--font-cooper)", "serif"],
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        marquee: "marquee 30s linear infinite",
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
        "grain": "grain 0.5s steps(1) infinite",
        "bubble-wobble": "bubble-wobble 6s ease-in-out infinite",
      },
      keyframes: {
        "bubble-wobble": {
          "0%, 100%": { borderRadius: "50% 50% 50% 50% / 50% 50% 50% 50%" },
          "33%": { borderRadius: "55% 45% 52% 48% / 48% 52% 50% 50%" },
          "66%": { borderRadius: "48% 52% 45% 55% / 52% 48% 53% 47%" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "0.97" },
          "50%": { opacity: "1" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-1%, -1%)" },
          "20%": { transform: "translate(1%, 1%)" },
          "30%": { transform: "translate(-2%, 1%)" },
          "40%": { transform: "translate(2%, -1%)" },
          "50%": { transform: "translate(-1%, 2%)" },
          "60%": { transform: "translate(2%, 1%)" },
          "70%": { transform: "translate(-1%, -2%)" },
          "80%": { transform: "translate(1%, -1%)" },
          "90%": { transform: "translate(-2%, -1%)" },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
