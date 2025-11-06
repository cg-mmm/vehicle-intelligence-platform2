module.exports = {
  theme: {
    extend: {
      colors: {
        bg: "var(--ds-bg)",
        surface: "var(--ds-surface)",
        surfaceAlt: "var(--ds-surface-alt)",
        muted: "var(--ds-muted)",
        fg: "var(--ds-fg)",
        "fg-muted": "var(--ds-fg-muted)",
        primary: "var(--ds-primary)",
        "primary-fg": "var(--ds-primary-fg)",
        secondary: "var(--ds-secondary)",
        "secondary-fg": "var(--ds-secondary-fg)",
        accent: "var(--ds-accent)",
        "accent-fg": "var(--ds-accent-fg)",
        ring: "var(--ds-ring)",
        success: "var(--ds-success)",
        warning: "var(--ds-warning)",
        danger: "var(--ds-danger)",
      },
      backgroundImage: {
        "grad-brand": "var(--ds-grad-brand)",
        "grad-subtle": "var(--ds-grad-subtle)",
      },
      ringColor: {
        DEFAULT: "var(--ds-ring)",
      },
      borderColor: {
        DEFAULT: "color-mix(in oklab, var(--ds-fg) 10%, transparent)",
      },
    },
  },
}
