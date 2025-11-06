import { EdgeBandTLDR } from "../skins/EdgeBandTLDR"

interface TLDRProps {
  content: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TLDR({ content, isOpen, onOpenChange }: TLDRProps) {
  return (
    <div className="relative">
      {/* Removed LiquidBlobs from here since it's now in the parent container in ArticleView */}
      <EdgeBandTLDR content={content} isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  )
}
