export interface ThemeTokens {
  colors: {
    gradientStart: string
    gradientMid: string
    gradientEnd: string
    accent: string // Primary CTA
    accent2: string // Secondary CTA/hover
    bg: string
    panel: string
    fg: string
    fgMuted: string
    primary: string
    success: string
    warning: string
    error: string
  }
  gradients: {
    brand: string
    cta: string
  }
  shadows: {
    soft: string
    cta: string
  }
  animations: {
    voltWaves: string
    ctaPulse: string
  }
  fonts: {
    sans: string
    mono: string
  }
}

/**
 * Get current theme tokens for Cobalt Volt
 * These values are synced with app/globals.css
 */
export function getCobaltVoltTokens(): ThemeTokens {
  return {
    colors: {
      gradientStart: "#0b2a6b", // Deep Cobalt
      gradientMid: "#1f6feb", // Signal Blue
      gradientEnd: "#6ee7ff", // Ice Cyan
      accent: "#ffd400", // Volt Yellow (Primary CTA)
      accent2: "#ff8c00", // Ember Orange (CTA hover)
      bg: "#f7f9fc",
      panel: "#ffffff",
      fg: "#0a0f1a",
      fgMuted: "#475569",
      primary: "#1f6feb",
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#e11d48",
    },
    gradients: {
      brand: "linear-gradient(135deg, #0b2a6b, #1f6feb, #6ee7ff)",
      cta: "linear-gradient(135deg, #ffd400, #ff8c00)",
    },
    shadows: {
      soft: "0 8px 24px rgba(11, 16, 32, 0.1)",
      cta: "0 10px 28px rgba(255, 140, 0, 0.3)",
    },
    animations: {
      voltWaves: "voltWaves 22s ease-in-out infinite",
      ctaPulse: "ctaPulse 6s ease-in-out infinite",
    },
    fonts: {
      sans: "Inter, system-ui, sans-serif",
      mono: "Geist Mono, monospace",
    },
  }
}

/**
 * Convert theme tokens to Remotion-compatible brand pack
 */
export function themeToBrandPack(theme: ThemeTokens, siteConfig: any) {
  return {
    siteName: siteConfig.siteName,
    siteUrl: siteConfig.siteUrl,
    colors: {
      primary: theme.colors.primary,
      accent: theme.colors.accent,
      background: theme.colors.bg,
      text: theme.colors.fg,
    },
    fonts: {
      heading: theme.fonts.sans,
      body: theme.fonts.sans,
    },
    organization: {
      name: siteConfig.siteName,
      url: siteConfig.siteUrl,
      logo: "/logo.png",
    },
    // Remotion-specific overrides for video aesthetics
    videoPalette: {
      bg: theme.colors.gradientStart, // Dark background for video
      primary: theme.colors.gradientMid,
      accent: theme.colors.accent,
      text: "#ffffff", // White text for dark video background
    },
    videoTypeface: {
      heading: theme.fonts.sans,
      body: theme.fonts.sans,
    },
    // Pass full theme for advanced animations
    theme,
  }
}

/**
 * Browser-side theme extraction (reads from CSS variables)
 * Use this in client components to get live theme values
 */
export function extractThemeFromDOM(): ThemeTokens | null {
  if (typeof window === "undefined") return null

  const style = getComputedStyle(document.documentElement)

  return {
    colors: {
      gradientStart: style.getPropertyValue("--gradient-start").trim(),
      gradientMid: style.getPropertyValue("--gradient-mid").trim(),
      gradientEnd: style.getPropertyValue("--gradient-end").trim(),
      accent: style.getPropertyValue("--accent").trim(),
      accent2: style.getPropertyValue("--accent-2").trim(),
      bg: style.getPropertyValue("--bg").trim(),
      panel: style.getPropertyValue("--panel").trim(),
      fg: style.getPropertyValue("--fg").trim(),
      fgMuted: style.getPropertyValue("--fg-muted").trim(),
      primary: style.getPropertyValue("--primary").trim(),
      success: style.getPropertyValue("--success").trim(),
      warning: style.getPropertyValue("--warning").trim(),
      error: style.getPropertyValue("--error").trim(),
    },
    gradients: {
      brand: `linear-gradient(135deg, ${style.getPropertyValue("--gradient-start").trim()}, ${style.getPropertyValue("--gradient-mid").trim()}, ${style.getPropertyValue("--gradient-end").trim()})`,
      cta: `linear-gradient(135deg, ${style.getPropertyValue("--accent").trim()}, ${style.getPropertyValue("--accent-2").trim()})`,
    },
    shadows: {
      soft: style.getPropertyValue("--shadow-soft").trim(),
      cta: style.getPropertyValue("--shadow-cta").trim(),
    },
    animations: {
      voltWaves: "voltWaves 22s ease-in-out infinite",
      ctaPulse: "ctaPulse 6s ease-in-out infinite",
    },
    fonts: {
      sans: style.getPropertyValue("--font-sans").trim() || "Inter, system-ui, sans-serif",
      mono: style.getPropertyValue("--font-mono").trim() || "Geist Mono, monospace",
    },
  }
}
