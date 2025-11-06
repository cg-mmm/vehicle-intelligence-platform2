import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Seo } from "@/components/seo/Seo"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { getBrand } from "@/lib/siteConfig"
import { getPillar, getSection, getCluster, listArticles } from "@/lib/taxonomy"
import { getArticle } from "@/lib/storage"
import Link from "next/link"

export async function generateMetadata({
  params,
}: {
  params: { pillar: string; section: string; cluster: string }
}): Promise<Metadata> {
  console.log("[v0] Cluster page metadata params:", params)

  const pillar = getPillar(params.pillar)
  const section = pillar ? getSection(pillar.id, params.section) : undefined
  const cluster = getCluster(params.cluster)

  console.log("[v0] Cluster page found pillar:", pillar?.title)
  console.log("[v0] Cluster page found section:", section?.title)
  console.log("[v0] Cluster page found cluster:", cluster?.title)

  if (!pillar || !section || !cluster) return {}

  const brand = getBrand()

  return {
    title: `${cluster.title} - ${section.title} | ${brand.organization.name}`,
    description: cluster.description,
  }
}

export default async function ClusterPage({
  params,
}: {
  params: { pillar: string; section: string; cluster: string }
}) {
  console.log("[v0] Cluster page rendering with params:", params)

  const pillar = getPillar(params.pillar)
  const section = pillar ? getSection(pillar.id, params.section) : undefined
  const cluster = getCluster(params.cluster)

  console.log("[v0] Cluster page found pillar:", pillar?.title)
  console.log("[v0] Cluster page found section:", section?.title)
  console.log("[v0] Cluster page found cluster:", cluster?.title)

  if (!pillar) {
    console.log("[v0] Pillar not found:", params.pillar)
    redirect("/")
  }

  if (!section) {
    console.log("[v0] Section not found:", params.section)
    redirect(`/topics/${pillar.slug}`)
  }

  if (!cluster) {
    console.log("[v0] Cluster not found:", params.cluster)
    redirect(`/topics/${pillar.slug}/${section.slug}`)
  }

  const articleMetas = listArticles(pillar.id, section.id, cluster.id)
  console.log("[v0] Cluster page found", articleMetas.length, "articles")

  const articles = await Promise.all(articleMetas.map(async (a) => await getArticle(a.slug)))
  const brand = getBrand()

  return (
    <>
      <Seo
        title={`${cluster.title} - ${section.title}`}
        description={cluster.description}
        canonical={`${process.env.BASE_URL}/topics/${pillar.slug}/${section.slug}/${cluster.slug}`}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: pillar.title, href: `/topics/${pillar.slug}` },
            { label: section.title, href: `/topics/${pillar.slug}/${section.slug}` },
            { label: cluster.title, href: `/topics/${pillar.slug}/${section.slug}/${cluster.slug}` },
          ]}
        />

        {/* Hero */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">{cluster.title}</h1>
          <p className="text-lg text-muted-foreground">{cluster.description}</p>
        </div>

        {/* Articles */}
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => {
            if (!article) return null
            return (
              <Link
                key={article.slug}
                href={`/topics/${pillar.slug}/${section.slug}/${cluster.slug}/${article.slug}`}
                className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
              >
                <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">{article.title}</h2>
                <p className="text-sm text-muted-foreground">{article.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
