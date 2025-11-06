import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion"
import { buildStoryboard } from "../src/lib/video/storyboard"
import { CinematicHero } from "./scenes/CinematicHero"
import { CinematicTLDR } from "./scenes/CinematicTLDR"
import { ReviewsCarousel } from "./scenes/ReviewsCarousel"
import { ContentHighlight } from "./scenes/ContentHighlight"
import { OutroBranded } from "./scenes/OutroBranded"
import { cobaltVoltTheme } from "./theme/cobaltVoltTokens"
import { StatsRail, ComparisonSnap, ProsConsCard, KenBurnsImage, FAQFlash, CTA, LowerThird } from "./Primitives"
import type { VideoInputProps } from "./Root"

export function ArticleVideo({ article, brand, aspect = "landscape" }: VideoInputProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const theme = {
    colors: cobaltVoltTheme.colors,
    gradients: cobaltVoltTheme.gradients,
    fonts: cobaltVoltTheme.fonts,
    shadows: cobaltVoltTheme.shadows,
  }

  const videoBrand = {
    ...brand,
    colors: {
      primary: cobaltVoltTheme.colors.gradientMid,
      accent: cobaltVoltTheme.colors.accent,
      background: cobaltVoltTheme.colors.bg,
      text: cobaltVoltTheme.colors.fg,
    },
    fonts: {
      heading: cobaltVoltTheme.fonts.heading,
      body: cobaltVoltTheme.fonts.body,
    },
  }

  const { scenes } = buildStoryboard(article, brand)

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

  return (
    <AbsoluteFill style={{ backgroundColor: videoBrand.colors.background }}>
      {activeScene.type === "title" && (
        <CinematicHero
          title={activeScene.data.title}
          subtitle={activeScene.data.subtitle}
          heroImage={activeScene.data.heroImage?.url}
          brandName={videoBrand.organization.name}
          progress={progress}
        />
      )}

      {activeScene.type === "tldr" && (
        <CinematicTLDR content={activeScene.data.content} points={activeScene.data.points} progress={progress} />
      )}

      {activeScene.type === "stats_rail" && (
        <StatsRail stats={activeScene.data.stats} brand={videoBrand} progress={progress} />
      )}

      {activeScene.type === "comparison_snap" && (
        <ComparisonSnap
          columns={activeScene.data.columns}
          rows={activeScene.data.rows}
          brand={videoBrand}
          progress={progress}
        />
      )}

      {activeScene.type === "content_highlight" && (
        <ContentHighlight
          heading={activeScene.data.heading}
          clusters={activeScene.data.clusters}
          brandColors={videoBrand.colors}
        />
      )}

      {activeScene.type === "pros_cons" && (
        <ProsConsCard
          pros={activeScene.data.pros}
          cons={activeScene.data.cons}
          brand={videoBrand}
          progress={progress}
        />
      )}

      {activeScene.type === "reviews_carousel" && (
        <ReviewsCarousel
          reviews={activeScene.data.reviews}
          sources={activeScene.data.sources}
          brandColors={videoBrand.colors}
        />
      )}

      {activeScene.type === "gallery_ken_burns" && (
        <KenBurnsImage
          src={activeScene.data.images[0].src}
          alt={activeScene.data.images[0].alt}
          title={activeScene.data.images[0].alt}
          brand={videoBrand}
          progress={progress}
        />
      )}

      {activeScene.type === "faq_flash" && (
        <FAQFlash faqs={activeScene.data.faqs} brand={videoBrand} progress={progress} />
      )}

      {activeScene.type === "outro_branded" && (
        <OutroBranded
          title={activeScene.data.title}
          siteName={activeScene.data.siteName}
          siteUrl={activeScene.data.siteUrl}
          logo={activeScene.data.logo}
          cta={activeScene.data.cta}
          brandColors={videoBrand.colors}
        />
      )}

      {activeScene.type === "cta" && <CTA brand={videoBrand} progress={progress} />}

      {activeScene.type !== "title" && activeScene.type !== "outro_branded" && activeScene.type !== "cta" && (
        <LowerThird text={videoBrand.organization.name} />
      )}
    </AbsoluteFill>
  )
}
