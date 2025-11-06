import { getAllArticles } from "@/lib/storage"
import { getPillars, getSections, getClusters } from "@/lib/taxonomy"
import { getBrand } from "@/lib/siteConfig"
import { buildArticleSchema, buildDatasetSchema } from "@/lib/seo/jsonld"
import { hasChartData } from "@/lib/visual/charts"

interface TestResult {
  name: string
  passed: boolean
  message: string
  duration: number
}

const results: TestResult[] = []

function test(name: string, fn: () => void | Promise<void>) {
  return async () => {
    const start = Date.now()
    try {
      await fn()
      const duration = Date.now() - start
      results.push({ name, passed: true, message: "✓ Passed", duration })
      console.log(`✓ ${name} (${duration}ms)`)
    } catch (error) {
      const duration = Date.now() - start
      const message = error instanceof Error ? error.message : String(error)
      results.push({ name, passed: false, message: `✗ Failed: ${message}`, duration })
      console.error(`✗ ${name} (${duration}ms)`)
      console.error(`  Error: ${message}`)
    }
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

// Test Suite
const tests = [
  test("Brand configuration is valid", () => {
    const brand = getBrand()
    assert(brand.siteName.length > 0, "Site name must not be empty")
    assert(brand.siteUrl.startsWith("http"), "Site URL must be a valid URL")
    assert(brand.organization.name.length > 0, "Organization name must not be empty")
    assert(brand.author.name.length > 0, "Author name must not be empty")
  }),

  test("Taxonomy structure is complete", () => {
    const pillars = getPillars()
    assert(pillars.length > 0, "Must have at least one pillar")

    pillars.forEach((pillar) => {
      const sections = getSections(pillar.id)
      assert(sections.length > 0, `Pillar ${pillar.title} must have at least one section`)

      sections.forEach((section) => {
        const clusters = getClusters(section.id)
        assert(clusters.length > 0, `Section ${section.title} must have at least one cluster`)
      })
    })
  }),

  test("Articles have required fields", async () => {
    const articles = await getAllArticles()
    assert(articles.length > 0, "Must have at least one article")

    articles.forEach((article) => {
      assert(article.slug.length > 0, `Article must have a slug`)
      assert(article.title.length > 0, `Article ${article.slug} must have a title`)
      assert(article.description.length > 0, `Article ${article.slug} must have a description`)
      assert(article.hero.title.length > 0, `Article ${article.slug} must have a hero title`)
      assert(article.blocks.length > 0, `Article ${article.slug} must have at least one block`)
    })
  }),

  test("Articles have valid comparison tables", async () => {
    const articles = await getAllArticles()
    const articlesWithTables = articles.filter((a) =>
      a.blocks.some((b) => b.type === "comparisonTable" || b.type === "specGrid"),
    )

    assert(articlesWithTables.length > 0, "Must have at least one article with comparison data")

    articlesWithTables.forEach((article) => {
      const comparisonBlock = article.blocks.find((b) => b.type === "comparisonTable")
      if (comparisonBlock && comparisonBlock.type === "comparisonTable") {
        assert(comparisonBlock.columns.length >= 2, `Article ${article.slug} comparison must have at least 2 columns`)
        assert(comparisonBlock.rows.length >= 1, `Article ${article.slug} comparison must have at least 1 row`)

        // Validate data consistency
        comparisonBlock.rows.forEach((row, index) => {
          const keys = Object.keys(row)
          assert(
            keys.length === comparisonBlock.columns.length,
            `Article ${article.slug} row ${index} must have data for all columns`,
          )
        })
      }
    })
  }),

  test("Articles have valid FAQ blocks", async () => {
    const articles = await getAllArticles()
    const articlesWithFAQ = articles.filter((a) => a.blocks.some((b) => b.type === "faq"))

    articlesWithFAQ.forEach((article) => {
      const faqBlock = article.blocks.find((b) => b.type === "faq")
      if (faqBlock && faqBlock.type === "faq") {
        assert(faqBlock.items.length >= 3, `Article ${article.slug} FAQ must have at least 3 items`)

        faqBlock.items.forEach((item, index) => {
          assert(item.q.length > 0, `Article ${article.slug} FAQ item ${index} must have a question`)
          assert(item.a.length > 0, `Article ${article.slug} FAQ item ${index} must have an answer`)
          assert(item.q.endsWith("?"), `Article ${article.slug} FAQ item ${index} question must end with ?`)
        })
      }
    })
  }),

  test("Chart data extraction works", async () => {
    const articles = await getAllArticles()
    const articlesWithCharts = articles.filter((a) => hasChartData(a))

    console.log(`  Found ${articlesWithCharts.length} articles with chart data`)

    articlesWithCharts.forEach((article) => {
      console.log(`  - ${article.slug} has chart data`)
    })
  }),

  test("JSON-LD schemas are valid", async () => {
    const articles = await getAllArticles()
    const brand = getBrand()

    articles.forEach((article) => {
      const schema = buildArticleSchema(article, brand)

      assert(schema["@context"] === "https://schema.org", `Article ${article.slug} schema must have @context`)
      assert(schema["@type"] === "Article", `Article ${article.slug} schema must have @type`)
      assert(schema.headline === article.title, `Article ${article.slug} schema headline must match title`)
      assert(schema.description === article.description, `Article ${article.slug} schema description must match`)
      assert(schema.author, `Article ${article.slug} schema must have author`)
      assert(schema.publisher, `Article ${article.slug} schema must have publisher`)
      assert(schema.datePublished, `Article ${article.slug} schema must have datePublished`)
      assert(schema.dateModified, `Article ${article.slug} schema must have dateModified`)
    })
  }),

  test("Dataset schemas are valid for comparison articles", async () => {
    const articles = await getAllArticles()
    const brand = getBrand()

    const articlesWithComparisons = articles.filter((a) => a.blocks.some((b) => b.type === "comparisonTable"))

    articlesWithComparisons.forEach((article) => {
      const comparisonBlock = article.blocks.find((b) => b.type === "comparisonTable")
      if (comparisonBlock && comparisonBlock.type === "comparisonTable") {
        const schema = buildDatasetSchema(
          `${article.title} - Comparison Data`,
          `Structured comparison data for ${article.title}`,
          `/articles/${article.slug}`,
          comparisonBlock.rows.length,
          brand,
          article.slug,
        )

        assert(schema["@type"] === "Dataset", `Article ${article.slug} dataset schema must have @type`)
        assert(schema.name.length > 0, `Article ${article.slug} dataset schema must have name`)
        assert(schema.description.length > 0, `Article ${article.slug} dataset schema must have description`)
        assert(schema.distribution, `Article ${article.slug} dataset schema must have distribution`)
        assert(Array.isArray(schema.distribution), `Article ${article.slug} dataset schema distribution must be array`)
        assert(schema.distribution.length >= 2, `Article ${article.slug} dataset schema must have CSV and JSON formats`)
      }
    })
  }),

  test("SEO metadata is complete", async () => {
    const articles = await getAllArticles()

    articles.forEach((article) => {
      assert(article.title.length >= 10, `Article ${article.slug} title must be at least 10 characters`)
      assert(article.title.length <= 60, `Article ${article.slug} title must be at most 60 characters`)
      assert(article.description.length >= 50, `Article ${article.slug} description must be at least 50 characters`)
      assert(article.description.length <= 160, `Article ${article.slug} description must be at most 160 characters`)
    })
  }),

  test("Table of contents is generated", async () => {
    const articles = await getAllArticles()

    articles.forEach((article) => {
      assert(article.toc.length > 0, `Article ${article.slug} must have table of contents`)

      article.toc.forEach((item, index) => {
        assert(item.id.length > 0, `Article ${article.slug} TOC item ${index} must have id`)
        assert(item.title.length > 0, `Article ${article.slug} TOC item ${index} must have title`)
        assert(item.level >= 1 && item.level <= 3, `Article ${article.slug} TOC item ${index} level must be 1-3`)
      })
    })
  }),

  test("Enhancements are properly structured", async () => {
    const articles = await getAllArticles()

    articles.forEach((article) => {
      if (article.enhancements?.tldr) {
        assert(
          article.enhancements.tldr.content.length >= 50,
          `Article ${article.slug} TLDR must be at least 50 characters`,
        )
      }

      if (article.enhancements?.keyTakeaways) {
        assert(
          article.enhancements.keyTakeaways.items.length >= 3,
          `Article ${article.slug} must have at least 3 key takeaways`,
        )
        article.enhancements.keyTakeaways.items.forEach((item, index) => {
          assert(item.length >= 10, `Article ${article.slug} key takeaway ${index} must be at least 10 characters`)
        })
      }

      if (article.enhancements?.quiz) {
        assert(
          article.enhancements.quiz.questions.length >= 3,
          `Article ${article.slug} quiz must have at least 3 questions`,
        )
        article.enhancements.quiz.questions.forEach((q, index) => {
          assert(q.question.length > 0, `Article ${article.slug} quiz question ${index} must have text`)
          assert(q.options.length >= 2, `Article ${article.slug} quiz question ${index} must have at least 2 options`)
          assert(
            q.correctIndex >= 0 && q.correctIndex < q.options.length,
            `Article ${article.slug} quiz question ${index} correctIndex must be valid`,
          )
        })
      }
    })
  }),

  test("Accessibility: Images have alt text", async () => {
    const articles = await getAllArticles()

    articles.forEach((article) => {
      if (article.hero.image) {
        assert(article.hero.image.alt.length > 0, `Article ${article.slug} hero image must have alt text`)
      }

      article.blocks.forEach((block, index) => {
        if (block.type === "gallery") {
          block.images.forEach((img, imgIndex) => {
            assert(img.alt.length > 0, `Article ${article.slug} block ${index} image ${imgIndex} must have alt text`)
          })
        }
      })
    })
  }),

  test("Performance: Articles are not too large", async () => {
    const articles = await getAllArticles()

    articles.forEach((article) => {
      const jsonSize = JSON.stringify(article).length
      const maxSize = 500 * 1024 // 500KB

      assert(
        jsonSize < maxSize,
        `Article ${article.slug} is too large (${(jsonSize / 1024).toFixed(2)}KB). Consider splitting content.`,
      )
    })
  }),
]

// Run all tests
async function runTests() {
  console.log("\n🧪 Running Smoke Tests...\n")

  for (const testFn of tests) {
    await testFn()
  }

  console.log("\n" + "=".repeat(60))
  console.log("Test Results Summary")
  console.log("=".repeat(60))

  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)

  console.log(`\nTotal: ${results.length} tests`)
  console.log(`Passed: ${passed} ✓`)
  console.log(`Failed: ${failed} ✗`)
  console.log(`Duration: ${totalDuration}ms`)

  if (failed > 0) {
    console.log("\n❌ Failed Tests:")
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  - ${r.name}`)
        console.log(`    ${r.message}`)
      })
    process.exit(1)
  } else {
    console.log("\n✅ All tests passed!")
    process.exit(0)
  }
}

runTests()
