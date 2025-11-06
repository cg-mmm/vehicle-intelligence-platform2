import "server-only"
import { z } from "zod"
import defaultBrandPack from "@/tenants/brand.pack.json"

export const BrandPackSchema = z.object({
  siteName: z.string(),
  siteUrl: z.string().url(),
  description: z.string(),
  logo: z.string(),
  organization: z.object({
    name: z.string(),
    url: z.string().url(),
    logo: z.string(),
  }),
  author: z.object({
    name: z.string(),
    url: z.string().url(),
  }),
  social: z
    .object({
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      linkedin: z.string().optional(),
      instagram: z.string().optional(),
    })
    .optional(),
  defaultOgImage: z.string(),
  videoPalette: z.object({
    bg: z.string(),
    primary: z.string(),
    accent: z.string(),
    text: z.string(),
  }),
  videoTypeface: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  colors: z
    .object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      accent: z.string().optional(),
    })
    .optional(),
  fonts: z
    .object({
      heading: z.string().optional(),
      body: z.string().optional(),
    })
    .optional(),
})

export type BrandPack = z.infer<typeof BrandPackSchema>

const brandCache = new Map<string, BrandPack>()

export function loadBrand(brandFile: string): BrandPack {
  // Check cache first
  if (brandCache.has(brandFile)) {
    return brandCache.get(brandFile)!
  }

  try {
    // In production, you could use dynamic imports or API routes for multiple tenants
    if (brandFile === "tenants/brand.pack.json") {
      const validated = BrandPackSchema.parse(defaultBrandPack)
      brandCache.set(brandFile, validated)
      return validated
    }

    // Fallback for unknown brand files
    throw new Error(`Brand file ${brandFile} not found`)
  } catch (error) {
    console.error(`[v0] Failed to load brand pack from ${brandFile}:`, error)
    // Return default brand pack as fallback
    const fallback: BrandPack = {
      siteName: "Vehicle Intelligence Platform",
      siteUrl: "https://v0-automata-2.vercel.app",
      description: "AI-powered vehicle comparison and overview pages",
      logo: "/logo.png",
      organization: {
        name: "Vehicle Intelligence Platform",
        url: "https://v0-automata-2.vercel.app",
        logo: "/logo.png",
      },
      author: {
        name: "Vehicle Intelligence Team",
        url: "https://v0-automata-2.vercel.app/about",
      },
      defaultOgImage: "/og-default.png",
      videoPalette: {
        bg: "#000000",
        primary: "#0ea5e9",
        accent: "#22c55e",
        text: "#ffffff",
      },
      videoTypeface: {
        heading: "Inter",
        body: "Inter",
      },
    }
    brandCache.set(brandFile, fallback)
    return fallback
  }
}
