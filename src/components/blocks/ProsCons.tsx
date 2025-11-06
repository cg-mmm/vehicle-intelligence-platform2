"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"
import type { ProsConsBlock } from "@/lib/contracts"

interface ProsConsProps {
  block: ProsConsBlock
}

export function ProsCons({ block }: ProsConsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-[color:var(--color-success)]/20 bg-[color:var(--color-success)]/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[color:var(--color-success)]">
            <CheckCircle2 className="w-5 h-5" />
            Pros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {block.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[color:var(--color-success)]" />
                <span className="text-sm text-foreground">{pro}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-[color:var(--color-error)]/20 bg-[color:var(--color-error)]/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[color:var(--color-error)]">
            <XCircle className="w-5 h-5" />
            Cons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {block.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2">
                <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-[color:var(--color-error)]" />
                <span className="text-sm text-foreground">{con}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
