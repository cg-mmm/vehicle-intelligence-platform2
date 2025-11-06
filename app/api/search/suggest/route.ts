import { type NextRequest, NextResponse } from "next/server"
import { searchStore } from "@/lib/search/store"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get("q") || ""
  const limit = Number.parseInt(searchParams.get("limit") || "8")

  const response = searchStore.suggest(q, limit)

  return NextResponse.json(response)
}
