import type { ArticleDoc } from "../contracts"
import type { Scene } from "./storyboard"

export interface CaptionCue {
  start: number // seconds
  end: number // seconds
  text: string
}

/**
 * Generate VTT captions from storyboard scenes
 * Best-effort approach using scene data
 */
export function generateTranscript(article: ArticleDoc, scenes: Scene[]): CaptionCue[] {
  const cues: CaptionCue[] = []
  let currentTime = 0

  scenes.forEach((scene) => {
    const duration = scene.durationSec

    switch (scene.type) {
      case "title":
        cues.push({
          start: currentTime,
          end: currentTime + duration,
          text: scene.data.title,
        })
        if (scene.data.subtitle) {
          cues.push({
            start: currentTime + 1,
            end: currentTime + duration,
            text: scene.data.subtitle,
          })
        }
        break

      case "tldr":
      case "quick_tldr":
        // Split content into readable chunks
        const content = scene.data.content || ""
        const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
        const timePerSentence = duration / Math.max(sentences.length, 1)

        sentences.forEach((sentence, i) => {
          cues.push({
            start: currentTime + i * timePerSentence,
            end: currentTime + (i + 1) * timePerSentence,
            text: sentence.trim(),
          })
        })
        break

      case "stats_rail":
      case "highlight_stat":
        scene.data.stats?.forEach((stat: any, i: number) => {
          const timePerStat = duration / scene.data.stats.length
          cues.push({
            start: currentTime + i * timePerStat,
            end: currentTime + (i + 1) * timePerStat,
            text: `${stat.label}: ${stat.value}`,
          })
        })
        break

      case "pros_cons":
        cues.push({
          start: currentTime,
          end: currentTime + duration / 2,
          text: `Pros: ${scene.data.pros?.join(", ")}`,
        })
        cues.push({
          start: currentTime + duration / 2,
          end: currentTime + duration,
          text: `Cons: ${scene.data.cons?.join(", ")}`,
        })
        break

      case "faq_flash":
        scene.data.faqs?.forEach((faq: any, i: number) => {
          const timePerFAQ = duration / scene.data.faqs.length
          cues.push({
            start: currentTime + i * timePerFAQ,
            end: currentTime + (i + 1) * timePerFAQ,
            text: `${faq.question} ${faq.answer}`,
          })
        })
        break

      case "content_highlight":
        cues.push({
          start: currentTime,
          end: currentTime + duration,
          text: scene.data.heading || "Key Insights",
        })
        break

      case "outro_branded":
        cues.push({
          start: currentTime,
          end: currentTime + duration,
          text: `Learn more at ${scene.data.siteUrl}`,
        })
        break
    }

    currentTime += duration
  })

  return cues
}

/**
 * Convert caption cues to WebVTT format
 */
export function cuesToVTT(cues: CaptionCue[]): string {
  let vtt = "WEBVTT\n\n"

  cues.forEach((cue, index) => {
    const startTime = formatVTTTime(cue.start)
    const endTime = formatVTTTime(cue.end)
    vtt += `${index + 1}\n${startTime} --> ${endTime}\n${cue.text}\n\n`
  })

  return vtt
}

function formatVTTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}.${pad(ms, 3)}`
}

function pad(num: number, length = 2): string {
  return String(num).padStart(length, "0")
}
