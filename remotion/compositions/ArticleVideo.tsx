import type React from "react"
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion"
import { getThemeTokens, hsl, COBALT_VOLT } from "../theme/tokens"

type ArticleVideoProps = {
  title: string
  tldr: { label: string; value: string }[]
  winner?: {
    name: string
    score: number
  }
}

export const ArticleVideo: React.FC<ArticleVideoProps> = ({ title, tldr, winner }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const theme = getThemeTokens()

  // Animated background gradient
  const gradientShift = interpolate(frame, [0, 600], [0, 360], {
    extrapolateRight: "wrap",
  })

  // Title animation
  const titleOpacity = interpolate(frame, [0, 30], [0, 1])
  const titleY = spring({
    frame,
    fps,
    from: 40,
    to: 0,
    config: { damping: 15 },
  })

  // TL;DR animation
  const tldrOpacity = interpolate(frame, [30, 60], [0, 1])
  const tldrY = spring({
    frame: frame - 30,
    fps,
    from: 40,
    to: 0,
    config: { damping: 15 },
  })

  // Winner animation
  const winnerOpacity = interpolate(frame, [60, 90], [0, 1])
  const winnerScale = spring({
    frame: frame - 60,
    fps,
    from: 0.8,
    to: 1,
    config: { damping: 12 },
  })

  return (
    <AbsoluteFill
      style={{
        background: COBALT_VOLT.gradients.hero,
        backgroundSize: "240% 240%",
        backgroundPosition: `${gradientShift}% 50%`,
        fontFamily: theme.font.family,
      }}
    >
      {/* Legibility overlay */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
        }}
      />

      {/* Content */}
      <AbsoluteFill
        style={{
          padding: 80,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 60,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: hsl(theme.colors.fg),
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
        </div>

        {/* TL;DR Grid */}
        <div
          style={{
            opacity: tldrOpacity,
            transform: `translateY(${tldrY}px)`,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 40,
            width: "100%",
            maxWidth: 1200,
          }}
        >
          {tldr.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: 16,
                padding: 32,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                border: `2px solid ${hsl(theme.colors.accent)}`,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: hsl(theme.colors.fg),
                  opacity: 0.7,
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: hsl(theme.colors.accent),
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Winner Badge */}
        {winner && (
          <div
            style={{
              opacity: winnerOpacity,
              transform: `scale(${winnerScale})`,
              background: COBALT_VOLT.gradients.cta,
              borderRadius: 24,
              padding: "24px 48px",
              boxShadow: "0 12px 48px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "white",
                textAlign: "center",
              }}
            >
              🏆 Winner: {winner.name}
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "white",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {winner.score}/100
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
