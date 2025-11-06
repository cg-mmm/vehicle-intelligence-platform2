"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, Mail, Link2, Share2, Check } from "lucide-react"
import { buildShareLinks } from "@/lib/share/links"
import { trackEvent } from "@/lib/analytics/events"
import { motion, AnimatePresence } from "framer-motion"

interface ShareBarProps {
  canonical: string
  title: string
  summary?: string
  image?: string
  className?: string
}

export function ShareBar({ canonical, title, summary, image, className = "" }: ShareBarProps) {
  const [copied, setCopied] = useState(false)
  const links = buildShareLinks({ canonical, title, summary, image })

  const handleShare = async (network: string, url: string) => {
    trackEvent({ type: "share_click", network, path: canonical })

    if (network === "copy") {
      try {
        await navigator.clipboard.writeText(links.copy)
        setCopied(true)
        trackEvent({ type: "share_copy", path: canonical })
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        // Fallback for older browsers
        const textarea = document.createElement("textarea")
        textarea.value = links.copy
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } else if (network === "webshare" && navigator.share) {
      try {
        await navigator.share(links.webshareData)
        trackEvent({ type: "webshare_success", path: canonical })
      } catch (error: any) {
        if (error.name !== "AbortError") {
          trackEvent({ type: "webshare_fail", path: canonical, error: error.message })
        }
      }
    } else {
      window.open(url, "_blank", "noopener,noreferrer,width=600,height=600")
    }
  }

  // Check if Web Share API is available
  const hasWebShare = typeof navigator !== "undefined" && navigator.share

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter", links.twitter)}
        className="bg-card/50 border-border hover:bg-accent/10 hover:border-accent/30"
      >
        <Twitter className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook", links.facebook)}
        className="bg-card/50 border-border hover:bg-accent/10 hover:border-accent/30"
      >
        <Facebook className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin", links.linkedin)}
        className="bg-card/50 border-border hover:bg-accent/10 hover:border-accent/30"
      >
        <Linkedin className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("email", links.email)}
        className="bg-card/50 border-border hover:bg-muted hover:border-muted-foreground/30"
      >
        <Mail className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("copy", links.copy)}
        className="bg-card/50 border-border hover:bg-[color:var(--color-success)]/10 hover:border-[color:var(--color-success)]/30 relative"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <Check className="w-4 h-4 text-[color:var(--color-success)]" />
            </motion.div>
          ) : (
            <motion.div key="link" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Link2 className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {hasWebShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("webshare", "")}
          className="bg-card/50 border-border hover:bg-accent-2/10 hover:border-accent-2/30 md:hidden"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
