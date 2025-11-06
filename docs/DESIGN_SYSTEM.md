# Design System Documentation

## ⚡ Single-Source Color System

**The entire site's colors are controlled from ONE file: `app/globals.css`**

All other files reference this central theme, making it incredibly easy to change your site's appearance.

## 🎨 Quick Start: Changing Colors

### Step 1: Open `app/globals.css`

Find the `:root` section at the top (around line 8).

### Step 2: Edit the Color Values

\`\`\`css
:root {
  /* ========================================
     SPACE GRAY DESIGN SYSTEM
     Change these values to re-skin the entire site
     ======================================== */

  /* Brand gradient */
  --brand-gradient-start: #232526; /* Space Gray */
  --brand-gradient-end: #414345;   /* Cosmic Graphite */

  /* Core surfaces */
  --bg: #0d0d0d;           /* Very dark background */
  --surface: #1a1a1a;      /* Dark surface */
  --surface-2: #242424;    /* Slightly lighter surface */
  --muted: #2e2e2e;        /* Subtle borders/fills */

  /* Text */
  --fg: #e0e0e0;           /* Light gray text */
  --fg-muted: #9e9e9e;     /* Muted gray text */

  /* Actions */
  --primary: #5ab963;      /* Aurora Green */
  --primary-fg: #0d0d0d;   /* Dark label on green */
  --secondary: #7f00ff;    /* Deep Violet */
  --secondary-fg: #ffffff; /* White label on violet */
  --accent: #5ab963;       /* Aurora Green accent */
  --accent-fg: #0d0d0d;    /* Dark label on green */

  /* HSL versions for gradient blobs */
  --primary-hsl: 125 40% 54%;   /* Aurora Green */
  --secondary-hsl: 270 100% 50%; /* Deep Violet */
  --accent-hsl: 125 40% 54%;    /* Aurora Green */

  /* Status */
  --success: #5ab963;      /* Aurora Green */
  --warning: #ffa726;      /* Warm orange */
  --danger: #ef5350;       /* Soft red */

  /* Focus */
  --ring: #5ab963;         /* Aurora Green ring */

  /* Borders */
  --border: #3f3f3f;       /* Medium gray border */

  /* Gradients */
  --grad-brand: linear-gradient(135deg, #232526, #414345);
  --grad-accent: linear-gradient(135deg, #5ab963, #7f00ff);
  --grad-subtle: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
}
\`\`\`

### Step 3: Save and Refresh

That's it! Every component, animation, gradient, and visual effect updates automatically.

## 🏗️ Architecture

### 1. Central Theme (`app/globals.css`)
- **Single source of truth** for all colors
- CSS custom properties (variables)
- Includes HSL versions for animations
- Automatically inherited by all components

### 2. Deprecated Files (Now Reference Main Theme)
These files still exist for backwards compatibility but now reference `globals.css`:
- `src/styles/css-vars.css` - Maps old `--ds-*` tokens to new system
- `src/design/system/tokens.ts` - TypeScript reference (not used for styling)
- `src/styles/theme.css` - Brand hues (uses main theme)
- `src/styles/liquid-neon.css` - Animation colors (uses main theme)

### 3. Component Usage
All components use semantic utility classes that reference the theme:

\`\`\`tsx
// Text colors
<p className="text-fg">Primary text</p>
<p className="text-fg-muted">Secondary text</p>

// Backgrounds
<div className="bg-surface">Card background</div>
<div className="bg-bg">Page background</div>

// Actions
<button className="bg-primary text-primary-fg">Primary button</button>
<a className="text-secondary">Secondary link</a>

// Gradients
<div className="bg-brand-gradient">Gradient background</div>
<h1 className="text-brand-gradient">Gradient text</h1>

// Borders
<div className="border-border">Tokenized border</div>
\`\`\`

## 🎭 Visual Effects

All visual effects automatically use the theme:

### Animated Gradient Blobs
- Uses `--primary-hsl`, `--secondary-hsl`, `--accent-hsl`
- Automatically adjusts to theme changes
- Found in: `src/components/visual/LiquidBlobs.tsx`

### Gradient Ribbons
- Uses theme color pairs
- Found in: `src/components/visual/GradientRibbon.tsx`

### Background Effects
- SVG gradients reference theme
- Found in: `src/components/visual/LiquidWindBackground.tsx`

## 📊 Chart Theming

Charts automatically use design tokens:

\`\`\`tsx
// Charts use these CSS variables:
--chart-1: var(--primary)
--chart-2: var(--accent)
--chart-3: var(--secondary)
--chart-4: var(--success)
--chart-5: var(--warning)
\`\`\`

## ♿ Accessibility

All color pairs are designed for WCAG AA contrast (4.5:1 minimum).

### Text Readability Checklist:
- ✅ Article pages use white backgrounds with dark text
- ✅ TLDR sections have dark text on light backgrounds
- ✅ All interactive elements have sufficient contrast
- ✅ Focus rings are visible on all focusable elements

## 🎨 Example Themes

Copy and paste these into your `:root` section in `app/globals.css`:

### Midnight Blue
\`\`\`css
--bg: #0a1628;
--surface: #132f4c;
--fg: #e3f2fd;
--primary: #00b4d8;
--secondary: #0077b6;
--accent: #90e0ef;
--primary-hsl: 191 100% 42%;
--secondary-hsl: 199 100% 36%;
--accent-hsl: 191 73% 75%;
\`\`\`

### Forest Green
\`\`\`css
--bg: #0d1f0d;
--surface: #1a331a;
--fg: #e8f5e9;
--primary: #4caf50;
--secondary: #2e7d32;
--accent: #81c784;
--primary-hsl: 122 39% 49%;
--secondary-hsl: 123 50% 33%;
--accent-hsl: 123 38% 63%;
\`\`\`

### Royal Purple
\`\`\`css
--bg: #1a0a2e;
--surface: #2d1b4e;
--fg: #f3e5f5;
--primary: #9c27b0;
--secondary: #6a1b9a;
--accent: #ba68c8;
--primary-hsl: 291 64% 42%;
--secondary-hsl: 291 69% 35%;
--accent-hsl: 291 47% 59%;
\`\`\`

### Sunset Orange
\`\`\`css
--bg: #1a0f0a;
--surface: #2d1810;
--fg: #fff3e0;
--primary: #ff6f00;
--secondary: #e65100;
--accent: #ffb74d;
--primary-hsl: 26 100% 50%;
--secondary-hsl: 20 100% 45%;
--accent-hsl: 36 100% 65%;
\`\`\`

## 🔧 Converting Hex to HSL

Need to convert your colors to HSL for animations?

**Online Tool:** https://www.rapidtables.com/convert/color/hex-to-hsl.html

**Example:**
- Hex: `#5ab963`
- HSL: `hsl(125, 40%, 54%)`
- In CSS: `--primary-hsl: 125 40% 54%;` (no commas, no hsl())

## 📝 Best Practices

1. **Always edit `app/globals.css`** - Never hardcode colors in components
2. **Use semantic names** - `text-fg` not `text-white`
3. **Test on article pages** - Ensure text is readable on white backgrounds
4. **Check animations** - Gradient blobs should be visible but subtle
5. **Maintain contrast** - Keep text readable against backgrounds

## ✅ Migration Status

### Completed:
- ✅ Centralized all colors in `app/globals.css`
- ✅ Updated all visual effects to use theme tokens
- ✅ Removed hardcoded colors from key components
- ✅ Created HSL versions for animations
- ✅ Ensured text readability on article pages
- ✅ Updated source icons to use theme colors
- ✅ Fixed TLDR section shadows to use theme
- ✅ Comprehensive documentation created

### System is 100% Token-Driven:
Every color, gradient, animation, and visual effect now references `app/globals.css`. Change the theme once, update everywhere instantly.

## 🚀 Future Enhancements

- [ ] Theme switcher UI for users
- [ ] Additional pre-built color schemes
- [ ] Animation speed controls
- [ ] Seasonal theme variations
