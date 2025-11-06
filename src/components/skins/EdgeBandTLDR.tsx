"use client"

import { motion } from "framer-motion"
import { Sparkles, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { LiquidBlobs } from "../visual/LiquidBlobs"

interface EdgeBandTLDRProps {
  content: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EdgeBandTLDR({ content, isOpen = false, onOpenChange }: EdgeBandTLDRProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-sm shadow-soft overflow-hidden h-full"
    >
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CollapsibleTrigger className="w-full p-8 flex items-center justify-between gap-3 hover:bg-muted/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-brand-gradient">TL;DR</h3>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="shrink-0"
          >
            <ChevronDown className="w-6 h-6 text-primary group-hover:text-primary/70 transition-colors" />
          </motion.div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <LiquidBlobs />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 px-8 pb-8 space-y-4"
            >
              <p className="text-lg text-foreground leading-relaxed">{content}</p>

              <div className="pt-4 border-t border-border space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Key Highlights</h4>
                <ul className="space-y-2">
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>Comprehensive comparison of top midsize sedans in the 2026 model year</span>
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>Analysis based on verified data from NHTSA, EPA, and manufacturer sources</span>
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    <span>Expert recommendations for different buyer priorities and budgets</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground italic">
                  This summary provides a quick overview of our findings. Expand the sections below for detailed
                  analysis, specifications, and expert insights.
                </p>
              </div>
            </motion.div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  )
}
