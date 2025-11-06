"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface ChecklistRailProps {
  items: string[]
}

export function ChecklistRail({ items }: ChecklistRailProps) {
  return (
    <div className="minimal-card p-6 space-y-4">
      <h3 className="font-bold text-lg mb-4">Key Takeaways</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.24, delay: i * 0.08 }}
            className="flex items-start gap-3 group"
          >
            <div className="relative pt-1">
              <motion.div
                className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center transition-all duration-200"
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 hsl(var(--accent) / 0)",
                    "0 0 0 4px hsl(var(--accent) / 0.1)",
                    "0 0 0 0 hsl(var(--accent) / 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Check className="w-3 h-3 text-accent" />
              </motion.div>
            </div>
            <span className="text-sm leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors">
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
