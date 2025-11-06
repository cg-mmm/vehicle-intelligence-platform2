"use client"

import type React from "react"
import cn from "classnames"
import { useState, useEffect } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { KeyTakeaways } from "../modules/KeyTakeaways"
import type { ArticleTOCItem } from "@/lib/contracts"
import {
  FileText,
  Table,
  Grid3x3,
  ThumbsUp,
  ImageIcon,
  HelpCircle,
  Megaphone,
  BookOpen,
  Star,
  CheckCircle2,
  Sparkles,
} from "lucide-react"

interface StickyRailProps {
  toc: ArticleTOCItem[]
  keyTakeaways?: string[]
}

// Map section types to icons
const getSectionIcon = (title: string) => {
  const lowerTitle = title.toLowerCase()

  if (lowerTitle.includes("introduction") || lowerTitle.includes("intro")) return FileText
  if (lowerTitle.includes("comparison") || lowerTitle.includes("vs")) return Table
  if (lowerTitle.includes("spec") || lowerTitle.includes("specification")) return Grid3x3
  if (lowerTitle.includes("pros") || lowerTitle.includes("cons")) return ThumbsUp
  if (lowerTitle.includes("gallery") || lowerTitle.includes("photo")) return ImageIcon
  if (lowerTitle.includes("faq") || lowerTitle.includes("question")) return HelpCircle
  if (lowerTitle.includes("cta") || lowerTitle.includes("call to action")) return Megaphone
  if (lowerTitle.includes("review")) return Star
  if (lowerTitle.includes("takeaway") || lowerTitle.includes("summary")) return CheckCircle2
  if (lowerTitle.includes("deep dive") || lowerTitle.includes("analysis")) return Sparkles

  return BookOpen
}

export function StickyRail({ toc, keyTakeaways }: StickyRailProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => {
      const sections = toc.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[]

      if (sections.length === 0) return

      // Find the section that's currently most visible in viewport
      let currentSection: HTMLElement | null = null
      let maxVisibility = 0

      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        const viewportHeight = window.innerHeight

        // Calculate how much of the section is visible
        const visibleTop = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0))
        const visibility = visibleTop / viewportHeight

        if (visibility > maxVisibility && rect.top < viewportHeight / 2) {
          maxVisibility = visibility
          currentSection = section
        }
      }

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    handleScroll() // Run on mount
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [toc])

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - offset

      element.focus({ preventScroll: true })

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <aside className="hidden lg:block w-80 shrink-0">
      <div className="sticky top-24 space-y-6">
        <motion.div
          className="absolute inset-0 opacity-20 rounded-2xl blur-3xl -z-10"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, hsl(var(--accent)) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, hsl(var(--accent-2)) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, hsl(var(--accent)) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 0%, hsl(var(--accent-2)) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, hsl(var(--accent)) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Table of Contents */}
        {toc.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-xl bg-[color:var(--card)]/50 backdrop-blur-sm border border-[color:var(--border)]/50 p-4 shadow-lg"
          >
            <div className="flex items-center gap-2 px-2 mb-4 pb-3 border-b border-[color:var(--border)]/50">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <BookOpen className="h-5 w-5 text-[color:var(--accent)]" />
              </motion.div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[color:var(--fg)]">Table of Contents</h3>
              <motion.div className="ml-auto h-1 w-12 rounded-full bg-[color:var(--muted)] overflow-hidden">
                <motion.div className="h-full bg-cta-gradient" style={{ scaleX: scaleY, transformOrigin: "left" }} />
              </motion.div>
            </div>

            <nav className="space-y-1">
              {toc.map((item, index) => {
                const Icon = getSectionIcon(item.title)
                const isActive = activeSection === item.id
                const isHovered = hoveredSection === item.id

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <motion.a
                      href={`#${item.id}`}
                      onClick={(e) => handleTocClick(e, item.id)}
                      onMouseEnter={() => setHoveredSection(item.id)}
                      onMouseLeave={() => setHoveredSection(null)}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300",
                        "hover:bg-[color:var(--accent)]/10 hover:shadow-md",
                        isActive
                          ? "bg-gradient-to-r from-[color:var(--accent)]/20 to-[color:var(--accent-2)]/10 text-[color:var(--fg)] font-bold border-l-4 border-[color:var(--accent)] shadow-lg shadow-[color:var(--accent)]/20"
                          : "text-[color:var(--fg)]/80 hover:text-[color:var(--fg)] border-l-4 border-transparent hover:border-[color:var(--accent)]/30",
                      )}
                      whileHover={{ x: 6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <motion.div
                        className={cn(
                          "shrink-0 transition-colors duration-300",
                          isActive
                            ? "text-[color:var(--accent)]"
                            : "text-[color:var(--fg-muted)] group-hover:text-[color:var(--accent)]",
                        )}
                        animate={isActive ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.div>

                      <span className="flex-1 line-clamp-2 leading-snug">{item.title}</span>

                      <motion.div
                        className={cn(
                          "relative h-2 w-2 rounded-full transition-all duration-300",
                          isActive
                            ? "bg-[color:var(--accent)] shadow-lg shadow-[color:var(--accent)]/50"
                            : "bg-[color:var(--fg-muted)]/30 group-hover:bg-[color:var(--accent)]/50",
                        )}
                        animate={
                          isActive
                            ? {
                                scale: [1, 1.3, 1],
                                opacity: [1, 0.7, 1],
                              }
                            : {}
                        }
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        {/* Pulsing ring effect for active item */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-full bg-[color:var(--accent)]"
                            animate={{
                              scale: [1, 2, 2],
                              opacity: [0.5, 0, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeOut",
                            }}
                          />
                        )}
                      </motion.div>

                      {isHovered && (
                        <motion.div
                          layoutId="toc-hover"
                          className="absolute inset-0 bg-gradient-to-r from-[color:var(--accent)]/10 to-[color:var(--accent-2)]/5 rounded-lg -z-10"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                        />
                      )}
                    </motion.a>
                  </motion.div>
                )
              })}
            </nav>
          </motion.div>
        )}

        {/* Key Takeaways */}
        {keyTakeaways && keyTakeaways.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <KeyTakeaways items={keyTakeaways} />
          </motion.div>
        )}
      </div>
    </aside>
  )
}
