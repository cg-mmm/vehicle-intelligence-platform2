import { z } from "zod"

export const GraphNode = z.object({
  slug: z.string(),
  type: z.enum(["pillar", "section", "cluster", "article"]),
  parent: z.string().optional(),
  title: z.string().optional(),
})

export const GraphEdge = z.object({
  from: z.string(),
  to: z.string(),
  rel: z.enum(["up", "down", "sibling", "cross"]),
})

export const Graph = z.object({
  nodes: z.array(GraphNode),
  edges: z.array(GraphEdge),
  counts: z.object({
    total: z.number(),
    pillars: z.number(),
    sections: z.number(),
    clusters: z.number(),
    articles: z.number(),
    byPillar: z.record(z.string(), z.number()),
    byCluster: z.record(z.string(), z.number()),
  }),
})

export type Graph = z.infer<typeof Graph>
export type GraphNode = z.infer<typeof GraphNode>
export type GraphEdge = z.infer<typeof GraphEdge>
