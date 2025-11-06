import { z } from "zod"

export const InterlinkPolicy = z.object({
  min_internal: z.number().int().min(1).default(3),
  max_internal: z.number().int().min(3).max(12).default(7),
  prefer_siblings: z.boolean().default(true),
  include_parent: z.boolean().default(true),
})

export const DirectionPillar = z.object({
  id: z.string(),
  priority: z.number().min(0).default(1),
  target_quota: z.number().int().min(0).default(20),
  freeze: z.boolean().default(false),
})

export const DirectionCluster = z.object({
  id: z.string(),
  priority: z.number().min(0).default(1),
  target_quota: z.number().int().min(0).default(10),
})

export const Direction = z.object({
  focus_window_days: z.number().int().min(7).max(120).default(30),
  publish_per_day: z.number().int().min(1).max(20).default(3),
  pillars: z.array(DirectionPillar),
  clusters: z.array(DirectionCluster).default([]),
  boost_entities: z.array(z.string()).default([]),
  deprioritize_patterns: z.array(z.string()).default([]),
  interlink_policy: InterlinkPolicy.default({}),
})

export type Direction = z.infer<typeof Direction>
export type InterlinkPolicy = z.infer<typeof InterlinkPolicy>
export type DirectionPillar = z.infer<typeof DirectionPillar>
export type DirectionCluster = z.infer<typeof DirectionCluster>
