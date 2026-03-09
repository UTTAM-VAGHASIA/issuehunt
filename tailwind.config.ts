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
        background: "#0A0A0F",
        surface: "#111118",
        border: "#1E1E2E",
        accent: "#F97316",
        "text-primary": "#F1F5F9",
        "text-muted": "#6B7280",
        success: "#22C55E",
        danger: "#EF4444",
        teal: "#14B8A6",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "8px",
        tag: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
