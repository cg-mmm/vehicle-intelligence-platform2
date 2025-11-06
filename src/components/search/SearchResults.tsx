"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, FileText, Video, HelpCircle, BookOpen } from "lucide-react"
import type { SearchDoc } from "@/lib/search/contracts"

interface SearchResultsProps {
  query: string
  filters: {
    pillar?: string
    section?: string
    cluster?: string
    type?: string
    sort?: string
  }
}

export function SearchResults({ query, filters }: SearchResultsProps) {
  const [results, setResults] = useState<SearchDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const params = new URLSearchParams({ q: query })
        if (filters.pillar) params.append("pillar", filters.pillar)
        if (filters.section) params.append("section", filters.section)
        if (filters.cluster) params.append("cluster", filters.cluster)
        if (filters.type) params.append("type", filters.type)
        if (filters.sort) params.append("sort", filters.sort)

        const response = await fetch(`/api/search?${params.toString()}`)
        const data = await response.json()

        setResults(data.results || [])
        setTotalResults(data.total || 0)
      } catch (error) {
        console.error("[v0] Search error:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, filters])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-muted rounded-lg p-6 h-32" />
        ))}
      </div>
    )
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Start Your Search</h2>
        <p className="text-muted-foreground">Enter a search term to find articles, videos, and more</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
        <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Found {totalResults} result{totalResults !== 1 ? "s" : ""}
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <SearchResultCard key={result.id} result={result} query={query} />
        ))}
      </div>
    </div>
  )
}

function SearchResultCard({ result, query }: { result: SearchDoc; query: string }) {
  const icon = getIconForKind(result.kind)

  return (
    <Link
      href={result.url}
      className="block bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">{icon}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
              {highlightText(result.title, query)}
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground uppercase">
              {result.kind}
            </span>
          </div>

          {result.subtitle && (
            <p className="text-sm text-muted-foreground mb-2">{highlightText(result.subtitle, query)}</p>
          )}

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{highlightText(result.summary, query)}</p>

          {(result.pillar || result.section || result.cluster) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {result.pillar && <span>{result.pillar.title}</span>}
              {result.section && (
                <>
                  <span>›</span>
                  <span>{result.section.title}</span>
                </>
              )}
              {result.cluster && (
                <>
                  <span>›</span>
                  <span>{result.cluster.title}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

function getIconForKind(kind: string) {
  switch (kind) {
    case "article":
      return <FileText className="w-5 h-5 text-primary" />
    case "video":
      return <Video className="w-5 h-5 text-primary" />
    case "faq":
      return <HelpCircle className="w-5 h-5 text-primary" />
    case "glossary":
      return <BookOpen className="w-5 h-5 text-primary" />
    default:
      return <FileText className="w-5 h-5 text-primary" />
  }
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !text) return text

  const parts = text.split(new RegExp(`(${query})`, "gi"))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-[color:var(--warning)]/20 font-semibold text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}
