import { listArticles } from "@/lib/storage"
import { getTaxonomy } from "@/lib/taxonomy"
import type { HomeHero, HomeKpis, TrendItem, TopicNode } from "./contracts"

export async function getLatestHero(): Promise<HomeHero> {
  const articles = listArticles()

  // Sort by publishedAt desc
  const sorted = articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const latest = sorted[0]
  if (!latest) {
    throw new Error("No articles found")
  }

  // Determine badge from section contentType
  let badge = "New"
  if (latest.cluster?.title.toLowerCase().includes("comparison")) {
    badge = "Comparison"
  } else if (latest.cluster?.title.toLowerCase().includes("deep")) {
    badge = "Deep Dive"
  } else if (latest.cluster?.title.toLowerCase().includes("guide")) {
    badge = "Guide"
  }

  // Extract stats from article
  const stats =
    latest.enhancements?.keyTakeaways?.items.slice(0, 3).map((item, i) => ({
      label: `Key Insight ${i + 1}`,
      value: item.substring(0, 50),
    })) || []

  return {
    type: "article",
    title: latest.title,
    subtitle: latest.description,
    coverImage: latest.hero?.image?.url || "/placeholder.svg?height=800&width=1200",
    badge,
    url: `/topics/${latest.pillar?.slug}/${latest.cluster?.slug?.split("-").pop()}/${latest.cluster?.slug}/${latest.slug}`,
    pillar: {
      slug: latest.pillar?.slug || "",
      title: latest.pillar?.title || "",
    },
    section: {
      slug: latest.cluster?.slug || "",
      title: latest.cluster?.title || "",
    },
    publishedAt: latest.publishedAt,
    stats,
    videoUrl: `/video/${latest.slug}`,
  }
}

export async function getHomeKpis(): Promise<HomeKpis> {
  const articles = listArticles()

  // Count articles published in last 7 days
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const articlesThisWeek = articles.filter((a) => new Date(a.publishedAt).getTime() > weekAgo).length

  // Generate synthetic sparkline (last 14 days)
  const trendSparkline = Array.from({ length: 14 }, (_, i) => {
    const base = 100
    const variance = Math.sin(i / 2) * 20
    const random = Math.random() * 10
    return Math.round(base + variance + random)
  })

  return {
    articlesThisWeek,
    videosThisWeek: articlesThisWeek, // All articles have videos
    avgTimeOnPageSec: 245,
    indexedPages: articles.length,
    trendSparkline,
  }
}

export async function getTrendingNow(limit = 12): Promise<TrendItem[]> {
  const articles = listArticles()

  // Sort by most recent (velocity proxy)
  const sorted = articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)

  return sorted.map((article, i) => ({
    title: article.title,
    url: `/topics/${article.pillar?.slug}/${article.cluster?.slug?.split("-").pop()}/${article.cluster?.slug}/${article.slug}`,
    pillar: article.pillar?.title || "",
    section: article.cluster?.title || "",
    shares: Math.floor(Math.random() * 500) + 100,
    views: Math.floor(Math.random() * 5000) + 1000,
    velocity: 100 - i * 5,
    coverImage: article.hero?.image?.url,
  }))
}

export async function getMostShared(limit = 12): Promise<TrendItem[]> {
  const articles = listArticles()

  // Simulate share counts
  const withShares = articles.map((article) => ({
    title: article.title,
    url: `/topics/${article.pillar?.slug}/${article.cluster?.slug?.split("-").pop()}/${article.cluster?.slug}/${article.slug}`,
    pillar: article.pillar?.title || "",
    section: article.cluster?.title || "",
    shares: Math.floor(Math.random() * 1000) + 200,
    views: Math.floor(Math.random() * 10000) + 2000,
    velocity: Math.floor(Math.random() * 100),
    coverImage: article.hero?.image?.url,
  }))

  return withShares.sort((a, b) => b.shares - a.shares).slice(0, limit)
}

export async function getTopicTree(): Promise<TopicNode[]> {
  const taxonomy = getTaxonomy()
  const articles = listArticles()

  const nodes: TopicNode[] = []

  for (const pillar of taxonomy.pillars.values()) {
    const pillarSections = Array.from(taxonomy.sections.values()).filter((s) => s.pillarId === pillar.id)

    for (const section of pillarSections) {
      const sectionClusters = Array.from(taxonomy.clusters.values()).filter((c) => c.sectionId === section.id)

      for (const cluster of sectionClusters) {
        const count = articles.filter((a) => a.cluster?.slug === cluster.slug).length

        if (count > 0) {
          nodes.push({
            pillar: pillar.title,
            section: section.title,
            cluster: cluster.title,
            count,
          })
        }
      }
    }
  }

  return nodes.sort((a, b) => b.count - a.count)
}
