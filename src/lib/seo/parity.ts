import type {
  ArticleDoc,
  ArticleBlock,
  FAQBlock,
  ProsConsBlock,
  ComparisonTableBlock,
  SpecGridBlock,
  LsiLongformBlock,
} from "../contracts"

export interface FAQItem {
  q: string
  a: string
}

export interface ProsCons {
  pros: string[]
  cons: string[]
}

export interface DatasetInfo {
  name: string
  variables: string[]
  rows: any[]
}

export interface GlossaryTerm {
  term: string
  definition: string
}

export interface VideoMoment {
  t: number
  label: string
}

export function getRenderedEntities(article: ArticleDoc): {
  faqs: FAQItem[]
  prosCons: ProsCons | null
  dataset: DatasetInfo | null
  videoMoments: VideoMoment[]
} {
  return {
    faqs: extractFaqFromBlocks(article.blocks),
    prosCons: extractProsCons(article.blocks),
    dataset: extractDatasetFromTable(article.blocks),
    videoMoments: extractVideoMoments(article),
  }
}

export function getSchemaEntities(schemas: any[]): {
  faqs: FAQItem[]
  prosCons: ProsCons | null
  dataset: DatasetInfo | null
  videoMoments: VideoMoment[]
} {
  const faqSchema = schemas.find((s) => s["@type"] === "FAQPage")
  const videoSchema = schemas.find((s) => s["@type"] === "VideoObject")
  const datasetSchema = schemas.find((s) => s["@type"] === "Dataset")

  return {
    faqs:
      faqSchema?.mainEntity?.map((q: any) => ({
        q: q.name,
        a: q.acceptedAnswer.text,
      })) || [],
    prosCons: null, // Pros/Cons not typically in schema
    dataset: datasetSchema
      ? {
          name: datasetSchema.name,
          variables: [],
          rows: [],
        }
      : null,
    videoMoments:
      videoSchema?.hasPart?.map((clip: any) => ({
        t: clip.startOffset,
        label: clip.name,
      })) || [],
  }
}

export function diffEntities(
  rendered: ReturnType<typeof getRenderedEntities>,
  schema: ReturnType<typeof getSchemaEntities>,
): {
  status: "GREEN" | "AMBER" | "RED"
  mismatches: Array<{
    entity: string
    field: string
    rendered: any
    schema: any
    reason: string
  }>
} {
  const mismatches: Array<{
    entity: string
    field: string
    rendered: any
    schema: any
    reason: string
  }> = []

  // Check FAQs
  if (rendered.faqs.length > 0) {
    if (!hasFaqParity(rendered.faqs, schema.faqs)) {
      mismatches.push({
        entity: "FAQs",
        field: "items",
        rendered: rendered.faqs.length,
        schema: schema.faqs.length,
        reason: "FAQ count or content mismatch",
      })
    }
  }

  // Check Dataset
  if (rendered.dataset && schema.dataset) {
    if (!hasDatasetParity(rendered.dataset, schema.dataset)) {
      mismatches.push({
        entity: "Dataset",
        field: "structure",
        rendered: rendered.dataset.variables.length,
        schema: schema.dataset.variables.length,
        reason: "Dataset structure mismatch",
      })
    }
  }

  // Check Video Moments
  if (rendered.videoMoments.length > 0 && schema.videoMoments.length === 0) {
    mismatches.push({
      entity: "Video",
      field: "moments",
      rendered: rendered.videoMoments.length,
      schema: schema.videoMoments.length,
      reason: "Video moments missing from schema",
    })
  }

  const status = mismatches.length === 0 ? "GREEN" : mismatches.length <= 2 ? "AMBER" : "RED"

  return { status, mismatches }
}

export function extractFaqFromBlocks(blocks: ArticleBlock[]): FAQItem[] {
  const faqBlocks = blocks.filter((b) => b.type === "faq") as FAQBlock[]

  if (faqBlocks.length > 1) {
    console.warn(`[v0] Parity: Found ${faqBlocks.length} FAQ blocks, only using the first one`)
  }

  const faqBlock = faqBlocks[0]
  if (!faqBlock) return []

  return faqBlock.items
    .filter((item) => item.a && item.a.trim().length > 0)
    .map((item) => ({
      q: normalizeText(item.q),
      a: normalizeText(item.a),
    }))
}

export function extractProsCons(blocks: ArticleBlock[]): ProsCons | null {
  const prosConsBlock = blocks.find((b) => b.type === "prosCons") as ProsConsBlock | undefined

  if (!prosConsBlock) return null

  return {
    pros: prosConsBlock.pros.map(normalizeText),
    cons: prosConsBlock.cons.map(normalizeText),
  }
}

export function extractDatasetFromTable(blocks: ArticleBlock[]): DatasetInfo | null {
  const comparisonBlock = blocks.find((b) => b.type === "comparisonTable") as ComparisonTableBlock | undefined

  if (comparisonBlock) {
    return {
      name: comparisonBlock.caption || "Comparison Data",
      variables: comparisonBlock.columns,
      rows: comparisonBlock.rows,
    }
  }

  const specBlock = blocks.find((b) => b.type === "specGrid") as SpecGridBlock | undefined

  if (specBlock) {
    const variables = ["Specification", "Value"]
    const rows = specBlock.groups.flatMap((group) =>
      group.items.map((item) => ({
        Specification: item.label,
        Value: item.value,
      })),
    )

    return {
      name: "Specifications",
      variables,
      rows,
    }
  }

  return null
}

export function extractGlossaryUsed(article: ArticleDoc): GlossaryTerm[] {
  const terms: GlossaryTerm[] = []

  // Extract from LSI longform blocks
  const lsiBlocks = article.blocks.filter((b) => b.type === "lsi_longform") as LsiLongformBlock[]

  lsiBlocks.forEach((block) => {
    block.semantic_clusters?.forEach((cluster) => {
      terms.push({
        term: cluster.topic,
        definition: cluster.related_terms.join(", "),
      })
    })
  })

  return terms
}

export function extractVideoMoments(article: ArticleDoc): VideoMoment[] {
  // This will be populated by the storyboard builder
  // For now, return empty array - will be enhanced when video is generated
  return []
}

function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ").replace(/[""]/g, '"').replace(/['']/g, "'")
}

export function hasTextArrayParity(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false

  const normalized1 = arr1.map(normalizeText).sort()
  const normalized2 = arr2.map(normalizeText).sort()

  return normalized1.every((text, index) => text === normalized2[index])
}

export function hasFaqParity(rendered: FAQItem[], schema: FAQItem[]): boolean {
  if (rendered.length !== schema.length) return false

  return rendered.every((item, index) => {
    const schemaItem = schema[index]
    return (
      normalizeText(item.q) === normalizeText(schemaItem.q) && normalizeText(item.a) === normalizeText(schemaItem.a)
    )
  })
}

export function hasDatasetParity(rendered: DatasetInfo, schema: DatasetInfo): boolean {
  if (rendered.variables.length !== schema.variables.length) return false
  if (rendered.rows.length !== schema.rows.length) return false

  return hasTextArrayParity(rendered.variables, schema.variables)
}

export function hasVideoMomentsParity(moments: VideoMoment[], durationSec: number): boolean {
  if (moments.length === 0) return true // Optional

  return moments.every((moment) => moment.t >= 0 && moment.t <= durationSec)
}
