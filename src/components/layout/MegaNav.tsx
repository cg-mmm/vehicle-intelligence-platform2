"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion"
import { ChevronDown, Menu, X, Sparkles, TrendingUp, Zap, ArrowRight } from "lucide-react"
import type { Pillar, Section, Cluster, ArticleMeta } from "@/lib/contracts"
import { SearchBox } from "@/components/search/SearchBox"
import { cn } from "@/lib/utils"

interface MegaNavProps {
  pillars: Pillar[]
  sections: Section[]
  clusters: Cluster[]
  articles: ArticleMeta[]
}

export function MegaNav({ pillars, sections, clusters, articles }: MegaNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activePillar, setActivePillar] = useState<string | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const megaMenuRef = useRef<HTMLDivElement>(null)

  const { scrollY, scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [0.85, 1])
  const headerBg = useTransform(scrollY, [0, 100], ["var(--panel)", "var(--panel)"])
  const borderOpacity = useTransform(scrollY, [0, 100], [0.4, 1])
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  // Gradient glow cursor effect for megamenu
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (megaMenuRef.current && activePillar) {
        const rect = megaMenuRef.current.getBoundingClientRect()
        setCursorPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    if (activePillar) {
      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [activePillar])

  // Get sections for a pillar
  const getSectionsForPillar = (pillarId: string) => {
    return sections.filter((s) => s.pillarId === pillarId).sort((a, b) => a.navWeight - b.navWeight)
  }

  // Get clusters for a section
  const getClustersForSection = (sectionId: string) => {
    return clusters.filter((c) => c.sectionId === sectionId).sort((a, b) => a.navWeight - b.navWeight)
  }

  // Get articles for a section (without cluster)
  const getArticlesForSection = (sectionId: string) => {
    return articles.filter((a) => a.sectionId === sectionId && !a.clusterId).slice(0, 6)
  }

  // Get icon for section type
  const getSectionIcon = (sectionSlug: string) => {
    if (sectionSlug.includes("comparison")) return TrendingUp
    if (sectionSlug.includes("deep-dive")) return Zap
    return Sparkles
  }

  // Get featured article for a pillar
  const getFeaturedArticle = (pillarId: string) => {
    const pillarSections = sections.filter((s) => s.pillarId === pillarId)
    const sectionIds = pillarSections.map((s) => s.id)
    const pillarArticles = articles.filter((a) => sectionIds.includes(a.sectionId))
    return pillarArticles[0] // Return first article as featured
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundColor: headerBg,
        opacity: headerOpacity,
      }}
      className="sticky top-0 z-50 border-b border-[color:var(--border)] backdrop-blur-xl"
    >
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="absolute inset-x-0 top-0 h-1 bg-brand-gradient shadow-lg shadow-[color:var(--accent)]/20"
      />

      <motion.div style={{ opacity: borderOpacity }} className="absolute inset-x-0 top-0 h-px overflow-hidden">
        <motion.div
          className="h-full w-full bg-gradient-to-r from-transparent via-[color:var(--accent)]/50 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group relative flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-cta-gradient rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative w-10 h-10 bg-cta-gradient rounded-xl flex items-center justify-center shadow-cta">
                <Sparkles className="w-5 h-5 text-[color:var(--fg-contrast)]" />
              </div>
            </motion.div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold text-brand-gradient">Vehicle Intel</span>
              <span className="text-xs text-[color:var(--fg-muted)] font-medium">AI-Powered Insights</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {pillars.map((pillar) => {
              const isActive = activePillar === pillar.id
              return (
                <div
                  key={pillar.id}
                  className="relative"
                  onMouseEnter={() => setActivePillar(pillar.id)}
                  onMouseLeave={() => setActivePillar(null)}
                >
                  <Link
                    href={`/topics/${pillar.slug}`}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 group",
                      isActive
                        ? "text-[color:var(--accent)]"
                        : "text-[color:var(--fg)] hover:text-[color:var(--accent)] hover:bg-[color:var(--muted)]/50",
                    )}
                  >
                    <span className="relative z-10">{pillar.title}</span>
                    <ChevronDown
                      className={cn("w-3.5 h-3.5 transition-transform duration-300", isActive && "rotate-180")}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="activePillar"
                        className="absolute inset-0 bg-gradient-to-r from-[color:var(--accent)]/15 via-[color:var(--accent-2)]/15 to-[color:var(--accent)]/15 rounded-lg border border-[color:var(--accent)]/40 shadow-lg shadow-[color:var(--accent)]/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-1/2 -translate-x-1/2 top-full z-50 w-screen max-w-5xl pt-4"
                      >
                        <div
                          ref={megaMenuRef}
                          className="relative rounded-2xl border-2 border-[color:var(--border)] shadow-2xl overflow-hidden bg-[color:var(--panel)]"
                        >
                          <div className="absolute inset-0 bg-cta-gradient opacity-5" />

                          <div
                            className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                              background: `radial-gradient(circle 400px at ${cursorPos.x}px ${cursorPos.y}px, rgba(255, 122, 26, 0.15), transparent 60%)`,
                            }}
                          />

                          <motion.div
                            className="absolute inset-0 opacity-15"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent 0%, rgba(255, 122, 26, 0.2) 50%, transparent 100%)",
                            }}
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              duration: 6,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          />

                          <div className="relative p-8">
                            {/* Pillar header */}
                            <div className="mb-6 pb-6 border-b border-[color:var(--border)]">
                              <h3 className="text-2xl font-bold text-brand-gradient mb-2">{pillar.title}</h3>
                              {pillar.description && (
                                <p className="text-sm text-[color:var(--fg-muted)]">{pillar.description}</p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {getSectionsForPillar(pillar.id).map((section, idx) => {
                                const sectionClusters = getClustersForSection(section.id)
                                const sectionArticles = getArticlesForSection(section.id)
                                const items = sectionClusters.length > 0 ? sectionClusters : sectionArticles
                                const SectionIcon = getSectionIcon(section.slug)

                                return (
                                  <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                    className="group/section space-y-3 p-4 rounded-xl hover:bg-[color:var(--muted)]/80 transition-all duration-300 border border-transparent hover:border-[color:var(--border)] neon-glow-hover"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="mt-0.5 p-2.5 rounded-lg bg-gradient-to-br from-[color:var(--accent)]/20 to-[color:var(--accent-2)]/20 group-hover/section:from-[color:var(--accent)]/30 group-hover/section:to-[color:var(--accent-2)]/30 transition-all duration-300 shadow-sm">
                                        <SectionIcon className="w-4 h-4 text-[color:var(--accent)]" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <Link
                                          href={`/topics/${pillar.slug}/${section.slug}`}
                                          className="text-sm font-semibold text-[color:var(--fg)] hover:text-[color:var(--accent)] transition-colors duration-200 block"
                                        >
                                          {section.title}
                                        </Link>
                                        {section.description && (
                                          <p className="mt-1 text-xs text-[color:var(--fg-muted)] line-clamp-2">
                                            {section.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {items.length > 0 && (
                                      <ul className="space-y-2 pl-11">
                                        {items.slice(0, 5).map((item, itemIdx) => (
                                          <motion.li
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.06 + itemIdx * 0.03 }}
                                          >
                                            <Link
                                              href={`/topics/${pillar.slug}/${section.slug}/${item.slug}`}
                                              className="block text-sm text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] transition-colors duration-200 hover:translate-x-1 transform"
                                            >
                                              <span className="inline-block mr-2 text-[color:var(--accent)]/50">→</span>
                                              {item.title}
                                            </Link>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    )}

                                    {items.length > 5 && (
                                      <Link
                                        href={`/topics/${pillar.slug}/${section.slug}`}
                                        className="block pl-11 text-xs text-[color:var(--accent)] hover:text-[color:var(--accent-2)] transition-colors duration-200 font-medium"
                                      >
                                        View all {items.length} items →
                                      </Link>
                                    )}
                                  </motion.div>
                                )
                              })}

                              {getFeaturedArticle(pillar.id) && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                  className="col-span-1 rounded-xl overflow-hidden border-2 border-[color:var(--border)] bg-[color:var(--card)] hover:shadow-xl hover:shadow-[color:var(--accent)]/15 hover:border-[color:var(--accent)]/40 transition-all duration-300 group/featured neon-glow-hover"
                                >
                                  <Link href={`/articles/${getFeaturedArticle(pillar.id)?.slug}`}>
                                    <div className="p-5 space-y-3 bg-gradient-to-br from-[color:var(--card)] to-[color:var(--muted)]/50">
                                      <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-md bg-gradient-to-br from-[color:var(--accent)]/20 to-[color:var(--accent-2)]/20">
                                          <Sparkles className="w-4 h-4 text-[color:var(--accent)]" />
                                        </div>
                                        <span className="text-xs font-semibold text-[color:var(--accent)] uppercase tracking-wide">
                                          Featured
                                        </span>
                                      </div>
                                      <h5 className="font-semibold text-[color:var(--fg)] text-sm leading-snug group-hover/featured:text-[color:var(--accent)] transition-colors">
                                        {getFeaturedArticle(pillar.id)?.title}
                                      </h5>
                                      {getFeaturedArticle(pillar.id)?.description && (
                                        <p className="text-xs text-[color:var(--fg-muted)] line-clamp-2 leading-relaxed">
                                          {getFeaturedArticle(pillar.id)?.description}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-2 text-xs text-[color:var(--accent)] font-medium group-hover/featured:gap-3 transition-all pt-2">
                                        <span>Read more</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover/featured:translate-x-1 transition-transform" />
                                      </div>
                                    </div>
                                  </Link>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <SearchBox />

            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/admin/generate"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-cta-gradient text-[color:var(--fg-contrast)] text-sm font-semibold shadow-cta vortex-shimmer hover:brightness-110 active:scale-[.98] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request Demo</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[color:var(--fg)] hover:text-[color:var(--accent)] hover:bg-[color:var(--muted)]/50 rounded-lg transition-all duration-200"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-16 z-40 lg:hidden bg-[color:var(--panel)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--panel)] via-[color:var(--card)] to-[color:var(--panel)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--accent)]/5 via-transparent to-[color:var(--accent-2)]/5" />

            <div className="relative h-full overflow-y-auto">
              <div className="px-4 py-6 space-y-6">
                {/* Mobile Search */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="pb-4 border-b border-[color:var(--border)]"
                >
                  <SearchBox />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href="/admin/generate"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg bg-cta-gradient text-[color:var(--fg-contrast)] text-sm font-semibold shadow-cta vortex-shimmer hover:brightness-110 active:scale-[.98] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Request Demo</span>
                  </Link>
                </motion.div>

                {/* Mobile Pillars with staggered animation */}
                {pillars.map((pillar, idx) => (
                  <motion.div
                    key={pillar.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-2"
                  >
                    <Link
                      href={`/topics/${pillar.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 px-4 font-semibold text-[color:var(--fg)] hover:text-[color:var(--accent)] hover:bg-[color:var(--muted)]/50 rounded-lg transition-all duration-200"
                    >
                      {pillar.title}
                    </Link>
                    <div className="space-y-1 pl-4">
                      {getSectionsForPillar(pillar.id).map((section, sectionIdx) => {
                        const SectionIcon = getSectionIcon(section.slug)
                        return (
                          <motion.div
                            key={section.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 + sectionIdx * 0.03 }}
                            className="space-y-1"
                          >
                            <Link
                              href={`/topics/${pillar.slug}/${section.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-2 py-2 px-3 text-sm font-medium text-[color:var(--fg-muted)] hover:text-[color:var(--fg)] hover:bg-[color:var(--muted)]/50 rounded-lg transition-all duration-200"
                            >
                              <SectionIcon className="w-4 h-4 text-[color:var(--accent)]" />
                              {section.title}
                            </Link>
                            <div className="space-y-1 pl-8">
                              {getClustersForSection(section.id)
                                .slice(0, 3)
                                .map((cluster) => (
                                  <Link
                                    key={cluster.id}
                                    href={`/topics/${pillar.slug}/${section.slug}/${cluster.slug}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="block py-1.5 px-3 text-xs text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] rounded-lg transition-all duration-200"
                                  >
                                    → {cluster.title}
                                  </Link>
                                ))}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
