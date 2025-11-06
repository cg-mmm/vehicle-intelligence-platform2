import type React from "react"

export interface AdFrameProps {
  children: React.ReactNode
  className?: string
}

export function AdFrame({ children, className = "" }: AdFrameProps) {
  return (
    <div
      className={`rounded-2xl bg-[color:var(--panel)] border border-[color:var(--border)] shadow-soft p-4 md:p-5 hover:shadow-lg hover:border-[color:var(--accent)]/30 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  )
}
