import { notFound } from "next/navigation"
import { getArticle } from "@/lib/storage"
import { getBrand } from "@/lib/siteConfig"
import { ArticleVideoPlayer } from "@/components/video/ArticleVideoPlayer"

export const dynamic = "force-dynamic"

interface VideoEmbedPageProps {
  params: {
    slug: string
  }
  searchParams: {
    t?: string
    autoplay?: string
  }
}

export default async function VideoEmbedPage({ params, searchParams }: VideoEmbedPageProps) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const brand = getBrand()
  const startTime = searchParams.t ? Number(searchParams.t) : undefined
  const autoplay = searchParams.autoplay === "1"

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="w-full h-full">
        <ArticleVideoPlayer
          article={article}
          brand={{
            siteName: brand.siteName,
            siteUrl: brand.siteUrl,
            videoPalette: {
              bg: "#000000",
              primary: brand.colors?.primary || "#0ea5e9",
              accent: brand.colors?.secondary || "#22c55e",
              text: "#ffffff",
            },
            videoTypeface: {
              heading: "Inter",
              body: "Inter",
            },
          }}
          aspect="landscape"
        />
      </div>

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
        <p className="text-white text-sm font-semibold">{brand.siteName}</p>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) {
    return {
      title: "Video Not Found",
      robots: "noindex,nofollow",
    }
  }

  return {
    title: `${article.title} - Video Embed`,
    description: article.description,
    robots: "noindex,follow", // Embeds shouldn't be indexed
  }
}
