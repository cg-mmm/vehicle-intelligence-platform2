export type AnalyticsEvent =
  | { type: "share_click"; network: string; path: string }
  | { type: "share_copy"; path: string }
  | { type: "webshare_success"; path: string }
  | { type: "webshare_fail"; path: string; error: string }
  | { type: "home_chart_view"; chart_id: string }
  | { type: "home_chart_interact"; chart_id: string; action: string }
  | { type: "home_trending_click"; article_url: string }
  | { type: "home_topic_explore"; pillar: string; section: string }
  | { type: "home_video_play"; video_url: string }

export function trackEvent(event: AnalyticsEvent): void {
  // Log to console for now (replace with your analytics provider)
  console.log("[Analytics]", event)

  // Send to analytics endpoint
  if (typeof window !== "undefined") {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    }).catch(() => {
      // Silently fail
    })
  }
}
