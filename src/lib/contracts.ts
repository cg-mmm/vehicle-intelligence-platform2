export interface ArticleHero {
  title: string
  subtitle?: string
  eyebrow?: string
  image?: {
    url: string
    alt: string
  }
  badges?: string[]
  cta?: {
    label: string
    href: string
  }
}

// Table of Contents
export interface ArticleTOCItem {
  id: string
  title: string
}

// Content Blocks
export type IntroBlock = {
  type: "intro"
  html: string
}

export type ComparisonTableBlock = {
  type: "comparisonTable"
  caption?: string
  columns: string[]
  rows: Array<Record<string, string>>
  highlightRule?: "max" | "min"
}

export type SpecGridBlock = {
  type: "specGrid"
  groups: Array<{
    title: string
    items: Array<{
      label: string
      value: string
    }>
  }>
}

export type ProsConsBlock = {
  type: "prosCons"
  pros: string[]
  cons: string[]
}

export type GalleryBlock = {
  type: "gallery"
  images: Array<{
    url: string
    alt: string
  }>
}

export type FAQBlock = {
  type: "faq"
  items: Array<{
    q: string
    a: string
  }>
}

export type CTABannerBlock = {
  type: "ctaBanner"
  heading: string
  sub?: string
  href: string
  label: string
}

export type MarkdownBlock = {
  type: "markdown"
  md: string
}

export type LsiLongformBlock = {
  type: "lsi_longform"
  heading: string
  content_markdown: string
  word_count: number
  keywords_used: string[]
  semantic_clusters: Array<{
    topic: string
    related_terms: string[]
  }>
  style: {
    tone: string
    readability: string
    visual_style: string
  }
}

export type ArticleBlock =
  | IntroBlock
  | ComparisonTableBlock
  | SpecGridBlock
  | ProsConsBlock
  | GalleryBlock
  | FAQBlock
  | CTABannerBlock
  | MarkdownBlock
  | LsiLongformBlock // Added to union type

// Enhancement Modules
export type TLDRModule = {
  type: "tldr"
  content: string
}

export type KeyTakeawaysModule = {
  type: "key_takeaways"
  items: string[]
}

export type QuizModule = {
  type: "quiz"
  title: string
  questions: Array<{
    prompt: string
    choices: string[]
    correctIndex: number
    explanation?: string
  }>
}

export type MpgCalculatorModule = {
  type: "mpg_calculator"
  label?: string
  defaults?: {
    cityMpg?: number
    hwyMpg?: number
    fuelPrice?: number
    miles?: number
  }
}

export type PullQuoteModule = {
  type: "pull_quote"
  quote: string
  attribution?: string
}

export type DropdownModule = {
  type: "dropdown"
  title: string
  body: string
}

export type ReviewsModule = {
  type: "reviews"
  sources?: string[]
  entries: Array<{
    author?: string
    rating?: number
    summary: string
    pros?: string[]
    cons?: string[]
  }>
}

export type EnhancementModule =
  | TLDRModule
  | KeyTakeawaysModule
  | QuizModule
  | MpgCalculatorModule
  | PullQuoteModule
  | DropdownModule
  | ReviewsModule

// SEO metadata
export interface ArticleSEO {
  title: string
  description?: string
  canonical?: string
  ogImage?: string
  schema?: unknown
}

// Content type and 3-level taxonomy support
export type ContentType = "comparison" | "deep_dive" | "how_to" | "glossary" | "news" | "database_entry"

export interface TaxonomyRef {
  slug: string
  title: string
}

export type SectionSlug = "comparisons" | "deep-dives" | "guides" | "glossary" | "news" | "database"

export interface Section {
  id: string
  pillarId: string
  slug: SectionSlug
  title: string
  description?: string
  navWeight: number
  featuredClusterIds?: string[]
}

export interface Pillar {
  id: string
  slug: string
  title: string
  description: string
  icon?: string
  coverImage?: string
  navWeight: number
  relatedPillars?: string[]
}

export interface Cluster {
  id: string
  pillarId: string
  sectionId: string
  slug: string
  title: string
  description: string
  coverImage?: string
  navWeight: number
  tags?: string[]
  relatedClusters?: string[]
}

// Author Info
export interface AuthorInfo {
  name: string
  slug?: string
  url?: string
  image?: string
  jobTitle?: string
  bio?: string
  sameAs?: string[]
}

export interface ArticleMeta {
  slug: string
  title: string
  description: string
  content_type: ContentType
  pillarId: string
  sectionId: string
  clusterId?: string
  keywords?: string[]
  semantic_clusters?: { topic: string; related_terms: string[] }[]
  navWeight?: number
  featured?: boolean
}

export interface ArticleDoc {
  title: string
  slug: string
  description: string
  content_type?: ContentType
  hero: ArticleHero
  toc: ArticleTOCItem[]
  blocks: ArticleBlock[]
  enhancements?: {
    tldr?: TLDRModule
    keyTakeaways?: KeyTakeawaysModule
    quiz?: QuizModule
    mpgCalculator?: MpgCalculatorModule
    pullQuote?: PullQuoteModule
    dropdown?: DropdownModule
    reviews?: ReviewsModule
  }
  seo?: ArticleSEO
  publishedAt?: string
  updatedAt?: string
  author?: AuthorInfo
  reviewer?: AuthorInfo
  pillar?: TaxonomyRef
  section?: TaxonomyRef
  cluster?: TaxonomyRef
  pageType?: "pillar" | "section" | "cluster" | "article"
}

// Utility: Generate stable ID from text
export function generateId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Utility: Validate required fields
export function validateArticleDoc(doc: Partial<ArticleDoc>): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  if (!doc.title) missing.push("title")
  if (!doc.slug) missing.push("slug")
  if (!doc.description) missing.push("description")
  if (!doc.hero) missing.push("hero")
  if (!doc.hero?.title) missing.push("hero.title")
  if (!doc.toc || doc.toc.length === 0) missing.push("toc")
  if (!doc.blocks || doc.blocks.length === 0) missing.push("blocks")

  return {
    valid: missing.length === 0,
    missing,
  }
}
