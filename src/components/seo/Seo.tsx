import type { Metadata } from "next"

interface SeoProps {
  metadata: Metadata
  jsonLd?: Record<string, any> | Array<Record<string, any>>
}

export function Seo({ metadata, jsonLd }: SeoProps) {
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]),
          }}
        />
      )}
    </>
  )
}
