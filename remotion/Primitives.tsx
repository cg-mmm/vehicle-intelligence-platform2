import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { Zap, TrendingUp, Award, CheckCircle2 } from "lucide-react"

interface BrandPack {
  siteName: string
  colors: {
    primary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  organization: {
    name: string
    logo: string
  }
}

export function TitleCard({ title, brand, progress }: { title: string; brand: BrandPack; progress: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: { damping: 100 },
  })

  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          textAlign: "center",
          color: "white",
          fontFamily: brand.fonts.heading,
        }}
      >
        <h1 style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.2, margin: 0 }}>{title}</h1>
      </div>

      {brand.organization.logo && (
        <div style={{ position: "absolute", top: 40, right: 40, opacity: 0.9 }}>
          <div
            style={{
              width: 80,
              height: 80,
              backgroundColor: "white",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: brand.colors.primary,
            }}
          >
            {brand.organization.name.charAt(0)}
          </div>
        </div>
      )}
    </AbsoluteFill>
  )
}

export function TLDRCard({ content, brand, progress }: { content: string; brand: BrandPack; progress: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const slideUp = spring({
    frame,
    fps,
    from: 100,
    to: 0,
    config: { damping: 100 },
  })

  const iconSway = interpolate(progress, [0, 0.5, 1], [-10, 10, -10])

  const gradient1Opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0.3, 0.6, 0.6, 0.3])
  const gradient2Opacity = interpolate(progress, [0, 0.4, 0.6, 1], [0.2, 0.5, 0.5, 0.2])

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 120,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 40% 50%, ${brand.colors.primary}20 0%, transparent 60%)`,
          opacity: gradient1Opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 60% 50%, ${brand.colors.accent}15 0%, transparent 60%)`,
          opacity: gradient2Opacity,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(${iconSway}deg)`,
          opacity: 0.06,
        }}
      >
        <Zap size={400} color={brand.colors.primary} />
      </div>

      <div
        style={{
          transform: `translateY(${slideUp}px)`,
          maxWidth: 1200,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: brand.colors.primary,
            marginBottom: 24,
            fontFamily: brand.fonts.heading,
          }}
        >
          TL;DR
        </div>
        <p
          style={{
            fontSize: 48,
            lineHeight: 1.5,
            color: brand.colors.text,
            margin: 0,
            fontFamily: brand.fonts.body,
          }}
        >
          {content}
        </p>
      </div>
    </AbsoluteFill>
  )
}

export function BulletCard({
  items,
  brand,
  progress,
  icon,
}: {
  items: string[]
  brand: BrandPack
  progress: number
  icon: string
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const Icon = icon === "award" ? Award : CheckCircle2

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 120,
      }}
    >
      <div style={{ maxWidth: 1200, width: "100%" }}>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: brand.colors.primary,
            marginBottom: 60,
            fontFamily: brand.fonts.heading,
          }}
        >
          Key Takeaways
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {items.map((item, index) => {
            const itemDelay = index * 0.15
            const itemProgress = Math.max(0, Math.min(1, (progress - itemDelay) / 0.2))

            const slideX = spring({
              frame: frame - index * 10,
              fps,
              from: -100,
              to: 0,
              config: { damping: 100 },
            })

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  transform: `translateX(${slideX}px)`,
                  opacity: itemProgress,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    backgroundColor: brand.colors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={32} color="white" />
                </div>
                <p
                  style={{
                    fontSize: 36,
                    lineHeight: 1.4,
                    color: brand.colors.text,
                    margin: 0,
                    fontFamily: brand.fonts.body,
                  }}
                >
                  {item}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}

export function StatTile({
  label,
  value,
  brand,
  progress,
}: {
  label: string
  value: string
  brand: BrandPack
  progress: number
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 100 },
  })

  // Extract number from value for count-up animation
  const numMatch = value.match(/[\d.]+/)
  const num = numMatch ? Number.parseFloat(numMatch[0]) : 0
  const countUp = interpolate(progress, [0, 0.6], [0, num], { extrapolateRight: "clamp" })
  const displayValue = numMatch ? value.replace(numMatch[0], countUp.toFixed(1)) : value

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 120,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          textAlign: "center",
          padding: 80,
          borderRadius: 24,
          backgroundColor: brand.colors.primary,
          color: "white",
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 800, marginBottom: 24, fontFamily: brand.fonts.heading }}>
          {displayValue}
        </div>
        <div style={{ fontSize: 48, fontWeight: 600, opacity: 0.9, fontFamily: brand.fonts.body }}>{label}</div>
      </div>
    </AbsoluteFill>
  )
}

export function KenBurnsImage({
  src,
  alt,
  title,
  brand,
  progress,
}: {
  src: string
  alt: string
  title: string
  brand: BrandPack
  progress: number
}) {
  const scale = interpolate(progress, [0, 1], [1, 1.2])
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.8])

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.background }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
            opacity,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          right: 80,
          padding: 40,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: 12,
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "white",
            margin: 0,
            fontFamily: brand.fonts.heading,
          }}
        >
          {title}
        </h2>
      </div>
    </AbsoluteFill>
  )
}

export function CTA({ brand, progress }: { brand: BrandPack; progress: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: { damping: 100 },
  })

  const arrowBounce = interpolate(progress, [0, 0.5, 1], [0, 10, 0])

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 120,
      }}
    >
      <div style={{ transform: `scale(${scale})`, textAlign: "center", color: "white" }}>
        <h2
          style={{
            fontSize: 64,
            fontWeight: 800,
            marginBottom: 40,
            fontFamily: brand.fonts.heading,
          }}
        >
          Learn More
        </h2>
        <div
          style={{
            fontSize: 48,
            fontWeight: 600,
            opacity: 0.95,
            fontFamily: brand.fonts.body,
          }}
        >
          {brand.siteName}
        </div>

        <div style={{ marginTop: 60, transform: `translateY(${arrowBounce}px)` }}>
          <TrendingUp size={80} color="white" />
        </div>
      </div>
    </AbsoluteFill>
  )
}

export function LowerThird({ text }: { text: string }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: 40,
        padding: "12px 24px",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
        borderRadius: 8,
        fontSize: 24,
        fontWeight: 600,
        color: "white",
        opacity: 0.7,
      }}
    >
      {text}
    </div>
  )
}

export function StatsRail({
  stats,
  brand,
  progress,
}: {
  stats: Array<{ label: string; value: string; iconKey?: string }>
  brand: BrandPack
  progress: number
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: stats.length <= 2 ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: 40,
          maxWidth: 1400,
          width: "100%",
        }}
      >
        {stats.map((stat, index) => {
          const delay = index * 0.15
          const itemProgress = Math.max(0, Math.min(1, (progress - delay) / 0.3))

          const scale = spring({
            frame: frame - index * 8,
            fps,
            from: 0.8,
            to: 1,
            config: { damping: 100 },
          })

          // Count-up animation for numeric values
          const numMatch = stat.value.match(/[\d.]+/)
          const num = numMatch ? Number.parseFloat(numMatch[0]) : 0
          const countUp = interpolate(itemProgress, [0, 1], [0, num], { extrapolateRight: "clamp" })
          const displayValue = numMatch
            ? stat.value.replace(numMatch[0], countUp.toFixed(num % 1 === 0 ? 0 : 1))
            : stat.value

          return (
            <div
              key={index}
              style={{
                transform: `scale(${scale})`,
                opacity: itemProgress,
                padding: 32,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${brand.colors.primary}15, ${brand.colors.accent}15)`,
                border: `2px solid ${brand.colors.primary}30`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  color: brand.colors.primary,
                  marginBottom: 12,
                  fontFamily: brand.fonts.heading,
                }}
              >
                {displayValue}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: brand.colors.text,
                  opacity: 0.8,
                  fontFamily: brand.fonts.body,
                }}
              >
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

export function ComparisonSnap({
  columns,
  rows,
  brand,
  progress,
}: {
  columns: string[]
  rows: Array<Record<string, string>>
  brand: BrandPack
  progress: number
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div style={{ maxWidth: 1400, width: "100%" }}>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: brand.colors.primary,
            marginBottom: 40,
            fontFamily: brand.fonts.heading,
          }}
        >
          Quick Comparison
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `200px repeat(${columns.length - 1}, 1fr)`,
            gap: 16,
          }}
        >
          {/* Header row */}
          {columns.map((col, index) => {
            const slideDown = spring({
              frame: frame - index * 5,
              fps,
              from: -50,
              to: 0,
              config: { damping: 100 },
            })

            return (
              <div
                key={`header-${index}`}
                style={{
                  transform: `translateY(${slideDown}px)`,
                  padding: 16,
                  backgroundColor: brand.colors.primary,
                  color: "white",
                  fontWeight: 700,
                  fontSize: index === 0 ? 20 : 24,
                  borderRadius: 8,
                  textAlign: index === 0 ? "left" : "center",
                  fontFamily: brand.fonts.heading,
                }}
              >
                {col}
              </div>
            )
          })}

          {/* Data rows */}
          {rows.map((row, rowIndex) => {
            return columns.map((col, colIndex) => {
              const delay = (rowIndex + 1) * 0.1 + colIndex * 0.05
              const itemProgress = Math.max(0, Math.min(1, (progress - delay) / 0.2))

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    opacity: itemProgress,
                    padding: 16,
                    backgroundColor: colIndex === 0 ? `${brand.colors.primary}10` : "transparent",
                    border: `1px solid ${brand.colors.primary}20`,
                    borderRadius: 8,
                    fontSize: colIndex === 0 ? 18 : 22,
                    fontWeight: colIndex === 0 ? 600 : 500,
                    textAlign: colIndex === 0 ? "left" : "center",
                    color: brand.colors.text,
                    fontFamily: brand.fonts.body,
                  }}
                >
                  {row[col] || "—"}
                </div>
              )
            })
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}

export function ProsConsCard({
  pros,
  cons,
  brand,
  progress,
}: {
  pros: string[]
  cons: string[]
  brand: BrandPack
  progress: number
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, maxWidth: 1400, width: "100%" }}>
        {/* Pros */}
        <div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#10b981",
              marginBottom: 32,
              fontFamily: brand.fonts.heading,
            }}
          >
            ✓ Pros
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {pros.map((pro, index) => {
              const slideX = spring({
                frame: frame - index * 8,
                fps,
                from: -100,
                to: 0,
                config: { damping: 100 },
              })

              return (
                <div
                  key={index}
                  style={{
                    transform: `translateX(${slideX}px)`,
                    padding: 20,
                    backgroundColor: "#10b98115",
                    border: "2px solid #10b98130",
                    borderRadius: 12,
                    fontSize: 28,
                    color: brand.colors.text,
                    fontFamily: brand.fonts.body,
                  }}
                >
                  {pro}
                </div>
              )
            })}
          </div>
        </div>

        {/* Cons */}
        <div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#ef4444",
              marginBottom: 32,
              fontFamily: brand.fonts.heading,
            }}
          >
            ✗ Cons
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {cons.map((con, index) => {
              const slideX = spring({
                frame: frame - index * 8,
                fps,
                from: 100,
                to: 0,
                config: { damping: 100 },
              })

              return (
                <div
                  key={index}
                  style={{
                    transform: `translateX(${slideX}px)`,
                    padding: 20,
                    backgroundColor: "#ef444415",
                    border: "2px solid #ef444430",
                    borderRadius: 12,
                    fontSize: 28,
                    color: brand.colors.text,
                    fontFamily: brand.fonts.body,
                  }}
                >
                  {con}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

export function FAQFlash({
  faqs,
  brand,
  progress,
}: {
  faqs: Array<{ question: string; answer: string }>
  brand: BrandPack
  progress: number
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const currentFAQIndex = Math.floor(progress * faqs.length)
  const currentFAQ = faqs[currentFAQIndex] || faqs[0]
  const faqProgress = (progress * faqs.length) % 1

  const fadeOpacity = interpolate(faqProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
  const slideY = interpolate(faqProgress, [0, 0.2, 1], [30, 0, 0])

  const gradient1Opacity = interpolate(faqProgress, [0, 0.3, 0.7, 1], [0.4, 0.7, 0.7, 0.4])
  const gradient2Opacity = interpolate(faqProgress, [0, 0.4, 0.6, 1], [0.3, 0.6, 0.6, 0.3])

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 120,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 35% 45%, ${brand.colors.primary}25 0%, transparent 60%)`,
          opacity: gradient1Opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 65% 55%, ${brand.colors.accent}20 0%, transparent 60%)`,
          opacity: gradient2Opacity,
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          width: "100%",
        }}
      >
        <div
          style={{
            opacity: fadeOpacity,
            transform: `translateY(${slideY}px)`,
            padding: 60,
            borderRadius: 24,
            background: `linear-gradient(135deg, ${brand.colors.primary}15, ${brand.colors.accent}15)`,
            border: `3px solid ${brand.colors.primary}40`,
            boxShadow: `0 20px 60px ${brand.colors.primary}20`,
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: brand.colors.primary,
              marginBottom: 24,
              fontFamily: brand.fonts.heading,
            }}
          >
            ❓ {currentFAQ.question}
          </div>
          <div
            style={{
              fontSize: 36,
              lineHeight: 1.5,
              color: brand.colors.text,
              fontFamily: brand.fonts.body,
            }}
          >
            💡 {currentFAQ.answer}
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {faqs.map((_, index) => (
            <div
              key={index}
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: index === currentFAQIndex ? brand.colors.primary : `${brand.colors.primary}30`,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}
