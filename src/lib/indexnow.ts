import { enqueueJob } from "./jobs"

interface IndexNowContext {
  reason?: string
}

interface IndexNowLog {
  id: string
  timestamp: string
  urls: string[]
  reason?: string
  status: number
  success: boolean
  error?: string
  responseBody?: string
}

const indexNowLogs: IndexNowLog[] = []
const MAX_LOGS = 100

export function getIndexNowLogs(): IndexNowLog[] {
  return [...indexNowLogs].reverse() // Most recent first
}

export function queueIndexNowPing(urls: string[], ctx?: IndexNowContext): { id: string; status: "queued" } {
  console.log(`[v0] Queueing IndexNow ping for ${urls.length} URL(s)`, ctx?.reason || "")

  return enqueueJob("indexnow-ping", {
    urls,
    reason: ctx?.reason,
    timestamp: new Date().toISOString(),
  })
}

export async function submitToIndexNow(
  urls: string[],
  apiKey?: string,
  reason?: string,
): Promise<{ success: boolean; error?: string; logId?: string }> {
  if (!urls || urls.length === 0) {
    return { success: false, error: "No URLs provided" }
  }

  const logId = `indexnow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // IndexNow supports multiple search engines
  const engines = [
    "https://api.indexnow.org/indexnow", // Generic endpoint
    "https://www.bing.com/indexnow", // Bing
  ]

  const key = apiKey || process.env.INDEXNOW_API_KEY || generateIndexNowKey()
  const host = process.env.BASE_URL || "https://example.com"

  try {
    const payload = {
      host: new URL(host).hostname,
      key,
      keyLocation: `${host}/indexnow-key.txt`,
      urlList: urls.map((url) => (url.startsWith("http") ? url : `${host}${url}`)),
    }

    // Submit to first available engine
    const response = await fetch(engines[0], {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    })

    const responseBody = await response.text().catch(() => "")

    const log: IndexNowLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      urls,
      reason,
      status: response.status,
      success: response.ok || response.status === 202,
      responseBody: responseBody || undefined,
    }

    // Store log
    indexNowLogs.push(log)
    if (indexNowLogs.length > MAX_LOGS) {
      indexNowLogs.shift() // Remove oldest
    }

    if (log.success) {
      console.info("[indexnow]", {
        urls,
        status: response.status,
        reason,
        logId,
      })
      return { success: true, logId }
    } else {
      const error = `IndexNow submission failed: ${response.status} ${response.statusText}`
      log.error = error
      console.error(`[IndexNow] ${error}`, { logId, responseBody })
      return { success: false, error, logId }
    }
  } catch (error) {
    const errorMsg = `IndexNow submission error: ${error}`

    const log: IndexNowLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      urls,
      reason,
      status: 0,
      success: false,
      error: errorMsg,
    }

    indexNowLogs.push(log)
    if (indexNowLogs.length > MAX_LOGS) {
      indexNowLogs.shift()
    }

    console.error(`[IndexNow] ${errorMsg}`, { logId })
    return { success: false, error: errorMsg, logId }
  }
}

function generateIndexNowKey(): string {
  // Generate a random 32-character hex key
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
}

export async function pingIndexNowOnPublish(articleSlug: string, baseUrl: string): Promise<void> {
  const urls = [
    `${baseUrl}/articles/${articleSlug}`,
    `${baseUrl}/video/${articleSlug}`,
    // Add sitemap URLs
    `${baseUrl}/sitemap.xml`,
    `${baseUrl}/video-sitemap.xml`,
  ]

  await submitToIndexNow(urls, undefined, "article-published")
}
