"use client"

import type { ComparisonMatrixSection } from "@/lib/content-schema"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { GitCompare, Trophy, CheckCircle2 } from "lucide-react"
import { Badge } from "./ui/badge"

interface ComparisonMatrixProps {
  section: ComparisonMatrixSection
  brandColor: string
}

export function ComparisonMatrix({ section, brandColor }: ComparisonMatrixProps) {
  const isBestValue = (rowIdx: number, colIdx: number) => {
    const row = section.rows[rowIdx]
    const value = row.values[colIdx]

    // Simple heuristic: check if it's the highest number or contains positive keywords
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      const maxValue = Math.max(...row.values.map((v) => Number.parseFloat(v)).filter((n) => !isNaN(n)))
      return numValue === maxValue
    }

    return (
      value.toLowerCase().includes("yes") ||
      value.toLowerCase().includes("standard") ||
      value.toLowerCase().includes("included")
    )
  }

  return (
    <Card className="overflow-hidden border-2 hover:shadow-lg transition-shadow duration-300">
      {section.title && (
        <CardHeader className="relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{ background: `linear-gradient(135deg, ${brandColor} 0%, transparent 100%)` }}
          />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${brandColor}20` }}>
              <GitCompare className="w-5 h-5" style={{ color: brandColor }} />
            </div>
            <CardTitle>{section.title}</CardTitle>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="py-4 px-4 text-left text-sm font-semibold">Specification</th>
                {section.columns.map((col, idx) => (
                  <th key={idx} className="py-4 px-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      {idx === 0 && <Trophy className="w-4 h-4" style={{ color: brandColor }} />}
                      {col}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {section.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-muted/50 transition-all duration-200 group">
                  <td className="py-4 px-4 font-medium text-sm">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                      {row.label}
                    </span>
                  </td>
                  {row.values.map((val, valIdx) => {
                    const isBest = isBestValue(rowIdx, valIdx)
                    return (
                      <td key={valIdx} className="py-4 px-4 text-sm">
                        <div className="flex items-center gap-2">
                          {isBest && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: brandColor }} />}
                          <span className={isBest ? "font-semibold" : "text-muted-foreground"}>{val}</span>
                          {isBest && (
                            <Badge
                              variant="secondary"
                              className="ml-1 text-xs"
                              style={{
                                backgroundColor: `${brandColor}20`,
                                color: brandColor,
                              }}
                            >
                              Best
                            </Badge>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
