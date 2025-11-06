export type SearchDocKind = "article" | "video" | "faq" | "glossary" | "dataset" | "pillar" | "section" | "cluster"

export interface SearchDoc {
  id: string // stable unique identifier
  kind: SearchDocKind
  url: string // canonical URL
  title: string
  subtitle?: string
  summary: string // TL;DR or first paragraph
  content_plain: string // stripped markdown (chunked for indexing)
  keywords?: string[]
  semantic_clusters?: Array<{
    topic: string
    related_terms: string[]
  }>
  pillar?: {
    slug: string
    title: string
  }
  section?: {
    slug: string
    title: string
  }
  cluster?: {
    slug: string
    title: string
  }
  video?: {
    duration: number
    captions?: string
    key_scenes?: string[]
  }
  stats?: Array<{
    label: string
    value: string
    unit?: string
  }>
  images?: string[] // top assets for rich results
  publishedAt?: string
  updatedAt?: string
  popularityScore?: number // views/CTR for ranking boost
}

export interface SearchQuery {
  q: string // search query
  filters?: {
    kind?: SearchDocKind[]
    pillar?: string
    section?: string
    cluster?: string
    year?: number
  }
  sort?: "relevance" | "newest" | "popular"
  page?: number
  limit?: number
}

export interface SearchResult {
  doc: SearchDoc
  score: number
  highlights?: {
    title?: string
    summary?: string
    content?: string
  }
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  page: number
  limit: number
  query: SearchQuery
  took_ms: number
}

export interface SearchSuggestion {
  doc: SearchDoc
  score: number
  highlight?: string
}

export interface SearchSuggestResponse {
  suggestions: SearchSuggestion[]
  took_ms: number
}
