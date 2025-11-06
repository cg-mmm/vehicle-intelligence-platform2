"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { StockArt } from "../visual/StockArt"
import { Appear } from "../motion/Appear"

interface FluidHeroProps {
  eyebrow?: string
  headline: string
  subheadline?: string
  badges?: Array<{ label: string }>
  cta?: { label: string; href: string }
  stockArtVariant?: "sedan" | "suv" | "ev" | "generic"
}

export function FluidHero({ eyebrow, headline, subheadline, badges, cta, stockArtVariant = "sedan" }: FluidHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <div ref={ref} className="relative min-h-[60vh] flex items-center overflow-hidden shadow-lg bg-brand-gradient">
      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left column - Content */}
          <motion.div style={{ y }} className="space-y-4">
            {eyebrow && (
              <Appear>
                <Badge
                  variant="secondary"
                  className="text-xs px-3 py-1 font-medium bg-white/20 text-fg border-border/30"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {eyebrow}
                </Badge>
              </Appear>
            )}

            <Appear delay={0.06}>
              <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight text-fg">{headline}</h1>
            </Appear>

            {subheadline && (
              <Appear delay={0.12}>
                <p className="text-lg md:text-xl text-fg-muted text-balance leading-relaxed">{subheadline}</p>
              </Appear>
            )}

            <Appear delay={0.18}>
              <div className="flex flex-wrap gap-2 items-center">
                {badges && badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {badges.map((badge, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="px-2 py-0.5 text-xs bg-white/20 text-fg border-border/30"
                      >
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                )}

                {cta && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      asChild
                      size="lg"
                      className="bg-cta-gradient text-fg hover:brightness-110 shadow-cta cta-pulse transition-all focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      <a href={cta.href}>{cta.label}</a>
                    </Button>
                  </motion.div>
                )}
              </div>
            </Appear>
          </motion.div>

          {/* Right column - Stock Art */}
          <Appear delay={0.24}>
            <div className="relative h-[300px] lg:h-[400px]">
              <StockArt variant={stockArtVariant} priority />
            </div>
          </Appear>
        </div>
      </div>
    </div>
  )
}
