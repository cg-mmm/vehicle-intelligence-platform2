import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Seo } from "@/components/seo/Seo"
import { getBrand } from "@/lib/siteConfig"
import { getPillar, listSections } from "@/lib/taxonomy"
import Link from "next/link"

export async function generateMetadata({ params }: { params: { pillar: string } }): Promise<Metadata> {
  const pillar = getPillar(params.pillar)
  if (!pillar) return {}

  const brand = getBrand()

  return {
    title: `${pillar.title} | ${brand.organization.name}`,
    description: pillar.description,
  }
}

export default function PillarPage({ params }: { params: { pillar: string } }) {
  const pillar = getPillar(params.pillar)

  if (!pillar) {
    notFound()
  }

  const sections = listSections(pillar.id)
  const brand = getBrand()

  return (
    <>
      <Seo
        title={`${pillar.title} - ${brand.organization.name}`}
        description={pillar.description}
        canonical={`${process.env.BASE_URL}/topics/${pillar.slug}`}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">{pillar.title}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{pillar.description}</p>
        </div>

        {/* Sections Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`/topics/${pillar.slug}/${section.slug}`}
              className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">{section.title}</h2>
              {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
