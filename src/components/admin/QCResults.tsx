"use client"

import { motion } from "framer-motion"
import type { ArticleDoc } from "@/lib/contracts"
import { validateArticleDoc } from "@/lib/contracts"
import type { QCResult } from "@/lib/qc/rules"
import { QC_RULES } from "@/lib/qc/rules"

interface QCResultsProps {
  results: QCResult[]
  article?: ArticleDoc
  onRerun?: () => void
}

export function QCResults({ results, article, onRerun }: QCResultsProps) {
  const validation = article ? validateArticleDoc(article) : { valid: true, missing: [] }

  const errorCount = results.filter((r) => !r.passed && r.severity === "error").length + validation.missing.length
  const warningCount = results.filter((r) => !r.passed && r.severity === "warning").length
  const passedCount = results.filter((r) => r.passed).length

  const categories = ["duplicate", "accessibility", "seo", "schema", "content"] as const

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border border-red-500/20 bg-red-500/5"
        >
          <div className="text-2xl font-bold text-red-500">{errorCount}</div>
          <div className="text-sm text-red-500/70">Errors</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5"
        >
          <div className="text-2xl font-bold text-yellow-500">{warningCount}</div>
          <div className="text-sm text-yellow-500/70">Warnings</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg border border-green-500/20 bg-green-500/5"
        >
          <div className="text-2xl font-bold text-green-500">{passedCount}</div>
          <div className="text-sm text-green-500/70">Passed</div>
        </motion.div>
      </div>

      {validation.missing.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold">Schema Validation</h3>
          <div className="space-y-2">
            {validation.missing.map((field, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-red-500">✗</span>
                      <span className="font-medium">Missing Required Field</span>
                    </div>
                    <p className="text-sm text-slate-400">{field}</p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">error</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results by Category */}
      {categories.map((category, idx) => {
        const categoryResults = results.filter((r) => {
          const rule = QC_RULES.find((rule) => rule.id === r.ruleId)
          return rule?.category === category
        })

        if (categoryResults.length === 0) return null

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold capitalize">{category}</h3>
            <div className="space-y-2">
              {categoryResults.map((result, resultIdx) => {
                const rule = QC_RULES.find((r) => r.id === result.ruleId)

                return (
                  <div
                    key={resultIdx}
                    className={`p-4 rounded-lg border ${
                      result.passed
                        ? "border-green-500/20 bg-green-500/5"
                        : result.severity === "error"
                          ? "border-red-500/20 bg-red-500/5"
                          : "border-yellow-500/20 bg-yellow-500/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-sm font-medium ${
                              result.passed
                                ? "text-green-500"
                                : result.severity === "error"
                                  ? "text-red-500"
                                  : "text-yellow-500"
                            }`}
                          >
                            {result.passed ? "✓" : "✗"}
                          </span>
                          <span className="font-medium">{rule?.name}</span>
                        </div>
                        <p className="text-sm text-slate-400">{result.message}</p>
                        {result.details && (
                          <pre className="mt-2 p-2 rounded bg-slate-900/50 text-xs overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        )}
                      </div>
                      {!result.passed && (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            result.severity === "error"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {result.severity}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )
      })}

      {/* Rerun Button */}
      {onRerun && (
        <button
          onClick={onRerun}
          className="w-full px-4 py-2 rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
        >
          Rerun QC Checks
        </button>
      )}
    </div>
  )
}
