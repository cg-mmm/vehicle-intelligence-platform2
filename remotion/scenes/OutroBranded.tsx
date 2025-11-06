"use client"

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { Sparkles, TrendingUp, Zap } from "lucide-react"

interface OutroBrandedProps {
  title: string
  siteName: string
  siteUrl: string
  cta: {
    label: string
    url: string
  }
  brandColors: {
    primary: string
    accent: string
    bg: string
    text: string
  }
}

export function OutroBranded({ title, siteName, siteUrl, cta, brandColors }: OutroBrandedProps) {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const titleSpring = spring({
    frame,
    fps,
    config: {
      damping: 20,
      stiffness: 80,
    },
  })

  const titleScale = interpolate(titleSpring, [0, 1], [0.8, 1])
  const titleOpacity = interpolate(frame, [0, 20], [0, 1])

  const ctaDelay = 25
  const ctaOpacity = interpolate(frame, [ctaDelay, ctaDelay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const waveY = interpolate(Math.sin((frame / fps) * Math.PI), [-1, 1], [-5, 5])

  const gradient1Opacity = interpolate(frame, [0, 30, durationInFrames - 20, durationInFrames], [0, 0.8, 0.8, 0])
  const gradient2Opacity = interpolate(frame, [10, 40, durationInFrames - 15, durationInFrames], [0, 0.6, 0.6, 0])

  const particle1Y = interpolate(frame, [0, durationInFrames], [100, -100])
  const particle2Y = interpolate(frame, [0, durationInFrames], [150, -150])
  const particle3Y = interpolate(frame, [0, durationInFrames], [80, -80])

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brandColors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px",
        fontFamily: "Inter, system-ui, sans-serif",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 30% 40%, ${brandColors.primary}40 0%, transparent 60%)`,
          opacity: gradient1Opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 70% 60%, ${brandColors.accent}35 0%, transparent 60%)`,
          opacity: gradient2Opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${brandColors.primary}15 0%, ${brandColors.accent}15 100%)`,
          opacity: gradient1Opacity,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "15%",
          top: "25%",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brandColors.primary}25, transparent)`,
          transform: `translateY(${particle1Y}px)`,
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "20%",
          top: "45%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brandColors.accent}20, transparent)`,
          transform: `translateY(${particle2Y}px)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "55%",
          top: "15%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brandColors.primary}18, transparent)`,
          transform: `translateY(${particle3Y}px)`,
          filter: "blur(45px)",
        }}
      />

      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          marginBottom: "40px",
          display: "flex",
          gap: "30px",
          alignItems: "center",
        }}
      >
        <Sparkles size={64} stroke={brandColors.primary} strokeWidth={2} fill={`${brandColors.primary}20`} />
        <div
          style={{
            fontSize: "80px",
            fontWeight: "900",
            background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.accent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.03em",
          }}
        >
          {siteName}
        </div>
        <Zap size={64} stroke={brandColors.accent} strokeWidth={2} fill={`${brandColors.accent}20`} />
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "44px",
          fontWeight: "600",
          color: brandColors.text,
          textAlign: "center",
          maxWidth: "1000px",
          marginBottom: "60px",
          opacity: titleOpacity,
          lineHeight: "1.4",
        }}
      >
        {title}
      </div>

      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${waveY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            fontWeight: "800",
            background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.accent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {cta.label}
          <TrendingUp size={48} stroke={brandColors.primary} strokeWidth={3} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "80px",
          display: "flex",
          gap: "40px",
          fontSize: "48px",
          opacity: 0.6,
        }}
      >
        <span>✨</span>
        <span>🚀</span>
        <span>💡</span>
      </div>
    </AbsoluteFill>
  )
}
