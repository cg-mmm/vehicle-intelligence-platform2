import type { ArticleDoc } from "../contracts"
import {
  extractFaqFromBlocks,
  extractProsCons,
  extractDatasetFromTable,
  hasFaqParity,
  hasDatasetParity,
  hasVideoMomentsParity,
} from "./parity"

export type ValidationResult = "GREEN" | "AMBER" | "RED"

export interface ValidationReport {
  faq: ValidationResult
  prosCons: ValidationResult
  dataset: ValidationResult
  video: ValidationResult
  messages: string[]
}

export function validateFAQBlocks(article: ArticleDoc): {
  status: ValidationResult
  messages: string[]
} {
  const faqBlocks = article.blocks.filter((b) => b.type === "faq")
  const messages: string[] = []
  let status: ValidationResult = "GREEN"

  // Check for multiple FAQ blocks
  if (faqBlocks.length > 1) {
    status = "AMBER"
    messages.push(`Found ${faqBlocks.length} FAQ blocks, only one is allowed per article`)
  }

  // Check for empty answers
  if (faqBlocks.length > 0) {
    const faqBlock = faqBlocks[0] as any
    const emptyAnswers = faqBlock.items.filter((item: any) => !item.a || item.a.trim().length === 0)

    if (emptyAnswers.length > 0) {
      status = "AMBER"
      messages.push(`Found ${emptyAnswers.length} FAQ items with empty answers`)
    }

    // Check for duplicate questions
    const questions = faqBlock.items.map((item: any) => item.q.toLowerCase().trim())
    const duplicates = questions.filter((q: string, index: number) => questions.indexOf(q) !== index)

    if (duplicates.length > 0) {
      status = "AMBER"
      messages.push(`Found ${duplicates.length} duplicate FAQ questions`)
    }
  }

  return { status, messages }
}

export function validateSchemaParity(article: ArticleDoc, schema: any): ValidationReport {
  const report: ValidationReport = {
    faq: "GREEN",
    prosCons: "GREEN",
    dataset: "GREEN",
    video: "GREEN",
    messages: [],
  }

  const faqValidation = validateFAQBlocks(article)
  if (faqValidation.status !== "GREEN") {
    report.faq = faqValidation.status
    report.messages.push(...faqValidation.messages)
  }

  // Validate FAQ parity
  const renderedFaqs = extractFaqFromBlocks(article.blocks)
  if (renderedFaqs.length > 0) {
    if (!schema.mainEntity || schema.mainEntity["@type"] !== "FAQPage") {
      report.faq = "RED"
      report.messages.push("FAQ block exists but FAQPage schema is missing")
    } else {
      const schemaFaqs = schema.mainEntity.mainEntity.map((q: any) => ({
        q: q.name,
        a: q.acceptedAnswer.text,
      }))

      if (!hasFaqParity(renderedFaqs, schemaFaqs)) {
        report.faq = "RED"
        report.messages.push("FAQ schema does not match rendered content")
      }
    }
  }

  // Validate Pros/Cons parity
  const renderedProsCons = extractProsCons(article.blocks)
  if (renderedProsCons) {
    // Check if pros/cons are visible in schema (could be in Review or custom property)
    if (!schema.review && !schema.positiveNotes && !schema.negativeNotes) {
      report.prosCons = "AMBER"
      report.messages.push("Pros/Cons block exists but not represented in schema")
    }
  }

  // Validate Dataset parity
  const renderedDataset = extractDatasetFromTable(article.blocks)
  if (renderedDataset) {
    if (!schema.dataset || schema.dataset["@type"] !== "Dataset") {
      report.dataset = "AMBER"
      report.messages.push("Comparison table exists but Dataset schema is missing")
    } else {
      if (
        !hasDatasetParity(renderedDataset, {
          name: schema.dataset.name,
          variables: schema.dataset.variableMeasured?.map((v: any) => v.name) || [],
          rows: [],
        })
      ) {
        report.dataset = "RED"
        report.messages.push("Dataset schema does not match rendered table")
      }
    }
  }

  // Validate Video moments parity
  if (schema.video && schema.video.hasPart) {
    const moments = schema.video.hasPart.map((clip: any) => ({
      t: clip.startOffset,
      label: clip.name,
    }))

    const durationMatch = schema.video.duration.match(/PT(\d+)M(\d+)S/)
    const durationSec = durationMatch ? Number.parseInt(durationMatch[1]) * 60 + Number.parseInt(durationMatch[2]) : 0

    if (!hasVideoMomentsParity(moments, durationSec)) {
      report.video = "RED"
      report.messages.push("Video moments exceed video duration")
    }
  }

  return report
}

export function validateJsonLd(schema: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!schema["@context"]) {
    errors.push("Missing @context")
  }

  if (!schema["@type"]) {
    errors.push("Missing @type")
  }

  // Validate required fields based on type
  if (schema["@type"] === "Article" || schema["@type"] === "TechArticle") {
    if (!schema.headline) errors.push("Missing headline")
    if (!schema.datePublished) errors.push("Missing datePublished")
    if (!schema.author) errors.push("Missing author")
    if (!schema.publisher) errors.push("Missing publisher")
  }

  if (schema["@type"] === "FAQPage") {
    if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
      errors.push("FAQPage missing mainEntity array")
    }
  }

  if (schema["@type"] === "VideoObject") {
    if (!schema.name) errors.push("VideoObject missing name")
    if (!schema.thumbnailUrl) errors.push("VideoObject missing thumbnailUrl")
    if (!schema.uploadDate) errors.push("VideoObject missing uploadDate")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
