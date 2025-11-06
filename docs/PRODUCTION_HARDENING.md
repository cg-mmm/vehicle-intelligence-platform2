# Automata-2 Production Hardening Guide

## Overview

This document outlines the production hardening implementation for Automata-2, covering search, SEO, video enhancements, E-E-A-T surfaces, QC gates, performance optimizations, and analytics.

---

## 1. Search System

### Implementation Status: ✅ Complete

**Files:**
- `src/lib/search/contracts.ts` - Type definitions for SearchDoc, queries, responses
- `src/lib/search/indexer.ts` - BM25 indexing with entity boost
- `src/lib/search/store.ts` - In-memory search store with hot reload
- `app/api/search/route.ts` - SSR search API endpoint
- `app/api/search/suggest/route.ts` - Type-ahead suggestions API
- `src/components/search/SearchBox.tsx` - Header search with combobox
- `app/search/page.tsx` - Full search results page
- `src/components/search/SearchResults.tsx` - Results display with highlighting
- `src/components/search/SearchFilters.tsx` - Filter sidebar

**Features:**
- **Hybrid Ranking**: BM25 (60%) + Entity Boost (25%) + Freshness (10%) + Popularity (5%)
- **Type-ahead**: 150-200ms debounce, keyboard navigation, rich previews
- **Indexed Content**: Articles, videos, FAQs, glossary, taxonomy (pillars/sections/clusters)
- **Filters**: Content type, pillar, section, cluster, sort order
- **SSR Results**: Server-side rendering for SEO

**Test Queries:**
\`\`\`
- "midsize sedan comparison"
- "hybrid mileage"
- "pros and cons accord"
- "best suv under 30k"
\`\`\`

---

## 2. SEO Enhancements

### Implementation Status: ✅ Complete

**Files:**
- `src/lib/seo/jsonld.ts` - Enhanced JSON-LD schema generators

**New Schemas:**

### WebSite with SearchAction (Homepage)
\`\`\`typescript
buildWebSiteWithSearchAction(brand)
\`\`\`
Enables Sitelinks Search Box in Google results.

### TechArticle with isPartOf Chain
\`\`\`typescript
buildTechArticleSchema(article, brand, taxonomyChain)
\`\`\`
Links articles to parent sections/clusters for taxonomy hierarchy.

### VideoObject with SeekToAction
\`\`\`typescript
buildVideoObjectWithSeekAction(article, brand, moments, opts)
\`\`\`
Enables key moment navigation in video search results.

**Key Moments:**
- Extracted from video storyboard scenes
- Includes timestamps and labels
- Enables "Jump to" links in search results

**Existing Schemas:**
- Article/TechArticle
- FAQPage
- BreadcrumbList
- CollectionPage (pillars, sections, clusters)
- Dataset (comparison tables)
- VideoObject

**Sitemaps:**
- `/sitemap.xml` - All pages (articles, taxonomy, videos)
- `/video-sitemap.xml` - Video content with metadata
- `/feed.xml` - RSS/Atom feed with categories

---

## 3. Video Enhancements

### Implementation Status: ✅ Complete

**Files:**
- `src/lib/video/storyboard.ts` - Enhanced with key moment extraction
- `src/lib/video/transcripts.ts` - Free caption generation pipeline
- `src/components/video/ArticleVideoPlayer.tsx` - Full-width player with captions

**New Features:**

### Key Moments (SeekToAction)
\`\`\`typescript
extractKeyMoments(scenes: Scene[]): VideoMoment[]
\`\`\`
Generates seekable timestamps for:
- Introduction
- Key Takeaways
- Statistics
- Comparison
- Pros & Cons
- Expert Reviews
- Deep Dive
- FAQ
- Summary

### Captions/Transcripts
\`\`\`typescript
generateTranscript(article: ArticleDoc, scenes: Scene[]): CaptionCue[]
cuesToVTT(cues: CaptionCue[]): string
\`\`\`
- Best-effort caption generation from scene content
- WebVTT format output
- Supports manual .vtt upload override

### Video Placement
- Positioned below TL;DR, full-width
- 16:9 desktop, 9:16 reel variant available
- Custom thumbnail with play button
- Site name watermark when paused

---

## 4. E-E-A-T Surfaces

### Implementation Status: 🟡 Stubs Created (Needs Content)

**Required Pages:**

### Author Pages
**Route:** `/authors/[slug]/page.tsx`
**Schema:** Person with credentials, bio, authored articles
**Content Needed:**
- Author bio and credentials
- Headshot image
- Social profiles (LinkedIn, Twitter)
- List of authored articles

### Editorial Policy
**Route:** `/editorial-policy/page.tsx`
**Content Needed:**
- Editorial standards
- Fact-checking process
- Source verification
- Conflict of interest policy

### Review Process
**Route:** `/review-process/page.tsx`
**Content Needed:**
- Review methodology
- Testing procedures
- Rating criteria
- Update frequency

**Article Enhancements:**
- "Reviewed by {Author}" in masthead
- "Last reviewed {date}" timestamp
- Source citations in deep-dive content

---

## 5. QC Gates

### Implementation Status: ✅ Complete

**Files:**
- `src/lib/qc/rules.ts` - QC rule definitions and execution
- `src/lib/qc/validators/structured.ts` - JSON-LD validators

**QC Rules (20 total):**

### Taxonomy Integrity ✅
- Article has valid pillar, section, cluster references
- URL matches canonical pattern: `/topics/{pillar}/{section}/{cluster}/{article}`
- Breadcrumbs are resolvable

### Structured Data Valid ✅
- All required JSON-LD properties present
- Article schema complete
- VideoObject schema valid
- FAQPage schema valid
- BreadcrumbList valid

### Originality Check ✅
- Cosine similarity < 0.92 vs existing articles
- Uses text vectorization and similarity scoring

### LSI Coverage ✅
- Deep-dive content covers >= 80% of target cluster terms
- Semantic clusters present
- Keywords properly distributed

### Video Assets ✅
- Poster image present
- Video storyboard can be generated
- Sufficient content for video

### Performance Preflight ✅
- Images have lazy loading
- Hero image optimized
- Preconnect tags for CDN origins
- Third-party scripts deferred

**CI Integration:**
\`\`\`yaml
# .github/workflows/qc.yml
name: QC Checks
on: [pull_request]
jobs:
  qc:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run qc:check
      # Fails PR if any RED (error) rules fail
\`\`\`

---

## 6. Performance Optimizations

### Implementation Status: ✅ Complete

**Optimizations:**
- ✅ Lazy video loading with poster frame
- ✅ Image preconnects for CDN origins
- ✅ Deferred third-party scripts
- ✅ Reserved aspect ratios for CLS prevention
- ✅ INP/LCP guards via web-vitals sampling

**Preconnect Tags:**
\`\`\`html
<link rel="preconnect" href="https://images.cdn.example.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
\`\`\`

**Video Optimization:**
- Poster image shown before playback
- Player pauses when scrolled out of view
- Lazy loading for below-fold videos

---

## 7. IndexNow Integration

### Implementation Status: ✅ Complete

**Files:**
- `src/lib/indexnow.ts` - IndexNow submission implementation

**Features:**
\`\`\`typescript
submitToIndexNow(urls: string[], apiKey?: string)
pingIndexNowOnPublish(articleSlug: string, baseUrl: string)
\`\`\`

**Supported Engines:**
- IndexNow.org (generic)
- Bing
- Yandex (via IndexNow protocol)

**Usage:**
\`\`\`typescript
// On article publish
await pingIndexNowOnPublish(article.slug, process.env.BASE_URL)

// Batch submission
await submitToIndexNow([
  '/articles/new-article',
  '/video/new-video',
  '/sitemap.xml'
])
\`\`\`

**Configuration:**
- Set `INDEXNOW_API_KEY` environment variable
- Or auto-generate key on first use
- Key stored at `/indexnow-key.txt`

---

## 8. Analytics Events

### Implementation Status: 🟡 Tracking Points Identified (Needs Analytics SDK)

**Events to Track:**

### Search Events
\`\`\`typescript
// Search suggest
trackEvent('search_suggest', { query, resultCount })

// Search submit
trackEvent('search_submit', { query, filters, resultCount })

// Search result click
trackEvent('search_click', { query, resultUrl, position })
\`\`\`

### Video Events
\`\`\`typescript
// Video render
trackEvent('video_render', { articleSlug, duration })

// Video play
trackEvent('video_play', { articleSlug, timestamp })

// Video complete
trackEvent('video_complete', { articleSlug, watchTime })

// Video seek
trackEvent('video_seek', { articleSlug, fromTime, toTime })
\`\`\`

### Interlink Events
\`\`\`typescript
// Internal link click
trackEvent('interlink_click', { fromUrl, toUrl, linkText })

// Taxonomy navigation
trackEvent('taxonomy_nav', { pillar, section, cluster })
\`\`\`

### Core Web Vitals
\`\`\`typescript
// LCP (Largest Contentful Paint)
trackEvent('cwv_lcp', { value, rating })

// INP (Interaction to Next Paint)
trackEvent('cwv_inp', { value, rating })

// CLS (Cumulative Layout Shift)
trackEvent('cwv_cls', { value, rating })
\`\`\`

**Integration:**
Add analytics SDK (e.g., Google Analytics 4, Plausible, Vercel Analytics) and implement tracking calls at identified points.

---

## 9. Test Plan

### Search Tests

**Query Tests:**
1. "midsize sedan comparison" → Should return comparison articles
2. "hybrid mileage" → Should return fuel economy content
3. "pros and cons accord" → Should return pros/cons sections
4. "best suv under 30k" → Should return budget SUV guides

**Filter Tests:**
1. Filter by content type (articles only)
2. Filter by pillar (Sedans)
3. Filter by section (Comparisons)
4. Sort by newest/oldest

**Type-ahead Tests:**
1. Type "mid" → Should suggest "midsize sedan"
2. Keyboard navigation (↑/↓ arrows)
3. Enter to select
4. Debounce timing (150-200ms)

### Schema Validation Tests

**Homepage:**
- ✅ WebSite schema with SearchAction
- ✅ Organization schema
- ✅ Logo present

**Pillar Page:**
- ✅ CollectionPage schema
- ✅ ItemList with articles
- ✅ BreadcrumbList

**Section Page:**
- ✅ CollectionPage with isPartOf (pillar)
- ✅ ItemList with clusters

**Cluster Page:**
- ✅ CollectionPage with isPartOf (section)
- ✅ ItemList with articles

**Article Page:**
- ✅ TechArticle schema
- ✅ isPartOf chain (section → cluster)
- ✅ VideoObject with SeekToAction
- ✅ FAQPage (if FAQ block present)
- ✅ BreadcrumbList

### QC Tests

**Intentional Failures:**
1. Create article with duplicate title → RED (error)
2. Create article with similarity > 92% → RED (error)
3. Create article without pillar reference → RED (error)
4. Create article with empty blocks → RED (error)
5. Create article with LSI coverage < 80% → AMBER (warning)

**Fixes:**
1. Change title → GREEN
2. Rewrite content → GREEN
3. Add pillar reference → GREEN
4. Fill blocks → GREEN
5. Add more LSI terms → GREEN

### Video Tests

**Key Moments:**
1. Generate video for article
2. Verify key moments extracted
3. Check SeekToAction in VideoObject schema
4. Test seek functionality in player

**Captions:**
1. Generate transcript from storyboard
2. Verify VTT format
3. Test caption display in player
4. Upload manual .vtt override

---

## 10. Deployment Checklist

### Environment Variables
\`\`\`bash
# Required
BASE_URL=https://your-domain.com
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=your-org
GITHUB_REPO=your-repo
GITHUB_BRANCH=main

# Optional
INDEXNOW_API_KEY=your-key-here
OPENAI_API_KEY=sk-...
\`\`\`

### Pre-Launch
- [ ] Run QC checks on all articles
- [ ] Validate all JSON-LD schemas
- [ ] Test search functionality
- [ ] Verify video generation
- [ ] Check sitemap generation
- [ ] Test IndexNow submission
- [ ] Verify analytics tracking
- [ ] Run performance audit (Lighthouse)
- [ ] Test mobile responsiveness
- [ ] Verify accessibility (WCAG AA)

### Post-Launch
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Enable IndexNow pings on publish
- [ ] Monitor search analytics
- [ ] Track Core Web Vitals
- [ ] Review QC dashboard weekly
- [ ] Update editorial policy as needed

---

## 11. Maintenance

### Weekly Tasks
- Review QC dashboard for warnings
- Check search analytics for popular queries
- Monitor Core Web Vitals trends
- Review failed IndexNow submissions

### Monthly Tasks
- Audit structured data with Google Rich Results Test
- Review and update author bios
- Check for broken internal links
- Update editorial policy if needed
- Analyze search query gaps (missing content)

### Quarterly Tasks
- Full content audit (originality, LSI coverage)
- Performance optimization review
- Schema markup updates for new Google features
- Competitor analysis for search visibility

---

## 12. Known Limitations & Future Enhancements

### Current Limitations
- **Embeddings**: BM25 only, no semantic search (can add pgvector adapter)
- **Analytics**: Tracking points identified but SDK integration needed
- **E-E-A-T Pages**: Stubs created, content needed
- **Captions**: Best-effort generation, manual upload recommended for accuracy

### Future Enhancements
- Add pgvector for semantic search
- Implement real-time search suggestions
- Add search analytics dashboard
- Create author management UI
- Build QC dashboard in admin panel
- Add automated content freshness checks
- Implement A/B testing for search ranking
- Add search query autocorrect/suggestions

---

## 13. Support & Troubleshooting

### Search Not Working
1. Check if search index is built: `searchStore.getStats()`
2. Verify API endpoint: `curl /api/search?q=test`
3. Check browser console for errors
4. Rebuild search index: `searchStore.rebuild()`

### Video Not Generating
1. Check article has sufficient content
2. Verify storyboard builds: `buildStoryboard(article, brand)`
3. Check for missing images/data
4. Review QC video-assets rule

### Schema Validation Failing
1. Use Google Rich Results Test
2. Check required fields in validators
3. Verify taxonomy references
4. Review JSON-LD output in page source

### IndexNow Not Submitting
1. Check `INDEXNOW_API_KEY` is set
2. Verify `BASE_URL` is correct
3. Check network logs for API errors
4. Ensure `/indexnow-key.txt` is accessible

---

## Summary

Automata-2 is now production-hardened with:
- ✅ Instant search with type-ahead and SSR results
- ✅ Comprehensive SEO schemas (SearchAction, SeekToAction, isPartOf chains)
- ✅ Enhanced video with key moments and captions
- ✅ QC gates for quality assurance (20 rules)
- ✅ Performance optimizations (lazy loading, preconnect, CLS prevention)
- ✅ IndexNow integration for instant indexing
- 🟡 E-E-A-T surfaces (stubs created, content needed)
- 🟡 Analytics tracking (points identified, SDK integration needed)

**Next Steps:**
1. Add content to E-E-A-T pages (authors, editorial policy, review process)
2. Integrate analytics SDK and implement tracking
3. Run full QC audit on existing articles
4. Submit sitemaps to search engines
5. Enable IndexNow on publish workflow
