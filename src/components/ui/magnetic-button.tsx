"use client"

import type React from "react"

import { motion } from "framer-motion"
import { type ReactNode, useRef, useState } from "react"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
}

export function MagneticButton({ children, className = "", onClick, href }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (clientX - (left + width / 2)) * 0.15
    const y = (clientY - (top + height / 2)) * 0.15
    setPosition({ x, y })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  const Component = href ? motion.a : motion.button
  const props = href ? { href } : { onClick }

  return (
    <Component
      ref={ref as any}
      {...props}
      className={`bg-cta-gradient text-white shadow-[var(--shadow-cta)] cta-pulse cta-sheen px-5 py-3 rounded-lg font-semibold focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] hover:brightness-110 active:scale-[.98] transition-all ${className}`}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </Component>
  )
}
