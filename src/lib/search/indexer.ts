import type { ArticleDoc } from "../contracts"
import type { SearchDoc } from "./contracts"
import { getTaxonomy } from "@/lib/taxonomy"
import { listArticles } from "@/lib/storage"

// Simple text normalization for search
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// Extract plain text from HTML/markdown
function extractPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ") // Remove HTML tags
    .replace(/[#*_`]/g, "") // Remove markdown symbols
    .replace(/\s+/g, " ")
    .trim()
}

// Build search document from article
export function indexArticle(article: ArticleDoc): SearchDoc {
  // Extract content from blocks
  const contentParts: string[] = []

  article.blocks.forEach((block) => {
    if (block.type === "intro" || block.type === "markdown") {
      const text = "html" in block ? extractPlainText(block.html) : "md" in block ? extractPlainText(block.md) : ""
      contentParts.push(text)
    } else if (block.type === "lsi_longform" && "content_markdown" in block) {
      contentParts.push(extractPlainText(block.content_markdown))
    } else if (block.type === "faq" && "items" in block) {
      block.items.forEach((item) => {
        contentParts.push(`${item.q} ${item.a}`)
      })
    }
  })

  const content_plain = contentParts.join(" ")

  // Extract stats
  const stats: Array<{ label: string; value: string; unit?: string }> = []
  article.blocks.forEach((block) => {
    if (block.type === "specGrid" && "groups" in block) {
      block.groups.forEach((group) => {
        group.items.forEach((item) => {
          stats.push({
            label: item.label,
            value: item.value,
            unit: undefined,
          })
        })
      })
    }
  })

  // Extract images
  const images: string[] = []
  if (article.hero.image?.url) {
    images.push(article.hero.image.url)
  }
  article.blocks.forEach((block) => {
    if (block.type === "gallery" && "images" in block) {
      block.images.forEach((img) => images.push(img.url))
    }
  })

  // Extract semantic clusters from LSI content
  const semantic_clusters: Array<{ topic: string; related_terms: string[] }> = []
  article.blocks.forEach((block) => {
    if (block.type === "lsi_longform" && "semantic_clusters" in block && block.semantic_clusters) {
      semantic_clusters.push(...block.semantic_clusters)
    }
  })

  return {
    id: `article:${article.slug}`,
    kind: "article",
    url: `/articles/${article.slug}`,
    title: article.title,
    subtitle: article.hero.subtitle,
    summary: article.enhancements?.tldr?.content || article.description,
    content_plain,
    keywords: article.blocks
      .filter((b) => b.type === "lsi_longform" && "keywords_used" in b)
      .flatMap((b: any) => b.keywords_used || []),
    semantic_clusters,
    pillar: article.pillar,
    section: article.cluster
      ? {
          slug: article.cluster.slug,
          title: article.cluster.title,
        }
      : undefined,
    cluster: article.cluster,
    stats,
    images,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    popularityScore: 0, // TODO: Track views/CTR
  }
}

// Build search index from all content
export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = []

  // Index articles
  const articles = listArticles()
  articles.forEach((article) => {
    docs.push(indexArticle(article))
  })

  // Index taxonomy (pillars, sections, clusters)
  const taxonomy = getTaxonomy()

  taxonomy.pillars.forEach((pillar) => {
    docs.push({
      id: `pillar:${pillar.slug}`,
      kind: "pillar",
      url: `/topics/${pillar.slug}`,
      title: pillar.title,
      summary: pillar.description,
      content_plain: pillar.description,
      pillar: {
        slug: pillar.slug,
        title: pillar.title,
      },
    })
  })

  taxonomy.sections.forEach((section) => {
    const pillar = taxonomy.pillars.get(section.pillarId)
    if (pillar) {
      docs.push({
        id: `section:${section.id}`,
        kind: "section",
        url: `/topics/${pillar.slug}/${section.slug}`,
        title: section.title,
        summary: section.description,
        content_plain: section.description,
        pillar: {
          slug: pillar.slug,
          title: pillar.title,
        },
        section: {
          slug: section.slug,
          title: section.title,
        },
      })
    }
  })

  taxonomy.clusters.forEach((cluster) => {
    const section = taxonomy.sections.get(cluster.sectionId)
    const pillar = section ? taxonomy.pillars.get(section.pillarId) : undefined
    if (pillar && section) {
      docs.push({
        id: `cluster:${cluster.id}`,
        kind: "cluster",
        url: `/topics/${pillar.slug}/${section.slug}/${cluster.slug}`,
        title: cluster.title,
        summary: cluster.description,
        content_plain: cluster.description,
        pillar: {
          slug: pillar.slug,
          title: pillar.title,
        },
        section: {
          slug: section.slug,
          title: section.title,
        },
        cluster: {
          slug: cluster.slug,
          title: cluster.title,
        },
      })
    }
  })

  return docs
}

// Simple BM25-like scoring
export function scoreDocument(doc: SearchDoc, query: string): number {
  const queryTokens = normalizeText(query).split(" ")
  let score = 0

  // Title match (highest weight)
  const titleNorm = normalizeText(doc.title)
  queryTokens.forEach((token) => {
    if (titleNorm.includes(token)) {
      score += 10
    }
  })

  // Exact title match bonus
  if (titleNorm === normalizeText(query)) {
    score += 50
  }

  // Summary match (medium weight)
  const summaryNorm = normalizeText(doc.summary)
  queryTokens.forEach((token) => {
    if (summaryNorm.includes(token)) {
      score += 5
    }
  })

  // Content match (lower weight)
  const contentNorm = normalizeText(doc.content_plain)
  queryTokens.forEach((token) => {
    if (contentNorm.includes(token)) {
      score += 1
    }
  })

  // Keyword match bonus
  if (doc.keywords) {
    const keywordsNorm = doc.keywords.map((k) => normalizeText(k))
    queryTokens.forEach((token) => {
      keywordsNorm.forEach((keyword) => {
        if (keyword.includes(token)) {
          score += 3
        }
      })
    })
  }

  // Entity boost (pillar/section/cluster match)
  if (doc.pillar && normalizeText(doc.pillar.title).includes(normalizeText(query))) {
    score += 8
  }
  if (doc.section && normalizeText(doc.section.title).includes(normalizeText(query))) {
    score += 8
  }
  if (doc.cluster && normalizeText(doc.cluster.title).includes(normalizeText(query))) {
    score += 8
  }

  // Freshness boost (newer content gets slight boost)
  if (doc.updatedAt) {
    const daysSinceUpdate = (Date.now() - new Date(doc.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpdate < 30) {
      score += 2
    } else if (daysSinceUpdate < 90) {
      score += 1
    }
  }

  // Popularity boost
  if (doc.popularityScore) {
    score += doc.popularityScore * 0.5
  }

  return score
}
