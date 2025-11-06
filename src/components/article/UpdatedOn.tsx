interface UpdatedOnProps {
  publishedAt?: string
  updatedAt?: string
}

export function UpdatedOn({ publishedAt, updatedAt }: UpdatedOnProps) {
  const displayDate = updatedAt || publishedAt
  if (!displayDate) return null

  const date = new Date(displayDate)
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex items-center gap-2 text-sm text-[color:var(--fg-muted)]">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <time dateTime={displayDate}>
        {updatedAt ? "Updated" : "Published"} {formattedDate}
      </time>
    </div>
  )
}
