import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { MegaNav } from "@/components/layout/MegaNav"
import { Footer } from "@/components/layout/Footer"
import { BrandProvider } from "@/components/providers/BrandProvider"
import { getBrand } from "@/lib/siteConfig"
import { listPillars, listSections, listClusters, listArticles } from "@/lib/taxonomy"
import "./globals.css"
import { StickyShareBar } from "@/components/share/StickyShareBar"
import { WebVitals } from "@/components/WebVitals"

export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrand()
  return {
    title: brand.siteName,
    description: brand.description,
    generator: "v0.app",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const brand = getBrand()

  const pillars = listPillars()
  const sections = listSections()
  const clusters = listClusters()
  const articles = listArticles()

  const brandStyles = {
    "--brand-primary": brand.colors?.primary || "#0ea5e9",
    "--brand-secondary": brand.colors?.secondary || "#22c55e",
    "--brand-accent": brand.colors?.accent || "#f59e0b",
  } as React.CSSProperties

  return (
    <html lang="en" style={brandStyles}>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <BrandProvider brand={brand}>
          <WebVitals />
          <MegaNav pillars={pillars} sections={sections} clusters={clusters} articles={articles} />
          <Suspense fallback={null}>{children}</Suspense>
          <Footer />
          <StickyShareBar
            canonical={typeof window !== "undefined" ? window.location.href : brand.siteUrl || ""}
            title={brand.siteName}
            summary={brand.description}
          />
          <Analytics />
        </BrandProvider>
      </body>
    </html>
  )
}
