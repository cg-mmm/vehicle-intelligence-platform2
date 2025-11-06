import { listArticles } from "@/lib/storage"
import { buildStoryboard } from "@/lib/video/storyboard"
import brandPack from "@/tenants/brand.pack.json"
import { getBaseUrl } from "@/lib/canonicalUrl"

export async function GET() {
  const baseUrl = getBaseUrl()

  const articles = listArticles().slice(0, 100)

  const videoEntries = articles
    .filter((article) => article.enhancements?.tldr)
    .map((article) => {
      const { estimatedDurationSec } = buildStoryboard(article, brandPack as any)

      const publishDate = article.publishedAt || new Date().toISOString()
      const updateDate = article.updatedAt || publishDate

      console.info("[video-sitemap] updated", article.slug, "lastmod:", updateDate)

      return `
    <url>
      <loc>${baseUrl}/video/${article.slug}</loc>
      <lastmod>${updateDate}</lastmod>
      <video:video>
        <video:thumbnail_loc>${baseUrl}/videos/${article.slug}.jpg</video:thumbnail_loc>
        <video:title>${escapeXml(article.title)}</video:title>
        <video:description>${escapeXml(article.enhancements?.tldr?.content || article.description)}</video:description>
        <video:content_loc>${baseUrl}/videos/${article.slug}.mp4</video:content_loc>
        <video:duration>${Math.floor(estimatedDurationSec)}</video:duration>
        <video:publication_date>${publishDate}</video:publication_date>
      </video:video>
    </url>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoEntries}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}
