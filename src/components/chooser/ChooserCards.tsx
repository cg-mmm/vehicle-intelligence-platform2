"use client"

import { motion } from "framer-motion"
import { Check, X, DollarSign, Zap, Shield, Sparkles } from "lucide-react"
import { useState } from "react"

export interface ChooserOption {
  id: string
  name: string
  tagline: string
  price: string
  image?: string
  pros: string[]
  cons: string[]
  bestFor: string[]
  rating: number
  badge?: {
    label: string
    variant: "best" | "value" | "premium" | "popular"
  }
}

export interface ChooserCardsProps {
  title: string
  description?: string
  options: ChooserOption[]
  onSelect?: (optionId: string) => void
}

const BADGE_STYLES = {
  best: {
    bg: "bg-gradient-to-r from-green-500 to-emerald-500",
    icon: Sparkles,
    label: "Best Overall",
  },
  value: {
    bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
    icon: DollarSign,
    label: "Best Value",
  },
  premium: {
    bg: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: Zap,
    label: "Premium Pick",
  },
  popular: {
    bg: "bg-gradient-to-r from-orange-500 to-amber-500",
    icon: Shield,
    label: "Most Popular",
  },
}

export function ChooserCards({ title, description, options, onSelect }: ChooserCardsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = (optionId: string) => {
    setSelectedId(optionId)
    onSelect?.(optionId)
  }

  return (
    <div className="my-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-brand-gradient">{title}</h2>
        {description && <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>}
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {options.map((option, index) => {
          const isSelected = selectedId === option.id
          const badgeStyle = option.badge ? BADGE_STYLES[option.badge.variant] : null
          const BadgeIcon = badgeStyle?.icon

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative rounded-2xl border shadow-lg p-6 space-y-6 transition-all cursor-pointer ${
                isSelected
                  ? "ring-2 ring-primary border-primary bg-primary/5"
                  : "hover:border-primary/50 hover:shadow-xl bg-card"
              }`}
              onClick={() => handleSelect(option.id)}
            >
              {/* Badge */}
              {badgeStyle && BadgeIcon && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div
                    className={`${badgeStyle.bg} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg`}
                  >
                    <BadgeIcon className="w-3 h-3" />
                    {option.badge?.label || badgeStyle.label}
                  </div>
                </div>
              )}

              {/* Image */}
              {option.image && (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={option.image || "/placeholder.svg"}
                    alt={option.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-foreground">{option.name}</h3>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="p-1 rounded-full bg-primary text-primary-foreground"
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{option.tagline}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{option.price}</span>
                  <span className="text-sm text-muted-foreground">MSRP</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full ${i < option.rating ? "bg-[color:var(--warning)]" : "bg-muted"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">{option.rating}/5</span>
              </div>

              {/* Pros */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground">Pros</div>
                <ul className="space-y-1">
                  {option.pros.slice(0, 3).map((pro, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Check className="w-4 h-4 text-[color:var(--success)] shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground">Cons</div>
                <ul className="space-y-1">
                  {option.cons.slice(0, 2).map((con, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <X className="w-4 h-4 text-[color:var(--error)] shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best For */}
              <div className="space-y-2 pt-4 border-t">
                <div className="text-sm font-semibold text-foreground">Best For</div>
                <div className="flex flex-wrap gap-2">
                  {option.bestFor.map((tag, i) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-muted text-xs font-medium text-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Select Button */}
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(option.id)
                }}
              >
                {isSelected ? "Selected" : "Select This Option"}
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Selection Summary */}
      {selectedId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border bg-[color:var(--success)]/10 border-[color:var(--success)]/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[color:var(--success)]/20">
              <Check className="w-5 h-5 text-[color:var(--success)]" />
            </div>
            <div>
              <div className="font-semibold text-foreground">
                You selected: {options.find((o) => o.id === selectedId)?.name}
              </div>
              <div className="text-sm text-muted-foreground">
                Great choice! This option is {options.find((o) => o.id === selectedId)?.tagline.toLowerCase()}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
