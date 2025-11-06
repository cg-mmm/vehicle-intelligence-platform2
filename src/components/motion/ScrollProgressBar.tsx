"use client"

import { useScroll, useSpring, motion } from "framer-motion"

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20 })

  return <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 h-1 origin-left bg-cta-gradient z-50" />
}
