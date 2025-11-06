"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SpecGridBlock } from "@/lib/contracts"

interface SpecGridProps {
  block: SpecGridBlock
}

function renderValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value)
  }
  if (value && typeof value === "object") {
    if ("label" in value) return String(value.label)
    if ("value" in value) return String(value.value)
  }
  return String(value)
}

export function SpecGrid({ block }: SpecGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {block.groups.map((group, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{group.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              {group.items.map((item, j) => (
                <div key={j} className="flex justify-between items-center">
                  <dt className="text-sm text-fg-muted">{renderValue(item.label)}</dt>
                  <dd className="text-sm font-semibold text-fg">{renderValue(item.value)}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
