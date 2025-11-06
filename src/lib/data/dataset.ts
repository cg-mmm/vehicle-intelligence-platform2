import { readFileSync, readdirSync } from "fs"
import { join } from "path"

export interface BabyName {
  slug: string
  name: string
  meaning: string
  origin: string
  gender: string
  tags: string[]
  popularity_rank: number
  variants?: string[]
  famous_bearers?: string[]
}

export interface DatasetConfig {
  title: string
  dataset: string
  facets: Array<{
    key: string
    label: string
    type: "multi" | "range"
    min?: number
    max?: number
  }>
  columns: Array<{
    key: string
    label: string
    sortable?: boolean
  }>
  detailRoute: string
  ads: string[]
  offersTags: string[]
}

export interface FacetFilters {
  gender?: string[]
  origin?: string[]
  tags?: string[]
  popularity_rank?: [number, number]
}

export interface DatasetResult {
  items: BabyName[]
  total: number
  facetOptions: {
    gender: string[]
    origin: string[]
    tags: string[]
  }
}

// Load all baby name data from JSON shards
function loadDataset(): BabyName[] {
  if (typeof window !== "undefined") {
    // Browser environment - return empty array
    // In production, this would be called server-side only
    return []
  }

  try {
    const dataDir = join(process.cwd(), "public", "datasets", "baby-names")

    const files = readdirSync(dataDir).filter((f: string) => f.endsWith(".json"))
    const allData: BabyName[] = []

    for (const file of files) {
      const filePath = join(dataDir, file)
      const content = readFileSync(filePath, "utf-8")
      const data = JSON.parse(content)
      allData.push(...data)
    }

    return allData
  } catch (error) {
    return []
  }
}

// Get unique facet options from dataset
function getFacetOptions(data: BabyName[]) {
  const genders = new Set<string>()
  const origins = new Set<string>()
  const tags = new Set<string>()

  for (const item of data) {
    if (item.gender) genders.add(item.gender)
    if (item.origin) origins.add(item.origin)
    if (item.tags) {
      for (const tag of item.tags) {
        tags.add(tag)
      }
    }
  }

  return {
    gender: Array.from(genders).sort(),
    origin: Array.from(origins).sort(),
    tags: Array.from(tags).sort(),
  }
}

// Filter dataset by facets
function filterData(data: BabyName[], filters: FacetFilters): BabyName[] {
  return data.filter((item) => {
    // Gender filter
    if (filters.gender && filters.gender.length > 0) {
      if (!filters.gender.includes(item.gender)) return false
    }

    // Origin filter
    if (filters.origin && filters.origin.length > 0) {
      if (!filters.origin.includes(item.origin)) return false
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some((tag) => item.tags?.includes(tag))
      if (!hasTag) return false
    }

    // Popularity rank filter
    if (filters.popularity_rank) {
      const [min, max] = filters.popularity_rank
      if (item.popularity_rank < min || item.popularity_rank > max) return false
    }

    return true
  })
}

// Sort dataset
function sortData(data: BabyName[], sortBy: string, sortOrder: "asc" | "desc"): BabyName[] {
  return [...data].sort((a, b) => {
    const aVal = a[sortBy as keyof BabyName]
    const bVal = b[sortBy as keyof BabyName]

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal
    }

    return 0
  })
}

// Main query function
export function queryDataset(
  filters: FacetFilters = {},
  sortBy = "name",
  sortOrder: "asc" | "desc" = "asc",
  page = 1,
  pageSize = 50,
): DatasetResult {
  const allData = loadDataset()
  const facetOptions = getFacetOptions(allData)

  let filtered = filterData(allData, filters)
  filtered = sortData(filtered, sortBy, sortOrder)

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const items = filtered.slice(start, end)

  return {
    items,
    total: filtered.length,
    facetOptions,
  }
}

// Get single item by slug
export function getBySlug(slug: string): BabyName | null {
  const allData = loadDataset()
  return allData.find((item) => item.slug === slug) || null
}

// Load config
export function loadDataPageConfig(): DatasetConfig {
  if (typeof window !== "undefined") {
    // Browser environment - return default config
    return {
      title: "Baby Names Database",
      dataset: "baby-names",
      facets: [],
      columns: [],
      detailRoute: "/names/[slug]",
      ads: [],
      offersTags: [],
    }
  }

  try {
    const fs = require("fs")
    const path = require("path")
    const configPath = path.join(process.cwd(), "tenants", "data.page.json")
    const content = fs.readFileSync(configPath, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    return {
      title: "Baby Names Database",
      dataset: "baby-names",
      facets: [],
      columns: [],
      detailRoute: "/names/[slug]",
      ads: [],
      offersTags: [],
    }
  }
}
