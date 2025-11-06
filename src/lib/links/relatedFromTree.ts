interface ContentTreeNode {
  slug: string
  title: string
  pillar?: string
  cluster?: string
  keywords?: string[]
  tags?: string[]
}

interface ContentTree {
  nodes: ContentTreeNode[]
}

interface RelatedQuery {
  pillar?: string
  cluster?: string
  keywords?: string[]
  excludeSlug?: string
}

interface RelatedLink {
  title: string
  href: string
  reason?: string
}

/**
 * Load content tree from JSON file
 * Returns empty tree if fs is not available (browser environment)
 */
function loadContentTree(): ContentTree | null {
  if (typeof window !== "undefined") {
    // Browser environment - return empty tree
    return { nodes: [] }
  }

  try {
    // Only import fs in Node.js environment
    const fs = require("fs")
    const path = require("path")
    const treePath = path.join(process.cwd(), "content", "tree.json")
    const treeData = fs.readFileSync(treePath, "utf-8")
    return JSON.parse(treeData)
  } catch (error) {
    // Tree file doesn't exist yet - return empty tree
    return { nodes: [] }
  }
}

/**
 * Calculate relevance score between query and node
 */
function calculateRelevance(query: RelatedQuery, node: ContentTreeNode): number {
  let score = 0

  // Exact pillar match (highest priority)
  if (query.pillar && node.pillar === query.pillar) {
    score += 10
  }

  // Exact cluster match
  if (query.cluster && node.cluster === query.cluster) {
    score += 8
  }

  // Keyword overlap
  if (query.keywords && node.keywords) {
    const matchingKeywords = query.keywords.filter((k) => node.keywords?.includes(k))
    score += matchingKeywords.length * 2
  }

  // Tag overlap
  if (query.keywords && node.tags) {
    const matchingTags = query.keywords.filter((k) => node.tags?.includes(k))
    score += matchingTags.length
  }

  return score
}

/**
 * Get related links from content tree based on query
 */
export function relatedFromTree(query: RelatedQuery, maxLinks = 3): RelatedLink[] {
  const tree = loadContentTree()

  if (!tree || tree.nodes.length === 0) {
    return []
  }

  // Filter out the current page
  const candidates = tree.nodes.filter((node) => node.slug !== query.excludeSlug)

  // Calculate relevance scores
  const scored = candidates
    .map((node) => ({
      node,
      score: calculateRelevance(query, node),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxLinks)

  // Convert to RelatedLink format
  return scored.map((item) => {
    let reason = ""

    if (query.pillar && item.node.pillar === query.pillar) {
      reason = `Part of ${query.pillar} series`
    } else if (query.cluster && item.node.cluster === query.cluster) {
      reason = `Related to ${query.cluster}`
    } else if (query.keywords && item.node.keywords) {
      const matches = query.keywords.filter((k) => item.node.keywords?.includes(k))
      if (matches.length > 0) {
        reason = `Related topics: ${matches.slice(0, 2).join(", ")}`
      }
    }

    return {
      title: item.node.title,
      href: `/articles/${item.node.slug}`,
      reason: reason || undefined,
    }
  })
}
