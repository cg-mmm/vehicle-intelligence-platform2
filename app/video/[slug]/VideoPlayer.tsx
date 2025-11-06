"use client"

import { useEffect, useRef, useState } from "react"

interface VideoPlayerProps {
  mp4Url: string
  posterUrl: string
  startTime?: number
  title: string
}

export function VideoPlayer({ mp4Url, posterUrl, startTime, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      if (startTime && startTime > 0 && startTime < video.duration) {
        video.currentTime = startTime
        video.focus()
      }
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [startTime])

  if (error) {
    return (
      <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-lg font-semibold mb-2">Video will appear shortly</p>
          <p className="text-sm text-muted-foreground">
            The video is being generated and will be available soon. Check back in a few minutes.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        controls
        preload="metadata"
        poster={posterUrl}
        className="w-full h-full"
        onError={() => setError(true)}
        aria-label={`Video: ${title}`}
      >
        <source src={mp4Url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
