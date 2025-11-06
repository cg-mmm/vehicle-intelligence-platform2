import { NextResponse } from "next/server"
import { buildGraphFromSitemapAndTaxonomy } from "@/lib/graph"
import { readDirection } from "@/lib/direction"
import { planNext } from "@/lib/planner"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const n = body.n ?? 3

    const [graph, direction] = await Promise.all([buildGraphFromSitemapAndTaxonomy(), readDirection()])

    const result = await planNext(graph, direction, Math.max(1, Math.min(n, direction.publish_per_day)))

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate planner picks" }, { status: 500 })
  }
}
