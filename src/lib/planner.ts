import "server-only"
import type { Graph } from "./contracts/graph"
import type { Direction } from "./contracts/direction"
import type { PlannerResponse, PlannerPick } from "./contracts/planner"

export async function planNext(graph: Graph, direction: Direction, n: number): Promise<PlannerResponse> {
  const picks: PlannerPick[] = []

  // Score clusters by priority * (target - current)
  const clusterScores: Array<{
    clusterId: string
    score: number
    current: number
    target: number
  }> = []

  for (const cluster of direction.clusters) {
    const current = graph.counts.byCluster[cluster.id] || 0
    const gap = Math.max(0, cluster.target_quota - current)
    const score = cluster.priority * gap

    if (gap > 0 && score > 0) {
      clusterScores.push({
        clusterId: cluster.id,
        score,
        current,
        target: cluster.target_quota,
      })
    }
  }

  // Sort by score descending
  clusterScores.sort((a, b) => b.score - a.score)

  // Generate picks for top clusters
  for (let i = 0; i < Math.min(n, clusterScores.length); i++) {
    const cluster = clusterScores[i]

    // Find cluster node in graph
    const clusterNode = graph.nodes.find((node) => node.slug === cluster.clusterId && node.type === "cluster")
    if (!clusterNode) continue

    // Find section and pillar
    const sectionNode = graph.nodes.find((node) => node.slug === clusterNode.parent && node.type === "section")
    const pillarNode = sectionNode
      ? graph.nodes.find((node) => node.slug === sectionNode.parent && node.type === "pillar")
      : undefined

    if (!sectionNode || !pillarNode) continue

    // Find existing articles in this cluster for sibling links
    const clusterArticles = graph.nodes.filter((node) => node.type === "article" && node.parent === cluster.clusterId)

    // Generate slug suggestion
    const articleCount = cluster.current + 1
    const slug = `${cluster.clusterId}-comparison-${articleCount}`

    // Build link targets
    const siblings = clusterArticles.slice(0, direction.interlink_policy.max_internal - 1).map((a) => a.slug)

    const crosslinks: string[] = []
    if (direction.interlink_policy.prefer_siblings) {
      // Find articles in related clusters
      const relatedClusters = direction.clusters
        .filter((c) => c.id !== cluster.clusterId && c.priority > 0.5)
        .slice(0, 2)

      for (const relatedCluster of relatedClusters) {
        const relatedArticles = graph.nodes.filter(
          (node) => node.type === "article" && node.parent === relatedCluster.id,
        )
        if (relatedArticles.length > 0) {
          crosslinks.push(relatedArticles[0].slug)
        }
      }
    }

    picks.push({
      slug,
      pillar: pillarNode.slug,
      section: sectionNode.slug,
      cluster: cluster.clusterId,
      reason: `High-priority cluster (score: ${cluster.score.toFixed(1)}) with ${cluster.current}/${cluster.target} articles. Gap of ${cluster.target - cluster.current} articles remaining.`,
      link_targets: {
        parent: direction.interlink_policy.include_parent ? clusterNode.slug : undefined,
        siblings,
        crosslinks,
      },
    })
  }

  return {
    publish_count: n,
    picks,
  }
}
