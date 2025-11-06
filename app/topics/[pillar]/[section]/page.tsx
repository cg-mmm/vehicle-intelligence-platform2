import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Seo } from "@/components/seo/Seo"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { getBrand } from "@/lib/siteConfig"
import { getPillar, getSection, listClusters, listArticles } from "@/lib/taxonomy"
import { getArticle } from "@/lib/storage"
import Link from "next/link"

export async function generateMetadata({
  params,
}: {
  params: { pillar: string; section: string }
}): Promise<Metadata> {
  const pillar = getPillar(params.pillar)
  const section = pillar ? getSection(pillar.id, params.section) : undefined
  if (!pillar || !section) return {}

  const brand = getBrand()

  return {
    title: `${section.title} - ${pillar.title} | ${brand.organization.name}`,
    description: section.description || `${section.title} in ${pillar.title}`,
  }
}

export default async function SectionPage({ params }: { params: { pillar: string; section: string } }) {
  const pillar = getPillar(params.pillar)
  const section = pillar ? getSection(pillar.id, params.section) : undefined

  if (!pillar || !section) {
    notFound()
  }

  const clusters = listClusters(pillar.id, section.id)
  const articles = listArticles(pillar.id, section.id)
  const brand = getBrand()

  // Load full article data for articles without clusters
  const articlesWithoutClusters = await Promise.all(
    articles.filter((a) => !a.clusterId).map(async (a) => await getArticle(a.slug)),
  )

  return (
    <>
      <Seo
        title={`${section.title} - ${pillar.title}`}
        description={section.description || `${section.title} in ${pillar.title}`}
        canonical={`${process.env.BASE_URL}/topics/${pillar.slug}/${section.slug}`}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: pillar.title, href: `/topics/${pillar.slug}` },
            { label: section.title, href: `/topics/${pillar.slug}/${section.slug}` },
          ]}
        />

        {/* Hero */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">{section.title}</h1>
          {section.description && <p className="text-lg text-muted-foreground">{section.description}</p>}
        </div>

        {/* Clusters */}
        {clusters.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Topics</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {clusters.map((cluster) => (
                <Link
                  key={cluster.id}
                  href={`/topics/${pillar.slug}/${section.slug}/${cluster.slug}`}
                  className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                >
                  <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">{cluster.title}</h3>
                  <p className="text-sm text-muted-foreground">{cluster.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Articles without clusters */}
        {articlesWithoutClusters.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Articles</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {articlesWithoutClusters.map((article) => {
                if (!article) return null
                return (
                  <Link
                    key={article.slug}
                    href={`/topics/${pillar.slug}/${section.slug}/${article.slug}`}
                    className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                  >
                    <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
