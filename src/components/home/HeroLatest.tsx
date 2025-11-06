"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, BookOpen, Calendar, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { ShareBar } from "@/components/share/ShareBar"
import type { HomeHero } from "@/lib/home/contracts"

interface HeroLatestProps {
  hero: HomeHero
}

export function HeroLatest({ hero }: HeroLatestProps) {
  const publishDate = new Date(hero.publishedAt)

  return (
    <section className="relative w-full min-h-[80vh] flex items-center overflow-hidden">
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hero.coverImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-6"
          >
            {/* Badge and date */}
            <div className="flex items-center gap-4 flex-wrap">
              {hero.badge && (
                <Badge className="bg-cta-gradient text-[color:var(--fg-contrast)] border-0 px-4 py-2 text-sm font-semibold">
                  {hero.badge}
                </Badge>
              )}
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                {publishDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-primary">
              <Link href={`/topics/${hero.pillar.slug}`} className="hover:underline">
                {hero.pillar.title}
              </Link>
              <span className="text-border">/</span>
              <span className="text-foreground">{hero.section.title}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[color:var(--fg-contrast)] leading-tight">
              {hero.title}
            </h1>

            {/* Subtitle */}
            {hero.subtitle && <p className="text-xl md:text-2xl text-foreground leading-relaxed">{hero.subtitle}</p>}

            {/* Stats */}
            {hero.stats && hero.stats.length > 0 && (
              <div className="flex flex-wrap gap-6 pt-4">
                {hero.stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                      <div className="text-lg font-semibold text-[color:var(--fg-contrast)]">
                        {stat.value} {stat.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTAs and Share */}
            <div className="flex flex-wrap items-center gap-4 pt-6">
              <Link href={hero.url}>
                <Button
                  size="lg"
                  className="bg-cta-gradient hover:opacity-90 border-0 text-lg px-8 text-[color:var(--fg-contrast)]"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Read Article
                </Button>
              </Link>

              {hero.videoUrl && (
                <Link href={hero.videoUrl}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-card/50 border-border hover:bg-card text-foreground text-lg px-8 backdrop-blur-sm"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Video
                  </Button>
                </Link>
              )}

              <div className="ml-auto">
                <ShareBar canonical={hero.url} title={hero.title} summary={hero.subtitle} image={hero.coverImage} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
