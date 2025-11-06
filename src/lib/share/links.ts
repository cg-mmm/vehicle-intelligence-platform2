export interface ShareLinks {
  twitter: string
  facebook: string
  linkedin: string
  reddit: string
  pinterest?: string
  email: string
  copy: string
  webshareData: {
    title: string
    text: string
    url: string
  }
}

export function buildShareLinks(opts: {
  canonical: string
  title: string
  summary?: string
  image?: string
  utm?: Record<string, string>
}): ShareLinks {
  const { canonical, title, summary, image, utm } = opts

  // Build URL with UTM parameters
  const url = new URL(canonical, process.env.NEXT_PUBLIC_BASE_URL || "https://example.com")
  url.searchParams.set("utm_source", utm?.utm_source || "share")
  url.searchParams.set("utm_medium", utm?.utm_medium || "social")
  url.searchParams.set("utm_campaign", utm?.utm_campaign || "onsite")

  const shareUrl = url.toString()
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedSummary = encodeURIComponent(summary || title)

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    pinterest: image
      ? `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(image)}&description=${encodedSummary}`
      : undefined,
    email: `mailto:?subject=${encodedTitle}&body=${encodedSummary}%0A%0A${encodedUrl}`,
    copy: shareUrl,
    webshareData: {
      title,
      text: summary || title,
      url: shareUrl,
    },
  }
}
