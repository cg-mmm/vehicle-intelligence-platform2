import { Suspense } from "react"
import type { Metadata } from "next"
import { loadDataPageConfig, queryDataset } from "@/lib/data/dataset"
import { DatabaseView } from "@/components/data/DatabaseView"
import { AdSlot } from "@/components/marketing/AdSlot"
import { OffersRail } from "@/components/marketing/OffersRail"
import { relatedFromTree } from "@/lib/links/relatedFromTree"

export const metadata: Metadata = {
  title: "Baby Name Database - Find the Perfect Name",
  description: "Search and explore thousands of baby names with meanings, origins, and popularity rankings.",
}

export default async function DatabasePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const config = loadDataPageConfig()

  // Parse filters from URL
  const filters = {
    gender: params.gender ? (Array.isArray(params.gender) ? params.gender : [params.gender]) : undefined,
    origin: params.origin ? (Array.isArray(params.origin) ? params.origin : [params.origin]) : undefined,
    tags: params.tags ? (Array.isArray(params.tags) ? params.tags : [params.tags]) : undefined,
    popularity_rank:
      params.popularity_min && params.popularity_max
        ? ([Number(params.popularity_min), Number(params.popularity_max)] as [number, number])
        : undefined,
  }

  const sortBy = (params.sortBy as string) || "name"
  const sortOrder = (params.sortOrder as "asc" | "desc") || "asc"
  const page = Number(params.page) || 1

  const result = queryDataset(filters, sortBy, sortOrder, page, 50)

  const relatedLinksMap: Record<string, Array<{ title: string; href: string }>> = {}
  result.items.forEach((item) => {
    const links = relatedFromTree(
      {
        keywords: [item.origin, item.gender, ...item.tags],
        excludeSlug: item.slug,
      },
      2,
    )
    if (links.length > 0) {
      relatedLinksMap[item.slug] = links
    }
  })

  // JSON-LD for Dataset
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: config.title,
    description: "Comprehensive database of baby names with meanings, origins, and popularity data",
    url: "https://example.com/database",
    keywords: ["baby names", "name meanings", "name origins", "popular names"],
  }

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Top Banner Ad */}
      {config.ads.includes("top_banner") && (
        <div className="container mx-auto px-4 pt-8">
          <AdSlot id="top_banner" />
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {config.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore thousands of baby names with detailed meanings, origins, and popularity rankings
          </p>
        </header>

        <Suspense fallback={<div className="text-center py-12">Loading database...</div>}>
          <DatabaseView
            config={config}
            initialData={result}
            initialFilters={filters}
            initialSort={{ by: sortBy, order: sortOrder }}
            initialPage={page}
            relatedLinksMap={relatedLinksMap}
          />
        </Suspense>

        {/* In-Database Ad */}
        {config.ads.includes("in_database_1") && (
          <div className="mt-12">
            <AdSlot id="in_database_1" />
          </div>
        )}

        {/* Offers Rail */}
        <div className="mt-12">
          <OffersRail tags={config.offersTags} />
        </div>
      </div>
    </div>
  )
}
