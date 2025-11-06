import "server-only"
import { getTaxonomy, listArticles } from "@/lib/taxonomy"
import type { Graph, GraphNode, GraphEdge } from "./contracts/graph"

export async function buildGraphFromSitemapAndTaxonomy(): Promise<Graph> {
  const taxonomy = getTaxonomy()
  const articles = listArticles()

  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const byPillar: Record<string, number> = {}
  const byCluster: Record<string, number> = {}

  // Add pillar nodes
  for (const pillar of taxonomy.pillars.values()) {
    nodes.push({
      slug: pillar.slug,
      type: "pillar",
      title: pillar.title,
    })
    byPillar[pillar.slug] = 0
  }

  // Add section nodes
  for (const section of taxonomy.sections.values()) {
    nodes.push({
      slug: section.slug,
      type: "section",
      parent: section.pillarId.replace("pillar-", ""),
      title: section.title,
    })

    // Add edge from section to pillar
    edges.push({
      from: section.slug,
      to: section.pillarId.replace("pillar-", ""),
      rel: "up",
    })
  }

  // Add cluster nodes
  for (const cluster of taxonomy.clusters.values()) {
    nodes.push({
      slug: cluster.slug,
      type: "cluster",
      parent: cluster.sectionId.replace("section-", ""),
      title: cluster.title,
    })
    byCluster[cluster.slug] = 0

    // Add edge from cluster to section
    edges.push({
      from: cluster.slug,
      to: cluster.sectionId.replace("section-", ""),
      rel: "up",
    })
  }

  // Add article nodes
  for (const article of articles) {
    const pillarSlug = article.pillarId?.replace("pillar-", "") || ""
    const clusterSlug = article.clusterId?.replace("cluster-", "") || ""

    nodes.push({
      slug: article.slug,
      type: "article",
      parent: clusterSlug,
      title: article.title,
    })

    // Count articles by pillar and cluster
    if (pillarSlug && byPillar[pillarSlug] !== undefined) {
      byPillar[pillarSlug]++
    }
    if (clusterSlug && byCluster[clusterSlug] !== undefined) {
      byCluster[clusterSlug]++
    }

    // Add edge from article to cluster
    if (clusterSlug) {
      edges.push({
        from: article.slug,
        to: clusterSlug,
        rel: "up",
      })
    }

    // Find sibling articles (same cluster)
    const siblings = articles.filter((a) => a.clusterId === article.clusterId && a.slug !== article.slug)
    for (const sibling of siblings.slice(0, 3)) {
      edges.push({
        from: article.slug,
        to: sibling.slug,
        rel: "sibling",
      })
    }
  }

  return {
    nodes,
    edges,
    counts: {
      total: nodes.length,
      pillars: Array.from(taxonomy.pillars.values()).length,
      sections: Array.from(taxonomy.sections.values()).length,
      clusters: Array.from(taxonomy.clusters.values()).length,
      articles: articles.length,
      byPillar,
      byCluster,
    },
  }
}
