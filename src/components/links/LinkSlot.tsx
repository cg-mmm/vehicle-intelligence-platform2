import { BookOpen, ArrowRight } from "lucide-react"

interface RelatedLink {
  title: string
  href: string
  reason?: string
}

interface LinkSlotProps {
  links: RelatedLink[]
  maxLinks?: number
  title?: string
}

export function LinkSlot({ links, maxLinks = 3, title = "Related Articles" }: LinkSlotProps) {
  const displayLinks = links.slice(0, maxLinks)

  if (displayLinks.length === 0) {
    return null
  }

  return (
    <aside className="my-8 p-6 rounded-lg border border-border/50 bg-muted/30" aria-labelledby="related-articles">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 id="related-articles" className="text-lg font-semibold">
          {title}
        </h3>
      </div>

      <ul className="space-y-3" role="list">
        {displayLinks.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ArrowRight className="w-4 h-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {link.title}
                </div>
                {link.reason && <div className="text-sm text-muted-foreground mt-1">{link.reason}</div>}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
