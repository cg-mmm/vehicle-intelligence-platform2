"use client"

import { motion } from "framer-motion"
import { Calendar, Database, FileCheck, ExternalLinkIcon, ChevronDown } from "lucide-react"
import { ExternalLinkComponent } from "@/lib/sources"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

export interface MethodologyProps {
  trimsCompared: string[]
  msrpDateISO: string
  sources: Array<{
    name: string
    url: string
    accessedDate: string
  }>
  notes?: string[]
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Methodology({
  trimsCompared,
  msrpDateISO,
  sources,
  notes,
  isOpen = false,
  onOpenChange,
}: MethodologyProps) {
  const formattedDate = new Date(msrpDateISO).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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
              <FileCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-brand-gradient">Methodology & Data Sources</h3>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="px-8 pb-8 space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Data Verification Date */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Data Last Verified</span>
                </div>
                <p className="text-lg font-bold text-foreground">{formattedDate}</p>
                <p className="text-sm text-muted-foreground">
                  All pricing, specifications, and performance data were verified as of this date.
                </p>
              </div>

              {/* Trims Compared */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Database className="w-4 h-4 text-primary" />
                  <span>Trims Compared</span>
                </div>
                <ul className="space-y-1">
                  {trimsCompared.map((trim, index) => (
                    <li key={index} className="text-sm text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {trim}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sources */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ExternalLinkIcon className="w-4 h-4 text-accent" />
                <span>Primary Data Sources</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {sources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors border border-border"
                  >
                    <div className="flex-1">
                      <ExternalLinkComponent href={source.url} accessedDate={source.accessedDate}>
                        {source.name}
                      </ExternalLinkComponent>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            {notes && notes.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="text-sm font-semibold text-foreground">Additional Notes</div>
                <ul className="space-y-2">
                  {notes.map((note, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  )
}
