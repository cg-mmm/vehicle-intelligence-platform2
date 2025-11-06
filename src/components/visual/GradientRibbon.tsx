"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function GradientRibbon() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <motion.div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity, scale }}>
      <div
        className="absolute top-0 left-0 right-0 h-2 blur-sm"
        style={{
          background: "linear-gradient(90deg, var(--gradient-start), var(--accent), var(--gradient-end))",
        }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: "linear-gradient(90deg, var(--gradient-start), var(--accent), var(--gradient-end))",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </motion.div>
  )
}
