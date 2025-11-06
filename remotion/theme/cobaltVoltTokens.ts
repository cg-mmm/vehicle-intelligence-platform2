export const cobaltVoltTheme = {
  // Brand Core - Gradient System
  colors: {
    gradientStart: "#0b2a6b", // Deep Cobalt
    gradientMid: "#1f6feb", // Signal Blue
    gradientEnd: "#6ee7ff", // Ice Cyan
    accent: "#ffd400", // Volt Yellow (Primary CTA)
    accent2: "#ff8c00", // Ember Orange (CTA hover/highlights)

    // Surfaces & Text
    bg: "#f7f9fc", // app canvas
    panel: "#ffffff", // cards, panels
    muted: "#edf2f7", // subtle fills
    border: "#d2dbe8", // dividers
    fg: "#0a0f1a", // primary text
    fgMuted: "#475569", // secondary text

    // System States
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#e11d48",
    link: "#2563eb",
  },

  // Gradients
  gradients: {
    brand: "linear-gradient(135deg, #0b2a6b, #1f6feb, #6ee7ff)",
    cta: "linear-gradient(135deg, #ffd400, #ff8c00)",
    brandRadial:
      "radial-gradient(1200px 600px at -10% 0%, rgba(31, 111, 235, 0.18), transparent 55%), radial-gradient(900px 500px at 110% 20%, rgba(110, 231, 255, 0.18), transparent 60%)",
  },

  // Typography
  fonts: {
    heading: "var(--font-geist-sans), system-ui, sans-serif",
    body: "var(--font-geist-sans), system-ui, sans-serif",
    mono: "var(--font-geist-mono), monospace",
  },

  // Shadows
  shadows: {
    soft: "0 8px 24px rgba(11, 16, 32, 0.1)",
    cta: "0 10px 28px rgba(255, 140, 0, 0.3)",
    ctaHover: "0 12px 36px rgba(255, 140, 0, 0.38)",
  },

  // Animation Timings (matching Framer Motion easing)
  easing: {
    // Framer Motion default: [0.22, 1, 0.36, 1]
    smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
    spring: { damping: 15, stiffness: 100 },
  },

  // Animation Durations
  durations: {
    voltWaves: 22, // seconds
    ctaPulse: 6, // seconds
  },
} as const

export type CobaltVoltTheme = typeof cobaltVoltTheme
