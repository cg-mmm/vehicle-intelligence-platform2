import { type NextRequest, NextResponse } from "next/server"
import { searchStore } from "@/lib/search/store"
import type { SearchQuery } from "@/lib/search/contracts"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const query: SearchQuery = {
    q: searchParams.get("q") || "",
    filters: {
      kind: searchParams.get("kind")?.split(",") as any,
      pillar: searchParams.get("pillar") || undefined,
      section: searchParams.get("section") || undefined,
      cluster: searchParams.get("cluster") || undefined,
    },
    sort: (searchParams.get("sort") as any) || "relevance",
    page: Number.parseInt(searchParams.get("page") || "1"),
    limit: Number.parseInt(searchParams.get("limit") || "20"),
  }

  const response = searchStore.search(query)

  return NextResponse.json(response)
}
