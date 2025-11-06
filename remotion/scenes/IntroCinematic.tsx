import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"

interface IntroCinematicProps {
  title: string
  subtitle?: string
  heroImage?: string
  brand: {
    colors: { primary: string; accent: string; text: string; background: string }
    fonts: { heading: string; body: string }
    organization: { name: string }
  }
  progress: number
}

export function IntroCinematic({ title, subtitle, heroImage, brand, progress }: IntroCinematicProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const parallaxY = interpolate(progress, [0, 1], [0, -30])
  const scale = spring({ frame, fps, from: 1.15, to: 1, config: { damping: 100 } })
  const opacity = interpolate(progress, [0, 0.1, 0.85, 1], [0, 1, 1, 0])

  const gradient1Opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0.4, 0.8, 0.8, 0.4])
  const gradient2Opacity = interpolate(progress, [0, 0.4, 0.6, 1], [0.3, 0.6, 0.6, 0.3])
  const gradient3Opacity = interpolate(progress, [0, 0.5, 1], [0.2, 0.5, 0.2])

  const particle1Y = interpolate(progress, [0, 1], [100, -100])
  const particle2Y = interpolate(progress, [0, 1], [150, -150])
  const particle3Y = interpolate(progress, [0, 1], [80, -80])

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.background }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 30% 40%, ${brand.colors.primary}40 0%, transparent 50%)`,
          opacity: gradient1Opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 70% 60%, ${brand.colors.accent}30 0%, transparent 50%)`,
          opacity: gradient2Opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${brand.colors.primary}20 0%, ${brand.colors.accent}20 100%)`,
          opacity: gradient3Opacity,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "30%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brand.colors.primary}30, transparent)`,
          transform: `translateY(${particle1Y}px)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "25%",
          top: "50%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brand.colors.accent}25, transparent)`,
          transform: `translateY(${particle2Y}px)`,
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "60%",
          top: "20%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brand.colors.primary}20, transparent)`,
          transform: `translateY(${particle3Y}px)`,
          filter: "blur(35px)",
        }}
      />

      {/* Hero image with smooth zoom */}
      {heroImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}
        >
          <img
            src={heroImage || "/placeholder.svg"}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${scale}) translateY(${parallaxY}px)`,
              filter: "blur(8px) brightness(0.3)",
            }}
          />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(at 20% 30%, ${brand.colors.primary}60 0%, transparent 50%),
            radial-gradient(at 80% 70%, ${brand.colors.accent}50 0%, transparent 50%),
            radial-gradient(at 50% 50%, ${brand.colors.primary}30 0%, transparent 70%)
          `,
          mixBlendMode: "multiply",
        }}
      />

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
          }}
        >
          <h1
            style={{
              fontSize: 96,
              fontWeight: 900,
              lineHeight: 1.1,
              margin: 0,
              marginBottom: subtitle ? 32 : 0,
              color: "white",
              fontFamily: brand.fonts.heading,
              textShadow: `
                0 4px 20px rgba(0,0,0,0.5),
                0 0 60px ${brand.colors.primary}40,
                0 0 100px ${brand.colors.accent}30
              `,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: 42,
                fontWeight: 500,
                margin: 0,
                color: "rgba(255,255,255,0.95)",
                fontFamily: brand.fonts.body,
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 60,
            fontSize: 32,
            fontWeight: 800,
            color: "white",
            opacity: 0.7,
            fontFamily: brand.fonts.heading,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {brand.organization.name}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
