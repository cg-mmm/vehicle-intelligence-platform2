"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedChipProps {
  children: ReactNode
  active?: boolean
  onClick?: () => void
}

export function AnimatedChip({ children, active = false, onClick }: AnimatedChipProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        active
          ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)] shadow-[var(--shadow-cta)]"
          : "bg-[color:var(--panel)] text-[color:var(--fg)] border-[color:var(--border)] hover:bg-[color:var(--muted)]"
      }`}
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.button>
  )
}
