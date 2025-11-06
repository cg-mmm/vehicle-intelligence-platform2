export interface HomeHero {
  type: "article" | "video"
  title: string
  subtitle?: string
  coverImage: string
  badge?: string
  url: string
  pillar: { slug: string; title: string }
  section: { slug: string; title: string }
  publishedAt: string
  stats?: { label: string; value: string; unit?: string }[]
  videoUrl?: string
}

export interface HomeKpis {
  articlesThisWeek: number
  videosThisWeek: number
  avgTimeOnPageSec: number
  indexedPages: number
  trendSparkline: number[]
}

export interface TrendItem {
  title: string
  url: string
  pillar: string
  section: string
  shares: number
  views: number
  velocity: number
  coverImage?: string
}

export interface TopicNode {
  pillar: string
  section: string
  cluster: string
  count: number
}
