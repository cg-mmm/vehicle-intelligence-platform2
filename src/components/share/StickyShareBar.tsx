"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Twitter, Facebook, Linkedin, Mail, Link2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildShareLinks } from "@/lib/share/links"
import { trackEvent } from "@/lib/analytics/events"

interface StickyShareBarProps {
  canonical: string
  title: string
  summary?: string
  image?: string
}

export function StickyShareBar({ canonical, title, summary, image }: StickyShareBarProps) {
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const links = buildShareLinks({ canonical, title, summary, image })

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleShare = async (network: string, url: string) => {
    trackEvent({ type: "share_click", network, path: canonical })

    if (network === "copy") {
      try {
        await navigator.clipboard.writeText(links.copy)
        setCopied(true)
        trackEvent({ type: "share_copy", path: canonical })
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        const textarea = document.createElement("textarea")
        textarea.value = links.copy
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } else {
      window.open(url, "_blank", "noopener,noreferrer,width=600,height=600")
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
        >
          <div className="flex flex-col gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("twitter", links.twitter)}
              className="w-12 h-12 p-0 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary transition-all duration-300 group rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 backdrop-blur-sm border border-primary/20"
              title="Share on Twitter"
            >
              <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("facebook", links.facebook)}
              className="w-12 h-12 p-0 bg-accent/10 hover:bg-accent/20 text-accent hover:text-accent transition-all duration-300 group rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/40 backdrop-blur-sm border border-accent/20"
              title="Share on Facebook"
            >
              <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("linkedin", links.linkedin)}
              className="w-12 h-12 p-0 bg-accent-2/10 hover:bg-accent-2/20 text-accent-2 hover:text-accent-2 transition-all duration-300 group rounded-full shadow-lg shadow-accent-2/20 hover:shadow-accent-2/40 backdrop-blur-sm border border-accent-2/20"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("email", links.email)}
              className="w-12 h-12 p-0 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 group rounded-full shadow-lg shadow-muted/20 hover:shadow-muted/40 backdrop-blur-sm border border-border"
              title="Share via Email"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("copy", links.copy)}
              className="w-12 h-12 p-0 bg-[color:var(--color-success)]/10 hover:bg-[color:var(--color-success)]/20 text-[color:var(--color-success)] hover:text-[color:var(--color-success)] transition-all duration-300 group relative rounded-full shadow-lg shadow-[color:var(--color-success)]/20 hover:shadow-[color:var(--color-success)]/40 backdrop-blur-sm border border-[color:var(--color-success)]/20"
              title="Copy Link"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                  >
                    <Check className="w-5 h-5 text-[color:var(--color-success)]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="link"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="group-hover:scale-110 transition-transform"
                  >
                    <Link2 className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
