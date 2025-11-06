import { test, expect } from "@playwright/test"

test.describe("Smoke Tests", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Automata/)
    await expect(page.locator("h1")).toBeVisible()
  })

  test("article page has JSON-LD schema", async ({ page }) => {
    await page.goto("/topics/sedans/comparisons/midsize-sedans/2026-midsize-sedan-comparison")

    const jsonLdScript = page.locator('script[type="application/ld+json"]')
    await expect(jsonLdScript).toBeAttached()

    const jsonLdContent = await jsonLdScript.textContent()
    expect(jsonLdContent).toBeTruthy()

    const schemas = JSON.parse(jsonLdContent!)
    expect(Array.isArray(schemas)).toBe(true)
    expect(schemas.length).toBeGreaterThan(0)

    const hasArticleSchema = schemas.some((s: any) => s["@type"] === "Article")
    expect(hasArticleSchema).toBe(true)
  })

  test("search page has noindex robots meta", async ({ page }) => {
    await page.goto("/search?q=camry")

    const robotsMeta = page.locator('meta[name="robots"]')
    const content = await robotsMeta.getAttribute("content")

    expect(content).toContain("noindex")
    expect(content).toContain("follow")
  })

  test("video page loads with timestamp parameter", async ({ page }) => {
    await page.goto("/video/2026-midsize-sedan-comparison?t=30")

    await expect(page.locator("video, [data-video-player]")).toBeVisible({ timeout: 10000 })
  })

  test("dataset download returns CSV", async ({ page, request }) => {
    const response = await request.get("/api/datasets/2026-midsize-sedan-comparison?format=csv")

    expect(response.ok()).toBe(true)
    expect(response.headers()["content-type"]).toContain("text/csv")

    const body = await response.text()
    expect(body).toContain("Metric")
    expect(body.length).toBeGreaterThan(0)
  })

  test("OG image endpoint returns 200", async ({ request }) => {
    const response = await request.get("/api/og/article/2026-midsize-sedan-comparison")

    expect(response.ok()).toBe(true)
    expect(response.headers()["content-type"]).toContain("image")
  })

  test("sitemap index exists", async ({ request }) => {
    const response = await request.get("/sitemap_index.xml")

    expect(response.ok()).toBe(true)
    expect(response.headers()["content-type"]).toContain("xml")

    const body = await response.text()
    expect(body).toContain("<sitemapindex")
    expect(body).toContain("sitemap.xml")
    expect(body).toContain("video-sitemap.xml")
  })

  test("security headers are present", async ({ request }) => {
    const response = await request.get("/")

    expect(response.headers()["strict-transport-security"]).toBeTruthy()
    expect(response.headers()["x-content-type-options"]).toBe("nosniff")
    expect(response.headers()["x-frame-options"]).toBe("SAMEORIGIN")
  })

  test("canonical URL strips tracking parameters", async ({ page }) => {
    await page.goto("/topics/sedans/comparisons/midsize-sedans/2026-midsize-sedan-comparison?utm_source=test")

    const canonical = page.locator('link[rel="canonical"]')
    const href = await canonical.getAttribute("href")

    expect(href).toBeTruthy()
    expect(href).not.toContain("utm_source")
  })
})
