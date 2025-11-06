export function getCanonicalUrl(url: string): string {
  const urlObj = new URL(url)

  const trackingParams = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
    "msclkid",
    "ref",
    "source",
  ]

  trackingParams.forEach((param) => {
    urlObj.searchParams.delete(param)
  })

  return urlObj.toString()
}

/**
 * Get base URL from environment
 */
export function getBaseUrl(): string {
  const baseUrl = process.env.BASE_URL || process.env.VERCEL_URL || "https://v0-automata-2.vercel.app"
  return baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`
}
