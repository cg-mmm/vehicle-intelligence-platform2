"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, BookOpen, TrendingUp, Layers, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { FluidHero } from "../layout/FluidHero"
import { LiquidBlobs } from "../visual/LiquidBlobs"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Cluster {
  slug: string
  title: string
  description: string
  articleCount: number
}

interface FeaturedArticle {
  slug: string
  title: string
  description: string
  image: string
}

interface Pillar {
  slug: string
  title: string
  description: string
  hero: {
    title: string
    subtitle: string
    image: string
  }
  clusters: Cluster[]
  featuredArticles: FeaturedArticle[]
}

interface PillarPageViewProps {
  pillar: Pillar
  brand: any
}

const CLUSTERS_PER_PAGE = 9

export function PillarPageView({ pillar, brand }: PillarPageViewProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(pillar.clusters.length / CLUSTERS_PER_PAGE)
  const startIndex = (currentPage - 1) * CLUSTERS_PER_PAGE
  const endIndex = startIndex + CLUSTERS_PER_PAGE
  const currentClusters = pillar.clusters.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    document.getElementById("topic-clusters")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-background relative">
      <LiquidBlobs />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <FluidHero
          eyebrow="Topic Hub"
          headline={pillar.hero.title}
          subheadline={pillar.hero.subtitle}
          badges={[{ label: "Pillar Page" }, { label: `${pillar.clusters.length} Topics` }]}
          stockArtVariant="sedan"
        />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <div className="relative max-w-3xl">
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-2xl blur-3xl"
              aria-hidden="true"
            />
            <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">About {pillar.title}</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">{pillar.description}</p>
            </div>
          </div>
        </motion.div>

        <motion.section
          id="topic-clusters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-16"
          aria-labelledby="topic-clusters-heading"
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
              aria-hidden="true"
            >
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <h2 id="topic-clusters-heading" className="text-2xl font-bold text-foreground">
              Topic Clusters
            </h2>
          </div>

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Showing {startIndex + 1} to {Math.min(endIndex, pillar.clusters.length)} of {pillar.clusters.length} topics.
            Page {currentPage} of {totalPages}.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {currentClusters.map((cluster, index) => (
              <motion.div
                key={cluster.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                role="listitem"
              >
                <Link
                  href={`/topics/${cluster.slug}`}
                  className="block relative group h-full"
                  aria-label={`${cluster.title} - ${cluster.articleCount} articles`}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10 rounded-xl transition-all duration-300 blur-xl"
                    aria-hidden="true"
                  />

                  <div className="relative p-6 bg-card border border-border rounded-xl hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {cluster.title}
                      </h3>
                      <ArrowRight
                        className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-muted-foreground mb-4 flex-grow">{cluster.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="px-3 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-2">
                        <BookOpen className="w-4 h-4" aria-hidden="true" />
                        <span className="font-medium">{cluster.articleCount} articles</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Topic clusters pagination">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </nav>
          )}
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {pillar.featuredArticles.length > 0 && (
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Featured Articles</h2>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillar.featuredArticles.map((article, index) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              >
                <Link href={`/articles/${article.slug}`} className="block group relative">
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/20 group-hover:to-accent/20 rounded-xl transition-all duration-300 blur-2xl"
                    aria-hidden="true"
                  />

                  <div className="relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent z-10" />
                      <img
                        src={article.image || "/placeholder.svg?height=400&width=600"}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">{article.description}</p>

                      <div className="mt-4 flex items-center gap-2 text-primary font-medium text-sm">
                        <span>Read Article</span>
                        <ArrowRight
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
