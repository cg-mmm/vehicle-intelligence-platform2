"use client"

import { useEffect, useState, type ReactNode } from "react"

interface LazyHydrateProps {
  children: ReactNode
  whenIdle?: boolean
  whenVisible?: boolean
  rootMargin?: string
}

export function LazyHydrate({ children, whenIdle, whenVisible, rootMargin = "200px" }: LazyHydrateProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (whenIdle) {
      // Hydrate when browser is idle
      if ("requestIdleCallback" in window) {
        const id = requestIdleCallback(() => setIsHydrated(true), { timeout: 500 })
        return () => cancelIdleCallback(id)
      } else {
        const timeout = setTimeout(() => setIsHydrated(true), 1)
        return () => clearTimeout(timeout)
      }
    }

    if (whenVisible) {
      // Hydrate when component becomes visible
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsHydrated(true)
            observer.disconnect()
          }
        },
        { rootMargin },
      )

      const element = document.getElementById("lazy-hydrate-target")
      if (element) {
        observer.observe(element)
      }

      return () => observer.disconnect()
    }

    // Default: hydrate immediately
    setIsHydrated(true)
  }, [whenIdle, whenVisible, rootMargin])

  if (!isHydrated) {
    return <div id="lazy-hydrate-target" suppressHydrationWarning />
  }

  return <>{children}</>
}
