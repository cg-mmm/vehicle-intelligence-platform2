# Automata-2 System Integration Guide for Cursor AI

## 🎯 Executive Summary

**Automata-2** is a production-ready AI-powered vehicle intelligence platform that generates rich, data-driven comparison articles using OpenAI. The system features a complete design system (Space Gray theme), interactive components, GitHub publishing, and a comprehensive content management architecture.

**Current Status**: ✅ Frontend Complete | ⚠️ Backend Wiring Needed

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [What's Complete](#whats-complete)
3. [What Needs Wiring](#what-needs-wiring)
4. [Environment Setup](#environment-setup)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Integration Checklist](#integration-checklist)

---

## 🏗️ System Architecture

### Technology Stack

- **Framework**: Next.js 15.1.6 (App Router)
- **Runtime**: React 19.0.0
- **Styling**: Tailwind CSS v4.1.9 + Custom Design System
- **UI Components**: Radix UI + shadcn/ui
- **AI**: OpenAI GPT-4o-mini
- **Storage**: GitHub (content) + In-memory (runtime)
- **Animations**: Framer Motion + tw-animate-css
- **Video**: Remotion (article video generation)
- **Testing**: Vitest + Playwright

### Directory Structure

\`\`\`
automata-2/
├── app/                          # Next.js App Router
│   ├── (about)/                  # About pages group
│   ├── admin/                    # Admin interfaces
│   │   ├── generate/             # Article generation UI
│   │   ├── jobs/                 # Background jobs UI
│   │   ├── roadmap/              # Roadmap board
│   │   ├── templates/            # Template management
│   │   └── schema-debug/         # Schema debugging
│   ├── api/                      # API routes
│   │   ├── ai/generate-modules/  # AI content generation
│   │   ├── articles/             # Articles CRUD
│   │   ├── datasets/             # Dataset exports
│   │   ├── draft/                # Draft management
│   │   ├── og/                   # OpenGraph images
│   │   ├── qc/                   # Quality control
│   │   └── video/                # Video rendering
│   ├── articles/                 # Article pages
│   │   └── [slug]/               # Dynamic article routes
│   ├── search/                   # Search interface
│   ├── topics/                   # Taxonomy-based navigation
│   │   └── [pillar]/[section]/[cluster]/[article]/
│   ├── video/                    # Video pages
│   │   ├── [slug]/               # Video player
│   │   └── embed/[slug]/         # Embeddable player
│   ├── globals.css               # 🎨 DESIGN SYSTEM (single source of truth)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
│
├── src/
│   ├── components/
│   │   ├── blocks/               # Content blocks (ComparisonTable, SpecGrid, etc.)
│   │   ├── layout/               # Layout components (MegaNav, Footer, StickyRail)
│   │   ├── modules/              # Interactive modules (TLDR, Quiz, Calculator)
│   │   ├── visual/               # Visual effects (LiquidBlobs, GradientRibbon)
│   │   ├── home/                 # Homepage components
│   │   ├── article/              # Article-specific components
│   │   ├── admin/                # Admin UI components
│   │   ├── seo/                  # SEO components
│   │   └── ArticleView.tsx       # Main article renderer
│   │
│   ├── lib/
│   │   ├── contracts.ts          # TypeScript interfaces
│   │   ├── articleSchema.ts      # Zod validation schemas
│   │   ├── seo/                  # SEO utilities (meta tags, JSON-LD)
│   │   ├── home/                 # Homepage data logic
│   │   └── search/               # Search indexing
│   │
│   ├── styles/
│   │   ├── css-vars.css          # Legacy CSS variables (references globals.css)
│   │   ├── theme.css             # Theme utilities
│   │   └── liquid-neon.css       # Animation color pairs
│   │
│   └── design/
│       └── system/
│           └── tokens.ts         # Design tokens (references CSS variables)
│
├── lib/                          # Core business logic
│   ├── storage.tsx               # Article storage (GitHub + in-memory)
│   ├── taxonomy.ts               # Content taxonomy (pillars/sections/clusters)
│   ├── siteConfig.ts             # Multi-tenant configuration
│   ├── domainTenant.ts           # Domain-based tenant routing
│   ├── openai-generator.tsx      # OpenAI content generation
│   ├── publish.ts                # GitHub publishing
│   └── packs/                    # Brand & content packs
│       ├── brand.ts              # Brand configuration
│       └── content.ts            # Content templates
│
├── content/                      # Content storage
│   ├── articles/                 # Published articles (JSON)
│   └── taxonomy.json             # Content taxonomy structure
│
├── components/                   # Enhanced UI components
│   └── ui/                       # shadcn/ui components
│
├── remotion/                     # Video generation
│   ├── ArticleVideoReel.tsx      # Main video composition
│   ├── scenes/                   # Video scenes
│   └── Primitives.tsx            # Video primitives
│
├── scripts/                      # Utility scripts
│   ├── smoke-test.ts             # System smoke tests
│   └── a11y-contrast.mjs         # Accessibility checker
│
└── docs/                         # Documentation
    ├── DESIGN_SYSTEM.md          # Design system guide
    ├── THEME_QUICK_START.md      # Theme customization
    ├── TESTING.md                # Testing guide
    └── PRODUCTION_HARDENING.md   # Production checklist
\`\`\`

---

## ✅ What's Complete

### 1. Design System (100% Complete)

**Location**: `app/globals.css` (single source of truth)

- ✅ **Space Gray Theme**: Professional dark theme with Aurora Green/Deep Violet accents
- ✅ **Centralized Color Tokens**: All colors defined in one place
- ✅ **Semantic Design Tokens**: `--bg`, `--fg`, `--primary`, `--secondary`, `--accent`, etc.
- ✅ **HSL Color Variables**: For gradient blobs and animations
- ✅ **Responsive Typography**: Geist Sans + Geist Mono fonts
- ✅ **Accessibility**: WCAG AA compliant contrast ratios
- ✅ **Dark Mode**: Full dark mode support
- ✅ **Animation System**: Liquid neon gradients, animated blobs, smooth transitions

**How to Change Theme**: Edit the `:root` section in `app/globals.css` - all components automatically inherit changes.

### 2. Frontend Components (100% Complete)

#### Layout Components
- ✅ **MegaNav**: Multi-level navigation with taxonomy integration
- ✅ **Footer**: Site footer with links and branding
- ✅ **StickyRail**: Sticky sidebar with table of contents
- ✅ **FluidHero**: Animated hero section with gradient blobs

#### Content Blocks
- ✅ **ComparisonTable**: Sortable comparison tables with highlighting
- ✅ **SpecGrid**: Specification cards in grid layout
- ✅ **ProsCons**: Pros and cons lists
- ✅ **Gallery**: Image galleries with lightbox
- ✅ **MarkdownBlock**: Rich markdown rendering
- ✅ **CTABanner**: Call-to-action banners
- ✅ **ChartsBlock**: Recharts integration with theme colors
- ✅ **LsiLongform**: Long-form SEO content blocks
- ✅ **FuelEconomy**: Fuel economy comparison widget

#### Interactive Modules
- ✅ **TLDR**: Summary cards with animated backgrounds
- ✅ **Quiz**: Interactive quizzes with scoring
- ✅ **MPGCalculator**: Fuel cost calculator
- ✅ **Reviews**: Aggregated expert reviews
- ✅ **FAQ**: Collapsible FAQ sections
- ✅ **Dropdown**: Expandable content sections

#### Visual Effects
- ✅ **LiquidBlobs**: Animated gradient blobs (7 variants)
- ✅ **LiquidWindBackground**: SVG turbulence animations
- ✅ **GradientRibbon**: Animated gradient ribbons
- ✅ **StockArt**: Placeholder art generation

### 3. Content Management (90% Complete)

- ✅ **Article Schema**: Comprehensive Zod schema with validation
- ✅ **Taxonomy System**: Pillars → Sections → Clusters → Articles
- ✅ **In-Memory Storage**: Fast runtime article storage
- ✅ **GitHub Integration**: Load articles from GitHub repository
- ✅ **Mock Data**: Complete example articles with all features
- ⚠️ **GitHub Publishing**: Needs environment variables configured

### 4. SEO & Metadata (100% Complete)

- ✅ **Meta Tags**: OpenGraph, Twitter Cards, canonical URLs
- ✅ **JSON-LD Schema**: Article, BreadcrumbList, WebSite schemas
- ✅ **Sitemap Generation**: Dynamic XML sitemaps
- ✅ **RSS Feeds**: Article and video feeds
- ✅ **OpenGraph Images**: Dynamic OG image generation

### 5. Admin Interfaces (80% Complete)

- ✅ **Article Generator**: AI-powered article generation UI
- ✅ **Template Manager**: Content template management
- ✅ **Roadmap Board**: Feature roadmap Kanban board
- ✅ **Jobs Dashboard**: Background job monitoring
- ✅ **Schema Debugger**: Article schema validation tool
- ⚠️ **Publishing Flow**: Needs GitHub credentials

### 6. Testing Infrastructure (100% Complete)

- ✅ **Smoke Tests**: System integration tests (`npm run test:smoke`)
- ✅ **Unit Tests**: Vitest configuration (`npm test`)
- ✅ **E2E Tests**: Playwright tests (`npm run test:e2e`)
- ✅ **Accessibility Tests**: Contrast checker (`npm run design:a11y`)

---

## ⚠️ What Needs Wiring in Cursor AI

### 1. Environment Variables (CRITICAL)

**File to Create**: `.env.local`

\`\`\`env
# ========================================
# REQUIRED FOR BASIC FUNCTIONALITY
# ========================================

# OpenAI API (for article generation)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Base URL (for absolute URLs in metadata)
BASE_URL=http://localhost:3000

# ========================================
# REQUIRED FOR GITHUB PUBLISHING
# ========================================

# GitHub Personal Access Token (needs 'repo' scope)
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=your-github-username
GITHUB_REPO=automata-2
GITHUB_BRANCH=main
GITHUB_RAW_BASE=https://raw.githubusercontent.com/your-username/automata-2/main

# ========================================
# OPTIONAL FEATURES
# ========================================

# Admin Publishing (set to any value to enable browser-based OpenAI calls)
ALLOW_BROWSER_OPENAI=true

# Admin Publish Key (for secure publishing)
ADMIN_PUBLISH_KEY=your-secret-key
\`\`\`

**Where to Get Keys**:
- **OPENAI_API_KEY**: https://platform.openai.com/api-keys
- **GITHUB_TOKEN**: https://github.com/settings/tokens (needs `repo` scope)

### 2. GitHub Repository Setup

**What Needs to Be Done**:

1. **Create Content Directories**:
   \`\`\`bash
   mkdir -p content/articles
   mkdir -p content/taxonomy
   \`\`\`

2. **Initialize Taxonomy File**:
   \`\`\`bash
   cp content/taxonomy.json content/taxonomy.json.backup
   \`\`\`

3. **Configure GitHub Actions** (optional, for automated publishing):
   - Create `.github/workflows/publish.yml`
   - Add workflow for automated article publishing

### 3. Database Integration (OPTIONAL)

**Current State**: System uses in-memory storage + GitHub for persistence.

**If You Want Database Storage**:

1. **Choose Database**: PostgreSQL, MySQL, or MongoDB
2. **Create Schema**:
   \`\`\`sql
   CREATE TABLE articles (
     id UUID PRIMARY KEY,
     slug VARCHAR(255) UNIQUE NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     content JSONB NOT NULL,
     pillar_id VARCHAR(255),
     section_id VARCHAR(255),
     cluster_id VARCHAR(255),
     published_at TIMESTAMP,
     updated_at TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE taxonomy (
     id UUID PRIMARY KEY,
     type VARCHAR(50) NOT NULL, -- 'pillar', 'section', 'cluster'
     slug VARCHAR(255) UNIQUE NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     parent_id UUID REFERENCES taxonomy(id),
     metadata JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE INDEX idx_articles_slug ON articles(slug);
   CREATE INDEX idx_articles_pillar ON articles(pillar_id);
   CREATE INDEX idx_taxonomy_type ON taxonomy(type);
   CREATE INDEX idx_taxonomy_slug ON taxonomy(slug);
   \`\`\`

3. **Update Storage Layer**:
   - Modify `lib/storage.tsx` to use database instead of in-memory Map
   - Add database connection pooling
   - Implement caching layer (Redis recommended)

### 4. API Route Wiring

**Files That Need Environment Variables**:

| File | Needs | Purpose |
|------|-------|---------|
| `app/api/ai/generate-modules/route.ts` | `OPENAI_API_KEY` | AI content generation |
| `app/api/articles/route.ts` | None | List articles (works) |
| `app/api/articles/[slug]/route.ts` | None | Get article (works) |
| `app/api/draft/route.ts` | None | Draft management (works) |
| `app/api/qc/route.ts` | None | Quality control (works) |
| `app/api/video/render/route.ts` | `GITHUB_TOKEN` | Video rendering |
| `app/api/og/article/[slug]/route.tsx` | None | OG images (works) |

**What Works Without Setup**:
- ✅ Article listing (`/api/articles`)
- ✅ Article retrieval (`/api/articles/[slug]`)
- ✅ Draft management (`/api/draft`)
- ✅ Quality control checks (`/api/qc`)
- ✅ OpenGraph image generation (`/api/og/article/[slug]`)

**What Needs Environment Variables**:
- ⚠️ AI content generation (needs `OPENAI_API_KEY`)
- ⚠️ GitHub publishing (needs `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`)
- ⚠️ Video rendering (needs `GITHUB_TOKEN` for loading articles)

### 5. Content Migration

**If You Have Existing Content**:

1. **Convert to JSON Format**:
   \`\`\`typescript
   // Use the ArticleDoc interface from src/lib/contracts.ts
   import type { ArticleDoc } from '@/src/lib/contracts'
   
   const article: ArticleDoc = {
     title: "Your Article Title",
     slug: "your-article-slug",
     description: "Article description",
     // ... see src/lib/contracts.ts for full schema
   }
   \`\`\`

2. **Validate Against Schema**:
   \`\`\`bash
   npm run test:smoke
   \`\`\`

3. **Publish to GitHub**:
   - Use admin interface at `/admin/generate`
   - Or manually commit to `content/articles/[slug].json`

### 6. Multi-Tenant Setup (OPTIONAL)

**Current State**: System supports multi-tenant architecture via `lib/domainTenant.ts`

**To Enable Multiple Brands**:

1. **Create Brand Packs**:
   \`\`\`typescript
   // lib/packs/brand.ts
   export const brands = {
     'vehicle-intel': { /* brand config */ },
     'auto-compare': { /* brand config */ },
   }
   \`\`\`

2. **Configure Domain Mapping**:
   \`\`\`typescript
   // lib/domainTenant.ts
   const tenantMap = {
     'vehicleintel.com': 'vehicle-intel',
     'autocompare.com': 'auto-compare',
   }
   \`\`\`

3. **Deploy with Custom Domains** in Vercel

---

## 🔧 Environment Setup

### Local Development

1. **Clone Repository**:
   \`\`\`bash
   git clone https://github.com/your-username/automata-2.git
   cd automata-2
   \`\`\`

2. **Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Create Environment File**:
   \`\`\`bash
   cp .env.local.example .env.local
   # Edit .env.local with your keys
   \`\`\`

4. **Run Development Server**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open Browser**:
   \`\`\`
   http://localhost:3000
   \`\`\`

### Production Deployment (Vercel)

1. **Push to GitHub**:
   \`\`\`bash
   git push origin main
   \`\`\`

2. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Make sure to add them for Production, Preview, and Development

4. **Deploy**:
   - Vercel will automatically deploy on push
   - Or click "Deploy" button in dashboard

---

## 📊 Database Schema (If Using Database)

### Articles Table

\`\`\`sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Taxonomy
  pillar_id VARCHAR(255),
  section_id VARCHAR(255),
  cluster_id VARCHAR(255),
  page_type VARCHAR(50), -- 'cluster', 'pillar', 'section'
  
  -- Content (stored as JSONB for flexibility)
  content JSONB NOT NULL,
  
  -- Hero
  hero_eyebrow VARCHAR(255),
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  hero_image_alt TEXT,
  
  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  seo_canonical TEXT,
  seo_og_image TEXT,
  
  -- Metadata
  published_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) STORED
);

-- Indexes
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_pillar ON articles(pillar_id);
CREATE INDEX idx_articles_section ON articles(section_id);
CREATE INDEX idx_articles_cluster ON articles(cluster_id);
CREATE INDEX idx_articles_published ON articles(published_at DESC);
CREATE INDEX idx_articles_search ON articles USING GIN(search_vector);
\`\`\`

### Taxonomy Table

\`\`\`sql
CREATE TABLE taxonomy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'pillar', 'section', 'cluster'
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Hierarchy
  parent_id UUID REFERENCES taxonomy(id),
  pillar_id UUID REFERENCES taxonomy(id),
  
  -- Display
  icon VARCHAR(255),
  cover_image TEXT,
  nav_weight INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_taxonomy_type ON taxonomy(type);
CREATE INDEX idx_taxonomy_slug ON taxonomy(slug);
CREATE INDEX idx_taxonomy_parent ON taxonomy(parent_id);
CREATE INDEX idx_taxonomy_pillar ON taxonomy(pillar_id);
\`\`\`

---

## 🔌 API Endpoints

### Public APIs (No Auth Required)

| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/api/articles` | GET | List all articles | ✅ Working |
| `/api/articles/[slug]` | GET | Get article by slug | ✅ Working |
| `/api/draft` | GET | Get draft article | ✅ Working |
| `/api/qc` | GET | Quality control checks | ✅ Working |
| `/api/og/article/[slug]` | GET | Generate OG image | ✅ Working |
| `/api/datasets/[slug]` | GET | Export article data | ✅ Working |

### Admin APIs (Needs Auth/Env Vars)

| Endpoint | Method | Description | Needs |
|----------|--------|-------------|-------|
| `/api/ai/generate-modules` | POST | Generate article content | `OPENAI_API_KEY` |
| `/api/video/render` | POST | Render article video | `GITHUB_TOKEN` |
| `/api/video/download/[slug]` | GET | Download video | `GITHUB_TOKEN` |

### API Response Formats

**List Articles**:
\`\`\`json
GET /api/articles

{
  "articles": [
    {
      "slug": "2026-midsize-sedan-comparison",
      "title": "2026 Midsize Sedan Comparison",
      "description": "...",
      "pillar": { "slug": "sedans", "title": "Sedans" },
      "cluster": { "slug": "midsize-sedans", "title": "Midsize Sedans" },
      "publishedAt": "2026-01-15T10:00:00Z"
    }
  ]
}
\`\`\`

**Get Article**:
\`\`\`json
GET /api/articles/2026-midsize-sedan-comparison

{
  "title": "2026 Midsize Sedan Comparison",
  "slug": "2026-midsize-sedan-comparison",
  "description": "...",
  "hero": { ... },
  "blocks": [ ... ],
  "enhancements": { ... },
  "seo": { ... }
}
\`\`\`

---

## ✅ Integration Checklist

### Phase 1: Basic Setup (Required)

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Create `.env.local` file
- [ ] Add `OPENAI_API_KEY`
- [ ] Add `BASE_URL`
- [ ] Run development server (`npm run dev`)
- [ ] Verify homepage loads at `http://localhost:3000`
- [ ] Verify article pages load at `/articles/[slug]`

### Phase 2: GitHub Integration (For Publishing)

- [ ] Create GitHub personal access token (with `repo` scope)
- [ ] Add `GITHUB_TOKEN` to `.env.local`
- [ ] Add `GITHUB_OWNER` to `.env.local`
- [ ] Add `GITHUB_REPO` to `.env.local`
- [ ] Add `GITHUB_BRANCH` to `.env.local`
- [ ] Add `GITHUB_RAW_BASE` to `.env.local`
- [ ] Create `content/articles/` directory in repository
- [ ] Test publishing from `/admin/generate`

### Phase 3: Production Deployment (Vercel)

- [ ] Push code to GitHub
- [ ] Import project to Vercel
- [ ] Add all environment variables in Vercel dashboard
- [ ] Deploy to production
- [ ] Verify production URL works
- [ ] Test article generation in production
- [ ] Test article publishing in production

### Phase 4: Optional Enhancements

- [ ] Set up database (PostgreSQL/MySQL/MongoDB)
- [ ] Migrate storage layer to database
- [ ] Add Redis caching layer
- [ ] Configure custom domain
- [ ] Set up multi-tenant brands
- [ ] Add analytics (Vercel Analytics already included)
- [ ] Configure GitHub Actions for CI/CD
- [ ] Set up monitoring (Sentry, LogRocket, etc.)

---

## 🎨 Design System Quick Reference

### Changing Colors

**File**: `app/globals.css`

**Current Theme**: Space Gray with Aurora Green/Deep Violet accents

\`\`\`css
:root {
  /* Brand gradient */
  --brand-gradient-start: #232526; /* Space Gray */
  --brand-gradient-end: #414345;   /* Cosmic Graphite */
  
  /* Core surfaces */
  --bg: #0d0d0d;           /* Very dark background */
  --surface: #1a1a1a;      /* Dark surface */
  --surface-2: #242424;    /* Slightly lighter surface */
  --muted: #2e2e2e;        /* Subtle borders/fills */
  
  /* Text */
  --fg: #e0e0e0;           /* Light gray text */
  --fg-muted: #9e9e9e;     /* Muted gray text */
  
  /* Actions */
  --primary: #5ab963;      /* Aurora Green */
  --secondary: #7f00ff;    /* Deep Violet */
  --accent: #5ab963;       /* Aurora Green accent */
  
  /* HSL versions for gradients */
  --primary-hsl: 125 40% 54%;
  --secondary-hsl: 270 100% 50%;
  --accent-hsl: 125 40% 54%;
}
\`\`\`

**To Change Theme**: Edit these values and the entire site updates automatically!

### Example Themes

See `docs/THEME_QUICK_START.md` for pre-made themes:
- Quantum Flux (Sci-Fi Corporate)
- Carbon Circuit (Tech Industrial)
- Racing Performance (Hot & Energetic)
- Space Gray (Current)

---

## 🐛 Troubleshooting

### Common Issues

**1. "Module not found" errors**:
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

**2. "OpenAI API error"**:
- Check `OPENAI_API_KEY` is set correctly
- Verify you have API credits
- Check OpenAI API status: https://status.openai.com

**3. "GitHub publishing fails"**:
- Verify `GITHUB_TOKEN` has `repo` scope
- Check `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Ensure `content/articles/` directory exists in repo

**4. "Articles not loading"**:
- Check `GITHUB_RAW_BASE` is set correctly
- Verify articles exist in `content/articles/` directory
- Check browser console for errors

**5. "Build errors in production"**:
\`\`\`bash
npm run build
# Fix any TypeScript errors
# Then redeploy
\`\`\`

### Debug Mode

Enable debug logging:
\`\`\`typescript
// Add to any component
console.log('[v0] Debug info:', data)
\`\`\`

View logs in browser console or Vercel deployment logs.

---

## 📚 Additional Resources

- **Design System**: `docs/DESIGN_SYSTEM.md`
- **Theme Guide**: `docs/THEME_QUICK_START.md`
- **Testing Guide**: `docs/TESTING.md`
- **Production Checklist**: `docs/PRODUCTION_HARDENING.md`
- **API Documentation**: `README.md`

---

## 🎯 Next Steps for Cursor AI

1. **Set up environment variables** (`.env.local`)
2. **Test local development** (`npm run dev`)
3. **Configure GitHub integration** (if publishing needed)
4. **Deploy to Vercel** (production)
5. **Optional: Set up database** (if needed)
6. **Optional: Configure multi-tenant** (if needed)

---

## 💡 Pro Tips

1. **Start Simple**: Get basic functionality working first (homepage, article pages)
2. **Test Incrementally**: Test each integration step before moving to the next
3. **Use Mock Data**: System includes complete mock articles for testing
4. **Check Logs**: Always check browser console and Vercel logs for errors
5. **Read Docs**: Comprehensive documentation in `docs/` directory

---

## 🤝 Support

If you encounter issues:
1. Check this guide first
2. Review error messages in console/logs
3. Check `docs/` directory for specific guides
4. Review `README.md` for API documentation

---

**Last Updated**: 2026-01-30
**System Version**: 0.1.0
**Status**: Production Ready (Frontend) | Wiring Needed (Backend)
