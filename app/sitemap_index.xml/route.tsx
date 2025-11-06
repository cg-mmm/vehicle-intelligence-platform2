import { getBaseUrl } from "@/lib/canonicalUrl"

export async function GET() {
  const baseUrl = getBaseUrl()

  const sitemaps = [
    { loc: `${baseUrl}/sitemap.xml`, lastmod: new Date().toISOString() },
    { loc: `${baseUrl}/video-sitemap.xml`, lastmod: new Date().toISOString() },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (sitemap) => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
