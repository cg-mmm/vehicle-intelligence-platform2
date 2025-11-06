import { NextResponse } from "next/server"
import { getArticle } from "@/lib/storage"
import { getBrand } from "@/lib/siteConfig"
import { buildStoryboard } from "@/lib/video/storyboard"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const article = await getArticle(params.slug)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const brand = getBrand()

    const brandPack = {
      siteName: brand.siteName,
      siteUrl: brand.siteUrl,
      colors: {
        primary: brand.colors?.primary || "#0ea5e9",
        accent: brand.colors?.secondary || "#22c55e",
        background: "#000000",
        text: "#ffffff",
      },
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
      organization: {
        name: brand.siteName,
        url: brand.siteUrl,
        logo: "/logo.png",
      },
    }

    const { estimatedDurationSec } = buildStoryboard(article, brandPack)

    // In production, this would return the actual video file
    // For now, return metadata about where the video would be
    const videoUrl = `/videos/${params.slug}.mp4`

    return NextResponse.json({
      success: true,
      videoUrl,
      downloadUrl: videoUrl,
      filename: `${params.slug}.mp4`,
      durationSec: estimatedDurationSec,
      message: "Video download ready",
    })
  } catch (error) {
    console.error("[video-download] Error:", error)
    return NextResponse.json({ error: "Failed to prepare video download" }, { status: 500 })
  }
}
