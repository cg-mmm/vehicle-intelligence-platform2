"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Folder, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Category {
  pillar: string
  pillarSlug: string
  section: string
  sectionSlug: string
  cluster: string
  clusterSlug: string
  articleCount: number
}

interface CategoryGridProps {
  categories: Category[]
}

const ITEMS_PER_PAGE = 12

export function CategoryGrid({ categories }: CategoryGridProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentCategories = categories.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of grid
    document.getElementById("category-grid")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section
      id="category-grid"
      className="relative py-24 bg-gradient-to-b from-background via-surface to-background overflow-hidden"
      aria-labelledby="category-grid-heading"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-primary">Explore Our Content</span>
          </div>
          <h2
            id="category-grid-heading"
            className="text-5xl md:text-6xl font-bold text-[color:var(--fg-contrast)] mb-6 bg-brand-gradient bg-clip-text text-transparent"
          >
            All Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive collection of vehicle insights, comparisons, and guides
          </p>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Showing {startIndex + 1} to {Math.min(endIndex, categories.length)} of {categories.length} categories. Page{" "}
            {currentPage} of {totalPages}.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Category list">
          {currentCategories.map((category, index) => (
            <motion.div
              key={`${category.pillarSlug}-${category.sectionSlug}-${category.clusterSlug}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              role="listitem"
            >
              <Link
                href={`/topics/${category.pillarSlug}/${category.sectionSlug}/${category.clusterSlug}`}
                className="block group h-full"
                aria-label={`${category.cluster} in ${category.section} - ${category.articleCount} ${category.articleCount === 1 ? "article" : "articles"}`}
              >
                <div className="relative bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 overflow-hidden h-full card-hover-lift">
                  {/* Animated gradient on hover */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-300"
                    aria-hidden="true"
                  />

                  {/* Shimmer effect on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" />
                  </div>

                  <div className="relative z-10">
                    {/* Icon and badge */}
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        className="w-14 h-14 rounded-xl bg-cta-gradient flex items-center justify-center shadow-lg shadow-primary/30"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        aria-hidden="true"
                      >
                        <Folder className="w-7 h-7 text-[color:var(--fg-contrast)]" />
                      </motion.div>
                      <Badge className="bg-primary/20 text-primary border-primary/30 font-semibold">
                        {category.articleCount} {category.articleCount === 1 ? "article" : "articles"}
                      </Badge>
                    </div>

                    {/* Breadcrumb */}
                    <nav aria-label="Category breadcrumb" className="text-sm text-muted-foreground mb-3 font-medium">
                      {category.pillar}{" "}
                      <span className="text-border" aria-hidden="true">
                        →
                      </span>{" "}
                      {category.section}
                    </nav>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {category.cluster}
                    </h3>

                    {/* Arrow with animation */}
                    <div className="flex items-center text-primary text-sm font-medium">
                      <span>Explore Category</span>
                      <ArrowRight
                        className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex items-center justify-center gap-2"
            aria-label="Category pagination"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Go to previous page"
              className="bg-surface/50 border-border hover:border-primary/50 hover:bg-border/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)

                const showEllipsis =
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2)

                if (showEllipsis) {
                  return (
                    <span key={page} className="px-2 text-muted-foreground" aria-hidden="true">
                      ...
                    </span>
                  )
                }

                if (!showPage) return null

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => goToPage(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={
                      currentPage === page
                        ? "bg-gradient-to-r from-primary to-accent text-[color:var(--fg-contrast)] border-0"
                        : "bg-surface/50 border-border hover:border-primary/50 hover:bg-border/50"
                    }
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Go to next page"
              className="bg-surface/50 border-border hover:border-primary/50 hover:bg-border/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.nav>
        )}

        {/* View all link */}
        {categories.length > ITEMS_PER_PAGE && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <Link
              href="/topics"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cta-gradient text-[color:var(--fg-contrast)] font-semibold hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105"
              aria-label="View all topics and categories"
            >
              <span>View All Topics</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
