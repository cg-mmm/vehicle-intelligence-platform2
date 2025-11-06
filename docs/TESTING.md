# Testing Guide

## Overview

Automata-2 includes comprehensive testing at multiple levels to ensure production readiness.

## Test Types

### 1. Smoke Tests

Quick validation of critical functionality before deployment.

\`\`\`bash
npm run test:smoke
\`\`\`

**What it tests:**
- Brand configuration validity
- Taxonomy structure completeness
- Article data integrity
- Comparison table validation
- FAQ block validation
- Chart data extraction
- JSON-LD schema validity
- SEO metadata completeness
- Table of contents generation
- Enhancement structure validation
- Accessibility (alt text)
- Performance (bundle size)

**When to run:**
- Before every deployment
- After major data changes
- As part of CI/CD pipeline

### 2. Unit Tests

Component and utility function tests using Vitest.

\`\`\`bash
npm run test          # Run once
npm run test:watch    # Watch mode
\`\`\`

### 3. End-to-End Tests

Full user flow testing with Playwright.

\`\`\`bash
npm run test:e2e           # Headless mode
npm run test:e2e:ui        # Interactive UI
npm run test:e2e:headed    # See browser
\`\`\`

### 4. Run All Tests

\`\`\`bash
npm run test:all
\`\`\`

## Writing Tests

### Smoke Test Example

\`\`\`typescript
test("Articles have required fields", async () => {
  const articles = await getAllArticles()
  assert(articles.length > 0, "Must have at least one article")

  articles.forEach((article) => {
    assert(article.slug.length > 0, `Article must have a slug`)
    assert(article.title.length > 0, `Article ${article.slug} must have a title`)
  })
})
\`\`\`

### Unit Test Example

\`\`\`typescript
import { describe, it, expect } from 'vitest'
import { normalizeToScale } from '@/src/lib/visual/charts'

describe('normalizeToScale', () => {
  it('normalizes values to 0-100 scale', () => {
    const { normalized } = normalizeToScale([10, 20, 30])
    expect(normalized).toEqual([0, 50, 100])
  })
})
\`\`\`

### E2E Test Example

\`\`\`typescript
import { test, expect } from '@playwright/test'

test('article page loads and displays content', async ({ page }) => {
  await page.goto('/topics/vehicles/sedans/midsize/accord-vs-camry')
  
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('[data-testid="comparison-table"]')).toBeVisible()
})
\`\`\`

## CI/CD Integration

Add to your CI pipeline:

\`\`\`yaml
- name: Run smoke tests
  run: npm run test:smoke

- name: Run unit tests
  run: npm run test

- name: Run E2E tests
  run: npm run test:e2e
\`\`\`

## Test Coverage Goals

- **Smoke Tests**: 100% of critical paths
- **Unit Tests**: 80%+ code coverage
- **E2E Tests**: All major user flows

## Debugging Failed Tests

1. **Smoke Tests**: Check console output for specific assertion failures
2. **Unit Tests**: Use `test.only()` to isolate failing tests
3. **E2E Tests**: Use `--headed` or `--ui` flags to see what's happening

## Performance Benchmarks

Smoke tests should complete in under 5 seconds. If they take longer:
- Check for unnecessary async operations
- Optimize data loading
- Consider parallelization
