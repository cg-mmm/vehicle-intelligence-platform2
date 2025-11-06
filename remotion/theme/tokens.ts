export const getThemeTokens = () => {
  // In browser context, read from CSS variables
  if (typeof window !== "undefined") {
    const style = getComputedStyle(document.documentElement)
    return {
      colors: {
        bg: style.getPropertyValue("--bg").trim(),
        fg: style.getPropertyValue("--fg").trim(),
        accent: style.getPropertyValue("--accent").trim(),
        accent2: style.getPropertyValue("--accent-2").trim(),
        primary: style.getPropertyValue("--primary").trim(),
        gradientStart: style.getPropertyValue("--gradient-start").trim(),
        gradientEnd: style.getPropertyValue("--gradient-end").trim(),
      },
      font: {
        family: style.getPropertyValue("--font-sans").trim() || "'Inter', sans-serif",
        sizeBase: "1rem",
        sizeHeading: "2rem",
      },
      shadow: style.getPropertyValue("--shadow-soft").trim(),
    }
  }

  // Server-side fallback: Cobalt Volt theme defaults
  return {
    colors: {
      bg: "0 0% 100%", // White
      fg: "222 47% 11%", // Dark text
      accent: "210 100% 50%", // Signal Blue
      accent2: "180 100% 50%", // Ice Cyan
      primary: "45 100% 51%", // Volt Yellow
      gradientStart: "220 90% 20%", // Deep Cobalt
      gradientEnd: "180 100% 50%", // Ice Cyan
    },
    font: {
      family: "'Inter', sans-serif",
      sizeBase: "1rem",
      sizeHeading: "2rem",
    },
    shadow: "0 2px 8px rgba(0,0,0,0.08)",
  }
}

// Convert HSL string to CSS hsl() format
export const hsl = (hslString: string) => `hsl(${hslString})`

// Cobalt Volt theme constants
export const COBALT_VOLT = {
  name: "Cobalt Volt",
  colors: {
    deepCobalt: "220 90% 20%",
    signalBlue: "210 100% 50%",
    iceCyan: "180 100% 50%",
    voltYellow: "45 100% 51%",
    emberOrange: "25 95% 53%",
  },
  gradients: {
    hero: "linear-gradient(115deg, hsl(220 90% 20%), hsl(210 100% 50%), hsl(180 100% 50%))",
    cta: "linear-gradient(135deg, hsl(45 100% 51%), hsl(25 95% 53%))",
  },
  animations: {
    voltWaves: "voltWaves 20s ease-in-out infinite",
    lightningStreaks: "lightningStreaks 22s linear infinite",
  },
}
