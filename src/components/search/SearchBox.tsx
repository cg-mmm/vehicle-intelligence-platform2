"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, FileText, Video, HelpCircle, BookOpen, Layers } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { SearchSuggestResponse } from "@/lib/search/contracts"
import { cn } from "@/lib/utils"

export function SearchBox() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestResponse | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Debounced search
  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions(null)
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setSuggestions(data)
        setIsOpen(true)
        setSelectedIndex(0)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!suggestions || suggestions.suggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < suggestions.suggestions.length) {
        const selected = suggestions.suggestions[selectedIndex]
        router.push(selected.doc.url)
        setIsOpen(false)
        setQuery("")
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`)
        setIsOpen(false)
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  function getKindIcon(kind: string) {
    switch (kind) {
      case "article":
        return <FileText className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      case "faq":
        return <HelpCircle className="w-4 h-4" />
      case "pillar":
        return <BookOpen className="w-4 h-4" />
      case "section":
      case "cluster":
        return <Layers className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  function getKindBadge(kind: string) {
    const badges: Record<string, string> = {
      video: "VIDEO",
      faq: "FAQ",
      pillar: "PILLAR",
      section: "SECTION",
      cluster: "CLUSTER",
    }
    return badges[kind]
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search articles, videos, FAQs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2 bg-card/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={isOpen}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions && suggestions.suggestions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-2xl overflow-hidden z-50"
            id="search-suggestions"
            role="listbox"
          >
            <div className="p-2 max-h-96 overflow-y-auto">
              {suggestions.suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.doc.id}
                  onClick={() => {
                    router.push(suggestion.doc.url)
                    setIsOpen(false)
                    setQuery("")
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    index === selectedIndex ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                  )}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <div className="mt-1">{getKindIcon(suggestion.doc.kind)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{suggestion.doc.title}</span>
                      {getKindBadge(suggestion.doc.kind) && (
                        <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                          {getKindBadge(suggestion.doc.kind)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{suggestion.doc.summary}</p>
                    {suggestion.doc.pillar && (
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {suggestion.doc.pillar.title}
                        {suggestion.doc.section && ` › ${suggestion.doc.section.title}`}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded">Enter</kbd> to view all results
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
