import { NextResponse } from "next/server"
import { readDirection, writeDirection } from "@/lib/direction"
import { Direction } from "@/lib/contracts/direction"

export async function GET() {
  try {
    const direction = await readDirection()
    return NextResponse.json(direction)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to read direction" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    // Read current direction
    const current = await readDirection()

    // Merge with updates (partial update)
    const updated = {
      ...current,
      ...body,
      pillars: body.pillars || current.pillars,
      clusters: body.clusters || current.clusters,
      boost_entities: body.boost_entities || current.boost_entities,
      deprioritize_patterns: body.deprioritize_patterns || current.deprioritize_patterns,
      interlink_policy: {
        ...current.interlink_policy,
        ...(body.interlink_policy || {}),
      },
    }

    // Validate with Zod
    const validated = Direction.parse(updated)

    // Write back
    await writeDirection(validated)

    return NextResponse.json(validated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update direction" }, { status: 400 })
  }
}
