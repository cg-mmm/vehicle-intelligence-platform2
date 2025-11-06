import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { Zap } from "lucide-react"
import { cobaltVoltTheme } from "../theme/cobaltVoltTokens"
import { LiquidLightningBackground } from "../components/LiquidLightningBackground"

interface CinematicTLDRProps {
  content: string
  points?: string[]
  progress: number
}

/**
 * TL;DR scene with animated icon and staggered text reveal
 */
export function CinematicTLDR({ content, points = [], progress }: CinematicTLDRProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Icon animation - rotate and pulse
  const iconRotate = interpolate(progress, [0, 0.5, 1], [-15, 15, -15])
  const iconScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 100 },
  })

  // Content slide up
  const contentY = spring({
    frame,
    fps,
    from: 80,
    to: 0,
    config: { damping: 18, stiffness: 90 },
  })

  // Fade in
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])

  return (
    <AbsoluteFill>
      <LiquidLightningBackground intensity="medium" />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 120,
          opacity,
        }}
      >
        {/* Background icon */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${iconRotate}deg) scale(${iconScale})`,
            opacity: 0.08,
          }}
        >
          <Zap size={500} color={cobaltVoltTheme.colors.accent} strokeWidth={1.5} />
        </div>

        <div
          style={{
            transform: `translateY(${contentY}px)`,
            maxWidth: 1300,
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* TL;DR Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              padding: "12px 32px",
              background: cobaltVoltTheme.gradients.cta,
              borderRadius: 999,
              marginBottom: 40,
              boxShadow: cobaltVoltTheme.shadows.cta,
            }}
          >
            <Zap size={32} color={cobaltVoltTheme.colors.fg} strokeWidth={2.5} />
            <span
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: cobaltVoltTheme.colors.fg,
                fontFamily: cobaltVoltTheme.fonts.heading,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              TL;DR
            </span>
          </div>

          {/* Main content */}
          <p
            style={{
              fontSize: 52,
              lineHeight: 1.5,
              color: cobaltVoltTheme.colors.fg,
              margin: 0,
              fontFamily: cobaltVoltTheme.fonts.body,
              fontWeight: 500,
              textShadow: "0 2px 8px rgba(255,255,255,0.8)",
            }}
          >
            {content}
          </p>

          {/* Key points */}
          {points.length > 0 && (
            <div
              style={{
                marginTop: 60,
                display: "flex",
                flexDirection: "column",
                gap: 24,
                alignItems: "flex-start",
              }}
            >
              {points.map((point, index) => {
                const pointDelay = 0.2 + index * 0.15
                const pointProgress = Math.max(0, Math.min(1, (progress - pointDelay) / 0.2))

                const pointX = spring({
                  frame: frame - index * 8,
                  fps,
                  from: -60,
                  to: 0,
                  config: { damping: 15 },
                })

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      transform: `translateX(${pointX}px)`,
                      opacity: pointProgress,
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: cobaltVoltTheme.gradients.cta,
                        flexShrink: 0,
                        boxShadow: `0 0 20px ${cobaltVoltTheme.colors.accent}60`,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 36,
                        color: cobaltVoltTheme.colors.fg,
                        fontFamily: cobaltVoltTheme.fonts.body,
                        textAlign: "left",
                      }}
                    >
                      {point}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
