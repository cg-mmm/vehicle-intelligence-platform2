"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Sparkles,
  FileText,
  Play,
  Calendar,
  Clock,
  TrendingUp,
  Layers,
  Tag,
  ArrowRight,
  Video,
  BookOpen,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"
import type { BrandPack } from "@/lib/packs/brand"
import type { ContentPack } from "@/lib/packs/content"
import type { ArticleDoc } from "@/lib/contracts"
import type { Pillar, Section, Cluster } from "@/lib/contracts"

interface HomePageClientProps {
  brand: BrandPack
  contentPack: ContentPack
  articles: ArticleDoc[]
  pillars: Pillar[]
  sections: Section[]
  clusters: Cluster[]
}

export default function HomePageClient({
  brand,
  contentPack,
  articles,
  pillars,
  sections,
  clusters,
}: HomePageClientProps) {
  const { homepage } = contentPack

  // Sort articles by most recent first
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  // Get unique tags from all articles
  const allTags = Array.from(
    new Set(
      articles.flatMap((article) =>
        article.blocks
          .filter((block) => block.type === "lsi_longform")
          .flatMap((block: any) => block.keywords_used || []),
      ),
    ),
  ).slice(0, 20)

  return (
    <div className="relative min-h-screen bg-bg">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-bg via-surface to-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent animate-pulse delay-2000" />
      </div>

      <section className="relative container mx-auto px-4 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            {sortedArticles.length} Articles • {pillars.length} Topics • {clusters.length} Collections
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-fg via-primary to-accent bg-clip-text text-transparent animate-gradient">
              {homepage.hero.title}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-fg-muted text-balance max-w-4xl mx-auto leading-relaxed">
            {homepage.hero.subtitle}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 pt-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface/50 border border-border backdrop-blur-sm">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-fg font-semibold">{sortedArticles.length}</span>
              <span className="text-fg-muted text-sm">Articles</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface/50 border border-border backdrop-blur-sm">
              <Video className="w-5 h-5 text-secondary" />
              <span className="text-fg font-semibold">{sortedArticles.length}</span>
              <span className="text-fg-muted text-sm">Videos</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface/50 border border-border backdrop-blur-sm">
              <Layers className="w-5 h-5 text-accent" />
              <span className="text-fg font-semibold">{clusters.length}</span>
              <span className="text-fg-muted text-sm">Collections</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-fg">Browse by Topic</h2>
              <p className="text-fg-muted">Explore our comprehensive content library</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => {
              const pillarSections = sections.filter((s) => s.pillarId === pillar.id)
              const pillarClusters = clusters.filter((c) => c.pillarId === pillar.id)
              const pillarArticles = sortedArticles.filter((a) => a.pillar?.slug === pillar.slug)

              return (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link href={`/topics/${pillar.slug}`}>
                    <Card className="group relative overflow-hidden bg-gradient-to-br from-surface/50 to-surface/20 border-border hover:border-primary/30 transition-all cursor-pointer h-full">
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-secondary/0 group-hover:from-primary/10 group-hover:via-accent/10 group-hover:to-secondary/10 transition-all duration-500" />

                      <div className="relative p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            {pillar.icon || "📚"}
                          </div>
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            {pillarArticles.length} articles
                          </Badge>
                        </div>

                        <div>
                          <h3 className="font-bold text-xl text-fg group-hover:text-primary transition-colors mb-2">
                            {pillar.title}
                          </h3>
                          <p className="text-sm text-fg-muted line-clamp-2">{pillar.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {pillarSections.slice(0, 3).map((section) => (
                            <Badge
                              key={section.id}
                              variant="outline"
                              className="text-xs bg-surface/50 border-border text-fg-muted"
                            >
                              {section.title}
                            </Badge>
                          ))}
                          {pillarSections.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-surface/50 border-border text-fg-muted">
                              +{pillarSections.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      <section className="relative container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-fg">Popular Tags</h2>
              <p className="text-fg-muted">Discover content by topic</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {allTags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.02, duration: 0.4 }}
              >
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-base bg-gradient-to-r from-surface/50 to-surface/20 border-border hover:border-secondary/30 hover:bg-surface/80 transition-all cursor-pointer backdrop-blur-sm"
                >
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-fg">Latest Content</h2>
              <p className="text-fg-muted">Most recently published articles and videos</p>
            </div>
          </div>

          <div className="space-y-6">
            {sortedArticles.map((article, index) => {
              const hasVideo = true // All articles have videos now
              const publishDate = new Date(article.publishedAt)
              const isNew = Date.now() - publishDate.getTime() < 7 * 24 * 60 * 60 * 1000 // Less than 7 days old

              return (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                >
                  <Card className="group relative overflow-hidden bg-gradient-to-br from-surface/50 to-surface/20 border-border hover:border-primary/30 transition-all">
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-accent/0 to-secondary/0 group-hover:from-primary/5 group-hover:via-accent/5 group-hover:to-secondary/5 transition-all duration-700" />

                    <div className="relative grid md:grid-cols-[300px_1fr] gap-6 p-6">
                      {/* Thumbnail */}
                      <Link
                        href={`/topics/${article.pillar?.slug}/${article.cluster?.slug?.split("-").pop()}/${article.cluster?.slug}/${article.slug}`}
                        className="relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 group-hover:scale-105 transition-transform"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                        {hasVideo && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-surface/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="w-8 h-8 text-fg" />
                            </div>
                          </div>
                        )}
                        {isNew && (
                          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-primary to-accent text-white border-0 animate-pulse">
                            <Zap className="w-3 h-3 mr-1" />
                            New
                          </Badge>
                        )}
                      </Link>

                      {/* Content */}
                      <div className="flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          {/* Breadcrumb */}
                          <div className="flex items-center gap-2 text-sm text-fg-muted">
                            <Link
                              href={`/topics/${article.pillar?.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {article.pillar?.title}
                            </Link>
                            <span>/</span>
                            <Link
                              href={`/topics/${article.pillar?.slug}/${article.cluster?.slug?.split("-").pop()}`}
                              className="hover:text-primary transition-colors"
                            >
                              {article.cluster?.title}
                            </Link>
                          </div>

                          {/* Title */}
                          <Link
                            href={`/topics/${article.pillar?.slug}/${article.cluster?.slug?.split("-").pop()}/${article.cluster?.slug}/${article.slug}`}
                          >
                            <h3 className="font-bold text-2xl text-fg group-hover:text-primary transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                          </Link>

                          {/* Description */}
                          <p className="text-fg-muted line-clamp-2">{article.description}</p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {article.blocks
                              .filter((block) => block.type === "lsi_longform")
                              .flatMap((block: any) => block.keywords_used || [])
                              .slice(0, 5)
                              .map((keyword: string) => (
                                <Badge
                                  key={keyword}
                                  variant="outline"
                                  className="text-xs bg-surface/50 border-border text-fg-muted"
                                >
                                  {keyword}
                                </Badge>
                              ))}
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-6 text-sm text-fg-muted">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {publishDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {Math.ceil(
                              article.blocks.reduce((acc, block) => {
                                if (block.type === "lsi_longform") {
                                  return acc + ((block as any).word_count || 0)
                                }
                                return acc + 100
                              }, 0) / 200,
                            )}{" "}
                            min read
                          </div>
                          {hasVideo && (
                            <div className="flex items-center gap-2 text-primary">
                              <Video className="w-4 h-4" />
                              Video included
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Load more button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center pt-12"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-0 text-lg px-8"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Load More Content
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="relative overflow-hidden p-12 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-primary/20 backdrop-blur-sm">
            {/* Animated gradient orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="relative max-w-2xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-border text-primary text-sm font-medium backdrop-blur-sm">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Stay Updated
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-fg">Never Miss an Update</h2>
              <p className="text-lg text-fg-muted">
                Get the latest articles, videos, and insights delivered straight to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-surface/50 border border-border text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none backdrop-blur-sm"
                />
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-0 px-8">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-fg-muted">No spam. Unsubscribe anytime.</p>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
