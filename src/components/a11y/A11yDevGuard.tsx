"use client"

import { useEffect } from "react"
import { getContrastRatio } from "@/lib/a11y/contrast"

/**
 * A11yDevGuard - Development-time accessibility checker
 * Highlights elements with insufficient contrast
 * Enable with NEXT_PUBLIC_A11Y_DEV=1
 */
export function A11yDevGuard() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_A11Y_DEV !== "1") return

    const checkContrast = () => {
      const textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, label, button")

      textElements.forEach((el) => {
        const computed = window.getComputedStyle(el)
        const color = computed.color
        const bgColor = computed.backgroundColor

        // Convert rgb to hex
        const rgbToHex = (rgb: string) => {
          const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
          if (!match) return null
          const r = Number.parseInt(match[1])
          const g = Number.parseInt(match[2])
          const b = Number.parseInt(match[3])
          return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
        }

        const fgHex = rgbToHex(color)
        const bgHex = rgbToHex(bgColor)

        if (fgHex && bgHex) {
          const ratio = getContrastRatio(fgHex, bgHex)

          if (ratio < 4.5) {
            ;(el as HTMLElement).style.outline = "2px solid red"
            ;(el as HTMLElement).style.outlineOffset = "2px"
            console.warn(`[A11y] Low contrast (${ratio.toFixed(2)}:1):`, el, {
              fg: fgHex,
              bg: bgHex,
              selector: el.tagName + (el.className ? `.${el.className.split(" ")[0]}` : ""),
            })
          }
        }
      })
    }

    // Check on mount and after a delay for dynamic content
    checkContrast()
    const timer = setTimeout(checkContrast, 2000)

    return () => clearTimeout(timer)
  }, [])

  return null
}
