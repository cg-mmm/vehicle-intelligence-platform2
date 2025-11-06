import "server-only"
import { z } from "zod"
import taxonomyData from "@/content/taxonomy.json"
import type { Pillar, Section, Cluster, ArticleMeta } from "@/lib/contracts"

const SectionSlugSchema = z.enum(["comparisons", "deep-dives", "guides", "glossary", "news", "database"])

const ContentTypeSchema = z.enum(["comparison", "deep_dive", "how_to", "glossary", "news", "database_entry"])

const PillarSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  coverImage: z.string().optional(),
  navWeight: z.number(),
  relatedPillars: z.array(z.string()).optional(),
})

const SectionSchema = z.object({
  id: z.string(),
  pillarId: z.string(),
  slug: SectionSlugSchema,
  title: z.string(),
  description: z.string().optional(),
  navWeight: z.number(),
  featuredClusterIds: z.array(z.string()).optional(),
})

const ClusterSchema = z.object({
  id: z.string(),
  pillarId: z.string(),
  sectionId: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  coverImage: z.string().optional(),
  navWeight: z.number(),
  tags: z.array(z.string()).optional(),
  relatedClusters: z.array(z.string()).optional(),
})

const ArticleMetaSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  pillarId: z.string(),
  sectionId: z.string(),
  clusterId: z.string().optional(),
  content_type: ContentTypeSchema,
})

const TaxonomySchema = z.object({
  pillars: z.array(PillarSchema),
  sections: z.array(SectionSchema),
  clusters: z.array(ClusterSchema),
  articles: z.array(ArticleMetaSchema),
})

// In-memory cache
let cachedTaxonomy: {
  pillars: Map<string, Pillar>
  sections: Map<string, Section>
  clusters: Map<string, Cluster>
  articles: Map<string, ArticleMeta>
} | null = null

// Load and validate taxonomy
function loadTaxonomy() {
  if (cachedTaxonomy) return cachedTaxonomy

  try {
    const validated = TaxonomySchema.parse(taxonomyData)

    cachedTaxonomy = {
      pillars: new Map(validated.pillars.map((p) => [p.slug, p])),
      sections: new Map(validated.sections.map((s) => [`${s.pillarId}:${s.slug}`, s])),
      clusters: new Map(validated.clusters.map((c) => [c.slug, c])),
      articles: new Map(validated.articles.map((a) => [a.slug, a])),
    }

    return cachedTaxonomy
  } catch (error) {
    console.error("[v0] Taxonomy validation failed:", error)
    return {
      pillars: new Map(),
      sections: new Map(),
      clusters: new Map(),
      articles: new Map(),
    }
  }
}

export function getTaxonomy() {
  return loadTaxonomy()
}

// Public API
export function getPillar(slug: string): Pillar | undefined {
  const taxonomy = loadTaxonomy()
  return taxonomy.pillars.get(slug)
}

export function getSection(pillarId: string, sectionSlug: string): Section | undefined {
  const taxonomy = loadTaxonomy()
  return taxonomy.sections.get(`${pillarId}:${sectionSlug}`)
}

export function getCluster(slug: string): Cluster | undefined {
  const taxonomy = loadTaxonomy()
  return taxonomy.clusters.get(slug)
}

export function getArticleMeta(slug: string): ArticleMeta | undefined {
  const taxonomy = loadTaxonomy()
  return taxonomy.articles.get(slug)
}

export function listPillars(): Pillar[] {
  const taxonomy = loadTaxonomy()
  return Array.from(taxonomy.pillars.values()).sort((a, b) => a.navWeight - b.navWeight)
}

export function listSections(pillarId?: string): Section[] {
  const taxonomy = loadTaxonomy()
  const sections = Array.from(taxonomy.sections.values())

  if (pillarId) {
    return sections.filter((s) => s.pillarId === pillarId).sort((a, b) => a.navWeight - b.navWeight)
  }

  return sections.sort((a, b) => a.navWeight - b.navWeight)
}

export function listClusters(pillarId?: string, sectionId?: string): Cluster[] {
  const taxonomy = loadTaxonomy()
  const clusters = Array.from(taxonomy.clusters.values())

  let filtered = clusters

  if (pillarId) {
    filtered = filtered.filter((c) => c.pillarId === pillarId)
  }

  if (sectionId) {
    filtered = filtered.filter((c) => c.sectionId === sectionId)
  }

  return filtered.sort((a, b) => a.navWeight - b.navWeight)
}

export function listArticles(pillarId?: string, sectionId?: string, clusterId?: string): ArticleMeta[] {
  const taxonomy = loadTaxonomy()
  const articles = Array.from(taxonomy.articles.values())

  let filtered = articles

  if (pillarId) {
    filtered = filtered.filter((a) => a.pillarId === pillarId)
  }

  if (sectionId) {
    filtered = filtered.filter((a) => a.sectionId === sectionId)
  }

  if (clusterId) {
    filtered = filtered.filter((a) => a.clusterId === clusterId)
  }

  return filtered
}

// Validation helpers
export function validateArticleTaxonomy(article: {
  pillarId?: string
  sectionId?: string
  clusterId?: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!article.pillarId) {
    errors.push("Article must have a pillarId")
  } else if (!getPillar(article.pillarId.replace("pillar-", ""))) {
    errors.push(`Pillar '${article.pillarId}' does not exist`)
  }

  if (!article.sectionId) {
    errors.push("Article must have a sectionId")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// URL helpers
export function getArticleUrl(article: ArticleMeta): string {
  const pillar = getPillar(article.pillarId.replace("pillar-", ""))
  const section = getSection(article.pillarId, article.sectionId.replace("section-", ""))

  if (!pillar || !section) return `/articles/${article.slug}`

  if (article.clusterId) {
    const cluster = getCluster(article.clusterId.replace("cluster-", ""))
    if (cluster) {
      return `/topics/${pillar.slug}/${section.slug}/${cluster.slug}/${article.slug}`
    }
  }

  return `/topics/${pillar.slug}/${section.slug}/${article.slug}`
}

// Aliases for smoke test compatibility
export function getPillars(): Pillar[] {
  return listPillars()
}

export function getSections(pillarId: string): Section[] {
  return listSections(pillarId)
}

export function getClusters(sectionId: string): Cluster[] {
  return listClusters(undefined, sectionId)
}
