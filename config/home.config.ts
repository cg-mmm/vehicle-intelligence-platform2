export interface HomeSection {
  id: string
  enabled: boolean
  order: number
}

export const homeSections: Record<string, HomeSection> = {
  hero: { id: "hero", enabled: true, order: 1 },
  trending: { id: "trending", enabled: true, order: 2 },
  latestArticles: { id: "latestArticles", enabled: true, order: 3 },
  featuredCollections: { id: "featuredCollections", enabled: true, order: 4 },
  videosRail: { id: "videosRail", enabled: true, order: 5 },
  kpiGrid: { id: "kpiGrid", enabled: true, order: 6 },
  toolsPromo: { id: "toolsPromo", enabled: true, order: 7 },
  emailCapture: { id: "emailCapture", enabled: true, order: 8 },
}

export function getEnabledSections(): HomeSection[] {
  return Object.values(homeSections)
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order)
}
