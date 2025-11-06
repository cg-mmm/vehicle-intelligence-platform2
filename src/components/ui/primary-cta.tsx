"use client"

import type React from "react"
import { motion } from "framer-motion"

export interface PrimaryCTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function PrimaryCTA({ children, className = "", ...props }: PrimaryCTAProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, brightness: 1.1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
      className={`bg-cta-gradient text-[color:var(--fg-contrast)] shadow-cta vortex-shimmer cta-pulse px-5 py-3 rounded-lg font-semibold focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] hover:brightness-110 active:scale-[.98] transition-all duration-300 ${className}`}
    >
      {children}
    </motion.button>
  )
}
