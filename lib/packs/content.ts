import "server-only"
import { z } from "zod"
import defaultContentPack from "@/content/packs/default.content.json"

const LinkSchema = z.object({
  label: z.string(),
  href: z.string(),
})

const FooterColumnSchema = z.object({
  title: z.string(),
  links: z.array(LinkSchema),
})

export const ContentPackSchema = z.object({
  packId: z.string(),
  packName: z.string(),
  version: z.string(),
  features: z.object({
    articles: z.boolean(),
    database: z.boolean(),
    videos: z.boolean(),
    newsletter: z.boolean(),
    comments: z.boolean(),
  }),
  navigation: z.object({
    primary: z.array(LinkSchema),
    secondary: z.array(LinkSchema),
  }),
  footer: z.object({
    columns: z.array(FooterColumnSchema),
    copyright: z.string(),
  }),
  homepage: z.object({
    hero: z.object({
      title: z.string(),
      subtitle: z.string(),
      cta: z.object({
        primary: LinkSchema,
        secondary: LinkSchema,
      }),
    }),
    trending: z.object({
      title: z.string(),
      pillars: z.array(
        z.object({
          title: z.string(),
          slug: z.string(),
          count: z.number(),
        }),
      ),
    }),
    latestArticles: z.array(
      z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string(),
        image: z.string(),
        category: z.string(),
        publishedAt: z.string(),
      }),
    ),
    featuredCollections: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        articleCount: z.number(),
        image: z.string(),
        href: z.string(),
      }),
    ),
    videos: z.array(
      z.object({
        title: z.string(),
        slug: z.string(),
        thumbnail: z.string(),
        duration: z.number(),
        views: z.string(),
      }),
    ),
    kpis: z.object({
      postsToday: z.number(),
      avgPublishTime: z.string(),
      queueLength: z.number(),
      buildStatus: z.string(),
    }),
    tools: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        href: z.string(),
      }),
    ),
    newsletter: z.object({
      title: z.string(),
      description: z.string(),
      placeholder: z.string(),
      buttonText: z.string(),
    }),
  }),
})

export type ContentPack = z.infer<typeof ContentPackSchema>

const contentCache = new Map<string, ContentPack>()

export function loadContentPack(contentFile: string): ContentPack {
  // Check cache first
  if (contentCache.has(contentFile)) {
    return contentCache.get(contentFile)!
  }

  try {
    // In production, you could use dynamic imports or API routes for multiple tenants
    if (contentFile === "content/packs/default.content.json") {
      const validated = ContentPackSchema.parse(defaultContentPack)
      contentCache.set(contentFile, validated)
      return validated
    }

    // Fallback for unknown content files
    throw new Error(`Content file ${contentFile} not found`)
  } catch (error) {
    console.error(`[v0] Failed to load content pack from ${contentFile}:`, error)
    // Return default content pack as fallback
    const fallback: ContentPack = {
      packId: "default",
      packName: "Default Content Pack",
      version: "1.0.0",
      features: {
        articles: true,
        database: true,
        videos: true,
        newsletter: false,
        comments: false,
      },
      navigation: {
        primary: [
          { label: "Home", href: "/" },
          { label: "Articles", href: "/articles" },
          { label: "Database", href: "/database" },
        ],
        secondary: [
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
      },
      footer: {
        columns: [
          {
            title: "Product",
            links: [
              { label: "Features", href: "/features" },
              { label: "Pricing", href: "/pricing" },
            ],
          },
        ],
        copyright: "© 2025 All rights reserved.",
      },
      homepage: {
        hero: {
          title: "Welcome",
          subtitle: "Discover amazing content",
          cta: {
            primary: { label: "Get Started", href: "/articles" },
            secondary: { label: "Learn More", href: "/about" },
          },
        },
        trending: {
          title: "Trending Now",
          pillars: [],
        },
        latestArticles: [],
        featuredCollections: [],
        videos: [],
        kpis: {
          postsToday: 0,
          avgPublishTime: "00:00",
          queueLength: 0,
          buildStatus: "idle",
        },
        tools: [],
        newsletter: {
          title: "Subscribe to Our Newsletter",
          description: "Stay updated with the latest news and insights.",
          placeholder: "Enter your email address",
          buttonText: "Subscribe",
        },
      },
    }
    contentCache.set(contentFile, fallback)
    return fallback
  }
}
