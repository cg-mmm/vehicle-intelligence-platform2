"use client"

export function LiquidWindBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-bg via-surface/50 to-muted/30" />

      {/* SVG turbulence filter */}
      <svg className="absolute inset-0 w-full h-full opacity-40">
        <defs>
          <filter id="liquidWind">
            <feTurbulence type="fractalNoise" baseFrequency="0.005 0.003" numOctaves="4" seed="2" result="turbulence">
              <animate
                attributeName="baseFrequency"
                values="0.005 0.003; 0.007 0.004; 0.005 0.003"
                dur="20s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="50"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#windGradient)" filter="url(#liquidWind)" />
        <defs>
          <linearGradient id="windGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary-hsl) / 0.3)">
              <animate
                attributeName="stop-color"
                values="hsl(var(--primary-hsl) / 0.3); hsl(var(--accent-hsl) / 0.3); hsl(var(--primary-hsl) / 0.3)"
                dur="15s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="hsl(var(--secondary-hsl) / 0.2)">
              <animate
                attributeName="stop-color"
                values="hsl(var(--secondary-hsl) / 0.2); hsl(var(--accent-hsl) / 0.2); hsl(var(--secondary-hsl) / 0.2)"
                dur="18s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="hsl(var(--accent-hsl) / 0.25)">
              <animate
                attributeName="stop-color"
                values="hsl(var(--accent-hsl) / 0.25); hsl(var(--primary-hsl) / 0.25); hsl(var(--accent-hsl) / 0.25)"
                dur="22s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
      </svg>

      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent animate-pulse"
        style={{ animationDuration: "12s", animationDelay: "2s" }}
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent animate-pulse"
        style={{ animationDuration: "10s", animationDelay: "4s" }}
      />

      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="hsl(var(--primary-hsl) / 0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <line x1="0" y1="20%" x2="100%" y2="20%" stroke="url(#lineGradient)" strokeWidth="1">
          <animate attributeName="y1" values="20%; 25%; 20%" dur="8s" repeatCount="indefinite" />
          <animate attributeName="y2" values="20%; 25%; 20%" dur="8s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="60%" x2="100%" y2="60%" stroke="url(#lineGradient)" strokeWidth="1">
          <animate attributeName="y1" values="60%; 55%; 60%" dur="10s" repeatCount="indefinite" />
          <animate attributeName="y2" values="60%; 55%; 60%" dur="10s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="80%" x2="100%" y2="80%" stroke="url(#lineGradient)" strokeWidth="1">
          <animate attributeName="y1" values="80%; 85%; 80%" dur="12s" repeatCount="indefinite" />
          <animate attributeName="y2" values="80%; 85%; 80%" dur="12s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
