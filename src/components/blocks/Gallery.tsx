"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import type { GalleryBlock } from "@/lib/contracts"

interface GalleryProps {
  block: GalleryBlock
}

export function Gallery({ block }: GalleryProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {block.images.map((image, i) => (
        <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-video">
            <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
          </div>
        </Card>
      ))}
    </div>
  )
}
