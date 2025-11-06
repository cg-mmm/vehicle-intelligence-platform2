import { Composition } from "remotion"
import { ArticleVideo } from "./ArticleVideo"
import { ArticleVideoReel } from "./ArticleVideoReel"
import type { ArticleDoc } from "../src/lib/contracts"

interface BrandPack {
  siteName: string
  siteUrl: string
  colors: {
    primary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  organization: {
    name: string
    url: string
    logo: string
  }
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

export interface VideoInputProps {
  article: ArticleDoc
  brand: BrandPack
  aspect?: "landscape" | "vertical"
}

export default function Root() {
  return (
    <>
      <Composition
        id="ArticleVideo"
        component={ArticleVideo}
        durationInFrames={2700} // 90s at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          article: {} as ArticleDoc,
          brand: {} as BrandPack,
          aspect: "landscape" as const,
        }}
      />

      <Composition
        id="ArticleVideoReel"
        component={ArticleVideoReel}
        durationInFrames={1350} // 45s at 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          article: {} as ArticleDoc,
          brand: {} as BrandPack,
          aspect: "vertical" as const,
        }}
      />
    </>
  )
}
