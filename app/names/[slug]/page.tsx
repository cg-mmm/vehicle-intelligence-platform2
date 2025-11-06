import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBySlug } from "@/lib/data/dataset"
import { Heart, Share2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const name = getBySlug(slug)

  if (!name) {
    return {
      title: "Name Not Found",
    }
  }

  return {
    title: `${name.name} - Meaning, Origin & Popularity`,
    description: `${name.name} means "${name.meaning}". Origin: ${name.origin}. Popularity rank: #${name.popularity_rank}`,
  }
}

export default async function NameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const name = getBySlug(slug)

  if (!name) {
    notFound()
  }

  // JSON-LD for DefinedTerm
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: name.name,
    description: name.meaning,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Baby Names",
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-5xl font-bold mb-2">{name.name}</h1>
                <p className="text-xl text-muted-foreground">{name.meaning}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" aria-label="Add to favorites">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Share">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{name.gender}</Badge>
              <Badge variant="outline">{name.origin}</Badge>
              {name.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Details Card */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">Meaning</h2>
                <p className="text-lg">{name.meaning}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">Origin</h2>
                <p className="text-lg">{name.origin}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">Gender</h2>
                <p className="text-lg">{name.gender}</p>
              </div>

              {name.variants && name.variants.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-2">Variants</h2>
                  <p className="text-lg">{name.variants.join(", ")}</p>
                </div>
              )}
            </div>

            {/* Popularity Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Popularity</h2>
              </div>

              <div className="text-center py-8">
                <div className="text-6xl font-bold text-primary mb-2">#{name.popularity_rank}</div>
                <p className="text-muted-foreground">Current Rank</p>
              </div>

              {/* Placeholder for chart */}
              <div className="mt-6 h-32 bg-muted/30 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                Popularity trend chart placeholder
              </div>
            </div>
          </div>

          {/* Famous Bearers */}
          {name.famous_bearers && name.famous_bearers.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Famous People Named {name.name}</h2>
              <ul className="space-y-2">
                {name.famous_bearers.map((bearer) => (
                  <li key={bearer} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span>{bearer}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <a href="/database">← Back to Database</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
