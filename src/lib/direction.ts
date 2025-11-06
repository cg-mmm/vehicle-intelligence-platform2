import "server-only"
import { promises as fs } from "fs"
import path from "path"
import type { Direction } from "./contracts/direction"

const DIRECTION_PATH = path.join(process.cwd(), "content", "direction.json")

// Default direction configuration
const DEFAULT_DIRECTION: Direction = {
  focus_window_days: 30,
  publish_per_day: 3,
  pillars: [
    { id: "suvs", priority: 1.0, target_quota: 40, freeze: false },
    { id: "sedans", priority: 0.6, target_quota: 25, freeze: false },
    { id: "trucks", priority: 0.8, target_quota: 30, freeze: false },
  ],
  clusters: [
    { id: "suvs.midsize", priority: 1.2, target_quota: 20 },
    { id: "suvs.electric", priority: 1.0, target_quota: 15 },
  ],
  boost_entities: ["hybrid", "awd", "towing capacity"],
  deprioritize_patterns: ["2021 ", "old gen "],
  interlink_policy: {
    min_internal: 3,
    max_internal: 7,
    prefer_siblings: true,
    include_parent: true,
  },
}

export async function readDirection(): Promise<Direction> {
  try {
    const content = await fs.readFile(DIRECTION_PATH, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    // Return default if file doesn't exist
    return DEFAULT_DIRECTION
  }
}

export async function writeDirection(direction: Direction): Promise<void> {
  // Ensure content directory exists
  const contentDir = path.dirname(DIRECTION_PATH)
  await fs.mkdir(contentDir, { recursive: true })

  // Write atomically using temp file
  const tempPath = `${DIRECTION_PATH}.tmp`
  await fs.writeFile(tempPath, JSON.stringify(direction, null, 2), "utf-8")
  await fs.rename(tempPath, DIRECTION_PATH)
}
