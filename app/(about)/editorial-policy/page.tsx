import { Shield, CheckCircle, Users, FileText, RefreshCw } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Editorial Policy - Our Standards & Practices",
  description:
    "Learn about our editorial standards, fact-checking process, and commitment to accuracy and transparency in automotive journalism.",
}

export default function EditorialPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 mb-6">
          <Shield className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Editorial Policy</h1>
        <p className="text-xl text-slate-300 text-balance">
          Our commitment to accuracy, transparency, and editorial independence
        </p>
      </div>

      {/* Core Principles */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <CheckCircle className="w-7 h-7 text-green-400" />
          Core Principles
        </h2>
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-3">Accuracy First</h3>
            <p className="text-slate-300 leading-relaxed">
              Every piece of information we publish is verified through multiple authoritative sources. We
              cross-reference manufacturer specifications, government safety data, and independent testing results to
              ensure accuracy.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-3">Editorial Independence</h3>
            <p className="text-slate-300 leading-relaxed">
              Our editorial content is never influenced by advertisers, manufacturers, or commercial relationships. Our
              analysts and writers maintain complete independence in their assessments and recommendations.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-3">Transparency</h3>
            <p className="text-slate-300 leading-relaxed">
              We clearly disclose our methodology, data sources, and any potential conflicts of interest. When we make
              corrections, we acknowledge them openly and update our content promptly.
            </p>
          </div>
        </div>
      </section>

      {/* Fact-Checking Process */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <FileText className="w-7 h-7 text-cyan-400" />
          Fact-Checking Process
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4 p-5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold">
              1
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Primary Source Verification</h4>
              <p className="text-slate-300">
                All specifications and data are verified against official manufacturer documentation, NHTSA databases,
                EPA fuel economy reports, and IIHS safety ratings.
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold">
              2
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Expert Review</h4>
              <p className="text-slate-300">
                Every article is reviewed by at least one subject matter expert with relevant automotive industry
                experience and credentials.
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold">
              3
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Editorial Oversight</h4>
              <p className="text-slate-300">
                Our editorial team performs a final review to ensure consistency, clarity, and adherence to our style
                guidelines and ethical standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corrections Policy */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <RefreshCw className="w-7 h-7 text-amber-400" />
          Corrections & Updates
        </h2>
        <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-400/30">
          <p className="text-slate-300 leading-relaxed mb-4">
            When we discover an error, we correct it promptly and transparently. Significant corrections are noted at
            the top of the article with the date and nature of the correction.
          </p>
          <p className="text-slate-300 leading-relaxed">
            We regularly review and update our content to reflect new model years, specification changes, and updated
            safety ratings. All articles display their last updated date.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Users className="w-7 h-7 text-purple-400" />
          Contact Our Editorial Team
        </h2>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-slate-300 leading-relaxed mb-4">
            If you have questions about our editorial process, notice an error, or want to provide feedback, please
            contact our editorial team:
          </p>
          <a
            href="mailto:editorial@example.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            editorial@example.com
          </a>
        </div>
      </section>
    </div>
  )
}
