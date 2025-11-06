import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getArticle } from "@/lib/storage"
import { getBrand } from "@/lib/siteConfig"
import { VideoPlayer } from "./VideoPlayer"
import { VideoControls } from "@/components/video/VideoControls"
import { buildStoryboard, extractKeyMoments } from "@/lib/video/storyboard"

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: "Video Not Found" }
  }

  const brand = getBrand()
  const videoUrl = `${brand.siteUrl}/videos/${slug}.mp4`
  const posterUrl = `${brand.siteUrl}/videos/${slug}.jpg`

  return {
    title: `${article.title} - Video | ${brand.siteName}`,
    description: article.enhancements?.tldr?.content || article.description,
    robots: "index,follow",
    alternates: {
      canonical: `${brand.siteUrl}/video/${slug}`,
    },
    openGraph: {
      type: "video.other",
      title: article.title,
      description: article.enhancements?.tldr?.content || article.description,
      url: `${brand.siteUrl}/video/${slug}`,
      videos: [
        {
          url: videoUrl,
          secureUrl: videoUrl,
          type: "video/mp4",
          width: 1920,
          height: 1080,
        },
      ],
      images: [
        {
          url: posterUrl,
          width: 1920,
          height: 1080,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "player",
      title: article.title,
      description: article.enhancements?.tldr?.content || article.description,
      images: [posterUrl],
      players: {
        playerUrl: `${brand.siteUrl}/video/${slug}`,
        streamUrl: videoUrl,
        width: 1920,
        height: 1080,
      },
    },
  }
}

export default async function VideoPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ t?: string }>
}) {
  const { slug } = await params
  const { t } = await searchParams
  const article = await getArticle(slug)

  if (!article) {
    notFound()
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

  const { scenes, estimatedDurationSec } = buildStoryboard(article, brandPack)
  const moments = extractKeyMoments(scenes)

  const mp4Url = `/videos/${slug}.mp4`
  const posterUrl = `/videos/${slug}.jpg`
  const startTime = t ? Number(t) : undefined

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
            <p className="text-muted-foreground">{article.description}</p>
          </div>

          <VideoPlayer mp4Url={mp4Url} posterUrl={posterUrl} startTime={startTime} title={article.title} />

          <VideoControls articleSlug={slug} title={article.title} siteUrl={brand.siteUrl} />

          {moments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Video Chapters</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {moments.map((moment, index) => (
                  <a
                    key={index}
                    href={`/video/${slug}?t=${moment.t}`}
                    className="p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="text-sm font-mono text-muted-foreground mb-1">
                      {Math.floor(moment.t / 60)}:{String(moment.t % 60).padStart(2, "0")}
                    </div>
                    <div className="text-sm font-medium">{moment.label}</div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <a
              href={`/articles/${slug}`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Read Full Article
            </a>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              This video is automatically generated from the article content. For the complete analysis with interactive
              tools and detailed specifications,{" "}
              <a href={`/articles/${slug}`} className="text-primary hover:underline">
                read the full article
              </a>
              .
            </p>
          </div>

          <div className="p-4 rounded-lg border bg-muted space-y-2">
            <h3 className="font-semibold">Video Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Duration:</span>{" "}
                <span className="font-medium">
                  {Math.floor(estimatedDurationSec / 60)}:{String(estimatedDurationSec % 60).padStart(2, "0")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Scenes:</span>{" "}
                <span className="font-medium">{scenes.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Format:</span> <span className="font-medium">MP4 (H.264)</span>
              </div>
              <div>
                <span className="text-muted-foreground">Resolution:</span>{" "}
                <span className="font-medium">1920x1080</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
