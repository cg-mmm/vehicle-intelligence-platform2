"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, XCircle, Clock, RefreshCw, ExternalLink } from "lucide-react"

interface IndexNowLog {
  id: string
  timestamp: string
  urls: string[]
  reason?: string
  status: number
  success: boolean
  error?: string
  responseBody?: string
}

export default function IndexNowLogsPage() {
  const [logs, setLogs] = useState<IndexNowLog[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/indexnow/logs")
      const data = await response.json()
      if (data.success) {
        setLogs(data.logs)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const successCount = logs.filter((log) => log.success).length
  const failureCount = logs.filter((log) => !log.success).length
  const totalUrls = logs.reduce((sum, log) => sum + log.urls.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-cyan-400" />
              <h1 className="text-4xl font-bold text-white">IndexNow Logs</h1>
            </div>
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
          <p className="text-slate-300 text-lg">Monitor IndexNow submission history and success rates</p>
          <p className="text-slate-400 mt-2">
            Last refreshed: {lastRefresh.toLocaleTimeString()} | Showing last {logs.length} submissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <StatCard title="Total Submissions" value={logs.length} color="blue" />
          <StatCard title="Successful" value={successCount} color="green" />
          <StatCard title="Failed" value={failureCount} color="red" />
          <StatCard title="URLs Submitted" value={totalUrls} color="purple" />
        </div>

        {/* Logs Table */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Timestamp</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Reason</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">URLs</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">HTTP Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No IndexNow submissions yet
                    </td>
                  </tr>
                )}
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      {log.success ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Success</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <XCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Failed</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">{new Date(log.timestamp).toLocaleString()}</div>
                      <div className="text-xs text-slate-500 font-mono">{log.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                        {log.reason || "manual"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {log.urls.slice(0, 2).map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate max-w-xs">{url}</span>
                          </a>
                        ))}
                        {log.urls.length > 2 && (
                          <div className="text-xs text-slate-500">+{log.urls.length - 2} more</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono font-medium ${
                          log.status >= 200 && log.status < 300
                            ? "bg-green-500/20 text-green-300 border border-green-400/30"
                            : log.status === 0
                              ? "bg-slate-500/20 text-slate-300 border border-slate-400/30"
                              : "bg-red-500/20 text-red-300 border border-red-400/30"
                        }`}
                      >
                        {log.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.error && (
                        <div className="text-sm text-red-300 max-w-xs truncate" title={log.error}>
                          {log.error}
                        </div>
                      )}
                      {log.responseBody && (
                        <div className="text-xs text-slate-500 max-w-xs truncate" title={log.responseBody}>
                          {log.responseBody}
                        </div>
                      )}
                      {!log.error && !log.responseBody && <span className="text-sm text-slate-500">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 rounded-xl border border-cyan-400/30 bg-cyan-500/10">
          <h3 className="text-lg font-semibold text-cyan-300 mb-3">About IndexNow</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>IndexNow is a protocol that allows websites to instantly notify search engines about content changes.</p>
            <p>
              Submissions are automatically triggered when articles are published or updated. Successful submissions
              (HTTP 200 or 202) indicate that search engines have been notified.
            </p>
            <p className="text-slate-400">
              Note: This log shows the last {logs.length} submissions. Logs are stored in memory and will reset on
              server restart.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors = {
    blue: "from-blue-500/10 to-cyan-500/10 border-blue-500/30",
    green: "from-green-500/10 to-emerald-500/10 border-green-500/30",
    red: "from-red-500/10 to-pink-500/10 border-red-500/30",
    purple: "from-purple-500/10 to-pink-500/10 border-purple-500/30",
  }

  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br ${colors[color as keyof typeof colors]} border`}>
      <h3 className="text-sm font-medium text-slate-400 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}
