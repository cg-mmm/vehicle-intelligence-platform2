import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, ArrowLeft, Home } from "lucide-react"

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <FileQuestion className="w-24 h-24 mx-auto text-slate-400 dark:text-slate-600" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Article Not Found
          </h1>
        </div>

        <div className="space-y-4 text-slate-600 dark:text-slate-400">
          <p className="text-lg">The article you're looking for doesn't exist or the URL structure is incorrect.</p>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-left space-y-3 border border-slate-200 dark:border-slate-700">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Common issues:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>
                  <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs">
                    /topics/sedans/sedans/...
                  </code>{" "}
                  (wrong section)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>
                  <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs">
                    /topics/sedans/comparisons/...
                  </code>{" "}
                  (correct)
                </span>
              </li>
            </ul>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
              URL format: <code>/topics/[pillar]/[section]/[cluster]/[article]</code>
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-slate-300 dark:border-slate-700 bg-transparent">
            <Link href="/topics/sedans/comparisons" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Browse Sedans
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
