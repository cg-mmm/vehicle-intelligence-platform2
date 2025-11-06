"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { pickReadable } from "@/lib/a11y/contrast"

interface ContrastGuardProps {
  children: React.ReactNode
  bg?: string
  className?: string
  minRatio?: number
}

/**
 * ContrastGuard - Ensures text has sufficient contrast against its background
 * Automatically adjusts text color if contrast is insufficient
 */
export function ContrastGuard({ children, bg, className = "", minRatio = 4.5 }: ContrastGuardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [textColor, setTextColor] = useState<string | null>(null)

  useEffect(() => {
    if (!ref.current) return

    // Get background color from prop or computed style
    let backgroundColor = bg

    if (!backgroundColor) {
      const computed = window.getComputedStyle(ref.current)
      backgroundColor = computed.backgroundColor

      // Convert rgb/rgba to hex
      const match = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      if (match) {
        const r = Number.parseInt(match[1])
        const g = Number.parseInt(match[2])
        const b = Number.parseInt(match[3])
        backgroundColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
      }
    }

    if (backgroundColor && backgroundColor.startsWith("#")) {
      // Candidate colors from our design system
      const candidates = [
        "#fafafa", // fg-strong (light)
        "#e7e9ee", // fg (light)
        "#0b0b0c", // fg-strong (dark)
        "#1a1b1e", // fg (dark)
        "#e0e0e0", // Current Space Gray fg
        "#0d0d0d", // Current Space Gray bg
      ]

      const bestColor = pickReadable(candidates, backgroundColor, minRatio)
      setTextColor(bestColor)
    }
  }, [bg, minRatio])

  return (
    <div ref={ref} className={className} style={textColor ? { color: textColor } : undefined}>
      {children}
    </div>
  )
}
