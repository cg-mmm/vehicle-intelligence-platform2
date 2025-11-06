"use client"

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { Star } from "lucide-react"

interface Review {
  author: string
  rating: number
  summary: string
  pros: string[]
  cons: string[]
}

interface ReviewsCarouselProps {
  reviews: Review[]
  sources?: string[]
  brandColors: {
    primary: string
    accent: string
    bg: string
    text: string
  }
}

export function ReviewsCarousel({ reviews, sources, brandColors }: ReviewsCarouselProps) {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const framesPerReview = Math.floor(durationInFrames / reviews.length)

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${brandColors.bg} 0%, ${brandColors.primary}15 100%)`,
        padding: "80px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          left: "80px",
          right: "80px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            fontWeight: "800",
            color: brandColors.text,
            letterSpacing: "-0.02em",
          }}
        >
          Expert Reviews
        </div>
        {sources && sources.length > 0 && (
          <div
            style={{
              fontSize: "20px",
              color: `${brandColors.text}80`,
              fontWeight: "500",
            }}
          >
            from {sources.slice(0, 2).join(", ")}
            {sources.length > 2 && ` +${sources.length - 2} more`}
          </div>
        )}
      </div>

      {/* Reviews Carousel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gap: "40px",
        }}
      >
        {reviews.map((review, index) => {
          const reviewStartFrame = index * framesPerReview
          const reviewEndFrame = (index + 1) * framesPerReview

          const isActive = frame >= reviewStartFrame && frame < reviewEndFrame
          const localFrame = frame - reviewStartFrame

          const slideIn = spring({
            frame: localFrame,
            fps,
            config: {
              damping: 20,
              stiffness: 100,
            },
          })

          const opacity = interpolate(localFrame, [0, 15, framesPerReview - 15, framesPerReview], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })

          const translateY = interpolate(slideIn, [0, 1], [50, 0])

          if (!isActive && frame < reviewStartFrame) return null
          if (frame >= reviewEndFrame) return null

          return (
            <div
              key={index}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                width: "100%",
                maxWidth: "1200px",
                background: `linear-gradient(135deg, ${brandColors.primary}10 0%, ${brandColors.accent}10 100%)`,
                borderRadius: "24px",
                padding: "60px",
                border: `3px solid ${brandColors.primary}30`,
                boxShadow: `0 20px 60px ${brandColors.primary}20`,
              }}
            >
              {/* Author and Rating */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: brandColors.text,
                  }}
                >
                  {review.author}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={32}
                      fill={i < review.rating ? brandColors.accent : "transparent"}
                      stroke={i < review.rating ? brandColors.accent : `${brandColors.text}40`}
                      strokeWidth={2}
                    />
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div
                style={{
                  fontSize: "28px",
                  lineHeight: "1.6",
                  color: `${brandColors.text}E0`,
                  marginBottom: "30px",
                  fontWeight: "400",
                }}
              >
                "{review.summary}"
              </div>

              {/* Pros and Cons */}
              {(review.pros.length > 0 || review.cons.length > 0) && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "40px",
                  }}
                >
                  {review.pros.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#10b981",
                          marginBottom: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        ✓ Pros
                      </div>
                      {review.pros.map((pro, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: "20px",
                            color: `${brandColors.text}C0`,
                            marginBottom: "8px",
                            paddingLeft: "20px",
                          }}
                        >
                          • {pro}
                        </div>
                      ))}
                    </div>
                  )}
                  {review.cons.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#ef4444",
                          marginBottom: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        ✗ Cons
                      </div>
                      {review.cons.map((con, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: "20px",
                            color: `${brandColors.text}C0`,
                            marginBottom: "8px",
                            paddingLeft: "20px",
                          }}
                        >
                          • {con}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
