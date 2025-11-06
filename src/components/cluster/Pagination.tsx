import Link from "next/link"

interface PaginationProps {
  page: number
  total: number
  baseUrl: string
}

export default function Pagination({ page, total, baseUrl }: PaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <nav className="flex items-center justify-center gap-2 my-8" aria-label="Pagination">
      {page > 1 && (
        <Link
          href={`${baseUrl}?page=${page - 1}`}
          className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Previous page"
        >
          Previous
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={`${baseUrl}?page=${p}`}
          className={`px-4 py-2 rounded-lg transition-colors ${
            p === page ? "bg-primary text-primary-foreground font-semibold" : "bg-muted hover:bg-muted/80"
          }`}
          aria-label={`Page ${p}`}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Link>
      ))}

      {page < total && (
        <Link
          href={`${baseUrl}?page=${page + 1}`}
          className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Next page"
        >
          Next
        </Link>
      )}

      <Link
        href={baseUrl}
        className="ml-4 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
      >
        View All
      </Link>
    </nav>
  )
}
