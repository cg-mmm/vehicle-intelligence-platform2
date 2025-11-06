import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Offer {
  id: string
  title: string
  image: string
  body: string
  cta: string
  url: string
  start: string
  end: string
  tags: string[]
}

async function getActiveOffers(): Promise<Offer[]> {
  try {
    const response = await fetch(`${process.env.BASE_URL || "http://localhost:3000"}/tenants/offers.pack.json`, {
      cache: "no-store",
    })
    const data = await response.json()
    const now = new Date()

    return data.offers.filter((offer: Offer) => {
      const start = new Date(offer.start)
      const end = new Date(offer.end)
      return now >= start && now <= end
    })
  } catch {
    return []
  }
}

export async function OffersRail() {
  const offers = await getActiveOffers()

  if (offers.length === 0) {
    return null
  }

  return (
    <section className="py-12 relative z-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Current Offers</h2>
          <p className="text-muted-foreground">Special deals and incentives available now</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-muted">
                <img src={offer.image || "/placeholder.svg"} alt={offer.title} className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <div className="flex gap-2 mb-2">
                  {offer.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle>{offer.title}</CardTitle>
                <CardDescription>{offer.body}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={offer.url}>{offer.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
