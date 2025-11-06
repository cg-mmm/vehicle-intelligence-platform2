import { User, Award, Calendar, ExternalLink } from "lucide-react"

interface AuthorBoxProps {
  author: {
    name: string
    url?: string
    bio?: string
    credentials?: string[]
    expertise?: string[]
    yearsExperience?: number
  }
  organization?: {
    name: string
    url: string
    logo?: string
  }
  publishedDate?: string
  lastUpdated?: string
}

export function AuthorBox({ author, organization, publishedDate, lastUpdated }: AuthorBoxProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {/* Author Avatar - smaller */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-2)] flex items-center justify-center text-[color:var(--fg-contrast)] font-semibold text-[10px] shadow-md">
        {author.name.charAt(0)}
      </div>

      {/* Author Name */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-[color:var(--fg-muted)]">By</span>
        {author.url ? (
          <a
            href={author.url}
            className="font-semibold text-[color:var(--fg)] hover:text-[color:var(--accent)] transition-colors inline-flex items-center gap-1 text-xs"
            rel="author"
          >
            {author.name}
            <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
          </a>
        ) : (
          <span className="font-semibold text-[color:var(--fg)] text-xs">{author.name}</span>
        )}
      </div>

      {/* Separator */}
      <span className="text-[color:var(--fg-muted)] text-[10px]">•</span>

      {/* Years Experience */}
      {author.yearsExperience && (
        <>
          <div className="inline-flex items-center gap-1 text-[color:var(--fg-muted)]">
            <Award className="w-2.5 h-2.5" aria-hidden="true" />
            <span className="text-[10px]">{author.yearsExperience}+ years</span>
          </div>
          <span className="text-[color:var(--fg-muted)] text-[10px]">•</span>
        </>
      )}

      {/* Organization */}
      {organization && (
        <>
          <div className="inline-flex items-center gap-1 text-[color:var(--fg-muted)]">
            <User className="w-2.5 h-2.5" aria-hidden="true" />
            <a
              href={organization.url}
              className="text-[color:var(--fg)] hover:text-[color:var(--accent)] transition-colors font-medium text-[10px]"
            >
              {organization.name}
            </a>
          </div>
          <span className="text-[color:var(--fg-muted)] text-[10px]">•</span>
        </>
      )}

      {/* Published Date */}
      {publishedDate && (
        <>
          <div className="inline-flex items-center gap-0.5 text-[color:var(--fg-muted)]">
            <Calendar className="w-2.5 h-2.5" aria-hidden="true" />
            <span className="text-[10px]">{new Date(publishedDate).toLocaleDateString()}</span>
          </div>
        </>
      )}

      {/* Updated Date */}
      {lastUpdated && (
        <>
          <span className="text-[color:var(--fg-muted)] text-[10px]">•</span>
          <div className="inline-flex items-center gap-0.5 text-[color:var(--fg-muted)]">
            <span className="text-[9px]">Updated:</span>
            <span className="text-[10px]">{new Date(lastUpdated).toLocaleDateString()}</span>
          </div>
        </>
      )}

      {/* Credentials - condensed */}
      {author.credentials && author.credentials.length > 0 && (
        <>
          <span className="text-[color:var(--fg-muted)] text-[10px]">•</span>
          <div className="inline-flex items-center gap-1">
            {author.credentials.map((credential, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 rounded-md bg-[color:var(--accent)]/10 text-[color:var(--accent)] text-[9px] font-medium"
              >
                {credential}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
