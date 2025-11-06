"use client"

import { Download, Share2, Code, ExternalLink } from "lucide-react"
import { useState } from "react"

interface VideoControlsProps {
  articleSlug: string
  title: string
  siteUrl: string
}

export function VideoControls({ articleSlug, title, siteUrl }: VideoControlsProps) {
  const [showEmbed, setShowEmbed] = useState(false)
  const [copied, setCopied] = useState(false)

  const videoUrl = `${siteUrl}/video/${articleSlug}`
  const embedUrl = `${siteUrl}/video/embed/${articleSlug}`
  const downloadUrl = `/api/video/download/${articleSlug}`

  const embedCode = `<iframe src="${embedUrl}" width="1920" height="1080" frameborder="0" allowfullscreen></iframe>`

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Watch: ${title}`,
          url: videoUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(videoUrl)
      alert("Video URL copied to clipboard!")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <a
          href={downloadUrl}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Video
        </a>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>

        <button
          onClick={() => setShowEmbed(!showEmbed)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
        >
          <Code className="w-4 h-4" />
          Embed Code
        </button>

        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open in New Tab
        </a>
      </div>

      {showEmbed && (
        <div className="p-4 rounded-lg border bg-muted space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Embed Code</h3>
            <button
              onClick={handleCopyEmbed}
              className="text-sm px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="p-3 rounded bg-background overflow-x-auto text-sm">
            <code>{embedCode}</code>
          </pre>
          <p className="text-xs text-muted-foreground">
            Copy this code to embed the video on your website. The video will be responsive and include all interactive
            features.
          </p>
        </div>
      )}
    </div>
  )
}
