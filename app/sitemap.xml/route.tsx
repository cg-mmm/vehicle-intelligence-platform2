import { listArticles } from "@/lib/storage"
import { getTaxonomy } from "@/lib/taxonomy"
import { getBaseUrl } from "@/lib/canonicalUrl"

const MAX_URLS_PER_SITEMAP = 50000
const MAX_SIZE_MB = 45

export async function GET(request: Request) {
  const baseUrl = getBaseUrl()
  const url = new URL(request.url)
  const page = Number.parseInt(url.searchParams.get("page") || "1", 10)

  const articles = listArticles()
  const taxonomy = getTaxonomy()

  const urls: Array<{ loc: string; lastmod?: string; priority: number }> = []

  urls.push({
    loc: baseUrl,
    lastmod: new Date().toISOString(),
    priority: 1.0,
  })

  urls.push({
    loc: `${baseUrl}/search`,
    priority: 0.5,
  })

  urls.push({
    loc: `${baseUrl}/authors/john-smith`,
    lastmod: new Date().toISOString(),
    priority: 0.7,
  })

  urls.push({
    loc: `${baseUrl}/editorial-policy`,
    lastmod: new Date().toISOString(),
    priority: 0.6,
  })

  urls.push({
    loc: `${baseUrl}/review-process`,
    lastmod: new Date().toISOString(),
    priority: 0.6,
  })

  taxonomy.pillars.forEach((pillar) => {
    urls.push({
      loc: `${baseUrl}/topics/${pillar.slug}`,
      lastmod: new Date().toISOString(),
      priority: 0.9,
    })

    pillar.sections.forEach((section) => {
      urls.push({
        loc: `${baseUrl}/topics/${pillar.slug}/${section.slug}`,
        lastmod: new Date().toISOString(),
        priority: 0.8,
      })

      section.clusters.forEach((cluster) => {
        urls.push({
          loc: `${baseUrl}/topics/${pillar.slug}/${section.slug}/${cluster.slug}`,
          lastmod: new Date().toISOString(),
          priority: 0.7,
        })
      })
    })
  })

  articles.forEach((article) => {
    const pillarSlug = article.pillar.slug
    const sectionSlug = article.cluster.slug
    const clusterSlug = article.cluster.slug

    urls.push({
      loc: `${baseUrl}/topics/${pillarSlug}/${sectionSlug}/${clusterSlug}/${article.slug}`,
      lastmod: article.updatedAt || article.publishedAt || new Date().toISOString(),
      priority: 0.8,
    })

    if (article.enhancements?.tldr) {
      urls.push({
        loc: `${baseUrl}/video/${article.slug}`,
        lastmod: article.updatedAt || article.publishedAt || new Date().toISOString(),
        priority: 0.7,
      })
    }
  })

  const startIndex = (page - 1) * MAX_URLS_PER_SITEMAP
  const endIndex = startIndex + MAX_URLS_PER_SITEMAP
  const paginatedUrls = urls.slice(startIndex, endIndex)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paginatedUrls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
