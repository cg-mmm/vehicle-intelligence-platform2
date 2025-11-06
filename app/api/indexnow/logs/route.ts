import { NextResponse } from "next/server"
import { getIndexNowLogs } from "@/lib/indexnow"

export async function GET() {
  try {
    const logs = getIndexNowLogs()

    return NextResponse.json({
      success: true,
      count: logs.length,
      logs,
    })
  } catch (error) {
    console.error("[indexnow-logs] Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch logs" }, { status: 500 })
  }
}
