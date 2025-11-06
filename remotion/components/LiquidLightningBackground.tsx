import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion"
import { cobaltVoltTheme } from "../theme/cobaltVoltTokens"

interface LiquidLightningBackgroundProps {
  intensity?: "subtle" | "medium" | "strong"
  showLightning?: boolean
  showLegibilityVeil?: boolean
}

/**
 * Animated liquid waves + lightning streaks background
 * Matches the site's .bg-liquid-waves and .bg-lightning classes
 */
export function LiquidLightningBackground({
  intensity = "medium",
  showLightning = true,
  showLegibilityVeil = true,
}: LiquidLightningBackgroundProps) {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // 22s animation cycle (matching site)
  const cycleFrames = fps * 22
  const progress = (frame % cycleFrames) / cycleFrames

  // Gradient shift animation
  const gradientShift = interpolate(progress, [0, 0.5, 1], [0, 100, 0])
  const hueRotate = interpolate(progress, [0, 0.5, 1], [0, 6, 0])
  const saturate = interpolate(progress, [0, 0.5, 1], [110, 120, 110])

  // Radial gradient pulse
  const radial1Opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0.18, 0.24, 0.18, 0.18])
  const radial2Opacity = interpolate(progress, [0, 0.4, 0.6, 1], [0.18, 0.24, 0.18, 0.18])

  // Lightning streak animation
  const lightningShift = interpolate(frame, [0, fps * 8], [0, 100], { extrapolateRight: "wrap" })

  const intensityMultiplier = intensity === "subtle" ? 0.6 : intensity === "strong" ? 1.4 : 1

  return (
    <AbsoluteFill>
      {/* Base gradient with animation */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(115deg, ${cobaltVoltTheme.colors.gradientStart}, ${cobaltVoltTheme.colors.gradientMid}, ${cobaltVoltTheme.colors.gradientEnd})`,
          backgroundSize: "240% 240%",
          backgroundPosition: `${gradientShift}% 50%`,
          filter: `hue-rotate(${hueRotate}deg) saturate(${saturate}%)`,
        }}
      />

      {/* Radial gradient overlays (pulsing) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(1200px 600px at -10% 0%, rgba(31, 111, 235, ${radial1Opacity * intensityMultiplier}), transparent 55%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(900px 500px at 110% 20%, rgba(110, 231, 255, ${radial2Opacity * intensityMultiplier}), transparent 60%)`,
        }}
      />

      {/* Lightning streaks overlay */}
      {showLightning && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(
                115deg,
                rgba(255, 255, 255, 0.1) 0,
                rgba(255, 255, 255, 0.1) 2px,
                transparent 2px,
                transparent 14px
              ),
              radial-gradient(800px 400px at ${lightningShift}% 10%, rgba(255, 212, 0, 0.1), transparent 60%)
            `,
            mixBlendMode: "screen",
            opacity: 0.6 * intensityMultiplier,
          }}
        />
      )}

      {/* Legibility veil for text */}
      {showLegibilityVeil && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.36), rgba(255, 255, 255, 0.06))",
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  )
}
