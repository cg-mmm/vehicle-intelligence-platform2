import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.BASE_URL || process.env.VERCEL_URL || "https://v0-automata-2.vercel.app"
  const siteUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/private/",
          "/*?*utm_source=", // Prevent indexing of UTM-tagged URLs
          "/*?*sessionid=", // Prevent indexing of session URLs
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "Claude-Web",
        disallow: "/",
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/video-sitemap.xml`, `${siteUrl}/sitemap_index.xml`],
    host: siteUrl,
  }
}
