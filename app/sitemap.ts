import type { MetadataRoute } from "next"
import { listArticles } from "@/lib/storage"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL || process.env.VERCEL_URL || "https://v0-automata-2.vercel.app"
  const siteUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`

  const articles = listArticles().slice(0, 100)

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/database`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  for (const article of articles) {
    routes.push({
      url: `${siteUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  }

  return routes
}
