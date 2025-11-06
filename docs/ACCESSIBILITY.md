# Accessibility Guide

## Overview

This project implements WCAG AA compliance across all components, ensuring a minimum 4.5:1 contrast ratio for normal text and 3:1 for large text (18pt+ or 14pt+ bold).

## Semantic Color Tokens

All colors are defined in `app/globals.css` as CSS custom properties. **Never use hardcoded hex values in components.**

### Text Colors

\`\`\`css
.text-strong  /* Highest emphasis - #fafafa (21:1 contrast) */
.text-fg      /* Body text - #e7e9ee (16:1 contrast) */
.text-muted   /* Secondary text - #b6bccb (8:1 contrast) */
.text-subtle  /* Tertiary text - #8d94a6 (5:1 contrast) */
\`\`\`

### Background Colors

\`\`\`css
.bg-surface-0  /* Page background - #0b0b0c */
.bg-surface-1  /* Cards/modules - #111214 */
.bg-surface-2  /* Elevated surfaces - #17181b */
.bg-surface-3  /* Highest elevation - #1f2125 */
\`\`\`

## ContrastGuard Component

For dynamic backgrounds or images, use the `ContrastGuard` wrapper:

\`\`\`tsx
import { ContrastGuard } from "@/src/components/a11y/ContrastGuard"

<ContrastGuard bg="#1a1a1a">
  <p>This text will automatically adjust for optimal contrast</p>
</ContrastGuard>
\`\`\`

## Gradient Overlays

For text over images or gradients, apply overlay classes:

\`\`\`tsx
<div className="gradient-readable-light">
  {/* Light text on dark overlay */}
  <h1 className="text-strong">Heading</h1>
</div>
\`\`\`

## Development Mode

Enable contrast checking during development:

\`\`\`bash
NEXT_PUBLIC_A11Y_DEV=1 npm run dev
\`\`\`

This will:
- Highlight elements with insufficient contrast in red
- Log contrast ratios to console
- Help identify accessibility issues before production

## QC Integration

The build process includes automated contrast checking:

\`\`\`ts
import { assertContrastForArticle } from "@/src/lib/qc/contrastRule"

const { errors } = assertContrastForArticle(html)
// Fails build if any text has < 4.5:1 contrast
\`\`\`

## Best Practices

1. **Always use semantic tokens** - Never hardcode colors
2. **Test with ContrastGuard** - For dynamic content
3. **Apply overlays** - For text over images
4. **Run dev mode checks** - Before committing
5. **Verify in QC** - Automated checks catch regressions

## Changing Theme Colors

To update the site theme, edit only `app/globals.css` `:root` section. All components will automatically inherit the new colors while maintaining WCAG AA compliance.
