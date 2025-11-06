import { listArticles } from "@/lib/storage"
import brandPack from "@/tenants/brand.pack.json"

export async function GET() {
  const baseUrl = process.env.BASE_URL || process.env.VERCEL_URL || "https://v0-automata-2.vercel.app"
  const siteUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`

  const articles = listArticles()
    .filter((article) => article.enhancements?.tldr)
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 50)

  const items = articles
    .map(
      (article) => `
    <item>
      <title>${escapeXml(article.title)} - Video</title>
      <link>${siteUrl}/video/${article.slug}</link>
      <guid>${siteUrl}/video/${article.slug}</guid>
      <description>${escapeXml(article.enhancements?.tldr?.content || article.description)}</description>
      ${article.publishedAt ? `<pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>` : ""}
      <enclosure url="${siteUrl}/videos/${article.slug}.mp4" type="video/mp4" />
    </item>`,
    )
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(brandPack.siteName)} - Videos</title>
    <link>${siteUrl}</link>
    <description>Video content from ${escapeXml(brandPack.siteName)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/video-feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

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
