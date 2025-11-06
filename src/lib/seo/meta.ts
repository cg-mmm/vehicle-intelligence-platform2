import type { ArticleDoc } from "../contracts"

interface BrandPack {
  siteName: string
  siteUrl: string
  description: string
  logo: string
  organization: {
    name: string
    url: string
    logo: string
  }
  author: {
    name: string
    url: string
  }
  social: {
    twitter?: string
    facebook?: string
  }
  defaultOgImage: string
}

interface MetaTagsInput {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: "website" | "article"
  article?: ArticleDoc
  noindex?: boolean
}

export function buildMetaTags(input: MetaTagsInput, brand: BrandPack) {
  const { title, description, canonical, ogImage, ogType = "website", noindex = false } = input

  const fullTitle = title.includes(brand.siteName) ? title : `${title} | ${brand.siteName}`
  const fullCanonical = canonical || brand.siteUrl
  const fullOgImage = ogImage || brand.defaultOgImage
  const absoluteOgImage = fullOgImage.startsWith("http") ? fullOgImage : `${brand.siteUrl}${fullOgImage}`

  return {
    title: fullTitle,
    description,
    ...(noindex && { robots: "noindex,nofollow" }),
    canonical: fullCanonical,
    openGraph: {
      type: ogType,
      title: fullTitle,
      description,
      url: fullCanonical,
      siteName: brand.siteName,
      images: [
        {
          url: absoluteOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteOgImage],
      ...(brand.social.twitter && { site: brand.social.twitter }),
    },
  }
}

export function buildArticleMetaTags(article: ArticleDoc, brand: BrandPack) {
  return buildMetaTags(
    {
      title: article.title,
      description: article.description,
      canonical: article.seo?.canonical || `${brand.siteUrl}/articles/${article.slug}`,
      ogImage: article.seo?.ogImage || article.hero.image?.url,
      ogType: "article",
      article,
    },
    brand,
  )
}
