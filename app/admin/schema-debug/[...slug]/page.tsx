"use client"

import type React from "react"

import { notFound } from "next/navigation"
import { getArticle } from "@/lib/storage"
import { getBrand } from "@/lib/siteConfig"
import {
  buildArticleSchema,
  buildFAQPageSchema,
  buildDatasetSchema,
  buildVideoObjectWithSeekAction,
} from "@/lib/seo/jsonld"
import {
  extractFaqFromBlocks,
  extractProsCons,
  extractDatasetFromTable,
  extractVideoMoments,
  hasFaqParity,
  hasDatasetParity,
  type FAQItem,
  type DatasetInfo,
} from "@/lib/seo/parity"
import { CheckCircle2, AlertTriangle, XCircle, Copy, Code } from "lucide-react"

export const dynamic = "force-dynamic"

interface SchemaDebugPageProps {
  params: {
    slug: string[]
  }
}

export default async function SchemaDebugPage({ params }: SchemaDebugPageProps) {
  const articleSlug = params.slug.join("/")
  const article = await getArticle(articleSlug)

  if (!article) {
    notFound()
  }

  const brand = getBrand()

  // Extract rendered entities
  const renderedFaqs = extractFaqFromBlocks(article.blocks)
  const renderedProsCons = extractProsCons(article.blocks)
  const renderedDataset = extractDatasetFromTable(article.blocks)
  const renderedVideoMoments = extractVideoMoments(article)

  // Build schemas
  const articleSchema = buildArticleSchema(article, brand)
  const faqSchema = renderedFaqs.length > 0 ? buildFAQPageSchema(renderedFaqs, brand) : null
  const datasetSchema = renderedDataset
    ? buildDatasetSchema(
        renderedDataset.name,
        `Dataset containing ${renderedDataset.rows.length} entries`,
        `/articles/${article.slug}`,
        renderedDataset.rows.length,
        brand,
      )
    : null
  const videoSchema = buildVideoObjectWithSeekAction(article, brand, renderedVideoMoments, { durationSec: 60 })

  // Extract schema entities
  const schemaFaqs: FAQItem[] =
    faqSchema?.mainEntity?.map((q: any) => ({
      q: q.name,
      a: q.acceptedAnswer.text,
    })) || []

  const schemaDataset: DatasetInfo | null = datasetSchema
    ? {
        name: datasetSchema.name,
        variables: [],
        rows: [],
      }
    : null

  const schemaVideoMoments =
    videoSchema.hasPart?.map((clip: any) => ({
      t: clip.startOffset,
      label: clip.name,
    })) || []

  // Check parity
  const faqParity = renderedFaqs.length > 0 ? hasFaqParity(renderedFaqs, schemaFaqs) : null
  const prosConsParity = renderedProsCons ? "GREEN" : null
  const datasetParity = renderedDataset && schemaDataset ? hasDatasetParity(renderedDataset, schemaDataset) : null
  const videoMomentsParity = renderedVideoMoments.length > 0 ? schemaVideoMoments.length > 0 : null

  const allSchemas = [articleSchema, faqSchema, datasetSchema, videoSchema].filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Schema Debug Tool</h1>
          </div>
          <p className="text-slate-300 text-lg">Visual comparison of rendered content vs JSON-LD structured data</p>
          <p className="text-slate-400 mt-2">Article: {article.title}</p>
        </div>

        {/* Overall Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <StatusCard
            title="FAQs"
            status={faqParity === null ? "AMBER" : faqParity ? "GREEN" : "RED"}
            count={renderedFaqs.length}
          />
          <StatusCard title="Pros & Cons" status={prosConsParity || "AMBER"} count={renderedProsCons ? 1 : 0} />
          <StatusCard
            title="Dataset"
            status={datasetParity === null ? "AMBER" : datasetParity ? "GREEN" : "RED"}
            count={renderedDataset ? 1 : 0}
          />
          <StatusCard
            title="Video Moments"
            status={videoMomentsParity === null ? "AMBER" : videoMomentsParity ? "GREEN" : "RED"}
            count={renderedVideoMoments.length}
          />
        </div>

        {/* FAQ Comparison */}
        {renderedFaqs.length > 0 && (
          <ComparisonSection
            title="FAQ Comparison"
            status={faqParity ? "GREEN" : "RED"}
            rendered={
              <div className="space-y-4">
                {renderedFaqs.map((faq, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="font-semibold text-white mb-2">Q: {faq.q}</p>
                    <p className="text-slate-300">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            }
            schema={
              <div className="space-y-4">
                {schemaFaqs.map((faq, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="font-semibold text-white mb-2">Q: {faq.q}</p>
                    <p className="text-slate-300">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            }
            mismatchReason={!faqParity ? "FAQ count or content mismatch between rendered and schema" : undefined}
          />
        )}

        {/* Pros & Cons Comparison */}
        {renderedProsCons && (
          <ComparisonSection
            title="Pros & Cons"
            status="GREEN"
            rendered={
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-400 mb-3">Pros</h4>
                  <ul className="space-y-2">
                    {renderedProsCons.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-400 mb-3">Cons</h4>
                  <ul className="space-y-2">
                    {renderedProsCons.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <XCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            }
            schema={
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-400/30">
                <p className="text-amber-300">
                  Pros & Cons are typically not included in JSON-LD schemas. This is expected and acceptable.
                </p>
              </div>
            }
          />
        )}

        {/* Dataset Comparison */}
        {renderedDataset && (
          <ComparisonSection
            title="Dataset"
            status={datasetParity ? "GREEN" : "RED"}
            rendered={
              <div className="space-y-4">
                <p className="text-white font-semibold">{renderedDataset.name}</p>
                <p className="text-slate-400">Variables: {renderedDataset.variables.join(", ")}</p>
                <p className="text-slate-400">Rows: {renderedDataset.rows.length}</p>
              </div>
            }
            schema={
              <div className="space-y-4">
                <p className="text-white font-semibold">{schemaDataset?.name}</p>
                <p className="text-slate-400">Schema includes distribution metadata</p>
              </div>
            }
            mismatchReason={!datasetParity ? "Dataset structure mismatch" : undefined}
          />
        )}

        {/* Video Moments Comparison */}
        {renderedVideoMoments.length > 0 && (
          <ComparisonSection
            title="Video Moments"
            status={videoMomentsParity ? "GREEN" : "RED"}
            rendered={
              <div className="space-y-2">
                {renderedVideoMoments.map((moment, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <span className="text-cyan-400 font-mono">{moment.t}s</span>
                    <span className="text-slate-300">{moment.label}</span>
                  </div>
                ))}
              </div>
            }
            schema={
              <div className="space-y-2">
                {schemaVideoMoments.map((moment: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <span className="text-cyan-400 font-mono">{moment.t}s</span>
                    <span className="text-slate-300">{moment.label}</span>
                  </div>
                ))}
              </div>
            }
            mismatchReason={!videoMomentsParity ? "Video moments missing from schema" : undefined}
          />
        )}

        {/* JSON-LD Output */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Complete JSON-LD Output</h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(allSchemas, null, 2))
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy JSON-LD
            </button>
          </div>
          <pre className="p-6 rounded-xl bg-slate-950 border border-white/10 overflow-x-auto">
            <code className="text-sm text-slate-300">{JSON.stringify(allSchemas, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

function StatusCard({
  title,
  status,
  count,
}: {
  title: string
  status: "GREEN" | "AMBER" | "RED"
  count: number
}) {
  const colors = {
    GREEN: {
      bg: "from-green-500/10 to-emerald-500/10",
      border: "border-green-500/30",
      icon: "text-green-400",
      Icon: CheckCircle2,
    },
    AMBER: {
      bg: "from-amber-500/10 to-orange-500/10",
      border: "border-amber-500/30",
      icon: "text-amber-400",
      Icon: AlertTriangle,
    },
    RED: {
      bg: "from-red-500/10 to-pink-500/10",
      border: "border-red-500/30",
      icon: "text-red-400",
      Icon: XCircle,
    },
  }

  const config = colors[status]
  const Icon = config.Icon

  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br ${config.bg} border ${config.border}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <Icon className={`w-6 h-6 ${config.icon}`} />
      </div>
      <p className="text-3xl font-bold text-white">{count}</p>
      <p className={`text-sm mt-2 ${config.icon}`}>{status}</p>
    </div>
  )
}

function ComparisonSection({
  title,
  status,
  rendered,
  schema,
  mismatchReason,
}: {
  title: string
  status: "GREEN" | "AMBER" | "RED"
  rendered: React.ReactNode
  schema: React.ReactNode
  mismatchReason?: string
}) {
  const statusColors = {
    GREEN: "border-green-500/50 bg-green-500/5",
    AMBER: "border-amber-500/50 bg-amber-500/5",
    RED: "border-red-500/50 bg-red-500/5",
  }

  const statusIcons = {
    GREEN: <CheckCircle2 className="w-6 h-6 text-green-400" />,
    AMBER: <AlertTriangle className="w-6 h-6 text-amber-400" />,
    RED: <XCircle className="w-6 h-6 text-red-400" />,
  }

  return (
    <div className={`mb-8 p-6 rounded-2xl border-2 ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        {statusIcons[status]}
      </div>

      {mismatchReason && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-red-300 font-medium">Mismatch Reason:</p>
          <p className="text-red-200 mt-1">{mismatchReason}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-cyan-400 mb-4">Rendered Content</h4>
          <div className="p-4 rounded-lg bg-slate-900/50 border border-white/10">{rendered}</div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-purple-400 mb-4">JSON-LD Schema</h4>
          <div className="p-4 rounded-lg bg-slate-900/50 border border-white/10">{schema}</div>
        </div>
      </div>
    </div>
  )
}
