import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { cobaltVoltTheme } from "../theme/cobaltVoltTokens"
import { LiquidLightningBackground } from "../components/LiquidLightningBackground"

interface CinematicHeroProps {
  title: string
  subtitle?: string
  heroImage?: string
  brandName: string
  progress: number
}

/**
 * Cinematic hero scene with parallax, gradient swirl, and electric pulse
 * Matches the site's hero aesthetic with Cobalt Volt theme
 */
export function CinematicHero({ title, subtitle, heroImage, brandName, progress }: CinematicHeroProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Parallax effects
  const parallaxY = interpolate(progress, [0, 1], [0, -40])
  const parallaxScale = spring({
    frame,
    fps,
    from: 1.2,
    to: 1,
    config: cobaltVoltTheme.easing.spring,
  })

  // Fade in/out
  const opacity = interpolate(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])

  // Title animation - slide up with blur
  const titleY = spring({
    frame,
    fps,
    from: 60,
    to: 0,
    config: { damping: 20, stiffness: 80 },
  })
  const titleBlur = interpolate(frame, [0, 20], [8, 0], { extrapolateRight: "clamp" })

  // Electric pulse effect around title
  const pulseScale = interpolate(frame % (fps * 2), [0, fps, fps * 2], [1, 1.05, 1])
  const pulseOpacity = interpolate(frame % (fps * 2), [0, fps, fps * 2], [0.3, 0.6, 0.3])

  return (
    <AbsoluteFill>
      {/* Animated background */}
      <LiquidLightningBackground intensity="strong" />

      {/* Hero image with Ken Burns effect */}
      {heroImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            opacity: 0.3,
          }}
        >
          <img
            src={heroImage || "/placeholder.svg"}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${parallaxScale}) translateY(${parallaxY}px)`,
              filter: "blur(12px) brightness(0.4)",
            }}
          />
        </div>
      )}

      {/* Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 120,
          opacity,
        }}
      >
        <div
          style={{
            transform: `translateY(${parallaxY / 2}px)`,
            textAlign: "center",
            maxWidth: 1400,
            position: "relative",
          }}
        >
          {/* Electric pulse glow */}
          <div
            style={{
              position: "absolute",
              inset: -40,
              background: `radial-gradient(circle, ${cobaltVoltTheme.colors.accent}40, transparent 70%)`,
              transform: `scale(${pulseScale})`,
              opacity: pulseOpacity,
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          {/* Title */}
          <h1
            style={{
              fontSize: 110,
              fontWeight: 900,
              lineHeight: 1.1,
              margin: 0,
              marginBottom: subtitle ? 32 : 0,
              color: "white",
              fontFamily: cobaltVoltTheme.fonts.heading,
              transform: `translateY(${titleY}px)`,
              filter: `blur(${titleBlur}px)`,
              textShadow: `
                0 4px 20px rgba(0,0,0,0.6),
                0 0 80px ${cobaltVoltTheme.colors.accent}60,
                0 0 120px ${cobaltVoltTheme.colors.gradientMid}40
              `,
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              style={{
                fontSize: 48,
                fontWeight: 500,
                margin: 0,
                color: "rgba(255,255,255,0.95)",
                fontFamily: cobaltVoltTheme.fonts.body,
                textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                transform: `translateY(${titleY / 2}px)`,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Brand badge */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            padding: "16px 32px",
            background: cobaltVoltTheme.gradients.cta,
            borderRadius: 12,
            fontSize: 32,
            fontWeight: 800,
            color: cobaltVoltTheme.colors.fg,
            fontFamily: cobaltVoltTheme.fonts.heading,
            boxShadow: cobaltVoltTheme.shadows.cta,
          }}
        >
          {brandName}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
