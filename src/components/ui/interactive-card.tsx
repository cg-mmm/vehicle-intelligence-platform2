"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface InteractiveCardProps {
  children: ReactNode
  className?: string
  href?: string
}

export function InteractiveCard({ children, className = "", href }: InteractiveCardProps) {
  const Component = href ? motion.a : motion.div
  const props = href ? { href } : {}

  return (
    <Component
      {...props}
      className={`rounded-2xl bg-[color:var(--panel)] border border-[color:var(--border)] shadow-[var(--shadow-soft)] p-4 md:p-5 hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}
