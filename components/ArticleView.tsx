"use client"

import type { ContentDoc } from "@/lib/content-schema"
import { SpecTable } from "./SpecTable"
import { ComparisonMatrix } from "./ComparisonMatrix"
import { Quiz } from "./Quiz"
import { Calculator } from "./Calculator"
import { Charts } from "./Charts"
import { Button } from "./ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Badge } from "./ui/badge"
import {
  FileText,
  Table2,
  GitCompare,
  HelpCircle,
  CableIcon as CalcIcon,
  BarChart3,
  Sparkles,
  ChevronDown,
} from "lucide-react"

interface ArticleViewProps {
  doc: ContentDoc
  mode?: "preview" | "live"
}

export function ArticleView({ doc, mode = "live" }: ArticleViewProps) {
  const brandPrimary = doc.meta.brand.primary || "#3b82f6"

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "spec_table":
        return <Table2 className="w-6 h-6" />
      case "comparison_matrix":
        return <GitCompare className="w-6 h-6" />
      case "faq":
        return <HelpCircle className="w-6 h-6" />
      case "quiz":
        return <Sparkles className="w-6 h-6" />
      case "calculator":
        return <CalcIcon className="w-6 h-6" />
      case "chart":
        return <BarChart3 className="w-6 h-6" />
      default:
        return <FileText className="w-6 h-6" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="relative py-16 px-4 md:py-24 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brandPrimary}15 0%, ${brandPrimary}05 100%)`,
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ background: brandPrimary }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse"
            style={{ background: brandPrimary, animationDelay: "1s" }}
          />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          {mode === "preview" && (
            <Badge variant="secondary" className="mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
              Preview Mode
            </Badge>
          )}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700">
            {doc.meta.title}
          </h1>
          {doc.meta.subtitle && (
            <p className="text-xl text-muted-foreground text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              {doc.meta.subtitle}
            </p>
          )}
          {doc.meta.hero?.tagline && (
            <p className="text-lg text-muted-foreground mt-4 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              {doc.meta.hero.tagline}
            </p>
          )}

          <div className="flex justify-center mt-12 animate-bounce">
            <ChevronDown className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
        {doc.sections.map((section, idx) => {
          const animationDelay = `${idx * 100}ms`

          switch (section.type) {
            case "rich":
              return (
                <div
                  key={idx}
                  className="prose prose-lg dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay }}
                >
                  <div className="flex items-center gap-3 mb-6 not-prose">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${brandPrimary}20` }}>
                      {getSectionIcon(section.type)}
                    </div>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: section.html }} />
                </div>
              )

            case "spec_table":
              return (
                <div
                  key={idx}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay }}
                >
                  <SpecTable section={section} brandColor={brandPrimary} />
                </div>
              )

            case "comparison_matrix":
              return (
                <div
                  key={idx}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay }}
                >
                  <ComparisonMatrix section={section} brandColor={brandPrimary} />
                </div>
              )

            case "faq":
              return (
                <div
                  key={idx}
                  className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${brandPrimary}20` }}>
                      {getSectionIcon(section.type)}
                    </div>
                    <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    {section.items.map((item, faqIdx) => (
                      <AccordionItem key={faqIdx} value={`faq-${faqIdx}`}>
                        <AccordionTrigger className="text-left hover:text-foreground transition-colors">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )

            case "quiz":
              return (
                <div
                  key={idx}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay }}
                >
                  <Quiz section={section} brandColor={brandPrimary} />
                </div>
              )

            case "calculator":
              return (
                <div
                  key={idx}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay }}
                >
                  <Calculator section={section} brandColor={brandPrimary} />
                </div>
              )

            case "chart":
              return (
                <div
                  key={idx}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay }}
                >
                  <Charts section={section} brandColor={brandPrimary} />
                </div>
              )

            default:
              return null
          }
        })}

        {/* CTAs */}
        {doc.ctas && doc.ctas.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {doc.ctas.map((cta, idx) => (
              <Button
                key={idx}
                asChild
                size="lg"
                className="group transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: brandPrimary }}
              >
                <a href={cta.href} target="_blank" rel="noopener noreferrer">
                  {cta.label}
                  <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                </a>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
