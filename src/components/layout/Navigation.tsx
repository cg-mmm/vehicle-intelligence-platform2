"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Car, Sparkles, FileText, Menu, X, ChevronDown, BookOpen, Layers } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const navItems = [
    { href: "/", label: "Home", icon: Car },
    { href: "/articles", label: "Articles", icon: FileText },
    { href: "/admin/generate", label: "Generate", icon: Sparkles },
  ]

  const pillarItems = [
    {
      label: "Sedans",
      icon: BookOpen,
      pillarSlug: "sedan-buying-guide",
      clusters: [
        { href: "/articles/2026-midsize-sedan-comparison", label: "Midsize Sedan Comparison" },
        { href: "/articles/luxury-sedan-showdown", label: "Luxury Sedan Showdown" },
      ],
    },
    {
      label: "SUVs",
      icon: Layers,
      pillarSlug: "suv-comparison-hub",
      clusters: [
        { href: "/articles/best-electric-suvs-2026", label: "Best Electric SUVs" },
        { href: "/articles/compact-suv-buyers-guide", label: "Compact SUV Guide" },
      ],
    },
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-border backdrop-blur-xl bg-card/90"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }} className="relative">
              <div className="absolute inset-0 bg-brand-gradient rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-10 h-10 bg-brand-gradient rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-brand-gradient">AutoIntel</span>
              <span className="text-xs text-muted-foreground">Vehicle Intelligence</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-focus",
                    isActive ? "text-brand-gradient" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}

            {pillarItems.map((pillar) => {
              const Icon = pillar.icon
              const isOpen = openDropdown === pillar.pillarSlug
              const isActive = pillar.clusters.some((cluster) => pathname === cluster.href)

              return (
                <div
                  key={pillar.pillarSlug}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(pillar.pillarSlug)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={`/topics/${pillar.pillarSlug}`}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {pillar.label}
                    <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-xl overflow-hidden"
                      >
                        <div className="p-2">
                          {pillar.clusters.map((cluster) => (
                            <Link
                              key={cluster.href}
                              href={cluster.href}
                              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                              {cluster.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border"
          >
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}

            {pillarItems.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div key={pillar.pillarSlug} className="mt-2">
                  <Link
                    href={`/topics/${pillar.pillarSlug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    {pillar.label}
                  </Link>
                  <div className="ml-8 space-y-1">
                    {pillar.clusters.map((cluster) => (
                      <Link
                        key={cluster.href}
                        href={cluster.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {cluster.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
