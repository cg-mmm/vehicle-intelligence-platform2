export const chartTheme = {
  stroke1: () => getVar("--ds-primary"),
  stroke2: () => getVar("--ds-secondary"),
  stroke3: () => getVar("--ds-accent"),
  fill1: "color-mix(in oklab, var(--ds-primary) 22%, transparent)",
  fill2: "color-mix(in oklab, var(--ds-secondary) 22%, transparent)",
  fill3: "color-mix(in oklab, var(--ds-accent) 22%, transparent)",
  grid: "color-mix(in oklab, var(--ds-fg) 12%, transparent)",
  axis: "color-mix(in oklab, var(--ds-fg) 70%, white)",
  background: () => getVar("--ds-surface"),
  text: () => getVar("--ds-fg"),
}

function getVar(name: string): string {
  if (typeof window === "undefined") return "#000000"
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

// Export for use in chart components
export function getChartColors() {
  return {
    primary: chartTheme.stroke1(),
    secondary: chartTheme.stroke2(),
    accent: chartTheme.stroke3(),
    background: chartTheme.background(),
    text: chartTheme.text(),
  }
}
