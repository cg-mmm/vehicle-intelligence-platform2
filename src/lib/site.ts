export function getBaseUrl(req?: Request): string {
  // Check environment variable first
  if (process.env.BASE_URL) {
    const url = process.env.BASE_URL
    return url.startsWith("http") ? url : `https://${url}`
  }

  // Try to derive from request headers
  if (req) {
    const proto = req.headers.get("x-forwarded-proto") || "http"
    const host = req.headers.get("host")
    if (host) {
      return `${proto}://${host}`
    }
  }

  // Check VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Fallback to localhost
  return "http://localhost:3000"
}

export function absUrl(path: string, base: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  // Remove trailing slash from base
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base
  return `${normalizedBase}${normalizedPath}`
}
