import type {
  ArticleDoc,
  ComparisonTableBlock,
  SpecGridBlock,
  ProsConsBlock,
  GalleryBlock,
  FAQBlock,
  ReviewsModule,
  LsiLongformBlock,
} from "../contracts"

interface BrandPack {
  siteName: string
  siteUrl: string
  colors: {
    primary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  organization: {
    name: string
    url: string
    logo: string
  }
}

export interface Scene {
  type:
    | "title"
    | "tldr"
    | "stats_rail"
    | "comparison_snap"
    | "pros_cons"
    | "gallery_ken_burns"
    | "faq_flash"
    | "reviews_carousel"
    | "content_highlight"
    | "outro_branded"
    | "cta"
    | "hero_flash"
    | "quick_tldr"
    | "highlight_stat"
    | "cta_outro"
  durationSec: number
  data: any
}

export interface VideoConfig {
  minDuration: number
  maxDuration: number
  targetFPS: number
  aspectRatio: "16:9" | "9:16" | "1:1"
}

const DEFAULT_CONFIG: VideoConfig = {
  minDuration: 30,
  maxDuration: 120,
  targetFPS: 30,
  aspectRatio: "16:9",
}

/**
 * Calculate content weight to determine video duration bucket
 * Returns a score from 0-10+ based on content richness
 */
function calculateContentWeight(article: ArticleDoc): number {
  let weight = 0

  // TLDR presence (1 point)
  if (article.enhancements?.tldr) weight += 1

  // Key takeaways (1-2 points based on count)
  const takeaways = article.enhancements?.keyTakeaways?.items || []
  if (takeaways.length > 0) weight += Math.min(2, takeaways.length / 3)

  // Comparison tables/spec grids (2 points each, max 4)
  const tables = article.blocks.filter((b) => b.type === "comparisonTable" || b.type === "specGrid")
  weight += Math.min(4, tables.length * 2)

  // Gallery images (1 point if present)
  const gallery = article.blocks.find((b) => b.type === "gallery")
  if (gallery && "images" in gallery && gallery.images.length > 0) weight += 1

  // FAQs (1-2 points based on count)
  const faqs = article.blocks.filter((b) => b.type === "faq")
  if (faqs.length > 0) {
    const totalFAQs = faqs.reduce((sum, faq) => sum + (faq.type === "faq" ? faq.items.length : 0), 0)
    weight += Math.min(2, totalFAQs / 3)
  }

  // Pros/Cons (1 point)
  if (article.blocks.some((b) => b.type === "prosCons")) weight += 1

  if (article.enhancements?.reviews) {
    const reviewCount = article.enhancements.reviews.entries.length
    weight += Math.min(2, reviewCount / 2)
  }

  if (article.blocks.some((b) => b.type === "lsi_longform")) weight += 1

  return weight
}

/**
 * Map content weight to target duration bucket
 */
function getDurationBucket(weight: number): { min: number; max: number } {
  if (weight <= 4) return { min: 35, max: 50 } // Light
  if (weight <= 7) return { min: 50, max: 75 } // Medium
  return { min: 75, max: 110 } // Heavy
}

/**
 * Build adaptive storyboard from article content
 * Implements content-aware scene selection and duration scaling
 */
export function buildStoryboard(
  article: ArticleDoc,
  brand: BrandPack,
  config: Partial<VideoConfig> = {},
): { scenes: Scene[]; estimatedDurationSec: number; contentWeight: number } {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  const scenes: Scene[] = []

  // Calculate content weight for adaptive pacing
  const contentWeight = calculateContentWeight(article)
  const durationBucket = getDurationBucket(contentWeight)

  // 1. Title Card (always, 3-5s)
  scenes.push({
    type: "title",
    durationSec: 4,
    data: {
      title: article.title,
      subtitle: article.hero.subtitle,
      badges: article.hero.badges || [],
      heroImage: article.hero.image,
    },
  })

  // 2. TLDR (6-12s based on content length)
  const tldrContent = article.enhancements?.tldr?.content || article.description || ""
  if (tldrContent) {
    const wordCount = tldrContent.split(/\s+/).length
    const duration = Math.min(12, Math.max(6, wordCount / 15)) // ~15 words per second reading speed
    scenes.push({
      type: "tldr",
      durationSec: duration,
      data: {
        content: tldrContent.slice(0, 250), // Max 250 chars for readability
        points: article.enhancements?.keyTakeaways?.items?.slice(0, 3) || [],
      },
    })
  }

  // 3. Stats Rail (4-8s) - Extract key stats from comparison table or spec grid
  const comparisonBlock = article.blocks.find((b) => b.type === "comparisonTable") as ComparisonTableBlock | undefined
  const specBlock = article.blocks.find((b) => b.type === "specGrid") as SpecGridBlock | undefined

  const stats: Array<{ label: string; value: string; unit?: string; iconKey?: string }> = []

  if (comparisonBlock && comparisonBlock.rows.length > 0) {
    // Extract top 4 most interesting stats (those with numeric values and variation)
    const interestingRows = comparisonBlock.rows
      .filter((row) => {
        const values = Object.values(row).slice(1) // Skip metric name
        return values.some((v) => /\d/.test(String(v))) // Has numbers
      })
      .slice(0, 4)

    interestingRows.forEach((row) => {
      const metric = row[comparisonBlock.columns[0]]
      const value = row[comparisonBlock.columns[1]]
      if (metric && value) {
        stats.push({
          label: String(metric),
          value: String(value),
          iconKey: inferIconKey(String(metric)),
        })
      }
    })
  } else if (specBlock && specBlock.groups.length > 0) {
    // Extract first 4 specs
    specBlock.groups[0].items.slice(0, 4).forEach((item) => {
      stats.push({
        label: item.label,
        value: item.value,
        iconKey: inferIconKey(item.label),
      })
    })
  }

  if (stats.length > 0) {
    const duration = Math.min(8, Math.max(4, stats.length * 1.5))
    scenes.push({
      type: "stats_rail",
      durationSec: duration,
      data: { stats },
    })
  }

  // 4. Comparison Snap (4-7s) - Condensed table view
  if (comparisonBlock && comparisonBlock.rows.length > 0) {
    const topRows = comparisonBlock.rows.slice(0, 5) // Show max 5 rows
    scenes.push({
      type: "comparison_snap",
      durationSec: 6,
      data: {
        columns: comparisonBlock.columns.slice(0, 4), // Max 4 columns
        rows: topRows,
        highlightRule: comparisonBlock.highlightRule,
      },
    })
  }

  const lsiBlocks = article.blocks.filter((b) => b.type === "lsi_longform") as LsiLongformBlock[]
  if (lsiBlocks.length > 0) {
    // Extract semantic clusters from all LSI blocks
    const allClusters = lsiBlocks.flatMap((block) => block.semantic_clusters || [])

    if (allClusters.length > 0) {
      // Group clusters by topic and show top 4
      const topClusters = allClusters.slice(0, 4)
      const duration = Math.min(10, Math.max(6, topClusters.length * 2))

      scenes.push({
        type: "content_highlight",
        durationSec: duration,
        data: {
          heading: "Deep Dive Analysis",
          clusters: topClusters.map((cluster) => ({
            topic: cluster.topic,
            terms: cluster.related_terms.slice(0, 5),
          })),
        },
      })
    }

    // Extract key insights from LSI content markdown
    lsiBlocks.forEach((block, index) => {
      if (index < 2) {
        // Show max 2 LSI content highlights
        // Extract first paragraph or key sentence
        const firstParagraph = block.content_markdown.split("\n\n")[0]
        const sentences = firstParagraph.split(/[.!?]+/).filter((s) => s.trim().length > 20)

        if (sentences.length > 0) {
          scenes.push({
            type: "content_highlight",
            durationSec: 7,
            data: {
              heading: block.heading || "Key Insight",
              clusters: [
                {
                  topic: sentences[0].trim(),
                  terms: block.keywords_used?.slice(0, 4) || [],
                },
              ],
            },
          })
        }
      }
    })
  }

  // 5. Pros/Cons (4-7s)
  const prosConsBlock = article.blocks.find((b) => b.type === "prosCons") as ProsConsBlock | undefined
  if (prosConsBlock) {
    const totalItems = prosConsBlock.pros.length + prosConsBlock.cons.length
    const duration = Math.min(7, Math.max(4, totalItems * 0.8))
    scenes.push({
      type: "pros_cons",
      durationSec: duration,
      data: {
        pros: prosConsBlock.pros.slice(0, 4),
        cons: prosConsBlock.cons.slice(0, 4),
      },
    })
  }

  const reviewsModule = article.enhancements?.reviews as ReviewsModule | undefined
  if (reviewsModule && reviewsModule.entries.length > 0) {
    const topReviews = reviewsModule.entries.slice(0, 3)
    const duration = Math.min(10, Math.max(6, topReviews.length * 2.5))
    scenes.push({
      type: "reviews_carousel",
      durationSec: duration,
      data: {
        reviews: topReviews.map((review) => ({
          author: review.author || "Expert Review",
          rating: review.rating || 0,
          summary: review.summary.slice(0, 150), // Truncate for video
          pros: review.pros?.slice(0, 2) || [],
          cons: review.cons?.slice(0, 2) || [],
        })),
        sources: reviewsModule.sources || [],
      },
    })
  }

  // 6. Gallery Ken Burns (6-10s)
  const galleryBlock = article.blocks.find((b) => b.type === "gallery") as GalleryBlock | undefined
  const heroImage = article.hero.image

  if (galleryBlock && galleryBlock.images.length > 0) {
    const images = galleryBlock.images.filter((img) => img.url && !img.url.includes("placeholder")).slice(0, 6) // Max 6 images

    if (images.length > 0) {
      const duration = Math.min(10, Math.max(6, images.length * 1.5))
      scenes.push({
        type: "gallery_ken_burns",
        durationSec: duration,
        data: {
          images: images.map((img) => ({
            src: img.url,
            alt: img.alt || article.title,
          })),
        },
      })
    }
  } else if (heroImage && !heroImage.url.includes("placeholder")) {
    scenes.push({
      type: "gallery_ken_burns",
      durationSec: 6,
      data: {
        images: [
          {
            src: heroImage.url,
            alt: heroImage.alt || article.title,
          },
        ],
      },
    })
  }

  // 7. FAQ Flash (4-7s) - Top 2-3 FAQs
  const faqBlock = article.blocks.find((b) => b.type === "faq") as FAQBlock | undefined
  if (faqBlock && faqBlock.items.length > 0) {
    const topFAQs = faqBlock.items.slice(0, 3)
    const duration = Math.min(7, Math.max(4, topFAQs.length * 2))
    scenes.push({
      type: "faq_flash",
      durationSec: duration,
      data: {
        faqs: topFAQs.map((faq) => ({
          question: faq.q,
          answer: faq.a.slice(0, 120), // Short answer for video
        })),
      },
    })
  }

  scenes.push({
    type: "outro_branded",
    durationSec: 5,
    data: {
      title: article.title,
      siteName: brand.siteName,
      siteUrl: brand.siteUrl,
      logo: brand.organization.logo,
      cta: {
        label: article.hero.cta?.label || "Read Full Article",
        url: article.hero.cta?.href || `/${article.slug}`,
      },
    },
  })

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.durationSec, 0)

  // This ensures videos end immediately after last scene with no blank periods

  return {
    scenes,
    estimatedDurationSec: Math.round(totalDuration), // Exact duration, no min/max clamping
    contentWeight,
  }
}

/**
 * Build short-form "Auto-Reel" storyboard (9:16, 20-45s)
 * Prioritizes TLDR + Stats + CTA for social platforms
 */
export function buildReelStoryboard(
  article: ArticleDoc,
  brand: BrandPack,
): { scenes: Scene[]; estimatedDurationSec: number } {
  const scenes: Scene[] = []

  // 1. Hero Flash (3s) - Fast zoom + logo pop
  scenes.push({
    type: "hero_flash",
    durationSec: 3,
    data: {
      title: article.title,
      subtitle: article.hero.subtitle,
      heroImage: article.hero.image?.url,
    },
  })

  // 2. Quick TLDR (8s) - 3 main bullets with snappy type
  const tldrContent = article.enhancements?.tldr?.content || article.description || ""
  const tldrPoints = article.enhancements?.keyTakeaways?.items?.slice(0, 3) || []

  if (tldrContent || tldrPoints.length > 0) {
    scenes.push({
      type: "quick_tldr",
      durationSec: 8,
      data: {
        content: tldrContent.slice(0, 150), // Shorter for reel
        points: tldrPoints,
      },
    })
  }

  // 3. Highlight Stats (6s) - 2-3 key metrics with count-up
  const stats: Array<{ label: string; value: string; iconKey?: string }> = []

  const comparisonBlock = article.blocks.find((b) => b.type === "comparisonTable") as ComparisonTableBlock | undefined
  const specBlock = article.blocks.find((b) => b.type === "specGrid") as SpecGridBlock | undefined

  if (comparisonBlock && comparisonBlock.rows.length > 0) {
    const topRows = comparisonBlock.rows
      .filter((row) => {
        const values = Object.values(row).slice(1)
        return values.some((v) => /\d/.test(String(v)))
      })
      .slice(0, 3)

    topRows.forEach((row) => {
      const metric = row[comparisonBlock.columns[0]]
      const value = row[comparisonBlock.columns[1]]
      if (metric && value) {
        stats.push({
          label: String(metric),
          value: String(value),
          iconKey: inferIconKey(String(metric)),
        })
      }
    })
  } else if (specBlock && specBlock.groups.length > 0) {
    specBlock.groups[0].items.slice(0, 3).forEach((item) => {
      stats.push({
        label: item.label,
        value: item.value,
        iconKey: inferIconKey(item.label),
      })
    })
  }

  if (stats.length > 0) {
    scenes.push({
      type: "highlight_stat",
      durationSec: 6,
      data: { stats },
    })
  }

  // 4. CTA Outro (3s) - Brand URL + fade
  scenes.push({
    type: "cta_outro",
    durationSec: 3,
    data: {
      label: "Learn More",
      url: `/${article.slug}`,
    },
  })

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.durationSec, 0)

  return {
    scenes,
    estimatedDurationSec: Math.min(45, Math.max(20, totalDuration)),
  }
}

/**
 * Infer icon key from metric/label text
 */
function inferIconKey(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes("power") || lower.includes("hp") || lower.includes("torque")) return "zap"
  if (lower.includes("mpg") || lower.includes("fuel") || lower.includes("economy")) return "fuel"
  if (lower.includes("price") || lower.includes("cost") || lower.includes("$")) return "dollar-sign"
  if (lower.includes("safety") || lower.includes("rating") || lower.includes("star")) return "shield"
  if (lower.includes("speed") || lower.includes("0-60") || lower.includes("acceleration")) return "gauge"
  if (lower.includes("cargo") || lower.includes("space") || lower.includes("volume")) return "box"
  if (lower.includes("seat") || lower.includes("passenger")) return "users"
  if (lower.includes("range") || lower.includes("battery")) return "battery"
  return "check-circle"
}

export function paletteFromBrand(brand: BrandPack) {
  return {
    primary: brand.colors.primary,
    accent: brand.colors.accent,
    bg: brand.colors.background,
    text: brand.colors.text,
  }
}

export interface VideoMoment {
  t: number // seconds from start
  label: string
}

export function extractKeyMoments(scenes: Scene[]): VideoMoment[] {
  const moments: VideoMoment[] = []
  let currentTime = 0

  scenes.forEach((scene) => {
    // Add moment for each major scene type
    switch (scene.type) {
      case "title":
        moments.push({ t: currentTime, label: "Introduction" })
        break
      case "tldr":
        moments.push({ t: currentTime, label: "Key Takeaways" })
        break
      case "stats_rail":
        moments.push({ t: currentTime, label: "Key Statistics" })
        break
      case "comparison_snap":
        moments.push({ t: currentTime, label: "Comparison" })
        break
      case "pros_cons":
        moments.push({ t: currentTime, label: "Pros & Cons" })
        break
      case "reviews_carousel":
        moments.push({ t: currentTime, label: "Expert Reviews" })
        break
      case "content_highlight":
        moments.push({ t: currentTime, label: scene.data.heading || "Deep Dive" })
        break
      case "faq_flash":
        moments.push({ t: currentTime, label: "FAQ" })
        break
      case "outro_branded":
        moments.push({ t: currentTime, label: "Summary" })
        break
    }

    currentTime += scene.durationSec
  })

  return moments
}
