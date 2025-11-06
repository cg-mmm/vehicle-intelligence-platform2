import type React from "react"
import { ExternalLink, Globe, FileText, Database, Award } from "lucide-react"

export interface SourceInfo {
  label: string
  icon: typeof Globe
  color: string
}

const SOURCE_MAP: Record<string, SourceInfo> = {
  "nhtsa.gov": {
    label: "NHTSA",
    icon: Award,
    color: "var(--primary)", // Aurora Green
  },
  "epa.gov": {
    label: "EPA",
    icon: Database,
    color: "var(--success)", // Aurora Green
  },
  "iihs.org": {
    label: "IIHS",
    icon: Award,
    color: "var(--warning)", // Warm orange
  },
  "kbb.com": {
    label: "Kelley Blue Book",
    icon: FileText,
    color: "var(--secondary)", // Deep Violet
  },
  "edmunds.com": {
    label: "Edmunds",
    icon: FileText,
    color: "var(--accent)", // Aurora Green
  },
  "caranddriver.com": {
    label: "Car and Driver",
    icon: FileText,
    color: "var(--primary)", // Aurora Green
  },
  "motortrend.com": {
    label: "MotorTrend",
    icon: FileText,
    color: "var(--warning)", // Warm orange
  },
  "consumerreports.org": {
    label: "Consumer Reports",
    icon: FileText,
    color: "var(--success)", // Aurora Green
  },
}

export function getSourceInfo(url: string): SourceInfo {
  try {
    const domain = new URL(url).hostname.replace("www.", "")
    return (
      SOURCE_MAP[domain] || {
        label: domain,
        icon: Globe,
        color: "#6b7280",
      }
    )
  } catch {
    return {
      label: "External Source",
      icon: Globe,
      color: "#6b7280",
    }
  }
}

export interface ExternalLinkProps {
  href: string
  children: React.ReactNode
  accessedDate?: string
  showIcon?: boolean
  className?: string
}

export function ExternalLinkComponent({
  href,
  children,
  accessedDate,
  showIcon = true,
  className = "",
}: ExternalLinkProps) {
  const sourceInfo = getSourceInfo(href)
  const Icon = sourceInfo.icon

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors ${className}`}
    >
      {showIcon && <Icon className="w-4 h-4" style={{ color: sourceInfo.color }} />}
      <span className="underline underline-offset-2">{children}</span>
      <ExternalLink className="w-3 h-3" />
      {accessedDate && <span className="text-xs text-muted-foreground ml-1">(accessed {accessedDate})</span>}
    </a>
  )
}
