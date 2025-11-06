"use client"

import { Download } from "lucide-react"
import { ThreadedGrid } from "../skins/ThreadedGrid"
import type { ComparisonTableBlock } from "@/lib/contracts"
import { useState } from "react"

interface ComparisonTableProps {
  block: ComparisonTableBlock
  articleSlug?: string
}

export function ComparisonTable({ block, articleSlug }: ComparisonTableProps) {
  const [downloading, setDownloading] = useState<"csv" | "json" | null>(null)

  const handleDownload = async (format: "csv" | "json") => {
    if (!articleSlug) return

    setDownloading(format)
    try {
      const response = await fetch(`/api/datasets/${articleSlug}?format=${format}`)
      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${articleSlug}-comparison.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("[ComparisonTable] Download error:", error)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="relative">
      {articleSlug && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => handleDownload("csv")}
            disabled={downloading !== null}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-card/80 backdrop-blur-sm border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading === "csv" ? "Downloading..." : "CSV"}
          </button>
          <button
            onClick={() => handleDownload("json")}
            disabled={downloading !== null}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-card/80 backdrop-blur-sm border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading === "json" ? "Downloading..." : "JSON"}
          </button>
        </div>
      )}

      <ThreadedGrid block={block} />
    </div>
  )
}
