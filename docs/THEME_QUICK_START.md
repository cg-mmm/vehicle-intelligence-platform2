# Theme Quick Start Guide

Want to change your site's colors? Follow these 3 simple steps:

## Step 1: Open `app/globals.css`

Find the `:root` section at the top of the file.

## Step 2: Update the Color Values

\`\`\`css
:root {
  /* Core surfaces */
  --bg: #YOUR_BACKGROUND_COLOR;
  --surface: #YOUR_SURFACE_COLOR;
  --muted: #YOUR_MUTED_COLOR;

  /* Text */
  --fg: #YOUR_TEXT_COLOR;
  --fg-muted: #YOUR_MUTED_TEXT_COLOR;

  /* Actions */
  --primary: #YOUR_PRIMARY_COLOR;
  --secondary: #YOUR_SECONDARY_COLOR;
  --accent: #YOUR_ACCENT_COLOR;

  /* HSL versions (for animations) */
  --primary-hsl: H S% L%;    /* Convert your primary color to HSL */
  --secondary-hsl: H S% L%;  /* Convert your secondary color to HSL */
  --accent-hsl: H S% L%;     /* Convert your accent color to HSL */
}
\`\`\`

## Step 3: Save and Refresh

That's it! Your entire site will update automatically.

## Need Help Converting Hex to HSL?

Use this online tool: https://www.rapidtables.com/convert/color/hex-to-hsl.html

Example:
- Hex: `#5ab963`
- HSL: `125 40% 54%`
- In CSS: `--primary-hsl: 125 40% 54%;`

## Pro Tips

1. **Keep good contrast** - Ensure text is readable on backgrounds
2. **Test on article pages** - Article pages use white backgrounds
3. **Check animations** - Gradient blobs should be visible but subtle
4. **Use a color picker** - Tools like [Coolors](https://coolors.co/) help create palettes

## Example Themes

Copy and paste these into your `:root` section:

### Midnight Blue
\`\`\`css
--bg: #0a1628;
--surface: #132f4c;
--primary: #00b4d8;
--secondary: #0077b6;
--primary-hsl: 191 100% 42%;
--secondary-hsl: 199 100% 36%;
\`\`\`

### Forest Green
\`\`\`css
--bg: #0d1f0d;
--surface: #1a331a;
--primary: #4caf50;
--secondary: #81c784;
--primary-hsl: 122 39% 49%;
--secondary-hsl: 123 38% 63%;
\`\`\`

### Royal Purple
\`\`\`css
--bg: #1a0a2e;
--surface: #2d1b4e;
--primary: #9c27b0;
--secondary: #ba68c8;
--primary-hsl: 291 64% 42%;
--secondary-hsl: 291 47% 59%;
