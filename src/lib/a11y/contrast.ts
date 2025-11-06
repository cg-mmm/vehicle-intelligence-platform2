function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

/**
 * Calculate relative luminance (WCAG formula)
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return 1

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Pick the most readable foreground color from candidates
 * @param fgCandidates - Array of hex colors to test
 * @param bg - Background hex color
 * @param minRatio - Minimum contrast ratio (default 4.5 for WCAG AA)
 * @returns Best foreground color that meets contrast requirements
 */
export function pickReadable(fgCandidates: string[], bg: string, minRatio = 4.5): string {
  let bestColor = fgCandidates[0]
  let bestRatio = 0

  for (const fg of fgCandidates) {
    const ratio = getContrastRatio(fg, bg)
    if (ratio > bestRatio) {
      bestRatio = ratio
      bestColor = fg
    }
  }

  // If no candidate meets minimum, return black or white based on background luminance
  if (bestRatio < minRatio) {
    const bgRgb = hexToRgb(bg)
    if (bgRgb) {
      const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)
      return bgLum > 0.5 ? "#0b0b0c" : "#fafafa"
    }
  }

  return bestColor
}

/**
 * Check if a color combination meets WCAG AA standards
 */
export function meetsWCAG_AA(fg: string, bg: string, largeText = false): boolean {
  const ratio = getContrastRatio(fg, bg)
  return largeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * Check if a color combination meets WCAG AAA standards
 */
export function meetsWCAG_AAA(fg: string, bg: string, largeText = false): boolean {
  const ratio = getContrastRatio(fg, bg)
  return largeText ? ratio >= 4.5 : ratio >= 7
}
