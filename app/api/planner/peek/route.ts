import { NextResponse } from "next/server"
import { buildGraphFromSitemapAndTaxonomy } from "@/lib/graph"
import { readDirection } from "@/lib/direction"
import { planNext } from "@/lib/planner"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const n = Number(url.searchParams.get("n") || "10")

    const [graph, direction] = await Promise.all([buildGraphFromSitemapAndTaxonomy(), readDirection()])

    const result = await planNext(graph, direction, Math.max(1, Math.min(n, 20)))

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate planner picks" }, { status: 500 })
  }
}
