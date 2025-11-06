"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SearchFiltersProps {
  currentFilters: {
    pillar?: string
    section?: string
    cluster?: string
    type?: string
    sort?: string
  }
}

export function SearchFilters({ currentFilters }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    const query = params.get("q")
    router.push(query ? `/search?q=${query}` : "/search")
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      {/* Content Type Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Content Type</Label>
        <RadioGroup value={currentFilters.type || "all"} onValueChange={(value) => updateFilter("type", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="type-all" />
            <Label htmlFor="type-all" className="font-normal cursor-pointer">
              All Types
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="article" id="type-article" />
            <Label htmlFor="type-article" className="font-normal cursor-pointer">
              Articles
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="type-video" />
            <Label htmlFor="type-video" className="font-normal cursor-pointer">
              Videos
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="faq" id="type-faq" />
            <Label htmlFor="type-faq" className="font-normal cursor-pointer">
              FAQs
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Sort Order */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Sort By</Label>
        <RadioGroup value={currentFilters.sort || "relevance"} onValueChange={(value) => updateFilter("sort", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="relevance" id="sort-relevance" />
            <Label htmlFor="sort-relevance" className="font-normal cursor-pointer">
              Relevance
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newest" id="sort-newest" />
            <Label htmlFor="sort-newest" className="font-normal cursor-pointer">
              Newest First
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oldest" id="sort-oldest" />
            <Label htmlFor="sort-oldest" className="font-normal cursor-pointer">
              Oldest First
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
