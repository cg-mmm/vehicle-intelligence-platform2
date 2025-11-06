"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { motion } from "framer-motion"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap mt-0 pt-4">
        <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-foreground transition-colors u-hover"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </Link>
        </motion.li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              {isLast ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-foreground transition-colors u-hover">
                  {item.label}
                </Link>
              )}
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}
