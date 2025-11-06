import type React from "react"
import { MegaNav } from "@/components/layout/MegaNav"
import { Footer } from "@/components/layout/Footer"
import { listPillars, listSections, listClusters, listArticles } from "@/lib/taxonomy"

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pillars = listPillars()
  const sections = listSections()
  const clusters = listClusters()
  const articles = listArticles()

  return (
    <>
      <MegaNav pillars={pillars} sections={sections} clusters={clusters} articles={articles} />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">{children}</main>
      <Footer />
    </>
  )
}
