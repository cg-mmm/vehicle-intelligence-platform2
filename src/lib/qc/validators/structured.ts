import type { ArticleDoc } from "@/lib/contracts"

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateArticleSchema(article: ArticleDoc): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Required fields for Article schema
  if (!article.title) errors.push("Missing required field: title")
  if (!article.description) errors.push("Missing required field: description")
  if (!article.publishedAt) errors.push("Missing required field: publishedAt")

  // Recommended fields
  if (!article.hero?.image?.url) warnings.push("Missing hero image (recommended for Article schema)")
  if (!article.updatedAt) warnings.push("Missing updatedAt (recommended for freshness signals)")

  // Author information
  if (!article.author?.name) warnings.push("Missing author name")

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

export function validateVideoObjectSchema(article: ArticleDoc, durationSec: number): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Required fields for VideoObject
  if (!article.title) errors.push("Missing required field: name (title)")
  if (!article.description && !article.enhancements?.tldr?.content) {
    errors.push("Missing description for VideoObject")
  }
  if (!article.hero?.image?.url) errors.push("Missing thumbnailUrl (poster image)")
  if (!durationSec || durationSec <= 0) errors.push("Invalid duration")

  // Recommended fields
  if (!article.publishedAt) warnings.push("Missing uploadDate")

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

export function validateFAQPageSchema(faqItems: Array<{ q: string; a: string }>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!faqItems || faqItems.length === 0) {
    errors.push("FAQ block is empty")
    return { valid: false, errors, warnings }
  }

  faqItems.forEach((item, index) => {
    if (!item.q || item.q.trim().length === 0) {
      errors.push(`FAQ item ${index + 1}: Missing question`)
    }
    if (!item.a || item.a.trim().length === 0) {
      errors.push(`FAQ item ${index + 1}: Missing answer`)
    }
    if (item.q && item.q.length < 10) {
      warnings.push(`FAQ item ${index + 1}: Question is very short`)
    }
    if (item.a && item.a.length < 20) {
      warnings.push(`FAQ item ${index + 1}: Answer is very short`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

export function validateBreadcrumbSchema(items: Array<{ name: string; url: string }>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!items || items.length === 0) {
    errors.push("Breadcrumb list is empty")
    return { valid: false, errors, warnings }
  }

  items.forEach((item, index) => {
    if (!item.name || item.name.trim().length === 0) {
      errors.push(`Breadcrumb item ${index + 1}: Missing name`)
    }
    if (!item.url || item.url.trim().length === 0) {
      errors.push(`Breadcrumb item ${index + 1}: Missing URL`)
    }
    if (item.url && !item.url.startsWith("/")) {
      warnings.push(`Breadcrumb item ${index + 1}: URL should be absolute path`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

export function validateCollectionPageSchema(
  title: string,
  description: string,
  items: Array<{ name: string; url: string }>,
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!title || title.trim().length === 0) errors.push("Missing collection title")
  if (!description || description.trim().length === 0) errors.push("Missing collection description")
  if (!items || items.length === 0) warnings.push("Collection has no items")

  items.forEach((item, index) => {
    if (!item.name) errors.push(`Collection item ${index + 1}: Missing name`)
    if (!item.url) errors.push(`Collection item ${index + 1}: Missing URL`)
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
