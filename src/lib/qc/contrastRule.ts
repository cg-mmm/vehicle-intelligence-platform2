import { getContrastRatio } from "../a11y/contrast"

interface ContrastError {
  selector: string
  fg: string
  bg: string
  ratio: number
  required: number
}

/**
 * QC Rule: Assert contrast for article HTML
 * Checks server-rendered HTML for WCAG AA compliance
 */
export function assertContrastForArticle(html: string): { errors: ContrastError[] } {
  const errors: ContrastError[] = []

  // Map of CSS classes to their token colors (from globals.css)
  const colorMap: Record<string, string> = {
    "text-fg": "#e0e0e0",
    "text-fg-strong": "#fafafa",
    "text-fg-muted": "#9e9e9e",
    "text-muted-foreground": "#9e9e9e",
    "text-foreground": "#e0e0e0",
    "bg-surface": "#1a1a1a",
    "bg-surface-2": "#242424",
    "bg-background": "#0d0d0d",
    "bg-muted": "#2e2e2e",
  }

  // Simple HTML parser to extract class combinations
  const elementRegex = /<(\w+)[^>]*class="([^"]*)"[^>]*>/g
  let match

  while ((match = elementRegex.exec(html)) !== null) {
    const tag = match[1]
    const classes = match[2].split(" ")

    // Find text and background classes
    const textClass = classes.find((c) => c.startsWith("text-"))
    const bgClass = classes.find((c) => c.startsWith("bg-"))

    if (textClass && bgClass) {
      const fg = colorMap[textClass]
      const bg = colorMap[bgClass]

      if (fg && bg) {
        const ratio = getContrastRatio(fg, bg)
        const isLargeText = tag.match(/h[1-6]/) !== null
        const required = isLargeText ? 3 : 4.5

        if (ratio < required) {
          errors.push({
            selector: `${tag}.${classes.join(".")}`,
            fg,
            bg,
            ratio: Number.parseFloat(ratio.toFixed(2)),
            required,
          })
        }
      }
    }
  }

  return { errors }
}
