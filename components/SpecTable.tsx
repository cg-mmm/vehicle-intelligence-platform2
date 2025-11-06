"use client"

import type { SpecTableSection } from "@/lib/content-schema"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table2, TrendingUp, Award, Zap } from "lucide-react"

interface SpecTableProps {
  section: SpecTableSection
  brandColor: string
}

export function SpecTable({ section, brandColor }: SpecTableProps) {
  const getSpecIcon = (label: string) => {
    const lower = label.toLowerCase()
    if (lower.includes("power") || lower.includes("hp") || lower.includes("torque")) {
      return <Zap className="w-4 h-4" style={{ color: brandColor }} />
    }
    if (lower.includes("award") || lower.includes("rating") || lower.includes("score")) {
      return <Award className="w-4 h-4" style={{ color: brandColor }} />
    }
    if (lower.includes("efficiency") || lower.includes("mpg") || lower.includes("fuel")) {
      return <TrendingUp className="w-4 h-4" style={{ color: brandColor }} />
    }
    return null
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
              <Table2 className="w-5 h-5" style={{ color: brandColor }} />
            </div>
            <CardTitle>{section.title}</CardTitle>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-border">
              {section.rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-muted/50 transition-all duration-200 group"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  <td className="py-4 px-4 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      {getSpecIcon(row.label)}
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{row.label}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground text-right font-semibold">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
