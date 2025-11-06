import { Suspense } from "react"
import { SearchResults } from "@/components/search/SearchResults"
import { SearchFilters } from "@/components/search/SearchFilters"

export const metadata = {
  title: "Search Results",
  description: "Search our comprehensive automotive database",
  robots: {
    index: false,
    follow: true,
  },
}

interface SearchPageProps {
  searchParams: {
    q?: string
    pillar?: string
    section?: string
    cluster?: string
    type?: string
    sort?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const filters = {
    pillar: searchParams.pillar,
    section: searchParams.section,
    cluster: searchParams.cluster,
    type: searchParams.type,
    sort: searchParams.sort || "relevance",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-muted-foreground">
              Showing results for <span className="font-semibold text-foreground">&quot;{query}&quot;</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <SearchFilters currentFilters={filters} />
            </Suspense>
          </aside>

          {/* Results */}
          <main className="lg:col-span-3">
            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <SearchResults query={query} filters={filters} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
