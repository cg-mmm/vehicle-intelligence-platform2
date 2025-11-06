import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getArticle } from "@/lib/storage"
import { ArticleView } from "@/components/ArticleView"
import { relatedFromTree } from "@/lib/links/relatedFromTree"
import { Seo } from "@/components/seo/Seo"
import { buildArticleMetaTags } from "@/lib/seo/meta"
import { buildArticleSchema, buildBreadcrumbSchema, videoObjectFromArticle } from "@/lib/seo/jsonld"
import { AuthorBox } from "@/components/article/AuthorBox"
import { UpdatedOn } from "@/components/article/UpdatedOn"
import brandPack from "@/tenants/brand.pack.json"
import { buildStoryboard } from "@/lib/video/storyboard"

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: "Article Not Found" }
  }

  return buildArticleMetaTags(article, brandPack)
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const titleWords = article.title.toLowerCase().split(/\s+/)
  const keywords = titleWords.filter((word) => word.length > 4)

  const relatedLinks = relatedFromTree(
    {
      pillar: article.seo?.schema?.about?.[0] || undefined,
      keywords: keywords.slice(0, 5),
      excludeSlug: slug,
    },
    3,
  )

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Articles", url: "/articles" },
      { name: article.title, url: `/articles/${slug}` },
    ],
    brandPack,
  )

  const articleSchema = buildArticleSchema(article, brandPack)

  const { estimatedDurationSec } = buildStoryboard(article, brandPack as any)

  const videoSchema = videoObjectFromArticle(article, brandPack, {
    durationSec: estimatedDurationSec,
    mp4Url: `/videos/${slug}.mp4`,
    posterUrl: `/videos/${slug}.jpg`,
    embedUrl: `/video/${slug}`,
  })

  return (
    <>
      <Seo metadata={await generateMetadata({ params })} jsonLd={[breadcrumbSchema, articleSchema, videoSchema]} />
      <div className="space-y-0">
        <div className="band bg-[color:var(--primary-foreground)]">
          <div className="band-inner flex items-center justify-between gap-4 flex-wrap py-4">
            <AuthorBox author={brandPack.author} organization={brandPack.organization} />
            <UpdatedOn publishedAt={article.publishedAt} updatedAt={article.updatedAt} />
          </div>
        </div>
        <ArticleView article={article} relatedLinks={relatedLinks} />
      </div>
    </>
  )
}
