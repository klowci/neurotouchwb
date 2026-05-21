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
        navy:       "#0E1621",
        "navy-mid": "#162035",
        "navy-card":"#1a2a4a",
        blue:       "#223382",
        "blue-lt":  "#2d4499",
        orange:     "#FF7124",
        "orange-lt":"#FF8C47",
        beige:      "#E8DFD5",
        tan:        "#D4C9B5",
        cream:      "#F4F1EC",
        ink:        "#202124",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "vignette": "radial-gradient(ellipse at center, transparent 40%, rgba(14,22,33,0.95) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%":      { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        "glow-ping": {
          "0%":   { transform: "scale(1)",   opacity: "1" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "word-reveal": {
          "0%":   { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up":    "fade-up 0.6s ease forwards",
        "fade-in":    "fade-in 0.5s ease forwards",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "float":      "float 4s ease-in-out infinite",
        "glow-ping":  "glow-ping 1.5s ease-out infinite",
        "word-reveal":"word-reveal 0.3s ease forwards",
      },
    },
  },
  plugins: [],
};
export default config;
