import { z } from "zod"

export const PlannerPick = z.object({
  slug: z.string(),
  pillar: z.string(),
  section: z.string(),
  cluster: z.string(),
  reason: z.string(),
  link_targets: z.object({
    parent: z.string().optional(),
    siblings: z.array(z.string()).default([]),
    crosslinks: z.array(z.string()).default([]),
  }),
})

export const PlannerResponse = z.object({
  publish_count: z.number(),
  picks: z.array(PlannerPick),
})

export type PlannerPick = z.infer<typeof PlannerPick>
export type PlannerResponse = z.infer<typeof PlannerResponse>
