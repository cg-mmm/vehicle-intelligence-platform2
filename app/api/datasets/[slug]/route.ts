import { type NextRequest, NextResponse } from "next/server"
import { getArticle } from "@/lib/storage"
import type { ComparisonTableBlock } from "@/lib/contracts"

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const format = req.nextUrl.searchParams.get("format") || "csv"

    // Load article
    const article = await getArticle(slug)
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Find comparison table block
    const comparisonBlock = article.blocks.find(
      (block): block is ComparisonTableBlock => block.type === "comparisonTable",
    )

    if (!comparisonBlock) {
      return NextResponse.json({ error: "No comparison table found" }, { status: 404 })
    }

    // Generate filename
    const filename = `${slug}-comparison.${format}`

    if (format === "csv") {
      // Generate CSV
      const csv = generateCSV(comparisonBlock)
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      })
    } else if (format === "json") {
      // Generate JSON
      const json = JSON.stringify(
        {
          title: article.title,
          slug: article.slug,
          data: {
            columns: comparisonBlock.columns,
            rows: comparisonBlock.rows,
          },
        },
        null,
        2,
      )
      return new NextResponse(json, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      })
    } else {
      return NextResponse.json({ error: "Invalid format. Use csv or json" }, { status: 400 })
    }
  } catch (error) {
    console.error("[datasets] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateCSV(block: ComparisonTableBlock): string {
  const lines: string[] = []

  // Header row
  lines.push(block.columns.map((col) => escapeCSV(col)).join(","))

  // Data rows
  for (const row of block.rows) {
    const values = block.columns.map((col) => {
      const value = row[col]
      return escapeCSV(String(value ?? ""))
    })
    lines.push(values.join(","))
  }

  return lines.join("\n")
}

function escapeCSV(value: string): string {
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
