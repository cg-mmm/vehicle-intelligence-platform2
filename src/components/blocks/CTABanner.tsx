"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import type { CTABannerBlock } from "@/lib/contracts"

interface CTABannerProps {
  block: CTABannerBlock
}

function renderLabel(value: any): string {
  if (typeof value === "string") return value
  if (typeof value === "number") return String(value)
  if (value && typeof value === "object") {
    if ("label" in value) return String(value.label)
    if ("value" in value) return String(value.value)
  }
  return String(value || "")
}

export function CTABanner({ block }: CTABannerProps) {
  return (
    <Card className="bg-primary/10 border-primary/20 shadow-soft">
      <CardContent className="py-12 text-center">
        <h3 className="text-3xl font-bold mb-2 text-foreground">{renderLabel(block.heading)}</h3>
        {block.sub && <p className="text-muted-foreground mb-6">{renderLabel(block.sub)}</p>}
        <Button
          asChild
          size="lg"
          className="bg-cta-gradient text-white hover:brightness-110 shadow-cta cta-pulse focus-visible:ring-2 focus-visible:ring-focus"
        >
          <a href={block.href}>
            {renderLabel(block.label)}
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
