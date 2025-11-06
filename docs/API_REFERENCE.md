# Automata-2 API Reference

## Search API

### GET /api/search

Full-text search with filters and pagination.

**Query Parameters:**
- `q` (string, required) - Search query
- `pillar` (string, optional) - Filter by pillar slug
- `section` (string, optional) - Filter by section slug
- `cluster` (string, optional) - Filter by cluster slug
- `type` (string, optional) - Filter by content type (article, video, faq, glossary)
- `sort` (string, optional) - Sort order (relevance, newest, oldest)
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Results per page (default: 20)

**Response:**
\`\`\`json
{
  "results": [
    {
      "id": "article:2026-midsize-sedan-comparison",
      "kind": "article",
      "url": "/articles/2026-midsize-sedan-comparison",
      "title": "2026 Midsize Sedan Comparison",
      "subtitle": "Honda Accord vs Toyota Camry vs Mazda6",
      "summary": "Compare the top midsize sedans...",
      "content_plain": "...",
      "pillar": { "slug": "sedans", "title": "Sedans" },
      "section": { "slug": "comparisons", "title": "Comparisons" },
      "cluster": { "slug": "midsize-sedans", "title": "Midsize Sedans" },
      "keywords": ["sedan", "comparison", "accord", "camry"],
      "images": ["/images/accord.jpg"],
      "publishedAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-20T00:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20,
  "facets": {
    "kinds": { "article": 30, "video": 8, "faq": 4 },
    "pillars": { "sedans": 20, "suvs": 15, "trucks": 7 }
  }
}
\`\`\`

### GET /api/search/suggest

Type-ahead search suggestions.

**Query Parameters:**
- `q` (string, required) - Partial search query

**Response:**
\`\`\`json
{
  "suggestions": [
    {
      "id": "article:2026-midsize-sedan-comparison",
      "kind": "article",
      "url": "/articles/2026-midsize-sedan-comparison",
      "title": "2026 Midsize Sedan Comparison",
      "summary": "Compare the top midsize sedans...",
      "pillar": { "slug": "sedans", "title": "Sedans" }
    }
  ]
}
\`\`\`

---

## JSON-LD Schema Functions

### buildWebSiteWithSearchAction(brand)

Generates WebSite schema with SearchAction for homepage.

**Parameters:**
- `brand` (BrandPack) - Brand configuration

**Returns:** JSON-LD WebSite schema

### buildTechArticleSchema(article, brand, taxonomyChain)

Generates TechArticle schema with isPartOf chain.

**Parameters:**
- `article` (ArticleDoc) - Article data
- `brand` (BrandPack) - Brand configuration
- `taxonomyChain` (object) - Taxonomy hierarchy

**Returns:** JSON-LD TechArticle schema

### buildVideoObjectWithSeekAction(article, brand, moments, opts)

Generates VideoObject schema with SeekToAction and key moments.

**Parameters:**
- `article` (ArticleDoc) - Article data
- `brand` (BrandPack) - Brand configuration
- `moments` (VideoMoment[]) - Key moment timestamps
- `opts` (object) - Video options (duration, URLs)

**Returns:** JSON-LD VideoObject schema

---

## Video Functions

### buildStoryboard(article, brand, config)

Builds adaptive video storyboard from article content.

**Parameters:**
- `article` (ArticleDoc) - Article data
- `brand` (BrandPack) - Brand configuration
- `config` (VideoConfig, optional) - Video configuration

**Returns:**
\`\`\`typescript
{
  scenes: Scene[],
  estimatedDurationSec: number,
  contentWeight: number
}
\`\`\`

### extractKeyMoments(scenes)

Extracts seekable timestamps from video scenes.

**Parameters:**
- `scenes` (Scene[]) - Video scenes

**Returns:**
\`\`\`typescript
VideoMoment[] // [{ t: 0, label: "Introduction" }, ...]
\`\`\`

### generateTranscript(article, scenes)

Generates VTT captions from article and scenes.

**Parameters:**
- `article` (ArticleDoc) - Article data
- `scenes` (Scene[]) - Video scenes

**Returns:**
\`\`\`typescript
CaptionCue[] // [{ start: 0, end: 4, text: "..." }, ...]
\`\`\`

---

## QC Functions

### runQCChecks(article, existingArticles)

Runs all enabled QC rules on an article.

**Parameters:**
- `article` (Article) - Article to check
- `existingArticles` (Article[]) - Existing articles for comparison

**Returns:**
\`\`\`typescript
QCResult[] // [{ ruleId, passed, severity, message, details }, ...]
\`\`\`

### Validators

#### validateArticleSchema(article)
#### validateVideoObjectSchema(article, durationSec)
#### validateFAQPageSchema(faqItems)
#### validateBreadcrumbSchema(items)
#### validateCollectionPageSchema(title, description, items)

All return:
\`\`\`typescript
{
  valid: boolean,
  errors: string[],
  warnings: string[]
}
\`\`\`

---

## IndexNow Functions

### submitToIndexNow(urls, apiKey?)

Submits URLs to IndexNow for instant indexing.

**Parameters:**
- `urls` (string[]) - URLs to submit
- `apiKey` (string, optional) - IndexNow API key

**Returns:**
\`\`\`typescript
Promise<{ success: boolean, error?: string }>
\`\`\`

### pingIndexNowOnPublish(articleSlug, baseUrl)

Pings IndexNow when article is published.

**Parameters:**
- `articleSlug` (string) - Article slug
- `baseUrl` (string) - Site base URL

**Returns:** Promise<void>
