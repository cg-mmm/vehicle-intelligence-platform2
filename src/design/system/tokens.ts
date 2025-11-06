export const colors = {
  // These values are for reference only
  // The actual colors are defined in app/globals.css
  // Current theme: Space Gray

  bg: "#0d0d0d", // var(--bg)
  surface: "#1a1a1a", // var(--surface)
  surfaceAlt: "#242424", // var(--surface-2)
  muted: "#2e2e2e", // var(--muted)

  fg: "#e0e0e0", // var(--fg)
  fgMuted: "#9e9e9e", // var(--fg-muted)

  primary: "#5ab963", // var(--primary) - Aurora Green
  primaryFg: "#0d0d0d", // var(--primary-fg)

  secondary: "#7f00ff", // var(--secondary) - Deep Violet
  secondaryFg: "#ffffff", // var(--secondary-fg)

  accent: "#5ab963", // var(--accent) - Aurora Green
  accentFg: "#0d0d0d", // var(--accent-fg)

  ring: "#5ab963", // var(--ring)

  success: "#5ab963", // var(--success)
  warning: "#ffa726", // var(--warning)
  danger: "#ef5350", // var(--danger)

  // Gradient colors
  gradA: "#232526", // Space Gray
  gradB: "#414345", // Cosmic Graphite
} as const

export const gradients = {
  brand: `linear-gradient(135deg, #232526, #414345)`, // var(--grad-brand)
  subtle: `linear-gradient(180deg, rgba(255,255,255,0.02), transparent)`, // var(--grad-subtle)
}

// ========================================
// TO CHANGE THE ENTIRE SITE THEME:
// Edit the :root section in app/globals.css
// All components will automatically update
// ========================================
