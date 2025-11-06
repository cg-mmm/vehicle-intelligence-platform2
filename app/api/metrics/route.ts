import { NextResponse } from "next/server"

// In-memory storage for metrics (in production, use a database)
const metricsStore: Array<{
  timestamp: string
  metric: string
  value: number
  rating: string
  url: string
  budgetBreached?: boolean
}> = []

const MAX_METRICS = 1000

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, value, rating, url, budgetBreached } = body

    // Store metric
    metricsStore.push({
      timestamp: new Date().toISOString(),
      metric: name,
      value,
      rating,
      url,
      budgetBreached,
    })

    // Keep only last MAX_METRICS entries
    if (metricsStore.length > MAX_METRICS) {
      metricsStore.splice(0, metricsStore.length - MAX_METRICS)
    }

    if (budgetBreached) {
      console.warn(`[metrics] ⚠️ Budget breach - ${name}: ${value} (${rating}) - ${url}`)
    } else {
      console.log(`[metrics] ${name}: ${value} (${rating}) - ${url}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[metrics] Error storing metric:", error)
    return NextResponse.json({ success: false, error: "Failed to store metric" }, { status: 500 })
  }
}

export async function GET() {
  // Return aggregated metrics
  const metrics = {
    INP: metricsStore.filter((m) => m.metric === "INP"),
    LCP: metricsStore.filter((m) => m.metric === "LCP"),
    CLS: metricsStore.filter((m) => m.metric === "CLS"),
    FCP: metricsStore.filter((m) => m.metric === "FCP"),
    TTFB: metricsStore.filter((m) => m.metric === "TTFB"),
  }

  const calculateP75 = (values: number[]) => {
    if (values.length === 0) return 0
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil(sorted.length * 0.75) - 1
    return sorted[index]
  }

  const summary = {
    INP: {
      p75: calculateP75(metrics.INP.map((m) => m.value)),
      count: metrics.INP.length,
      target: 200,
      breaches: metrics.INP.filter((m) => m.budgetBreached).length,
    },
    LCP: {
      p75: calculateP75(metrics.LCP.map((m) => m.value)),
      count: metrics.LCP.length,
      target: 2500,
      breaches: metrics.LCP.filter((m) => m.budgetBreached).length,
    },
    CLS: {
      p75: calculateP75(metrics.CLS.map((m) => m.value)),
      count: metrics.CLS.length,
      target: 0.1,
      breaches: metrics.CLS.filter((m) => m.budgetBreached).length,
    },
  }

  const byRoute: Record<string, any> = {}
  metricsStore.forEach((m) => {
    if (!byRoute[m.url]) {
      byRoute[m.url] = { INP: [], LCP: [], CLS: [] }
    }
    if (m.metric === "INP" || m.metric === "LCP" || m.metric === "CLS") {
      byRoute[m.url][m.metric].push(m.value)
    }
  })

  const routeSummary = Object.entries(byRoute).map(([url, data]: [string, any]) => ({
    url,
    INP: calculateP75(data.INP),
    LCP: calculateP75(data.LCP),
    CLS: calculateP75(data.CLS),
  }))

  return NextResponse.json({ metrics, summary, byRoute: routeSummary })
}
