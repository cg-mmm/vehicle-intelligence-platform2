import { type NextRequest, NextResponse } from "next/server"
import { parseArticle } from "@/lib/articleSchema"
import { generateArticleWithOpenAI } from "@/lib/openai-generator"

export const runtime = "nodejs"
export const maxDuration = 60 // Allow up to 60 seconds for OpenAI generation

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] Generate API called")

    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] OPENAI_API_KEY environment variable is not set")
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.",
          success: false,
        },
        { status: 500 },
      )
    }

    console.log("[v0] OpenAI API key is configured")

    const body = await req.json()
    const { title, models, customInstructions } = body

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    console.log("[v0] Generating article with OpenAI for:", title)
    console.log("[v0] Custom instructions provided:", Object.keys(customInstructions || {}).length, "fields")

    // Generate article using OpenAI
    const article = await generateArticleWithOpenAI({
      title,
      models,
      customInstructions,
    })

    console.log("[v0] Validating generated article")

    // Validate the generated article against schema
    const validatedArticle = parseArticle(article)

    console.log("[v0] Article generated and validated successfully")

    return NextResponse.json({
      success: true,
      article: validatedArticle,
    })
  } catch (error) {
    console.error("[v0] Generate API error:")
    console.error("[v0] Error type:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

    const errorMessage = error instanceof Error ? error.message : "Failed to generate article"

    return NextResponse.json(
      {
        error: errorMessage,
        success: false,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

// GET endpoint for diagnostics
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Generate API is running",
    timestamp: new Date().toISOString(),
    env: {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      runtime: "nodejs",
      maxDuration: 60,
    },
  })
}
