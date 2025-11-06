"use client"

import { motion } from "framer-motion"
import type { LsiLongformBlock } from "@/lib/contracts"
import ReactMarkdown from "react-markdown"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Target,
  CheckCircle2,
  Info,
  Lightbulb,
  DollarSign,
  Award,
} from "lucide-react"

interface LsiLongformProps {
  block: LsiLongformBlock
  index?: number
}

export function LsiLongform({ block, index = 0 }: LsiLongformProps) {
  const useAlternateBackground = index % 2 === 1
  const bgClass = useAlternateBackground ? "bg-muted/30" : "bg-background"
  const borderClass = useAlternateBackground ? "border-y border-border/50" : ""

  const getClusterIcon = (topic: string) => {
    const topicLower = topic.toLowerCase()
    if (topicLower.includes("financial") || topicLower.includes("cost")) return DollarSign
    if (topicLower.includes("safety") || topicLower.includes("security")) return Shield
    if (topicLower.includes("technology") || topicLower.includes("tech")) return Zap
    if (topicLower.includes("value") || topicLower.includes("practical")) return Target
    if (topicLower.includes("performance")) return TrendingUp
    return Award
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative ${bgClass} ${borderClass} -mx-4 md:-mx-8 px-4 md:px-8 py-12`}
    >
      <div className="relative h-1 w-full mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>

      <div className="space-y-10 max-w-5xl mx-auto">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">📊 Deep Dive Analysis</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold leading-tight"
          >
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {block.heading}
            </span>
          </motion.h2>
        </div>

        {block.semantic_clusters && block.semantic_clusters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {block.semantic_clusters.map((cluster, idx) => {
              const Icon = getClusterIcon(cluster.topic)
              const cardBg = idx % 2 === 0 ? "from-background to-muted/20" : "from-muted/30 to-background"
              return (
                <div
                  key={idx}
                  className={`group relative p-4 rounded-xl border border-border/50 bg-gradient-to-br ${cardBg} hover:border-primary/30 transition-all duration-300`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-2 text-foreground">{cluster.topic}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {cluster.related_terms.slice(0, 3).map((term, termIdx) => (
                          <Badge key={termIdx} variant="secondary" className="text-xs px-2 py-0.5">
                            {term}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-12 mb-6 text-foreground scroll-mt-24 flex items-center gap-3">
                  <Lightbulb className="w-7 h-7 text-primary" />
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <div className="mt-12 mb-6 scroll-mt-24">
                  <div className="h-px w-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 mb-6" />
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                    {children}
                  </h2>
                </div>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground scroll-mt-24 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-medium mt-6 mb-3 text-foreground/90 scroll-mt-24">{children}</h4>
              ),
              h5: ({ children }) => (
                <h5 className="text-base font-medium mt-4 mb-2 text-muted-foreground scroll-mt-24">{children}</h5>
              ),
              p: ({ children }) => (
                <p className="mb-5 leading-relaxed text-foreground/90 text-lg max-w-[75ch]">{children}</p>
              ),
              ul: ({ children }) => <ul className="mb-6 space-y-3 list-none pl-0">{children}</ul>,
              ol: ({ children }) => <ol className="mb-6 space-y-3 list-none pl-0 counter-reset-list">{children}</ol>,
              li: ({ children }) => (
                <li className="flex items-start gap-3 leading-relaxed pl-0">
                  <div className="mt-1.5 p-1 rounded-full bg-primary/10 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <span className="flex-1">{children}</span>
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="relative border-l-4 border-primary pl-6 pr-6 py-4 my-8 rounded-r-lg bg-primary/5">
                  <div className="absolute top-4 left-4 text-primary/20">
                    <Info className="w-6 h-6" />
                  </div>
                  <div className="pl-8 italic text-foreground/80">{children}</div>
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-foreground bg-primary/10 px-1.5 py-0.5 rounded">{children}</strong>
              ),
              em: ({ children }) => <em className="italic text-primary font-medium">{children}</em>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary hover:text-primary/80 font-medium underline decoration-primary/30 hover:decoration-primary/60 transition-colors"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              ),
            }}
          >
            {block.content_markdown}
          </ReactMarkdown>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-border/50"
        >
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <div className="p-2 rounded-lg bg-primary/20">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{block.word_count}</div>
              <div className="text-xs text-muted-foreground">Words</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-muted/30 to-muted/50 border border-border/50">
            <div className="p-2 rounded-lg bg-background/50">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground capitalize">{block.style.readability}</div>
              <div className="text-xs text-muted-foreground">Reading Level</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <div className="p-2 rounded-lg bg-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{block.keywords_used.length}</div>
              <div className="text-xs text-muted-foreground">Key Terms</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative h-1 w-full mt-12">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>
    </motion.div>
  )
}
