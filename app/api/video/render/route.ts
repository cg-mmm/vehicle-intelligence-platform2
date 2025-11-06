import { NextResponse } from "next/server"
import { getArticle } from "@/lib/storage"
import { getBrand } from "@/lib/siteConfig"
import { buildStoryboard, extractKeyMoments } from "@/lib/video/storyboard"
import { getCobaltVoltTokens, themeToBrandPack } from "@/lib/video/themeSync"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { articleSlug, aspect = "landscape", format = "mp4" } = body

    if (!articleSlug) {
      return NextResponse.json({ error: "Article slug is required" }, { status: 400 })
    }

    const article = await getArticle(articleSlug)
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const brand = getBrand()
    const theme = getCobaltVoltTokens()
    const brandPack = themeToBrandPack(theme, brand)

    const { scenes, estimatedDurationSec, contentWeight } = buildStoryboard(article, brandPack, {
      aspectRatio: aspect,
    })

    const moments = extractKeyMoments(scenes)

    const videoMetadata = {
      articleSlug,
      title: article.title,
      durationSec: estimatedDurationSec,
      contentWeight,
      aspect,
      format,
      theme: {
        name: "Cobalt Volt",
        colors: theme.colors,
        gradients: theme.gradients,
      },
      scenes: scenes.map((s) => ({
        type: s.type,
        duration: s.durationSec,
      })),
      moments,
      renderUrl: `/video/${articleSlug}`,
      downloadUrl: `/api/video/download/${articleSlug}`,
      embedUrl: `/video/embed/${articleSlug}`,
    }

    console.log(`[video-render] Generated metadata for ${articleSlug} with Cobalt Volt theme`)

    return NextResponse.json(videoMetadata)
  } catch (error) {
    console.error("[video-render] Error:", error)
    return NextResponse.json({ error: "Failed to render video" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const articleSlug = searchParams.get("slug")

  if (!articleSlug) {
    return NextResponse.json({ error: "Article slug is required" }, { status: 400 })
  }

  try {
    const article = await getArticle(articleSlug)
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const brand = getBrand()
    const theme = getCobaltVoltTokens()
    const brandPack = themeToBrandPack(theme, brand)

    const { scenes, estimatedDurationSec } = buildStoryboard(article, brandPack)
    const moments = extractKeyMoments(scenes)

    return NextResponse.json({
      articleSlug,
      title: article.title,
      durationSec: estimatedDurationSec,
      moments,
      scenes: scenes.length,
      theme: "Cobalt Volt",
    })
  } catch (error) {
    console.error("[video-render] Error:", error)
    return NextResponse.json({ error: "Failed to get video metadata" }, { status: 500 })
  }
}
