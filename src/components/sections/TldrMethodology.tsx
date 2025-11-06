"use client"

import { Appear } from "@/components/motion/Appear"
import {
  CheckCircle2,
  Database,
  ChevronDown,
  Award,
  TrendingUp,
  DollarSign,
  Zap,
  Trophy,
  Star,
  Target,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

type TLDRItem = { label: string; value: string }
type Source = { name: string; url: string }
type Winner = {
  name: string
  reasons: string[]
  score: number
  highlights: { label: string; value: string }[]
}

export function TldrMethodology({
  tldr,
  sources,
  winner,
}: {
  tldr: TLDRItem[]
  sources: Source[]
  winner?: Winner
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="relative overflow-hidden bg-brand-gradient">
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-3">
        <Appear>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Column 1: TL;DR */}
            <div className="rounded-xl overflow-hidden shadow-cta">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 bg-cta-gradient text-[color:var(--accent-foreground)] shadow-cta cta-pulse hover:brightness-110 active:scale-[.99] focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <h3 className="text-base font-bold">TL;DR</h3>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-[color:var(--panel)]/95 backdrop-blur border-x border-b border-[color:var(--border)]"
                  >
                    <div className="p-3 space-y-1.5">
                      {tldr.map((it, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-1.5 rounded-lg bg-[color:var(--muted)]/50">
                          <div className="mt-0.5">
                            {idx === 0 && <Award className="h-4 w-4 text-[color:var(--accent)]" />}
                            {idx === 1 && <TrendingUp className="h-4 w-4 text-[color:var(--accent)]" />}
                            {idx === 2 && <DollarSign className="h-4 w-4 text-[color:var(--accent)]" />}
                            {idx > 2 && <Zap className="h-4 w-4 text-[color:var(--accent)]" />}
                          </div>
                          <div className="flex-1">
                            <div className="text-[color:var(--fg-muted)] text-xs font-medium uppercase tracking-wide mb-0.5">
                              {it.label}
                            </div>
                            <div className="text-[color:var(--fg)] text-sm font-semibold">{it.value}</div>
                          </div>
                        </div>
                      ))}

                      <div className="p-1.5 rounded-lg bg-[color:var(--accent)]/10 border border-[color:var(--accent)]/20">
                        <p className="text-xs text-[color:var(--fg-muted)] leading-relaxed">
                          <strong className="text-[color:var(--fg)]">Why this matters:</strong> These key metrics
                          represent the most important factors when comparing vehicles in this segment.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Column 2: Methodology */}
            <div className="rounded-xl overflow-hidden shadow-cta">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 bg-cta-gradient text-[color:var(--accent-foreground)] shadow-cta cta-pulse hover:brightness-110 active:scale-[.99] focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    <h3 className="text-base font-bold">Methodology</h3>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-[color:var(--panel)]/95 backdrop-blur border-x border-b border-[color:var(--border)]"
                  >
                    <div className="p-3 space-y-1.5">
                      <div className="space-y-1">
                        <div className="p-1.5 rounded-lg bg-[color:var(--muted)]/50">
                          <h4 className="text-[color:var(--fg)] font-semibold text-xs mb-0.5 flex items-center gap-2">
                            <Database className="h-3 w-3 text-[color:var(--accent)]" />
                            Data Collection
                          </h4>
                          <p className="text-xs text-[color:var(--fg-muted)] leading-relaxed">
                            Compiled from official OEM specs, press kits, and dealer guides. Cross-referenced for
                            accuracy.
                          </p>
                        </div>

                        <div className="p-1.5 rounded-lg bg-[color:var(--muted)]/50">
                          <h4 className="text-[color:var(--fg)] font-semibold text-xs mb-0.5 flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-[color:var(--accent)]" />
                            Testing & Validation
                          </h4>
                          <p className="text-xs text-[color:var(--fg-muted)] leading-relaxed">
                            Independent testing normalizes units and validates manufacturer claims across publications.
                          </p>
                        </div>

                        <div className="p-1.5 rounded-lg bg-[color:var(--muted)]/50">
                          <h4 className="text-[color:var(--fg)] font-semibold text-xs mb-0.5 flex items-center gap-2">
                            <Award className="h-3 w-3 text-[color:var(--accent)]" />
                            Trim Analysis
                          </h4>
                          <p className="text-xs text-[color:var(--fg-muted)] leading-relaxed">
                            Trim levels parsed with model-year deltas tracked. Pricing includes destination charges.
                          </p>
                        </div>

                        <div className="p-1.5 rounded-lg bg-[color:var(--muted)]/50">
                          <h4 className="text-[color:var(--fg)] font-semibold text-xs mb-0.5 flex items-center gap-2">
                            <Zap className="h-3 w-3 text-[color:var(--accent)]" />
                            Real-World Factors
                          </h4>
                          <p className="text-xs text-[color:var(--fg-muted)] leading-relaxed">
                            Incorporates fuel economy, maintenance costs, and reliability data from consumer reports.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[color:var(--fg)] font-semibold text-xs mb-1">Verified Sources</h4>
                        <div className="flex flex-wrap gap-1">
                          {sources.map((s, i) => (
                            <a
                              key={i}
                              href={s.url}
                              target="_blank"
                              rel="noreferrer nofollow noopener"
                              className="inline-flex items-center gap-1 rounded px-2 py-0.5 border border-[color:var(--border)] bg-[color:var(--muted)] text-xs text-[color:var(--fg)] hover:bg-[color:var(--panel)] hover:border-[color:var(--accent)]/50 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] transition-all neon-glow-hover"
                            >
                              <span className="font-medium">{s.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>

                      <div className="p-1.5 rounded-lg bg-[color:var(--link)]/10 border border-[color:var(--link)]/20">
                        <p className="text-xs text-[color:var(--fg-muted)] leading-relaxed">
                          <strong className="text-[color:var(--fg)]">Transparency:</strong> Editorial independence
                          maintained. No payment for rankings.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Column 3: Winner Highlight */}
            <div className="rounded-xl overflow-hidden shadow-cta">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 bg-cta-gradient text-[color:var(--accent-foreground)] shadow-cta cta-pulse hover:brightness-110 active:scale-[.99] focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    <h3 className="text-base font-bold">Winner Highlight</h3>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-[color:var(--panel)]/95 backdrop-blur border-x border-b border-[color:var(--accent)]"
                  >
                    <div className="p-3 space-y-1.5">
                      {winner ? (
                        <>
                          <div className="text-center p-2 rounded-lg bg-gradient-to-br from-[color:var(--accent)]/20 to-[color:var(--accent)]/5 border border-[color:var(--accent)]/30">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Star className="h-4 w-4 text-[color:var(--accent)] fill-[color:var(--accent)]" />
                              <h4 className="text-[color:var(--fg)] text-base font-bold">{winner.name}</h4>
                              <Star className="h-4 w-4 text-[color:var(--accent)] fill-[color:var(--accent)]" />
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-2xl font-bold text-[color:var(--accent)]">{winner.score}</span>
                              <span className="text-xs text-[color:var(--fg-muted)]">/ 100</span>
                            </div>
                            <p className="text-xs text-[color:var(--fg-muted)] mt-0.5">Overall Score</p>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-[color:var(--fg)] font-semibold text-xs flex items-center gap-2">
                              <Target className="h-3 w-3 text-[color:var(--accent)]" />
                              Key Strengths
                            </h4>
                            {winner.highlights.map((highlight, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 p-1.5 rounded-lg bg-[color:var(--muted)]/50"
                              >
                                <CheckCircle2 className="h-4 w-4 text-[color:var(--accent)] mt-0.5 shrink-0" />
                                <div className="flex-1">
                                  <div className="text-[color:var(--fg-muted)] text-xs font-medium">
                                    {highlight.label}
                                  </div>
                                  <div className="text-[color:var(--fg)] text-sm font-semibold">{highlight.value}</div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[color:var(--accent)]/10 to-transparent border border-[color:var(--accent)]/20">
                            <h4 className="text-[color:var(--fg)] font-semibold text-xs mb-1">Why It Wins</h4>
                            <ul className="space-y-0.5">
                              {winner.reasons.map((reason, idx) => (
                                <li
                                  key={idx}
                                  className="text-xs text-[color:var(--fg-muted)] leading-relaxed flex items-start gap-2"
                                >
                                  <span className="text-[color:var(--accent)] mt-0.5">•</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-3 text-[color:var(--fg-muted)] text-sm">
                          <Trophy className="h-6 w-6 mx-auto mb-1.5 text-[color:var(--accent)]/50" />
                          <p>Winner analysis coming soon</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Appear>
      </div>
    </section>
  )
}
