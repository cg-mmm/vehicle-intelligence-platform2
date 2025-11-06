"use client"

import { useEffect } from "react"
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals"

const BUDGETS = {
  INP: 200, // ms
  LCP: 2500, // ms
  CLS: 0.1, // score
}

export function WebVitals() {
  useEffect(() => {
    const sendToAnalytics = (metric: Metric) => {
      let budgetBreached = false
      if (metric.name === "INP" && metric.value > BUDGETS.INP) {
        budgetBreached = true
        console.warn(`[web-vitals] ⚠️ INP budget breach: ${metric.value}ms > ${BUDGETS.INP}ms`)
      } else if (metric.name === "LCP" && metric.value > BUDGETS.LCP) {
        budgetBreached = true
        console.warn(`[web-vitals] ⚠️ LCP budget breach: ${metric.value}ms > ${BUDGETS.LCP}ms`)
      } else if (metric.name === "CLS" && metric.value > BUDGETS.CLS) {
        budgetBreached = true
        console.warn(`[web-vitals] ⚠️ CLS budget breach: ${metric.value} > ${BUDGETS.CLS}`)
      }

      // Send to our metrics API
      fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          url: window.location.pathname,
          budgetBreached, // Include budget breach flag
        }),
      }).catch((error) => {
        console.error("[web-vitals] Failed to send metric:", error)
      })

      // Log to console for debugging
      const emoji = metric.rating === "good" ? "✅" : metric.rating === "needs-improvement" ? "⚠️" : "❌"
      console.log(`[web-vitals] ${emoji} ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      })
    }

    // Register all Core Web Vitals
    onCLS(sendToAnalytics)
    onFCP(sendToAnalytics)
    onINP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  }, [])

  return null
}
