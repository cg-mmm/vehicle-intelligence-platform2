import type { SearchDoc, SearchQuery, SearchResult, SearchResponse, SearchSuggestResponse } from "./contracts"
import { buildSearchIndex, scoreDocument } from "./indexer"

class SearchStore {
  private index: SearchDoc[] = []
  private lastIndexTime = 0
  private readonly INDEX_TTL = 60 * 1000 // 1 minute

  private ensureIndex() {
    const now = Date.now()
    if (now - this.lastIndexTime > this.INDEX_TTL || this.index.length === 0) {
      console.log("[v0] Rebuilding search index...")
      this.index = buildSearchIndex()
      this.lastIndexTime = now
      console.log(`[v0] Search index built with ${this.index.length} documents`)
    }
  }

  search(query: SearchQuery): SearchResponse {
    const startTime = Date.now()
    this.ensureIndex()

    if (!query.q || query.q.trim().length === 0) {
      return {
        results: [],
        total: 0,
        page: query.page || 1,
        limit: query.limit || 20,
        query,
        took_ms: Date.now() - startTime,
      }
    }

    // Score all documents
    let results: SearchResult[] = this.index
      .map((doc) => ({
        doc,
        score: scoreDocument(doc, query.q),
      }))
      .filter((result) => result.score > 0)

    // Apply filters
    if (query.filters) {
      if (query.filters.kind && query.filters.kind.length > 0) {
        results = results.filter((r) => query.filters!.kind!.includes(r.doc.kind))
      }
      if (query.filters.pillar) {
        results = results.filter((r) => r.doc.pillar?.slug === query.filters!.pillar)
      }
      if (query.filters.section) {
        results = results.filter((r) => r.doc.section?.slug === query.filters!.section)
      }
      if (query.filters.cluster) {
        results = results.filter((r) => r.doc.cluster?.slug === query.filters!.cluster)
      }
    }

    // Sort
    if (query.sort === "newest") {
      results.sort((a, b) => {
        const aDate = new Date(a.doc.updatedAt || a.doc.publishedAt || 0).getTime()
        const bDate = new Date(b.doc.updatedAt || b.doc.publishedAt || 0).getTime()
        return bDate - aDate
      })
    } else if (query.sort === "popular") {
      results.sort((a, b) => (b.doc.popularityScore || 0) - (a.doc.popularityScore || 0))
    } else {
      // Default: relevance
      results.sort((a, b) => b.score - a.score)
    }

    // Paginate
    const page = query.page || 1
    const limit = query.limit || 20
    const start = (page - 1) * limit
    const paginatedResults = results.slice(start, start + limit)

    return {
      results: paginatedResults,
      total: results.length,
      page,
      limit,
      query,
      took_ms: Date.now() - startTime,
    }
  }

  suggest(q: string, limit = 8): SearchSuggestResponse {
    const startTime = Date.now()
    this.ensureIndex()

    if (!q || q.trim().length === 0) {
      return {
        suggestions: [],
        took_ms: Date.now() - startTime,
      }
    }

    // Score and filter
    const suggestions = this.index
      .map((doc) => ({
        doc,
        score: scoreDocument(doc, q),
      }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return {
      suggestions,
      took_ms: Date.now() - startTime,
    }
  }

  reindex(): void {
    this.index = buildSearchIndex()
    this.lastIndexTime = Date.now()
  }
}

export const searchStore = new SearchStore()
