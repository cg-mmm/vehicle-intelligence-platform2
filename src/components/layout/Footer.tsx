"use client"

import type React from "react"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Car, Github, Twitter, Linkedin, Mail, ArrowRight, Sparkles } from "lucide-react"
import { useState } from "react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const { scrollYProgress } = useScroll()

  const y = useTransform(scrollYProgress, [0, 1], [0, -20])

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Use Cases", href: "#use-cases" },
        { label: "Roadmap", href: "#roadmap" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#docs" },
        { label: "API Reference", href: "#api" },
        { label: "Guides", href: "#guides" },
        { label: "Blog", href: "#blog" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Authors", href: "/authors/john-smith" },
        { label: "Editorial Policy", href: "/editorial-policy" },
        { label: "Review Process", href: "/review-process" },
        { label: "Careers", href: "#careers" },
        { label: "Contact", href: "#contact" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Github, href: "#github", label: "GitHub" },
    { icon: Twitter, href: "#twitter", label: "Twitter" },
    { icon: Linkedin, href: "#linkedin", label: "LinkedIn" },
    { icon: Mail, href: "#email", label: "Email" },
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Newsletter signup:", email)
    setEmail("")
  }

  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--border)] bg-brand-gradient">
      <motion.div style={{ y }} className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 group mb-4">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 bg-brand-gradient" />
                  <div className="relative w-12 h-12 rounded-xl flex items-center justify-center bg-brand-gradient shadow-lg">
                    <Car className="w-7 h-7 text-[color:var(--fg-contrast)]" />
                  </div>
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-brand-gradient">Vehicle Intel</span>
                  <span className="text-xs text-[color:var(--fg-muted)]">Automotive Intelligence</span>
                </div>
              </Link>
              <p className="text-sm leading-relaxed mb-6 max-w-xs text-[color:var(--fg-muted)]">
                Advanced automotive data and insights built for the next era of intelligent dealerships and informed
                buyers.
              </p>

              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.15, rotate: 3, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 bg-[color:var(--muted)] border border-[color:var(--border)] text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] hover:bg-[color:var(--panel)] neon-glow-hover"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  )
                })}
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold mb-4 tracking-wide text-[color:var(--fg)]">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm inline-flex items-center gap-1 group transition-all duration-200 text-[color:var(--fg-muted)] hover:text-[color:var(--accent)]"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[color:var(--accent)]" />
                <h3 className="text-sm font-semibold tracking-wide text-[color:var(--fg)]">Stay Updated</h3>
              </div>
              <p className="text-sm mb-4 leading-relaxed text-[color:var(--fg-muted)]">
                Subscribe to the latest data drops and automotive insights.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 focus:ring-2 focus-visible:ring-[color:var(--focus-ring)] bg-[color:var(--panel)] border border-[color:var(--border)] text-[color:var(--fg)] placeholder:text-[color:var(--fg-muted)]"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-cta-gradient text-[color:var(--fg-contrast)] shadow-cta vortex-shimmer hover:brightness-110 active:scale-[.98] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 mt-8 border-t border-[color:var(--border)]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
              <p className="text-sm text-[color:var(--fg-muted)]">
                © {currentYear} Vehicle Intelligence Platform. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <Link
                  href="#privacy"
                  className="transition-colors duration-200 text-[color:var(--fg-muted)] hover:text-[color:var(--accent)]"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#terms"
                  className="transition-colors duration-200 text-[color:var(--fg-muted)] hover:text-[color:var(--accent)]"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
