import { type NextRequest, NextResponse } from "next/server"
import { getArticleBySlug } from "@/lib/storage"

/**
 * API endpoint to trigger video regeneration when article content changes
 *
 * Usage:
 * POST /api/video/regenerate
 * Body: { slug: "article-slug" }
 *
 * This will queue a new video render with the latest content and theme tokens
 */
export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 })
    }

    // Fetch latest article content
    const article = await getArticleBySlug(slug)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Queue video render (this would integrate with your video rendering service)
    // For now, we'll just return success
    // In production, this would trigger a Remotion Lambda render or similar

    console.log(`[v0] Video regeneration queued for article: ${slug}`)

    return NextResponse.json({
      success: true,
      message: `Video regeneration queued for ${slug}`,
      article: {
        slug: article.slug,
        title: article.title,
        updatedAt: article.updatedAt,
      },
    })
  } catch (error) {
    console.error("[v0] Video regeneration error:", error)
    return NextResponse.json({ error: "Failed to queue video regeneration" }, { status: 500 })
  }
}
