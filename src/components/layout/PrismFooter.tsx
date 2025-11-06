"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"

export function PrismFooter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Newsletter signup:", email)
    // Handle newsletter signup
  }

  return (
    <footer className="relative blobfield legible border-t border-[color:var(--border)] mt-16">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-brand-gradient">Vehicle Intel</h2>
          <p className="text-sm text-[color:var(--fg-muted)] mt-3">
            Data-driven automotive insights that help buyers decide and dealers win.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-[color:var(--fg)] font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                className="text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] transition-colors"
                href="/vehicles"
              >
                Vehicles
              </a>
            </li>
            <li>
              <a
                className="text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] transition-colors"
                href="/compare"
              >
                Compare
              </a>
            </li>
            <li>
              <a
                className="text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] transition-colors"
                href="/insights"
              >
                Insights
              </a>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-[color:var(--fg)] font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                className="text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] transition-colors"
                href="/about"
              >
                About
              </a>
            </li>
            <li>
              <a
                className="text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] transition-colors"
                href="/careers"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                className="text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] transition-colors"
                href="/contact"
              >
                Contact
              </a>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-[color:var(--fg)] font-semibold mb-3">Get Updates</h3>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--fg)] placeholder-[color:var(--fg-muted)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-cta-gradient text-white shadow-[var(--shadow-cta)] cta-sheen px-4 py-2 rounded-lg font-semibold hover:brightness-110 transition-all"
            >
              Join
            </button>
          </form>
        </motion.div>
      </div>

      <div className="border-t border-[color:var(--border)]/50 py-6 text-center text-xs text-[color:var(--fg-muted)]">
        © 2025 Vehicle Intelligence Platform. All rights reserved.
      </div>
    </footer>
  )
}
