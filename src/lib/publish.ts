import type { Article } from "./articleSchema"
import { revalidateArticle } from "./revalidate"
import { enqueueJob } from "./jobs"

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = process.env.GITHUB_OWNER
const GITHUB_REPO = process.env.GITHUB_REPO

export async function publishArticle(article: Article): Promise<{ url: string }> {
  const filePath = `content/articles/${article.slug}.json`
  const content = JSON.stringify(article, null, 2)

  // Check if we should use GitHub API (production)
  if (GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO) {
    await publishToGitHub(filePath, content, article.slug)
  } else {
    // Local file system (development)
    await publishToLocal(filePath, content)
  }

  // Revalidate the article pages
  revalidateArticle(article.slug)

  enqueueJob("video-render", {
    slug: article.slug,
    aspect: "landscape",
    articlePath: `content/articles/${article.slug}.json`,
  })

  const url = `${BASE_URL}/articles/${article.slug}`

  const { queueIndexNowPing } = await import("./indexnow")
  queueIndexNowPing([url, `${BASE_URL}/video/${article.slug}`], { reason: "article-published" })

  return { url }
}

async function publishToLocal(filePath: string, content: string): Promise<void> {
  // Dynamic import to avoid issues in edge runtime
  const fs = await import("fs/promises")
  const path = await import("path")

  const fullPath = path.join(process.cwd(), filePath)
  const dir = path.dirname(fullPath)

  // Ensure directory exists
  await fs.mkdir(dir, { recursive: true })

  // Write file
  await fs.writeFile(fullPath, content, "utf-8")
}

async function publishToGitHub(filePath: string, content: string, slug: string): Promise<void> {
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`
  const base64Content = Buffer.from(content).toString("base64")

  try {
    // First, try to get the file to see if it exists
    let sha: string | undefined

    try {
      const getResponse = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (getResponse.ok) {
        const fileData = await getResponse.json()
        sha = fileData.sha
      }
    } catch (err) {
      // Ignore errors when checking if file exists
    }

    // Now create or update the file
    const putResponse = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: sha ? `feat(content): update ${slug}` : `feat(content): add ${slug}`,
        content: base64Content,
        ...(sha && { sha }),
      }),
    })

    if (!putResponse.ok) {
      const errorText = await putResponse.text()
      throw new Error(`Failed to publish to GitHub: ${errorText}`)
    }
  } catch (error) {
    throw error
  }
}
