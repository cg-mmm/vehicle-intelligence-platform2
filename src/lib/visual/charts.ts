import type { ArticleDoc, ComparisonTableBlock, SpecGridBlock } from "../contracts"

export interface BarStatData {
  name: string
  value: number
  unit?: string
  color?: string
}

export interface LineSeriesData {
  name: string
  [key: string]: number | string
}

export interface RadarMetric {
  metric: string
  value: number
  fullMark: number
}

export interface PieSlice {
  name: string
  value: number
  color?: string
}

export interface NormalizedData {
  name: string
  value: number
  normalizedValue: number // 0-100 scale
  unit?: string
  color?: string
}

export interface ScaleLegend {
  min: number
  max: number
  unit?: string
  description: string
}

export function normalizeToScale(values: number[]): { normalized: number[]; legend: ScaleLegend } {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min

  // Normalize to 0-100 scale where min = 0% and max = 100%
  const normalized = values.map((v) => {
    if (range === 0) return 50 // All values are the same
    return ((v - min) / range) * 100
  })

  return {
    normalized,
    legend: {
      min,
      max,
      description: `Relative to lowest value (${min.toLocaleString()}) = 0%, highest value (${max.toLocaleString()}) = 100%`,
    },
  }
}

export function toBarStats(article: ArticleDoc): BarStatData[] {
  const stats: BarStatData[] = []

  const comparisonBlock = article.blocks.find((b) => b.type === "comparisonTable") as ComparisonTableBlock | undefined

  console.log("[v0] toBarStats: comparisonBlock found:", !!comparisonBlock)

  if (comparisonBlock && comparisonBlock.rows.length > 0) {
    console.log("[v0] toBarStats: rows count:", comparisonBlock.rows.length)
    console.log("[v0] toBarStats: columns:", comparisonBlock.columns)

    // Find ANY numeric rows (more flexible)
    const numericRows = comparisonBlock.rows.filter((row) => {
      const values = Object.values(row).slice(1)
      const hasNumeric = values.some((v) => {
        const str = String(v)
        // Check for numbers, including those with units like "30 mpg" or "$25,000"
        return /\d+/.test(str)
      })
      return hasNumeric
    })

    console.log("[v0] toBarStats: numeric rows found:", numericRows.length)

    // Take first numeric row and create bars for each column
    if (numericRows.length > 0) {
      const row = numericRows[0]
      const metric = row[comparisonBlock.columns[0]]

      console.log("[v0] toBarStats: processing row with metric:", metric)

      comparisonBlock.columns.slice(1).forEach((col) => {
        const valueStr = String(row[col])
        // Extract first number from string (handles "$25,000", "30 mpg", etc.)
        const match = valueStr.match(/[\d,]+\.?\d*/)
        if (match) {
          const value = Number.parseFloat(match[0].replace(/,/g, ""))
          if (!isNaN(value)) {
            stats.push({
              name: col,
              value,
              unit: extractUnit(valueStr),
            })
            console.log("[v0] toBarStats: added stat:", { name: col, value, unit: extractUnit(valueStr) })
          }
        }
      })
    }
  }

  console.log("[v0] toBarStats: final stats count:", stats.length)
  return stats
}

export function toNormalizedBarStats(article: ArticleDoc): {
  data: NormalizedData[]
  legend: ScaleLegend
} {
  const rawStats = toBarStats(article)

  if (rawStats.length === 0) {
    return {
      data: [],
      legend: { min: 0, max: 0, description: "No data available" },
    }
  }

  const values = rawStats.map((s) => s.value)
  const { normalized, legend } = normalizeToScale(values)

  const data: NormalizedData[] = rawStats.map((stat, index) => ({
    ...stat,
    normalizedValue: normalized[index],
  }))

  legend.unit = rawStats[0].unit

  return { data, legend }
}

export function toComparisonLines(article: ArticleDoc): LineSeriesData[] {
  const series: LineSeriesData[] = []

  const comparisonBlock = article.blocks.find((b) => b.type === "comparisonTable") as ComparisonTableBlock | undefined

  if (comparisonBlock && comparisonBlock.rows.length > 0) {
    // Find numeric rows
    const numericRows = comparisonBlock.rows.filter((row) => {
      const values = Object.values(row).slice(1)
      return values.some((v) => !isNaN(Number.parseFloat(String(v))))
    })

    // Create series for each numeric row
    numericRows.slice(0, 5).forEach((row) => {
      const dataPoint: LineSeriesData = {
        name: String(row[comparisonBlock.columns[0]]),
      }

      comparisonBlock.columns.slice(1).forEach((col) => {
        const value = Number.parseFloat(String(row[col]))
        if (!isNaN(value)) {
          dataPoint[col] = value
        }
      })

      series.push(dataPoint)
    })
  }

  return series
}

export function toRadarSpec(article: ArticleDoc): RadarMetric[] {
  const metrics: RadarMetric[] = []

  const specBlock = article.blocks.find((b) => b.type === "specGrid") as SpecGridBlock | undefined

  if (specBlock && specBlock.groups.length > 0) {
    // Extract numeric specs
    specBlock.groups.forEach((group) => {
      group.items.forEach((item) => {
        const value = Number.parseFloat(item.value)
        if (!isNaN(value)) {
          metrics.push({
            metric: item.label,
            value,
            fullMark: 100, // Normalize to 100
          })
        }
      })
    })
  }

  return metrics.slice(0, 6) // Max 6 metrics for radar
}

export function toPieShare(article: ArticleDoc): PieSlice[] {
  const slices: PieSlice[] = []

  // Extract from comparison table (e.g., market share, powertrain split)
  const comparisonBlock = article.blocks.find((b) => b.type === "comparisonTable") as ComparisonTableBlock | undefined

  if (comparisonBlock && comparisonBlock.rows.length > 0) {
    // Look for percentage rows
    const percentageRow = comparisonBlock.rows.find((row) => {
      const values = Object.values(row).slice(1)
      return values.some((v) => String(v).includes("%"))
    })

    if (percentageRow) {
      comparisonBlock.columns.slice(1).forEach((col) => {
        const valueStr = String(percentageRow[col])
        const value = Number.parseFloat(valueStr.replace("%", ""))
        if (!isNaN(value)) {
          slices.push({
            name: col,
            value,
          })
        }
      })
    }
  }

  return slices
}

function extractUnit(value: string): string | undefined {
  const match = value.match(/[A-Za-z]+/)
  return match ? match[0] : undefined
}

export function hasChartData(article: ArticleDoc): boolean {
  const barStats = toBarStats(article)
  const lineData = toComparisonLines(article)
  const radarData = toRadarSpec(article)
  const pieData = toPieShare(article)

  return barStats.length >= 2 || lineData.length >= 2 || radarData.length >= 3 || pieData.length >= 2
}
