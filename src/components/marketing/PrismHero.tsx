"use client"

import type React from "react"

import { motion } from "framer-motion"

interface PrismHeroProps {
  title: string
  subtitle?: string
  ctaPrimary?: { text: string; href: string }
  ctaSecondary?: { text: string; href: string }
  adSlot?: React.ReactNode
}

export function PrismHero({ title, subtitle, ctaPrimary, ctaSecondary, adSlot }: PrismHeroProps) {
  return (
    <header className="relative blobfield legible">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-[color:var(--panel)]/80 backdrop-blur border border-[color:var(--border)] shadow-[var(--shadow-soft)] p-6 md:p-10"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[color:var(--fg)]">{title}</h1>
          {subtitle && <p className="mt-3 text-[color:var(--fg-muted)] max-w-2xl text-lg">{subtitle}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            {ctaPrimary && (
              <a
                href={ctaPrimary.href}
                className="bg-cta-gradient text-white shadow-[var(--shadow-cta)] cta-pulse cta-sheen px-5 py-3 rounded-lg font-semibold focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] hover:brightness-110 active:scale-[.98] transition-all"
              >
                {ctaPrimary.text}
              </a>
            )}
            {ctaSecondary && (
              <a
                href={ctaSecondary.href}
                className="bg-[color:var(--panel)] border border-[color:var(--border)] text-[color:var(--fg)] shadow-[var(--shadow-soft)] px-5 py-3 rounded-lg font-semibold hover:bg-[color:var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] transition-all"
              >
                {ctaSecondary.text}
              </a>
            )}
          </div>

          {/* Monetization slot */}
          {adSlot && <div className="mt-8">{adSlot}</div>}
        </motion.div>
      </div>
    </header>
  )
}

// Ad Frame component for monetization
export function AdFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[color:var(--panel)] border border-[color:var(--border)] shadow-[var(--shadow-soft)] p-4 md:p-5 hover:shadow-lg transition-shadow">
      {children}
    </div>
  )
}

// Example ad slot content
export function HeroAdSlot() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="ad-kicker text-sm">Limited-Time Offer</div>
        <div className="text-2xl md:text-3xl font-bold ad-price">Save up to $1,250</div>
        <div className="ad-subtext mt-1 text-sm">On select models with approved credit.</div>
      </div>
      <AdFrame>
        <div className="text-sm text-[color:var(--fg-muted)]">Sponsored</div>
        <div className="mt-1 font-semibold text-[color:var(--fg)]">Zero-Down Payment Options</div>
        <a
          href="#"
          className="mt-3 w-full block text-center bg-cta-gradient text-white shadow-[var(--shadow-cta)] cta-sheen px-4 py-2 rounded-lg font-semibold hover:brightness-110 transition-all"
        >
          Check Eligibility
        </a>
      </AdFrame>
    </div>
  )
}
