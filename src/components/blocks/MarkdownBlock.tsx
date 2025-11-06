"use client"

import { motion } from "framer-motion"
import type { MarkdownBlock as MarkdownBlockType } from "@/lib/contracts"
import { Sparkles } from "lucide-react"

interface MarkdownBlockProps {
  block: MarkdownBlockType
}

export function MarkdownBlock({ block }: MarkdownBlockProps) {
  // Parse the markdown to extract heading if it starts with ##
  const lines = block.md.split("\n")
  const firstLine = lines[0]?.trim()
  const isHeading = firstLine?.startsWith("##")
  const heading = isHeading ? firstLine.replace(/^##\s*/, "") : null
  const content = isHeading ? lines.slice(1).join("\n") : block.md

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="content-module-gradient relative group"
    >
      {/* Animated gradient glow effect */}
      <motion.div
        className="absolute -inset-1 bg-grad-brand opacity-20 blur-xl rounded-2xl -z-10"
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Top accent bar with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-grad-brand overflow-hidden">
        <motion.div
          className="h-full w-1/3 bg-white/30"
          animate={{
            x: ["-100%", "400%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            repeatDelay: 2,
          }}
        />
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 left-0 w-20 h-20 opacity-10">
        <div className="absolute inset-0 bg-grad-brand rounded-br-full" />
      </div>

      {heading && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3 mb-6"
        >
          {/* Icon with gradient background */}
          <motion.div
            className="p-2.5 rounded-xl bg-grad-brand shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>

          {/* Heading with gradient text */}
          <h2 className="text-2xl font-bold text-brand-gradient">{heading}</h2>

          {/* Decorative line */}
          <div className="flex-1 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
        </motion.div>
      )}

      {/* Content with enhanced typography */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="prose prose-lg dark:prose-invert max-w-none"
      >
        <div
          className="leading-relaxed text-foreground/90"
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/\n/g, "<br />")
              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-brand-gradient">$1</strong>'),
          }}
        />
      </motion.div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tl from-[color:var(--secondary)] to-[color:var(--accent)] rounded-tl-full" />
      </div>

      {/* Hover effect - subtle glow */}
      <motion.div className="absolute inset-0 bg-grad-brand opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg pointer-events-none" />
    </motion.div>
  )
}
