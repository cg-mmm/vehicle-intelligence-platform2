import { Microscope, Database, Award, TrendingUp, CheckSquare, Star } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Review Process - How We Test & Evaluate Vehicles",
  description:
    "Discover our comprehensive vehicle review methodology, testing procedures, and evaluation criteria used by our expert analysts.",
}

export default function ReviewProcessPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400/20 to-pink-600/20 border border-purple-400/30 mb-6">
          <Microscope className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Review Process</h1>
        <p className="text-xl text-slate-300 text-balance">
          Our rigorous methodology for testing and evaluating vehicles
        </p>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30">
          <p className="text-slate-300 leading-relaxed text-lg">
            Our review process combines objective data analysis with expert evaluation to provide comprehensive,
            unbiased vehicle assessments. Every review follows a standardized methodology to ensure consistency and
            reliability.
          </p>
        </div>
      </section>

      {/* Evaluation Criteria */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <CheckSquare className="w-7 h-7 text-green-400" />
          Evaluation Criteria
        </h2>
        <div className="grid gap-6">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Safety (25%)</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  We analyze NHTSA crash test ratings, IIHS safety awards, standard safety features, and advanced driver
                  assistance systems (ADAS).
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    NHTSA 5-Star Safety Ratings
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    IIHS Top Safety Pick Awards
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Standard & Available Safety Tech
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-600/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Performance (20%)</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  We evaluate acceleration, handling, braking, and overall driving dynamics based on manufacturer specs
                  and independent testing.
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    0-60 mph Acceleration Times
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Horsepower & Torque Ratings
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Handling & Ride Quality
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-600/20 flex items-center justify-center">
                <Database className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Fuel Economy (15%)</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  We use EPA-certified fuel economy ratings and calculate real-world cost estimates based on current
                  fuel prices.
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    EPA City/Highway/Combined MPG
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Annual Fuel Cost Estimates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Electric Range (for EVs/PHEVs)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-600/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Value & Reliability (40%)</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  We analyze pricing, standard features, warranty coverage, predicted reliability, and total cost of
                  ownership.
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    MSRP & Market Value Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    J.D. Power Reliability Ratings
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Warranty Coverage & Terms
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    5-Year Cost of Ownership
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Database className="w-7 h-7 text-cyan-400" />
          Trusted Data Sources
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: "NHTSA", desc: "Crash test ratings & safety data" },
            { name: "IIHS", desc: "Independent safety testing" },
            { name: "EPA", desc: "Fuel economy certifications" },
            { name: "J.D. Power", desc: "Reliability & satisfaction ratings" },
            { name: "Kelley Blue Book", desc: "Pricing & market value data" },
            { name: "Consumer Reports", desc: "Independent testing & surveys" },
          ].map((source) => (
            <div key={source.name} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="font-semibold text-white mb-1">{source.name}</h4>
              <p className="text-sm text-slate-400">{source.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Expert Team */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">Our Expert Team</h2>
        <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30">
          <p className="text-slate-300 leading-relaxed mb-4">
            All reviews are conducted by ASE-certified technicians and automotive journalists with extensive industry
            experience. Our team includes former automotive engineers, professional test drivers, and award-winning
            journalists.
          </p>
          <a
            href="/authors/john-smith"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            Meet our review team →
          </a>
        </div>
      </section>
    </div>
  )
}
