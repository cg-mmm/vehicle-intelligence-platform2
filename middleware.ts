import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = url.hostname
  const pathname = url.pathname

  const preferredHostname = process.env.PREFERRED_HOSTNAME || hostname
  if (hostname !== preferredHostname && !hostname.includes("localhost") && !hostname.includes("vercel.app")) {
    url.hostname = preferredHostname
    return NextResponse.redirect(url, 301)
  }

  if (pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase()
    return NextResponse.redirect(url, 301)
  }

  if (pathname.includes("//")) {
    url.pathname = pathname.replace(/\/+/g, "/")
    return NextResponse.redirect(url, 301)
  }

  if (pathname.endsWith("/index.html")) {
    url.pathname = pathname.replace("/index.html", "/")
    return NextResponse.redirect(url, 301)
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    url.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }

  const response = NextResponse.next()

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https:",
      "connect-src 'self' https://www.google-analytics.com https://api.github.com",
      "frame-src 'self'",
    ].join("; "),
  )

  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "SAMEORIGIN")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  if (pathname.startsWith("/video/embed/")) {
    response.headers.delete("X-Frame-Options")
    response.headers.set("X-Frame-Options", "ALLOWALL")
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
