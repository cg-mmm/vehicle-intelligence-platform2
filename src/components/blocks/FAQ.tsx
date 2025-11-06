"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FAQProps {
  items: Array<{ q: string; a: string }>
}

export function FAQ({ items }: FAQProps) {
  const validItems = items.filter((item) => item.a && item.a.trim().length > 0)

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (validItems.length < items.length) {
    console.warn(`[v0] FAQ: Filtered out ${items.length - validItems.length} items with empty answers`)
  }

  if (validItems.length === 0) {
    console.warn("[v0] FAQ: No valid FAQ items to display")
    return null
  }

  return (
    <div className="space-y-0">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Frequently Asked Questions</h2>
      {validItems.map((item, i) => (
        <div key={i} className="border-b border-border last:border-0">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full py-5 px-2 flex items-center justify-between gap-4 text-left group hover:text-primary transition-colors"
            aria-expanded={openIndex === i}
            aria-controls={`faq-answer-${i}`}
          >
            <span className="font-semibold text-base text-foreground group-hover:text-primary">{item.q}</span>
            <motion.div
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <ChevronDown className="w-5 h-5 shrink-0" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openIndex === i && (
              <>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.26 }}
                  className="h-0.5 mb-4 bg-brand-gradient"
                />
                <motion.div
                  id={`faq-answer-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24 }}
                  className="overflow-hidden"
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                >
                  <p className="pb-6 px-2 text-muted-foreground leading-relaxed">{item.a}</p>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
