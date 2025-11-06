"use client"

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { Lightbulb } from "lucide-react"

interface Cluster {
  topic: string
  terms: string[]
}

interface ContentHighlightProps {
  heading: string
  clusters: Cluster[]
  brandColors: {
    primary: string
    accent: string
    bg: string
    text: string
  }
}

export function ContentHighlight({ heading, clusters, brandColors }: ContentHighlightProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const headingSpring = spring({
    frame,
    fps,
    config: {
      damping: 20,
      stiffness: 80,
    },
  })

  const headingScale = interpolate(headingSpring, [0, 1], [0.8, 1])
  const headingOpacity = interpolate(frame, [0, 20], [0, 1])

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${brandColors.bg} 0%, ${brandColors.accent}15 100%)`,
        padding: "80px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Heading */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          left: "80px",
          right: "80px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          opacity: headingOpacity,
          transform: `scale(${headingScale})`,
        }}
      >
        <Lightbulb size={56} stroke={brandColors.accent} strokeWidth={2.5} fill={`${brandColors.accent}30`} />
        <div
          style={{
            fontSize: "56px",
            fontWeight: "800",
            color: brandColors.text,
            letterSpacing: "-0.02em",
          }}
        >
          {heading}
        </div>
      </div>

      {/* Clusters Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: clusters.length === 1 ? "1fr" : clusters.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: "40px",
          marginTop: "200px",
          padding: "0 80px",
        }}
      >
        {clusters.map((cluster, index) => {
          const clusterDelay = 20 + index * 8

          const clusterSpring = spring({
            frame: frame - clusterDelay,
            fps,
            config: {
              damping: 20,
              stiffness: 100,
            },
          })

          const clusterOpacity = interpolate(frame, [clusterDelay, clusterDelay + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })

          const clusterTranslateY = interpolate(clusterSpring, [0, 1], [40, 0])

          return (
            <div
              key={index}
              style={{
                opacity: clusterOpacity,
                transform: `translateY(${clusterTranslateY}px)`,
                background: `linear-gradient(135deg, ${brandColors.primary}15 0%, ${brandColors.accent}15 100%)`,
                borderRadius: "20px",
                padding: "40px",
                border: `2px solid ${brandColors.primary}40`,
                boxShadow: `0 10px 30px ${brandColors.primary}15`,
              }}
            >
              {/* Topic */}
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: brandColors.primary,
                  marginBottom: "20px",
                  letterSpacing: "-0.01em",
                }}
              >
                {cluster.topic}
              </div>

              {/* Terms */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {cluster.terms.map((term, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "22px",
                      color: `${brandColors.text}D0`,
                      fontWeight: "500",
                      paddingLeft: "20px",
                      borderLeft: `3px solid ${brandColors.accent}60`,
                    }}
                  >
                    {term}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
