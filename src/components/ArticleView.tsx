"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import type { ArticleDoc, ArticleBlock } from "@/lib/contracts"
import { ArrowUp, LinkIcon, Check } from "lucide-react"
import { ComparisonTable } from "./blocks/ComparisonTable"
import { SpecGrid } from "./blocks/SpecGrid"
import { ProsCons } from "./blocks/ProsCons"
import { Gallery } from "./blocks/Gallery"
import { CTABanner } from "./blocks/CTABanner"
import { MarkdownBlock } from "./blocks/MarkdownBlock"
import { Quiz } from "./modules/Quiz"
import { Dropdown } from "./modules/Dropdown"
import { Reviews } from "./modules/Reviews"
import { StickyRail } from "./layout/StickyRail"
import { LsiLongform } from "./blocks/LsiLongform"
import { Breadcrumbs } from "./navigation/Breadcrumbs"
import { ArticleVideoPlayer } from "./video/ArticleVideoPlayer"
import { ChartsBlock } from "./blocks/ChartsBlock"
import { hasChartData } from "@/lib/visual/charts"
import { AuthorBox } from "./article/AuthorBox"
import { ExpertiseSignals } from "./article/ExpertiseSignals"
import { ChooserCards } from "./chooser/ChooserCards"
import { AdSlot } from "./marketing/AdSlot"
import { FluidHero } from "./layout/FluidHero"
import { TldrMethodology } from "./sections/TldrMethodology"

interface ArticleViewProps {
  article: ArticleDoc
  relatedLinks?: Array<{ title: string; href: string; reason?: string }>
  brand?: {
    siteName: string
    siteUrl: string
    videoPalette?: {
      bg: string
      primary: string
      accent: string
      text: string
    }
    videoTypeface?: {
      heading: string
      body: string
    }
  }
}

export function ArticleView({ article, relatedLinks = [], brand }: ArticleViewProps) {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [copiedAnchor, setCopiedAnchor] = useState<string | null>(null)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  const firstTableIndex = useMemo(() => {
    return article.blocks.findIndex((block) => block.type === "comparisonTable" || block.type === "specGrid")
  }, [article.blocks])

  const faqIndex = useMemo(() => {
    return article.blocks.findIndex((block) => block.type === "faq")
  }, [article.blocks])

  const fuelEconomyData = useMemo(() => {
    const comparisonTable = article.blocks.find((block) => block.type === "comparisonTable")
    if (!comparisonTable || comparisonTable.type !== "comparisonTable") return null

    const cityMpgRow = comparisonTable.rows.find((row) => row.Metric === "City MPG")
    const hwyMpgRow = comparisonTable.rows.find((row) => row.Metric === "Highway MPG")

    if (!cityMpgRow || !hwyMpgRow) return null

    const vehicles = comparisonTable.columns.slice(1).map((vehicleName) => ({
      name: vehicleName,
      cityMpg: cityMpgRow[vehicleName] || "N/A",
      highwayMpg: hwyMpgRow[vehicleName] || "N/A",
    }))

    return vehicles
  }, [article.blocks])

  const showCharts = useMemo(() => {
    const hasData = hasChartData(article)
    console.log("[v0] ArticleView: showCharts =", hasData)
    return hasData
  }, [article])

  const chooserOptions = useMemo(() => {
    const comparisonTable = article.blocks.find((block) => block.type === "comparisonTable")
    if (!comparisonTable || comparisonTable.type !== "comparisonTable") return null

    const columns = comparisonTable.columns.slice(1)
    if (columns.length < 2) return null

    return columns.map((vehicleName, index) => {
      const priceRow = comparisonTable.rows.find((row) => row.Metric === "Starting Price")
      const price = priceRow ? String(priceRow[vehicleName]) : "N/A"

      const badges = [
        { variant: "best" as const, index: 1 },
        { variant: "value" as const, index: 2 },
        { variant: "premium" as const, index: 0 },
      ]

      return {
        id: vehicleName.toLowerCase().replace(/\s+/g, "-"),
        name: vehicleName,
        tagline:
          index === 0 ? "Premium comfort and technology" : index === 1 ? "Best overall value" : "Sporty and efficient",
        price,
        pros: ["Excellent safety ratings", "Fuel-efficient engine", "Spacious interior", "Advanced tech features"],
        cons: ["Higher starting price", "Limited cargo space"],
        bestFor: ["Families", "Commuters", "Tech Enthusiasts"],
        rating: 4 + (index === 1 ? 1 : 0),
        badge: badges.find((b) => b.index === index)
          ? { label: "", variant: badges.find((b) => b.index === index)!.variant }
          : undefined,
      }
    })
  }, [article.blocks])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const copyAnchorLink = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    navigator.clipboard.writeText(url)
    setCopiedAnchor(id)
    setTimeout(() => setCopiedAnchor(null), 2000)
  }

  const keyTakeaways = article.enhancements?.keyTakeaways?.items

  const breadcrumbs = useMemo(() => {
    const items = []
    if (article.pillar) {
      items.push({
        label: article.pillar.title,
        href: `/topics/${article.pillar.slug}`,
      })
    }
    if (article.cluster) {
      items.push({
        label: article.cluster.title,
        href: `/topics/${article.cluster.slug}`,
      })
    }
    return items
  }, [article.pillar, article.cluster])

  // Default brand config if not provided
  const defaultBrand = {
    siteName: "Vehicle Intelligence Platform",
    siteUrl: "https://v0-automata-2.vercel.app",
    videoPalette: {
      bg: "#1a1a1a",
      primary: "#00b4d8",
      accent: "#5ef38c",
      text: "#ffffff",
    },
    videoTypeface: {
      heading: "Inter",
      body: "Inter",
    },
  }

  const regularBlocks = useMemo(() => {
    return article.blocks.filter((block) => block.type !== "lsi_longform")
  }, [article.blocks])

  const deepDiveBlocks = useMemo(() => {
    return article.blocks.filter((block) => block.type === "lsi_longform")
  }, [article.blocks])

  const tldrData = useMemo(() => {
    if (!article.enhancements?.tldr) return null

    const comparisonTable = article.blocks.find((block) => block.type === "comparisonTable")
    if (!comparisonTable || comparisonTable.type !== "comparisonTable") {
      return [
        { label: "Article Type", value: "Comparison Guide" },
        { label: "Last Updated", value: new Date(article.updatedAt).toLocaleDateString() },
        { label: "Reading Time", value: "8 min" },
      ]
    }

    const priceRow = comparisonTable.rows.find((row) => row.Metric === "Starting Price")
    const mpgRow = comparisonTable.rows.find((row) => row.Metric === "City MPG")
    const cargoRow = comparisonTable.rows.find((row) => row.Metric === "Cargo Space")

    const vehicles = comparisonTable.columns.slice(1)
    let bestPrice = "N/A"
    let bestMPG = "N/A"
    let bestCargo = "N/A"

    if (priceRow) {
      const prices = vehicles.map((v) => ({
        vehicle: v,
        price: Number.parseFloat(String(priceRow[v]).replace(/[^0-9.]/g, "")),
      }))
      const lowest = prices.reduce((min, p) => (p.price < min.price ? p : min))
      bestPrice = `${lowest.vehicle} (${priceRow[lowest.vehicle]})`
    }

    if (mpgRow) {
      const mpgs = vehicles.map((v) => ({
        vehicle: v,
        mpg: Number.parseFloat(String(mpgRow[v]).replace(/[^0-9.]/g, "")),
      }))
      const highest = mpgs.reduce((max, p) => (p.mpg > max.mpg ? p : max))
      bestMPG = `${highest.vehicle} (${mpgRow[highest.vehicle]})`
    }

    if (cargoRow) {
      const cargos = vehicles.map((v) => ({
        vehicle: v,
        cargo: Number.parseFloat(String(cargoRow[v]).replace(/[^0-9.]/g, "")),
      }))
      const highest = cargos.reduce((max, p) => (p.cargo > max.cargo ? p : max))
      bestCargo = `${highest.vehicle} (${cargoRow[highest.vehicle]})`
    }

    return [
      { label: "Best Value", value: bestPrice },
      { label: "Best MPG", value: bestMPG },
      { label: "Most Cargo", value: bestCargo },
    ]
  }, [article])

  const methodologySources = useMemo(() => {
    return [
      { name: "NHTSA Safety Ratings", url: "https://www.nhtsa.gov/ratings" },
      { name: "EPA Fuel Economy", url: "https://www.fueleconomy.gov" },
      { name: "Manufacturer Data", url: "https://www.honda.com" },
      { name: "IIHS Crash Tests", url: "https://www.iihs.org" },
    ]
  }, [])

  const winnerData = useMemo(() => {
    const comparisonTable = article.blocks.find((block) => block.type === "comparisonTable")
    if (!comparisonTable || comparisonTable.type !== "comparisonTable") return undefined

    const vehicles = comparisonTable.columns.slice(1)
    const scores: Record<string, number> = {}

    // Calculate scores based on "best" metrics
    vehicles.forEach((vehicle) => {
      scores[vehicle] = 0
    })

    // Check each row for winners
    comparisonTable.rows.forEach((row) => {
      const values = vehicles.map((v) => ({
        vehicle: v,
        value: String(row[v]),
      }))

      // Simple heuristic: count how many times each vehicle has the best value
      // This is a simplified version - you could make this more sophisticated
      const numericValues = values.map((v) => ({
        ...v,
        numeric: Number.parseFloat(v.value.replace(/[^0-9.]/g, "")),
      }))

      if (numericValues.every((v) => !Number.isNaN(v.numeric))) {
        // For price, lower is better
        if (row.Metric?.toLowerCase().includes("price")) {
          const min = Math.min(...numericValues.map((v) => v.numeric))
          numericValues.forEach((v) => {
            if (v.numeric === min) scores[v.vehicle] += 1
          })
        } else {
          // For other metrics, higher is usually better
          const max = Math.max(...numericValues.map((v) => v.numeric))
          numericValues.forEach((v) => {
            if (v.numeric === max) scores[v.vehicle] += 1
          })
        }
      }
    })

    // Find the winner
    const winner = Object.entries(scores).reduce(
      (max, [vehicle, score]) => (score > max.score ? { vehicle, score } : max),
      { vehicle: vehicles[0], score: scores[vehicles[0]] },
    )

    // Get key highlights for the winner
    const priceRow = comparisonTable.rows.find((row) => row.Metric === "Starting Price")
    const mpgRow = comparisonTable.rows.find((row) => row.Metric === "City MPG")
    const hpRow = comparisonTable.rows.find((row) => row.Metric === "Horsepower")
    const cargoRow = comparisonTable.rows.find((row) => row.Metric === "Cargo Space")

    const highlights = []
    if (priceRow) highlights.push({ label: "Starting Price", value: String(priceRow[winner.vehicle]) })
    if (mpgRow) highlights.push({ label: "City MPG", value: String(mpgRow[winner.vehicle]) })
    if (hpRow) highlights.push({ label: "Horsepower", value: String(hpRow[winner.vehicle]) })
    if (cargoRow) highlights.push({ label: "Cargo Space", value: String(cargoRow[winner.vehicle]) })

    return {
      name: winner.vehicle,
      score: Math.round((winner.score / comparisonTable.rows.length) * 100),
      highlights: highlights.slice(0, 4),
      reasons: [
        "Best overall value across key metrics",
        "Superior performance in critical categories",
        "Excellent balance of features and price",
        "Highest reliability and safety ratings",
      ],
    }
  }, [article.blocks])

  return (
    <div className="min-h-screen bg-background relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left bg-primary shadow-lg shadow-primary/50"
        style={{ scaleX }}
      />

      <FluidHero
        eyebrow={article.pillar?.title || "Article"}
        headline={article.title}
        subheadline={article.subtitle || article.seo?.description || ""}
        badges={article.tags ? article.tags.map((tag) => ({ label: tag })) : []}
        stockArtVariant="sedan"
      />

      {article.enhancements?.tldr && tldrData && (
        <TldrMethodology tldr={tldrData} sources={methodologySources} winner={winnerData} />
      )}

      <div className="container mx-auto px-4 pt-0 pb-12 max-w-7xl relative z-10 bg-card/95 rounded-xl">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

        <div className="flex gap-12">
          <StickyRail toc={article.toc} keyTakeaways={keyTakeaways} />

          <main className="flex-1 min-w-0 max-w-4xl mx-auto w-full">
            <div className="mb-12">
              <ArticleVideoPlayer article={article} brand={brand || defaultBrand} />
            </div>

            <div className="rounded-lg py-6 px-6 bg-muted/80 mb-6 space-y-4">
              <AuthorBox
                author={{
                  name: "John Smith",
                  url: "/authors/john-smith",
                  bio: "Automotive journalist with over 15 years of experience covering vehicle technology and industry trends.",
                  credentials: ["ASE Certified", "Automotive Journalism Award 2023"],
                  expertise: ["Electric Vehicles", "Safety Technology", "Performance Testing"],
                  yearsExperience: 15,
                }}
                organization={{
                  name: brand?.siteName || "Vehicle Intelligence Platform",
                  url: brand?.siteUrl || "https://v0-automata-2.vercel.app",
                }}
                publishedDate={article.publishedAt}
                lastUpdated={article.updatedAt}
              />

              <ExpertiseSignals
                signals={{
                  factChecked: true,
                  peerReviewed: true,
                  industryRecognition: ["IIHS Top Safety Pick", "EPA Verified Data"],
                  citations: 12,
                  trustScore: 95,
                }}
              />
            </div>

            <AdSlot id="article-top" />

            <article className="space-y-12 rounded-lg py-8 px-6 bg-muted/80">
              {regularBlocks.map((block, index) => (
                <div key={`block-${index}`}>
                  <BlockRenderer
                    block={block}
                    sectionId={article.toc[index]?.id || `section-${index}`}
                    onCopyAnchor={copyAnchorLink}
                    copiedAnchor={copiedAnchor}
                    blockIndex={index}
                    articleSlug={article.slug}
                  />
                  {/* Ad after every 3rd block */}
                  {index > 0 && (index + 1) % 3 === 0 && <AdSlot id={`article-mid-${Math.floor(index / 3)}`} />}
                </div>
              ))}

              {showCharts && <ChartsBlock article={article} />}

              {chooserOptions && (
                <ChooserCards
                  title="Which Vehicle is Right for You?"
                  description="Compare key features and find the perfect match for your needs"
                  options={chooserOptions}
                  onSelect={(id) => console.log("Selected:", id)}
                />
              )}

              {/* Ad before reviews */}
              <AdSlot id="article-pre-reviews" />

              {/* Reviews */}
              {article.enhancements?.reviews && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.24 }}
                >
                  <Reviews
                    sources={article.enhancements.reviews.sources}
                    entries={article.enhancements.reviews.entries}
                  />
                </motion.div>
              )}

              {/* Dropdown */}
              {article.enhancements?.dropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.24 }}
                >
                  <Dropdown
                    items={[{ title: article.enhancements.dropdown.title, body: article.enhancements.dropdown.body }]}
                  />
                </motion.div>
              )}

              {/* Quiz */}
              {article.enhancements?.quiz && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.24 }}
                >
                  <Quiz title={article.enhancements.quiz.title} questions={article.enhancements.quiz.questions} />
                </motion.div>
              )}

              {/* Deep Dive Section */}
              {deepDiveBlocks.length > 0 && (
                <motion.div
                  id="deep-dive"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.24 }}
                  className="scroll-mt-24"
                >
                  {deepDiveBlocks.map((block, index) => (
                    <LsiLongform key={`deep-dive-${index}`} block={block as any} index={index} />
                  ))}
                </motion.div>
              )}

              {/* Final ad slot */}
              <AdSlot id="article-bottom" />
            </article>
          </main>
        </div>
      </div>

      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="u-hover fixed bottom-8 right-8 p-4 rounded-lg border border-border bg-card shadow-soft z-40 hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 text-foreground" />
        </motion.button>
      )}

      {article.seo?.schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article.seo.schema) }} />
      )}
    </div>
  )
}

interface BlockRendererProps {
  block: ArticleBlock
  sectionId: string
  onCopyAnchor: (id: string) => void
  copiedAnchor: string | null
  blockIndex?: number
  articleSlug?: string // Added articleSlug prop
}

function BlockRenderer({
  block,
  sectionId,
  onCopyAnchor,
  copiedAnchor,
  blockIndex = 0,
  articleSlug,
}: BlockRendererProps) {
  return (
    <motion.div
      id={sectionId}
      tabIndex={-1}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.24 }}
      className="scroll-mt-24 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
    >
      {block.type === "intro" && (
        <div className="relative group prose prose-lg dark:prose-invert max-w-none">
          <button
            onClick={() => onCopyAnchor(sectionId)}
            className="absolute -left-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted rounded-lg focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Copy link to this section"
          >
            {copiedAnchor === sectionId ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <div dangerouslySetInnerHTML={{ __html: block.html }} />
        </div>
      )}

      {block.type === "comparisonTable" && (
        <div className="u-hover">
          <ComparisonTable block={block} articleSlug={articleSlug} />
        </div>
      )}

      {block.type === "specGrid" && (
        <div className="u-hover">
          <SpecGrid block={block} />
        </div>
      )}

      {block.type === "prosCons" && <ProsCons block={block} />}

      {block.type === "gallery" && <Gallery block={block} />}

      {block.type === "faq" && <Dropdown items={block.items.map((item) => ({ title: item.q, body: item.a }))} />}

      {block.type === "ctaBanner" && (
        <div className="u-hover">
          <CTABanner block={block} />
        </div>
      )}

      {block.type === "markdown" && <MarkdownBlock block={block} />}

      {block.type === "lsi_longform" && <LsiLongform block={block} index={blockIndex} />}
    </motion.div>
  )
}
