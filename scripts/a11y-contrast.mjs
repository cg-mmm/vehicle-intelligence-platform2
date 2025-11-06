const tokens = {
  bg: "#0B0F14",
  surface: "#121824",
  surface2: "#172133",
  muted: "#1D2636",
  fg: "#E7ECF5",
  fgMuted: "#9FAAC1",
  primary: "#5AB963",
  primaryFg: "#05150E",
  secondary: "#7B5CF3",
  secondaryFg: "#F5F3FF",
  accent: "#2AD4B7",
  accentFg: "#062E28",
}

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// Calculate relative luminance
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return 0

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

const pairs = [
  { bg: tokens.bg, fg: tokens.fg, name: "bg:fg" },
  { bg: tokens.surface, fg: tokens.fg, name: "surface:fg" },
  { bg: tokens.surface2, fg: tokens.fg, name: "surface-2:fg" },
  { bg: tokens.muted, fg: tokens.fg, name: "muted:fg" },
  { bg: tokens.primary, fg: tokens.primaryFg, name: "primary:primary-fg" },
  { bg: tokens.secondary, fg: tokens.secondaryFg, name: "secondary:secondary-fg" },
  { bg: tokens.accent, fg: tokens.accentFg, name: "accent:accent-fg" },
  { bg: tokens.muted, fg: tokens.fgMuted, name: "muted:fg-muted" },
  { bg: tokens.surface, fg: tokens.fgMuted, name: "surface:fg-muted" },
]

console.log("\n🎨 Design Token Contrast Validation\n")
console.log("WCAG AA Standard: 4.5:1 for normal text\n")
console.log("=" .repeat(60))

let failed = false

pairs.forEach(({ bg, fg, name }) => {
  const ratio = getContrastRatio(bg, fg)
  const passes = ratio >= 4.5
  const status = passes ? "✅ PASS" : "❌ FAIL"

  console.log(`${status} ${name.padEnd(25)} ${ratio.toFixed(2)}:1`)

  if (!passes) {
    failed = true
    console.log(`   ⚠️  ${bg} on ${fg} has insufficient contrast`)
  }
})

console.log("=" .repeat(60))
console.log("\n")

if (failed) {
  console.error("❌ Contrast validation failed. Please adjust token colors in app/globals.css\n")
  process.exit(1)
} else {
  console.log("✅ All contrast pairs pass WCAG AA standards.\n")
  process.exit(0)
}
