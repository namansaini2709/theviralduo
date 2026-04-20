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
        background: "#080808",
        foreground: "#F5F0E8",
        accent: "#E63946",
        "accent-warm": "#FF6B6B",
        "film-black": "#080808",
        "film-cream": "#F5F0E8",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        handwritten: ["var(--font-caveat)", "cursive"],
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        marquee: "marquee 30s linear infinite",
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
        "grain": "grain 0.5s steps(1) infinite",
      },
      keyframes: {
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
    },
  },
  plugins: [],
};
export default config;
