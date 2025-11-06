"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, X } from "lucide-react"

interface AdSlotConfig {
  id: string
  adapter: "gam" | "adsense" | "house"
  path: string
  sizes: number[][]
  lazy: boolean
  freqCap: number | null
  title?: string
  description?: string
  cta?: string
}

interface AdSlotProps {
  id: string
  className?: string
}

export function AdSlot({ id, className = "" }: AdSlotProps) {
  const [config, setConfig] = useState<AdSlotConfig | null>(null)
  const [shouldShow, setShouldShow] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if ad was dismissed
    const dismissKey = `ad_dismissed_${id}`
    if (localStorage.getItem(dismissKey) === "true") {
      setIsDismissed(true)
      setShouldShow(false)
      return
    }

    // Load ad configuration
    fetch("/tenants/ads.pack.json")
      .then((res) => res.json())
      .then((data) => {
        const slot = data.slots.find((s: AdSlotConfig) => s.id === id)
        if (slot) {
          setConfig(slot)

          // Check frequency cap
          if (slot.freqCap) {
            const key = `ad_freq_${id}`
            const count = Number.parseInt(localStorage.getItem(key) || "0", 10)

            if (count >= slot.freqCap) {
              setShouldShow(false)
            } else {
              localStorage.setItem(key, String(count + 1))
            }
          }
        }
      })
      .catch(() => {
        // Silently fail if config not found
        setShouldShow(false)
      })
  }, [id])

  useEffect(() => {
    if (!config || !config.lazy) {
      setIsVisible(true)
      return
    }

    // Lazy loading with Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { rootMargin: "200px" },
    )

    const element = document.getElementById(`ad-slot-${id}`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [config, id])

  const handleDismiss = () => {
    const dismissKey = `ad_dismissed_${id}`
    localStorage.setItem(dismissKey, "true")
    setIsDismissed(true)
    setShouldShow(false)
  }

  if (!config || !shouldShow || isDismissed) {
    return null
  }

  const [width, height] = config.sizes[0] || [300, 250]

  return (
    <motion.div
      id={`ad-slot-${id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.4 }}
      role="complementary"
      aria-label="Advertisement"
      className={`my-8 flex justify-center ${className}`}
    >
      <div
        style={{ maxWidth: `${width}px` }}
        className="relative w-full rounded-xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm"
      >
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-colors"
          aria-label="Dismiss advertisement"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>

        {/* Ad label */}
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-background/80 border border-border/50">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Sponsored</span>
        </div>

        <div style={{ minHeight: `${height}px` }} className="relative">
          {config.adapter === "house" && isVisible ? (
            <a
              href={config.path}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block w-full h-full group"
            >
              <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                {/* House ad content */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ExternalLink className="w-8 h-8 text-[color:var(--fg-contrast)]" />
                </div>

                {config.title && (
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {config.title}
                  </h3>
                )}

                {config.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{config.description}</p>
                )}

                {config.cta && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium group-hover:bg-primary/90 transition-colors">
                    <span>{config.cta}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                )}
              </div>
            </a>
          ) : (
            <div className="flex items-center justify-center h-full p-6 text-muted-foreground text-sm">
              <div className="text-center space-y-2">
                <div className="text-xs opacity-50">Advertisement Placeholder</div>
                <div className="text-xs opacity-30">
                  {config.adapter.toUpperCase()} • {width}×{height}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
