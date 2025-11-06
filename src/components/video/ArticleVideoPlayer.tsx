"use client"

import { Player, type PlayerRef } from "@remotion/player"
import { ArticleVideo } from "@/remotion/ArticleVideo"
import type { ArticleDoc } from "@/lib/contracts"
import { motion, AnimatePresence } from "framer-motion"
import { useMemo, useState, useRef } from "react"
import { buildStoryboard } from "@/lib/video/storyboard"
import { Play } from "lucide-react"

interface ArticleVideoPlayerProps {
  article: ArticleDoc
  brand: {
    siteName: string
    siteUrl: string
    videoPalette?: {
      bg: string
      primary: string
      accent: string
      text: string
    }
    videoTypeface?: {
      heading: string
      body: string
    }
  }
  aspect?: "landscape" | "vertical"
}

export function ArticleVideoPlayer({ article, brand, aspect = "landscape" }: ArticleVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const playerRef = useRef<PlayerRef>(null)

  const { durationInFrames } = useMemo(() => {
    const brandPack = {
      siteName: brand.siteName,
      siteUrl: brand.siteUrl,
      colors: {
        primary: brand.videoPalette?.primary || "#0ea5e9",
        accent: brand.videoPalette?.accent || "#22c55e",
        background: brand.videoPalette?.bg || "#000000",
        text: brand.videoPalette?.text || "#ffffff",
      },
      fonts: {
        heading: brand.videoTypeface?.heading || "Inter",
        body: brand.videoTypeface?.body || "Inter",
      },
      organization: {
        name: brand.siteName,
        url: brand.siteUrl,
        logo: "/logo.png",
      },
    }

    const { estimatedDurationSec } = buildStoryboard(article, brandPack)

    return {
      durationInFrames: estimatedDurationSec * 30,
    }
  }, [article, brand])

  const inputProps = useMemo(
    () => ({
      article,
      brand: {
        siteName: brand.siteName,
        siteUrl: brand.siteUrl,
        colors: {
          primary: brand.videoPalette?.primary || "#0ea5e9",
          accent: brand.videoPalette?.accent || "#22c55e",
          background: brand.videoPalette?.bg || "#000000",
          text: brand.videoPalette?.text || "#ffffff",
        },
        fonts: {
          heading: brand.videoTypeface?.heading || "Inter",
          body: brand.videoTypeface?.body || "Inter",
        },
        organization: {
          name: brand.siteName,
          url: brand.siteUrl,
          logo: "/logo.png",
        },
        videoPalette: brand.videoPalette,
        videoTypeface: brand.videoTypeface,
      },
      aspect,
    }),
    [article, brand, aspect],
  )

  const dimensions =
    aspect === "vertical"
      ? { width: 1080, height: 1920, aspectRatio: "9/16" }
      : { width: 1920, height: 1080, aspectRatio: "16/9" }

  const handleThumbnailClick = () => {
    if (playerRef.current) {
      playerRef.current.play()
      setIsPlaying(true)
      setHasStarted(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl overflow-hidden shadow-2xl border border-[color:var(--accent)]/20 relative"
    >
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleThumbnailClick}
            className="absolute inset-0 z-20 cursor-pointer bg-gradient-to-br from-[color:var(--accent)]/20 via-[color:var(--accent-2)]/15 to-[color:var(--accent)]/20"
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 30%, hsl(var(--accent) / 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 70%, hsl(var(--accent-2) / 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 30%, hsl(var(--accent) / 0.3) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(circle at 80% 20%, hsl(var(--accent-2) / 0.25) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 80%, hsl(var(--accent) / 0.25) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 20%, hsl(var(--accent-2) / 0.25) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(at_40%_20%,hsl(var(--accent)/0.15)_0px,transparent_50%),radial-gradient(at_80%_0%,hsl(var(--accent-2)/0.15)_0px,transparent_50%),radial-gradient(at_0%_50%,hsl(var(--accent)/0.1)_0px,transparent_50%),radial-gradient(at_80%_50%,hsl(var(--accent-2)/0.1)_0px,transparent_50%),radial-gradient(at_0%_100%,hsl(var(--accent)/0.15)_0px,transparent_50%),radial-gradient(at_80%_100%,hsl(var(--accent-2)/0.15)_0px,transparent_50%)]" />

            {/* Content container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 backdrop-blur-[2px]">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-6 right-6 px-4 py-2 rounded-lg backdrop-blur-md bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent-2))] border border-[color:var(--accent)]/60 shadow-[0_4px_12px_hsl(var(--accent)/0.3)]"
              >
                <p className="text-sm font-bold tracking-wide text-[color:var(--accent-foreground)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {brand.siteName}
                </p>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-center mb-8 px-4 text-[color:var(--fg)]"
                style={{
                  textShadow: "0 4px 20px hsl(var(--accent) / 0.8), 0 2px 8px rgba(0,0,0,0.8)",
                  lineHeight: 1.2,
                }}
              >
                {article.title}
              </motion.h3>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-cta-gradient"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />

                <div className="relative w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-md bg-cta-gradient border-3 border-[color:var(--fg)] shadow-cta cta-pulse">
                  <Play className="w-10 h-10 ml-1 text-[color:var(--accent-foreground)] fill-[color:var(--accent-foreground)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-lg font-semibold text-[color:var(--fg)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              >
                Click to Watch
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Player
        ref={playerRef}
        component={ArticleVideo}
        inputProps={inputProps}
        durationInFrames={durationInFrames}
        fps={30}
        compositionWidth={dimensions.width}
        compositionHeight={dimensions.height}
        style={{
          width: "100%",
          aspectRatio: dimensions.aspectRatio,
        }}
        controls
        clickToPlay
        doubleClickToFullscreen
        spaceKeyToPlayOrPause
        initiallyShowControls={30}
        onPlay={() => {
          setIsPlaying(true)
          setHasStarted(true)
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </motion.div>
  )
}
