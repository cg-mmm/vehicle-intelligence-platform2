import type { ArticleDoc, FAQBlock } from "../contracts"

interface BrandPack {
  siteName: string
  siteUrl: string
  organization: {
    name: string
    url: string
    logo: string
  }
  author: {
    name: string
    url: string
  }
}

interface VideoMoment {
  t: number // seconds
  label: string
}

export function buildOrganizationSchema(brand: BrandPack, opts?: { sameAs?: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.organization.name,
    url: brand.organization.url,
    logo: {
      "@type": "ImageObject",
      url: `${brand.siteUrl}${brand.organization.logo}`,
    },
    sameAs: opts?.sameAs || [],
  }
}

export function buildPersonSchema(person: {
  name: string
  url?: string
  sameAs?: string[]
  jobTitle?: string
  image?: string
  description?: string
  worksFor?: {
    name: string
    url: string
  }
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
  }

  if (person.url) schema.url = person.url
  if (person.jobTitle) schema.jobTitle = person.jobTitle
  if (person.image) schema.image = person.image
  if (person.description) schema.description = person.description
  if (person.sameAs && person.sameAs.length > 0) schema.sameAs = person.sameAs
  if (person.worksFor) {
    schema.worksFor = {
      "@type": "Organization",
      name: person.worksFor.name,
      url: person.worksFor.url,
    }
  }

  return schema
}

export function buildItemListSchema(
  items: Array<{
    name: string
    url: string
    position: number
  }>,
  brand: BrandPack,
  opts?: {
    name?: string
    description?: string
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts?.name || "Featured Articles",
    description: opts?.description,
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: `${brand.siteUrl}${item.url}`,
    })),
  }
}

export function buildSpeakableSpec() {
  return {
    "@type": "SpeakableSpecification",
    cssSelector: [".tldr", ".intro", "h1", "h2"],
  }
}

export function buildWebSiteSchema(brand: BrandPack) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.siteName,
    url: brand.siteUrl,
    publisher: {
      "@type": "Organization",
      name: brand.organization.name,
      url: brand.organization.url,
      logo: {
        "@type": "ImageObject",
        url: `${brand.siteUrl}${brand.organization.logo}`,
      },
    },
  }
}

export function buildWebSiteWithSearchAction(brand: BrandPack) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.siteName,
    url: brand.siteUrl,
    publisher: {
      "@type": "Organization",
      name: brand.organization.name,
      url: brand.organization.url,
      logo: {
        "@type": "ImageObject",
        url: `${brand.siteUrl}${brand.organization.logo}`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${brand.siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>, brand: BrandPack) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${brand.siteUrl}${item.url}`,
    })),
  }
}

export function buildCollectionPageSchema(
  title: string,
  description: string,
  url: string,
  items: Array<{ name: string; url: string }>,
  brand: BrandPack,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${brand.siteUrl}${url}`,
    publisher: {
      "@type": "Organization",
      name: brand.organization.name,
      url: brand.organization.url,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: `${brand.siteUrl}${item.url}`,
      })),
    },
  }
}

export function buildArticleSchema(article: ArticleDoc, brand: BrandPack) {
  const faqBlock = article.blocks.find((b) => b.type === "faq") as FAQBlock | undefined

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${brand.siteUrl}/articles/${article.slug}`,
    image: article.hero.image?.url ? `${brand.siteUrl}${article.hero.image.url}` : undefined,
    datePublished: article.publishedAt || new Date().toISOString(),
    dateModified: article.updatedAt || article.publishedAt || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: brand.author.name,
      url: brand.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: brand.organization.name,
      url: brand.organization.url,
      logo: {
        "@type": "ImageObject",
        url: `${brand.siteUrl}${brand.organization.logo}`,
      },
    },
  }

  const sources = ["https://www.nhtsa.gov/ratings", "https://www.fueleconomy.gov", "https://www.iihs.org"]

  if (sources.length > 0) {
    schema.citation = sources.map((url) => ({
      "@type": "CreativeWork",
      url,
    }))
  }

  // Add FAQ schema if FAQ block exists
  if (faqBlock && faqBlock.items.length > 0) {
    schema.mainEntity = {
      "@type": "FAQPage",
      mainEntity: faqBlock.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    }
  }

  return schema
}

export function buildTechArticleSchema(
  article: ArticleDoc,
  brand: BrandPack,
  taxonomyChain?: {
    pillar?: { title: string; url: string }
    section?: { title: string; url: string }
    cluster?: { title: string; url: string }
  },
) {
  const faqBlock = article.blocks.find((b) => b.type === "faq") as FAQBlock | undefined

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.description,
    url: `${brand.siteUrl}/articles/${article.slug}`,
    image: article.hero.image?.url ? `${brand.siteUrl}${article.hero.image.url}` : undefined,
    datePublished: article.publishedAt || new Date().toISOString(),
    dateModified: article.updatedAt || article.publishedAt || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: brand.author.name,
      url: brand.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: brand.organization.name,
      url: brand.organization.url,
      logo: {
        "@type": "ImageObject",
        url: `${brand.siteUrl}${brand.organization.logo}`,
      },
    },
  }

  // Add isPartOf chain for taxonomy
  if (taxonomyChain?.section) {
    schema.isPartOf = {
      "@type": "CollectionPage",
      name: taxonomyChain.section.title,
      url: `${brand.siteUrl}${taxonomyChain.section.url}`,
    }

    if (taxonomyChain.cluster) {
      schema.isPartOf.isPartOf = {
        "@type": "CollectionPage",
        name: taxonomyChain.cluster.title,
        url: `${brand.siteUrl}${taxonomyChain.cluster.url}`,
      }
    }
  }

  // Add FAQ schema if FAQ block exists
  if (faqBlock && faqBlock.items.length > 0) {
    schema.mainEntity = {
      "@type": "FAQPage",
      mainEntity: faqBlock.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    }
  }

  return schema
}

export function buildFAQPageSchema(items: Array<{ q: string; a: string }>, brand: BrandPack) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }
}

export function buildDatasetSchema(
  name: string,
  description: string,
  url: string,
  totalItems: number,
  brand: BrandPack,
  articleSlug?: string,
) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url: `${brand.siteUrl}${url}`,
    creator: {
      "@type": "Organization",
      name: brand.organization.name,
      url: brand.organization.url,
    },
    variableMeasured: totalItems,
  }

  // Add distribution URLs if article slug is provided
  if (articleSlug) {
    schema.distribution = [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: `${brand.siteUrl}/api/datasets/${articleSlug}?format=csv`,
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${brand.siteUrl}/api/datasets/${articleSlug}?format=json`,
      },
    ]
  }

  return schema
}

export function buildDefinedTermSchema(
  name: string,
  description: string,
  url: string,
  properties: Record<string, any>,
  brand: BrandPack,
) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name,
    description,
    url: `${brand.siteUrl}${url}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: brand.siteName,
      url: brand.siteUrl,
    },
    ...properties,
  }
}

export function videoObjectFromArticle(
  article: ArticleDoc,
  brand: BrandPack,
  opts: {
    durationSec?: number
    mp4Url?: string
    posterUrl?: string
    embedUrl?: string
  } = {},
) {
  const durationSec = opts.durationSec || 60
  const mp4Url = opts.mp4Url || `/videos/${article.slug}.mp4`
  const posterUrl = opts.posterUrl || `/videos/${article.slug}.jpg`
  const embedUrl = opts.embedUrl || `/video/${article.slug}`

  // Convert duration to ISO 8601 format (PT1M30S for 1 minute 30 seconds)
  const minutes = Math.floor(durationSec / 60)
  const seconds = durationSec % 60
  const duration = `PT${minutes}M${seconds}S`

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: article.title,
    description: article.enhancements?.tldr?.content || article.description,
    thumbnailUrl: `${brand.siteUrl}${posterUrl}`,
    uploadDate: article.updatedAt || article.publishedAt || new Date().toISOString(),
    duration,
    contentUrl: `${brand.siteUrl}${mp4Url}`,
    embedUrl: `${brand.siteUrl}${embedUrl}`,
    publisher: {
      "@type": "Organization",
      name: brand.organization.name,
      url: brand.organization.url,
      logo: {
        "@type": "ImageObject",
        url: `${brand.siteUrl}${brand.organization.logo}`,
      },
    },
  }
}

export function buildVideoObjectWithSeekAction(
  article: ArticleDoc,
  brand: BrandPack,
  moments: VideoMoment[],
  opts: {
    durationSec?: number
    mp4Url?: string
    posterUrl?: string
    embedUrl?: string
  } = {},
) {
  const durationSec = opts.durationSec || 60
  const mp4Url = opts.mp4Url || `/videos/${article.slug}.mp4`
  const posterUrl = opts.posterUrl || `/videos/${article.slug}.jpg`
  const embedUrl = opts.embedUrl || `/video/${article.slug}`

  const minutes = Math.floor(durationSec / 60)
  const seconds = durationSec % 60
  const duration = `PT${minutes}M${seconds}S`

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${article.title} – Video Overview`,
    description: article.enhancements?.tldr?.content || article.description,
    thumbnailUrl: `${brand.siteUrl}${posterUrl}`,
    uploadDate: article.updatedAt || article.publishedAt || new Date().toISOString(),
    duration,
    contentUrl: `${brand.siteUrl}${mp4Url}`,
    embedUrl: `${brand.siteUrl}${embedUrl}`,
    publisher: {
      "@type": "Organization",
      name: brand.organization.name,
      url: brand.organization.url,
      logo: {
        "@type": "ImageObject",
        url: `${brand.siteUrl}${brand.organization.logo}`,
      },
    },
    potentialAction: {
      "@type": "SeekToAction",
      target: `${brand.siteUrl}${embedUrl}?t={seek_to_second_number}`,
      "startOffset-input": "required name=seek_to_second_number",
    },
    hasPart: moments.map((m) => ({
      "@type": "Clip",
      name: m.label,
      startOffset: m.t,
      url: `${brand.siteUrl}${embedUrl}?t=${m.t}`,
    })),
  }
}
