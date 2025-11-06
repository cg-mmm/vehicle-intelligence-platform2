import { Seo } from "@/components/seo/Seo"
import { buildMetaTags } from "@/lib/seo/meta"
import { buildWebSiteSchema } from "@/lib/seo/jsonld"
import { getBrand } from "@/lib/siteConfig"
import type { Metadata } from "next"
import { HeroLatest } from "@/components/home/HeroLatest"
import { ContentStats } from "@/components/home/ContentStats"
import { CategoryGrid } from "@/components/home/CategoryGrid"
import { getLatestHero } from "@/lib/home/data"
import { listArticles } from "@/lib/storage"
import { getTaxonomy } from "@/lib/taxonomy"

export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrand()
  const hero = await getLatestHero()

  return buildMetaTags(
    {
      title: `${brand.siteName} - ${hero.title}`,
      description: hero.subtitle || hero.title,
      canonical: "/",
      ogImage: hero.coverImage,
    },
    brand,
  )
}

export default async function HomePage() {
  const brand = getBrand()
  const hero = await getLatestHero()
  const articles = listArticles()
  const taxonomy = getTaxonomy()

  // Calculate stats
  const totalArticles = articles.length
  const totalVideos = articles.length // All articles have videos
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const articlesThisWeek = articles.filter((a) => new Date(a.publishedAt).getTime() > weekAgo).length
  const avgReadTime = 5 // Average read time in minutes

  // Get all categories with article counts
  const categories: Array<{
    pillar: string
    pillarSlug: string
    section: string
    sectionSlug: string
    cluster: string
    clusterSlug: string
    articleCount: number
  }> = []

  for (const cluster of taxonomy.clusters.values()) {
    const section = taxonomy.sections.get(cluster.sectionId)
    if (!section) continue

    const pillar = taxonomy.pillars.get(section.pillarId)
    if (!pillar) continue

    const clusterArticles = articles.filter((a) => a.cluster?.slug === cluster.slug)
    if (clusterArticles.length === 0) continue

    categories.push({
      pillar: pillar.title,
      pillarSlug: pillar.slug,
      section: section.title,
      sectionSlug: section.slug,
      cluster: cluster.title,
      clusterSlug: cluster.slug,
      articleCount: clusterArticles.length,
    })
  }

  // Sort by article count descending
  categories.sort((a, b) => b.articleCount - a.articleCount)

  const jsonLd = buildWebSiteSchema(brand)
  const metadata = await generateMetadata()

  return (
    <>
      <Seo metadata={metadata} jsonLd={jsonLd} />
      <div className="relative min-h-screen bg-bg">
        <HeroLatest hero={hero} />

        <ContentStats
          totalArticles={totalArticles}
          totalVideos={totalVideos}
          totalCategories={taxonomy.sections.size}
          totalClusters={taxonomy.clusters.size}
          articlesThisWeek={articlesThisWeek}
          avgReadTime={avgReadTime}
        />

        <CategoryGrid categories={categories} />
      </div>
    </>
  )
}
