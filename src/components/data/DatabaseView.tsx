"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FixedSizeList as List } from "react-window"
import { Search, SlidersHorizontal, ArrowUpDown, ExternalLink } from "lucide-react"
import type { DatasetConfig, DatasetResult, FacetFilters } from "@/lib/data/dataset"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DatabaseViewProps {
  config: DatasetConfig
  initialData: DatasetResult
  initialFilters: FacetFilters
  initialSort: { by: string; order: "asc" | "desc" }
  initialPage: number
  relatedLinksMap?: Record<string, Array<{ title: string; href: string }>>
}

export function DatabaseView({
  config,
  initialData,
  initialFilters,
  initialSort,
  initialPage,
  relatedLinksMap = {},
}: DatabaseViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Update URL with new filters
  const updateFilters = (newFilters: Partial<FacetFilters>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Update gender
    if (newFilters.gender !== undefined) {
      params.delete("gender")
      newFilters.gender.forEach((g) => params.append("gender", g))
    }

    // Update origin
    if (newFilters.origin !== undefined) {
      params.delete("origin")
      newFilters.origin.forEach((o) => params.append("origin", o))
    }

    // Update tags
    if (newFilters.tags !== undefined) {
      params.delete("tags")
      newFilters.tags.forEach((t) => params.append("tags", t))
    }

    // Update popularity range
    if (newFilters.popularity_rank !== undefined) {
      params.set("popularity_min", String(newFilters.popularity_rank[0]))
      params.set("popularity_max", String(newFilters.popularity_rank[1]))
    }

    router.push(`/database?${params.toString()}`)
  }

  // Update sort
  const updateSort = (by: string, order: "asc" | "desc") => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", by)
    params.set("sortOrder", order)
    router.push(`/database?${params.toString()}`)
  }

  // Filter data by search query
  const filteredData = searchQuery
    ? initialData.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : initialData.items

  // Row renderer for virtualized list
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = filteredData[index]
    const relatedLinks = relatedLinksMap[item.slug] || []

    return (
      <div
        style={style}
        className="flex items-center gap-4 px-6 py-4 border-b border-border/50 hover:bg-muted/50 transition-colors"
      >
        <a
          href={`/names/${item.slug}`}
          className="flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          tabIndex={0}
        >
          <div className="font-semibold text-lg">{item.name}</div>
          <div className="text-sm text-muted-foreground truncate">{item.meaning}</div>
        </a>
        <div className="text-sm text-muted-foreground">{item.origin}</div>
        <div className="text-sm font-medium">#{item.popularity_rank}</div>

        {relatedLinks.length > 0 && (
          <div className="flex flex-col gap-1 min-w-[200px]">
            <div className="text-xs text-muted-foreground mb-1">Related Guides</div>
            {relatedLinks.slice(0, 2).map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-xs text-primary hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
                tabIndex={0}
              >
                <ExternalLink className="w-3 h-3" />
                <span className="truncate">{link.title}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8">
      {/* Facets Sidebar */}
      <aside className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} aria-label="Toggle filters">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-6">
            {/* Gender Facet */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Gender</Label>
              <div className="space-y-2">
                {initialData.facetOptions.gender.map((gender) => (
                  <div key={gender} className="flex items-center space-x-2">
                    <Checkbox
                      id={`gender-${gender}`}
                      checked={initialFilters.gender?.includes(gender)}
                      onCheckedChange={(checked) => {
                        const current = initialFilters.gender || []
                        const updated = checked ? [...current, gender] : current.filter((g) => g !== gender)
                        updateFilters({ ...initialFilters, gender: updated })
                      }}
                    />
                    <label htmlFor={`gender-${gender}`} className="text-sm cursor-pointer">
                      {gender}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Origin Facet */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Origin</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {initialData.facetOptions.origin.map((origin) => (
                  <div key={origin} className="flex items-center space-x-2">
                    <Checkbox
                      id={`origin-${origin}`}
                      checked={initialFilters.origin?.includes(origin)}
                      onCheckedChange={(checked) => {
                        const current = initialFilters.origin || []
                        const updated = checked ? [...current, origin] : current.filter((o) => o !== origin)
                        updateFilters({ ...initialFilters, origin: updated })
                      }}
                    />
                    <label htmlFor={`origin-${origin}`} className="text-sm cursor-pointer">
                      {origin}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Facet */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Tags</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {initialData.facetOptions.tags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={initialFilters.tags?.includes(tag)}
                      onCheckedChange={(checked) => {
                        const current = initialFilters.tags || []
                        const updated = checked ? [...current, tag] : current.filter((t) => t !== tag)
                        updateFilters({ ...initialFilters, tags: updated })
                      }}
                    />
                    <label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Popularity Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Popularity Rank: {initialFilters.popularity_rank?.[0] || 1} -{" "}
                {initialFilters.popularity_rank?.[1] || 1000}
              </Label>
              <Slider
                min={1}
                max={1000}
                step={10}
                value={initialFilters.popularity_rank || [1, 1000]}
                onValueChange={(value) => {
                  updateFilters({
                    ...initialFilters,
                    popularity_rank: value as [number, number],
                  })
                }}
                className="w-full"
              />
            </div>
          </div>
        )}
      </aside>

      {/* Results */}
      <main className="space-y-6">
        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search names"
            />
          </div>

          <div className="flex gap-2">
            <Select value={initialSort.by} onValueChange={(value) => updateSort(value, initialSort.order)}>
              <SelectTrigger className="w-[180px]" aria-label="Sort by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.columns
                  .filter((col) => col.sortable)
                  .map((col) => (
                    <SelectItem key={col.key} value={col.key}>
                      {col.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => updateSort(initialSort.by, initialSort.order === "asc" ? "desc" : "asc")}
              aria-label={`Sort ${initialSort.order === "asc" ? "descending" : "ascending"}`}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {initialData.total} names
        </div>

        {/* Virtualized List */}
        <div
          className="border border-border rounded-lg overflow-hidden bg-card"
          role="table"
          aria-label="Baby names database"
        >
          <List height={600} itemCount={filteredData.length} itemSize={80} width="100%">
            {Row}
          </List>
        </div>
      </main>
    </div>
  )
}
