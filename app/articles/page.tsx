import { Seo } from "@/components/seo/Seo"
import { buildMetaTags } from "@/lib/seo/meta"
import { buildCollectionPageSchema, buildBreadcrumbSchema } from "@/lib/seo/jsonld"
import brandPack from "@/tenants/brand.pack.json"
import type { Metadata } from "next"
import ArticlesPageClient from "./articlesClient"

export const metadata: Metadata = buildMetaTags(
  {
    title: "Published Articles",
    description: "Browse all live vehicle intelligence pages with comparisons, specs, and interactive tools",
    canonical: "/articles",
  },
  brandPack,
)

export default async function ArticlesPage() {
  const res = await fetch(`${brandPack.siteUrl}/api/articles`, { cache: "no-store" })
  const data = await res.json()
  const articles = Array.isArray(data) ? data : data.articles || []

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Articles", url: "/articles" },
    ],
    brandPack,
  )

  const collectionSchema = buildCollectionPageSchema(
    "Published Articles",
    "Browse all live vehicle intelligence pages",
    "/articles",
    articles.map((a: any) => ({ name: a.title, url: `/articles/${a.slug}` })),
    brandPack,
  )

  return (
    <>
      <Seo metadata={metadata} jsonLd={[breadcrumbSchema, collectionSchema]} />
      <ArticlesPageClient articles={articles} />
    </>
  )
}
