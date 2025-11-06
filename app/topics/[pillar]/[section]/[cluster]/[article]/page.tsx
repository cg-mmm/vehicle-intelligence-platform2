import { redirect } from "next/navigation"
import { getArticle } from "@/lib/storage"
import { ArticleView } from "@/components/ArticleView"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { getPillar, getSection, getCluster, getArticleMeta, getArticleUrl } from "@/lib/taxonomy"
import { getBrand } from "@/lib/siteConfig"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildPersonSchema,
  buildVideoObjectWithSeekAction,
  buildDatasetSchema,
} from "@/lib/seo/jsonld"

export const dynamic = "force-dynamic"

interface ArticlePageProps {
  params: {
    pillar: string
    section: string
    cluster: string
    article: string
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  console.log("[v0] Article page rendering with params:", params)

  const articleMeta = getArticleMeta(params.article)

  if (articleMeta) {
    // Check if the URL matches the article's taxonomy
    const correctUrl = getArticleUrl(articleMeta)
    const currentUrl = `/topics/${params.pillar}/${params.section}/${params.cluster}/${params.article}`

    if (correctUrl !== currentUrl) {
      console.log("[v0] Incorrect URL detected. Redirecting to correct URL:", correctUrl)
      redirect(correctUrl)
    }
  }

  const pillar = getPillar(params.pillar)
  if (!pillar) {
    console.log("[v0] Pillar not found:", params.pillar)
    console.log("[v0] Available pillars: sedans, suvs")
    redirect("/")
  }

  const section = getSection(pillar.id, params.section)
  if (!section) {
    console.log("[v0] Section not found:", params.section)
    console.log("[v0] Available sections for", pillar.title, ": comparisons, deep-dives, guides")

    if (articleMeta) {
      const correctUrl = getArticleUrl(articleMeta)
      console.log("[v0] Redirecting to correct URL:", correctUrl)
      redirect(correctUrl)
    }

    redirect(`/topics/${pillar.slug}`)
  }

  const cluster = getCluster(params.cluster)
  if (!cluster || cluster.sectionId !== section.id) {
    console.log("[v0] Cluster not found or doesn't belong to section:", params.cluster)

    if (articleMeta) {
      const correctUrl = getArticleUrl(articleMeta)
      console.log("[v0] Redirecting to correct URL:", correctUrl)
      redirect(correctUrl)
    }

    redirect(`/topics/${pillar.slug}/${section.slug}`)
  }

  const article = await getArticle(params.article)

  if (!article) {
    console.log("[v0] Article not found:", params.article)
    redirect(`/topics/${pillar.slug}/${section.slug}/${cluster.slug}`)
  }

  console.log("[v0] Article found:", article.slug)

  const brand = getBrand()

  // Build breadcrumb path
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: pillar.title, href: `/topics/${pillar.slug}` },
    { label: section.title, href: `/topics/${pillar.slug}/${section.slug}` },
    { label: cluster.title, href: `/topics/${pillar.slug}/${section.slug}/${cluster.slug}` },
    { label: article.title, href: "" },
  ]

  const schemas = [
    buildOrganizationSchema(brand, {
      sameAs: ["https://twitter.com/autointel", "https://linkedin.com/company/autointel"],
    }),
    buildBreadcrumbSchema(
      breadcrumbs.map((b) => ({ name: b.label, url: b.href })),
      brand,
    ),
    buildArticleSchema(article, brand),
  ]

  // Add Person schema for author
  if (article.author) {
    schemas.push(
      buildPersonSchema({
        name: article.author.name,
        url: article.author.url || `${brand.siteUrl}/authors/${article.author.slug}`,
        jobTitle: article.author.jobTitle,
        image: article.author.image,
        description: article.author.bio,
        sameAs: article.author.sameAs,
        worksFor: {
          name: brand.organization.name,
          url: brand.organization.url,
        },
      }),
    )
  }

  // Add Person schema for reviewer
  if (article.reviewer) {
    schemas.push(
      buildPersonSchema({
        name: article.reviewer.name,
        url: article.reviewer.url || `${brand.siteUrl}/authors/${article.reviewer.slug}`,
        jobTitle: article.reviewer.jobTitle,
        image: article.reviewer.image,
        description: article.reviewer.bio,
        sameAs: article.reviewer.sameAs,
        worksFor: {
          name: brand.organization.name,
          url: brand.organization.url,
        },
      }),
    )
  }

  const comparisonBlock = article.blocks.find((block) => block.type === "comparisonTable")
  if (comparisonBlock && comparisonBlock.type === "comparisonTable") {
    schemas.push(
      buildDatasetSchema(
        `${article.title} - Comparison Data`,
        `Structured comparison data for ${article.title}`,
        `/topics/${params.pillar}/${params.section}/${params.cluster}/${params.article}`,
        comparisonBlock.rows.length,
        brand,
        article.slug,
      ),
    )
  }

  // Add VideoObject schema if video exists
  const videoMoments = [
    { t: 0, label: "Introduction" },
    { t: 15, label: "Key Features" },
    { t: 30, label: "Comparison" },
    { t: 45, label: "Conclusion" },
  ]
  schemas.push(
    buildVideoObjectWithSeekAction(article, brand, videoMoments, {
      durationSec: 60,
    }),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <div className="min-h-screen">
        <Breadcrumbs items={breadcrumbs} />
        <ArticleView article={article} />
      </div>
    </>
  )
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await getArticle(params.article)

  if (!article) {
    return {
      title: "Article Not Found",
      robots: "noindex,nofollow",
    }
  }

  const brand = getBrand()
  const ogImageUrl = `${brand.siteUrl}/api/og/article/${params.article}`

  return {
    title: article.title,
    description: article.hero.subtitle,
    openGraph: {
      title: article.title,
      description: article.hero.subtitle,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: article.author ? [article.author.name] : undefined,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.hero.subtitle,
      images: [ogImageUrl],
    },
  }
}
