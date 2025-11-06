"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

type TocItem = { id: string; label: string }

export function StickyTOC({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "")
  const [open, setOpen] = useState(true)
  const barRef = useRef<HTMLDivElement>(null)

  // Observe headings to update active item
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  // Smooth scroll to section + ripple origin
  const handleClick = (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty("--x", `${x}px`)
    e.currentTarget.style.setProperty("--y", `${y}px`)

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Progress width based on active index
  const progress = useMemo(() => {
    const idx = Math.max(
      0,
      items.findIndex((i) => i.id === active),
    )
    return ((idx + 1) / Math.max(1, items.length)) * 100
  }, [items, active])

  return (
    <aside className="sticky top-24 z-20">
      <div className="bg-card border border-border shadow-soft rounded-2xl overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-4 py-3 text-foreground font-semibold hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        >
          On this page
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {/* Progress bar */}
        <div className="h-1 bg-muted relative">
          <div
            ref={barRef}
            className="h-1 bg-cta-gradient transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
        </div>

        <motion.ul
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.28, ease: [0.25, 0.8, 0.25, 1] }}
          className="grid gap-2 px-3 py-3"
        >
          {items.map((item, i) => {
            const isActive = active === item.id
            const buttonClassName = `w-full text-left rounded-lg px-3 py-2 border focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 toc-magnetic toc-ripple ${isActive ? "toc-chip-active border-accent text-accent-foreground font-semibold shadow-md" : "toc-chip border-border text-foreground hover:border-primary/30"}`

            const indicatorClassName = `inline-flex h-5 w-5 shrink-0 rounded-full border-2 transition-all duration-200 ${isActive ? "bg-accent border-accent shadow-sm" : "bg-muted border-border"}`

            return (
              <li key={item.id}>
                <button
                  onClick={handleClick(item.id)}
                  className={buttonClassName}
                  aria-current={isActive ? "true" : "false"}
                >
                  <div className="flex items-center gap-2">
                    <span className={indicatorClassName} aria-hidden />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </button>
              </li>
            )
          })}
        </motion.ul>
      </div>
    </aside>
  )
}
