"use client"

import type React from "react"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, AlertCircle, Shield, Zap, Eye, Lock, Copy } from "lucide-react"

export type QCStatus = "GREEN" | "AMBER" | "RED"

export interface QCCheck {
  category: string
  status: QCStatus
  score?: number
  message?: string
}

interface QCPanelProps {
  checks: QCCheck[]
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Schema: Shield,
  "Originality/Info-Gain": Zap,
  A11y: Eye,
  Performance: Zap,
  Safety: Lock,
  Duplication: Copy,
}

const statusColors: Record<QCStatus, { bg: string; border: string; text: string; icon: string }> = {
  GREEN: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-900",
    text: "text-green-700 dark:text-green-300",
    icon: "text-green-600 dark:text-green-400",
  },
  AMBER: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-900",
    text: "text-amber-700 dark:text-amber-300",
    icon: "text-amber-600 dark:text-amber-400",
  },
  RED: {
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-900",
    text: "text-red-700 dark:text-red-300",
    icon: "text-red-600 dark:text-red-400",
  },
}

export function QCPanel({ checks }: QCPanelProps) {
  const overallStatus = useMemo(() => {
    if (checks.some((c) => c.status === "RED")) return "RED"
    if (checks.some((c) => c.status === "AMBER")) return "AMBER"
    return "GREEN"
  }, [checks])

  const allGreen = overallStatus === "GREEN"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Quality Control</h3>
        <div className="flex items-center gap-2">
          {overallStatus === "GREEN" && <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />}
          {overallStatus === "AMBER" && <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          {overallStatus === "RED" && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
          <span
            className={`text-sm font-medium ${
              overallStatus === "GREEN"
                ? "text-green-700 dark:text-green-300"
                : overallStatus === "AMBER"
                  ? "text-amber-700 dark:text-amber-300"
                  : "text-red-700 dark:text-red-300"
            }`}
          >
            {overallStatus}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {checks.map((check, index) => {
          const Icon = categoryIcons[check.category] || Shield
          const colors = statusColors[check.status]

          return (
            <motion.div
              key={check.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-lg border ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${colors.icon}`} />
                <div>
                  <p className={`text-sm font-medium ${colors.text}`}>{check.category}</p>
                  {check.message && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{check.message}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {check.score !== undefined && <span className={`text-sm font-mono ${colors.text}`}>{check.score}</span>}
                <div className={`px-2 py-1 rounded text-xs font-medium ${colors.text} ${colors.bg}`}>
                  {check.status}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {!allGreen && (
        <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {overallStatus === "RED"
              ? "Fix all RED issues before publishing"
              : "AMBER warnings can be published but should be reviewed"}
          </p>
        </div>
      )}
    </motion.div>
  )
}
