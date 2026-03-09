export const tokens = {
  colors: {
    background: "#0A0A0F",
    surface: "#111118",
    border: "#1E1E2E",
    accent: "#F97316",
    textPrimary: "#F1F5F9",
    textMuted: "#6B7280",
    success: "#22C55E",
    danger: "#EF4444",
    teal: "#14B8A6",
  },
  spacing: {
    cardPadding: "32px",
    sectionGap: "48px",
    sidebarItemPy: "12px",
  },
  radius: {
    card: "16px",
    button: "8px",
    tag: "6px",
    avatar: "9999px",
  },
} as const;

export const languageColors: Record<string, { bg: string; text: string; border: string }> = {
  Python: {
    bg: "rgba(255,212,59,0.1)",
    text: "#FFD43B",
    border: "rgba(255,212,59,0.2)",
  },
  TypeScript: {
    bg: "rgba(49,120,198,0.1)",
    text: "#3178C6",
    border: "rgba(49,120,198,0.2)",
  },
  JavaScript: {
    bg: "rgba(247,223,30,0.1)",
    text: "#F7DF1E",
    border: "rgba(247,223,30,0.2)",
  },
  Rust: {
    bg: "rgba(222,165,132,0.1)",
    text: "#DEA584",
    border: "rgba(222,165,132,0.2)",
  },
  Go: {
    bg: "rgba(0,173,216,0.1)",
    text: "#00ADD8",
    border: "rgba(0,173,216,0.2)",
  },
  Ruby: {
    bg: "rgba(204,52,45,0.1)",
    text: "#CC342D",
    border: "rgba(204,52,45,0.2)",
  },
  CSS: {
    bg: "rgba(86,61,124,0.1)",
    text: "#563D7C",
    border: "rgba(86,61,124,0.2)",
  },
  "C++": {
    bg: "rgba(243,75,125,0.1)",
    text: "#F34B7D",
    border: "rgba(243,75,125,0.2)",
  },
};
