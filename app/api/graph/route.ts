import { NextResponse } from "next/server"
import { buildGraphFromSitemapAndTaxonomy } from "@/lib/graph"

export async function GET() {
  try {
    const graph = await buildGraphFromSitemapAndTaxonomy()
    return NextResponse.json(graph)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to build graph" }, { status: 500 })
  }
}
