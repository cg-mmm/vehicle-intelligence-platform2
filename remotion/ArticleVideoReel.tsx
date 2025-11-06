import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion"
import { buildReelStoryboard } from "../src/lib/video/storyboard"
import { IntroCinematic } from "./scenes/IntroCinematic"
import { TLDRCard, StatsRail, CTA } from "./Primitives"
import type { VideoInputProps } from "./Root"

export function ArticleVideoReel({ article, brand }: VideoInputProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const { scenes } = buildReelStoryboard(article, brand)

  let currentTime = 0
  let activeScene: any = null

  for (const scene of scenes) {
    const sceneStart = currentTime
    const sceneEnd = currentTime + scene.durationSec * fps

    if (frame >= sceneStart && frame < sceneEnd) {
      activeScene = { ...scene, localFrame: frame - sceneStart, startFrame: sceneStart }
      break
    }

    currentTime = sceneEnd
  }

  if (!activeScene) return null

  const progress = activeScene.localFrame / (activeScene.durationSec * fps)

  const videoBrand = {
    ...brand,
    colors: {
      primary: brand.videoPalette?.primary || brand.colors.primary,
      accent: brand.videoPalette?.accent || brand.colors.accent,
      background: brand.videoPalette?.bg || brand.colors.background,
      text: brand.videoPalette?.text || brand.colors.text,
    },
    fonts: {
      heading: brand.videoTypeface?.heading || brand.fonts.heading,
      body: brand.videoTypeface?.body || brand.fonts.body,
    },
  }

  return (
    <AbsoluteFill style={{ backgroundColor: videoBrand.colors.background }}>
      {activeScene.type === "hero_flash" && (
        <IntroCinematic
          title={activeScene.data.title}
          subtitle={activeScene.data.subtitle}
          heroImage={activeScene.data.heroImage}
          brand={videoBrand}
          progress={progress}
        />
      )}

      {activeScene.type === "quick_tldr" && (
        <TLDRCard content={activeScene.data.content} brand={videoBrand} progress={progress} />
      )}

      {activeScene.type === "highlight_stat" && (
        <StatsRail stats={activeScene.data.stats} brand={videoBrand} progress={progress} />
      )}

      {activeScene.type === "cta_outro" && <CTA brand={videoBrand} progress={progress} />}

      {/* Caption bar for social */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "white",
            textAlign: "center",
            fontFamily: videoBrand.fonts.body,
          }}
        >
          {videoBrand.organization.name}
        </div>
      </div>
    </AbsoluteFill>
  )
}
