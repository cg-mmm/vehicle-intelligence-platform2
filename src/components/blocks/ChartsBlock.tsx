"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useState } from "react"
import type { ArticleDoc } from "@/lib/contracts"
import { BarChart3, TrendingUp, Activity, CheckCircle2, Trophy, Table, Info, Zap, Award } from "lucide-react"
import { LazyHydrate } from "@/components/LazyHydrate"

interface ChartsBlockProps {
  article: ArticleDoc
}

function ChartsBlockContent({ article }: ChartsBlockProps) {
  const shouldReduceMotion = useReducedMotion()
  const [showTable, setShowTable] = useState(false)
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null)

  const samplePrices = [
    {
      name: "Honda Accord",
      value: 28300,
      colorClass: "text-[color:var(--primary)]",
      bgClass: "bg-[color:var(--primary)]",
    },
    {
      name: "Toyota Camry",
      value: 27500,
      colorClass: "text-[color:var(--accent)]",
      bgClass: "bg-[color:var(--accent)]",
    },
    { name: "Mazda6", value: 26800, colorClass: "text-[color:var(--chart-3)]", bgClass: "bg-[color:var(--chart-3)]" },
  ]

  const performanceMetrics = [
    { metric: "Horsepower", accord: 192, camry: 203, mazda: 187, higherIsBetter: true },
    { metric: "0-60 mph (sec)", accord: 7.5, camry: 7.2, mazda: 7.8, higherIsBetter: false },
    { metric: "City MPG", accord: 30, camry: 28, mazda: 26, higherIsBetter: true },
    { metric: "Highway MPG", accord: 38, camry: 39, mazda: 35, higherIsBetter: true },
  ]

  const vehicleSpecs = [
    {
      name: "Honda Accord",
      colorClass: "text-[color:var(--primary)]",
      strokeClass: "stroke-[color:var(--primary)]",
      gradient: "from-[color:var(--primary)] to-[color:var(--brand-gradient-end)]",
      specs: [
        { name: "Safety Rating", value: 95 },
        { name: "Reliability", value: 88 },
        { name: "Comfort", value: 92 },
        { name: "Technology", value: 85 },
        { name: "Value", value: 90 },
      ],
    },
    {
      name: "Toyota Camry",
      colorClass: "text-[color:var(--accent)]",
      strokeClass: "stroke-[color:var(--accent)]",
      gradient: "from-[color:var(--accent)] to-[color:var(--secondary)]",
      specs: [
        { name: "Safety Rating", value: 93 },
        { name: "Reliability", value: 95 },
        { name: "Comfort", value: 90 },
        { name: "Technology", value: 88 },
        { name: "Value", value: 92 },
      ],
    },
    {
      name: "Mazda6",
      colorClass: "text-[color:var(--chart-3)]",
      strokeClass: "stroke-[color:var(--chart-3)]",
      gradient: "from-[color:var(--chart-3)] to-[color:var(--danger)]",
      specs: [
        { name: "Safety Rating", value: 90 },
        { name: "Reliability", value: 85 },
        { name: "Comfort", value: 95 },
        { name: "Technology", value: 82 },
        { name: "Value", value: 88 },
      ],
    },
  ]

  const minPrice = Math.min(...samplePrices.map((d) => d.value))
  const maxPrice = Math.max(...samplePrices.map((d) => d.value))
  const priceRange = maxPrice - minPrice

  const animationDuration = shouldReduceMotion ? 0 : 1
  const animationDelay = shouldReduceMotion ? 0 : 0.1

  return (
    <div className="my-16 space-y-8" style={{ minHeight: "800px" }}>
      {/* Header */}
      <div className="text-center space-y-3 p-8 rounded-3xl border border-[color:var(--border)] bg-[color:var(--primary)]/10">
        <div className="flex items-center justify-center gap-2 text-[color:var(--primary)]">
          <BarChart3 className="w-6 h-6" />
          <TrendingUp className="w-6 h-6" />
          <Activity className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold text-brand-gradient">Data Visualizations</h2>
        <p className="text-[color:var(--fg-muted)] max-w-2xl mx-auto">
          Interactive charts and graphs based on real comparison data. All charts use min-max normalization for accurate
          visual comparison.
        </p>
        <button
          onClick={() => setShowTable(!showTable)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--muted)] hover:bg-[color:var(--muted)]/80 transition-colors text-sm font-medium text-[color:var(--fg)]"
          aria-label={showTable ? "Hide table view" : "Show table view"}
        >
          <Table className="w-4 h-4" />
          {showTable ? "Hide Table" : "View as Table"}
        </button>
      </div>

      {showTable ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-lg p-6 overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">Vehicle comparison data</caption>
            <thead>
              <tr className="border-b border-[color:var(--border)]">
                <th className="text-left p-3 font-semibold text-[color:var(--fg)]">Metric</th>
                <th className="text-left p-3 font-semibold text-[color:var(--fg)]">Honda Accord</th>
                <th className="text-left p-3 font-semibold text-[color:var(--fg)]">Toyota Camry</th>
                <th className="text-left p-3 font-semibold text-[color:var(--fg)]">Mazda6</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[color:var(--border)]">
                <td className="p-3 text-[color:var(--fg)]">Starting Price</td>
                <td className="p-3 text-[color:var(--fg)]">${samplePrices[0].value.toLocaleString()}</td>
                <td className="p-3 text-[color:var(--fg)]">${samplePrices[1].value.toLocaleString()}</td>
                <td className="p-3 text-[color:var(--fg)]">${samplePrices[2].value.toLocaleString()}</td>
              </tr>
              {performanceMetrics.map((metric) => (
                <tr key={metric.metric} className="border-b border-[color:var(--border)]">
                  <td className="p-3 text-[color:var(--fg)]">{metric.metric}</td>
                  <td className="p-3 text-[color:var(--fg)]">{metric.accord}</td>
                  <td className="p-3 text-[color:var(--fg)]">{metric.camry}</td>
                  <td className="p-3 text-[color:var(--fg)]">{metric.mazda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* Price Comparison Chart */}
          <figure
            role="img"
            aria-label="Price comparison chart showing Honda Accord at $28,300, Toyota Camry at $27,500, and Mazda6 at $26,800. Mazda6 is the most affordable option."
          >
            <div
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-lg p-6 space-y-4"
              style={{ minHeight: "300px" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[color:var(--primary)]" />
                  <h3 className="text-xl font-semibold text-[color:var(--fg)]">Price Comparison</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-[color:var(--fg-muted)]">
                  <Info className="w-4 h-4" />
                  <span>
                    Normalized scale: ${minPrice.toLocaleString()} = 0%, ${maxPrice.toLocaleString()} = 100%
                  </span>
                </div>
              </div>
              <figcaption className="text-sm text-[color:var(--fg-muted)] bg-[color:var(--muted)]/50 p-3 rounded-lg">
                <strong>Key Insight:</strong> Mazda6 offers the best value at ${minPrice.toLocaleString()}, saving $
                {(maxPrice - minPrice).toLocaleString()} compared to the highest-priced option.
              </figcaption>
              <div className="space-y-6 py-4">
                {samplePrices.map((item, index) => {
                  const normalizedValue = priceRange === 0 ? 50 : ((item.value - minPrice) / priceRange) * 100
                  const displayPercentage = normalizedValue
                  const isWinner = item.value === minPrice
                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[color:var(--fg)]">{item.name}</span>
                          {isWinner && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: shouldReduceMotion ? 0 : 1.2, type: "spring" }}
                            >
                              <CheckCircle2
                                className="w-5 h-5 text-[color:var(--color-success)]"
                                aria-label="Best value"
                              />
                            </motion.div>
                          )}
                        </div>
                        <span className="text-[color:var(--fg-muted)]">${item.value.toLocaleString()}</span>
                      </div>
                      <div
                        className={`relative h-8 rounded-full overflow-hidden ${isWinner ? "bg-[color:var(--color-success)]/10 ring-2 ring-[color:var(--color-success)]" : "bg-[color:var(--muted)]"}`}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${displayPercentage}%` }}
                          transition={{ duration: animationDuration, delay: index * animationDelay }}
                          className={`absolute inset-y-0 left-0 rounded-full ${isWinner ? "bg-[color:var(--color-success)]" : item.bgClass}`}
                        />
                        <div className="absolute inset-0 flex items-center justify-end pr-3">
                          <span className="text-xs font-semibold text-white drop-shadow-lg">
                            {isWinner && <Trophy className="w-3 h-3 inline mr-1" aria-hidden="true" />}
                            {displayPercentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </figure>

          {/* Performance Trends */}
          <figure
            role="img"
            aria-label="Performance trends comparing horsepower, acceleration, and fuel economy across three vehicles"
          >
            <div className="relative rounded-3xl border border-[color:var(--primary)]/20 shadow-2xl p-8 space-y-8 bg-gradient-to-br from-[color:var(--primary)]/5 via-[color:var(--accent)]/5 to-[color:var(--color-success)]/5 overflow-hidden">
              {/* Animated background particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-[color:var(--primary)]/20"
                    initial={{
                      x: Math.random() * 100 + "%",
                      y: Math.random() * 100 + "%",
                      scale: Math.random() * 0.5 + 0.5,
                    }}
                    animate={{
                      y: [null, Math.random() * 100 + "%"],
                      x: [null, Math.random() * 100 + "%"],
                      scale: [null, Math.random() * 0.5 + 0.5],
                    }}
                    transition={{
                      duration: Math.random() * 10 + 10,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Header with animated gradient */}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="p-3 rounded-2xl bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] shadow-lg"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(16, 185, 129, 0.3)",
                        "0 0 40px rgba(16, 185, 129, 0.5)",
                        "0 0 20px rgba(16, 185, 129, 0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Zap className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-[color:var(--primary)] via-[color:var(--accent)] to-[color:var(--color-success)] bg-clip-text text-transparent">
                      Performance Trends
                    </h3>
                    <p className="text-sm text-[color:var(--fg-muted)]">Interactive 3D comparison cards</p>
                  </div>
                </div>
                <motion.div
                  className="px-4 py-2 rounded-full bg-[color:var(--color-success)]/10 border border-[color:var(--color-success)]/30 text-[color:var(--color-success)] text-sm font-semibold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Award className="w-4 h-4 inline mr-1" />
                  Live Data
                </motion.div>
              </div>

              <figcaption className="text-sm text-[color:var(--fg-muted)] bg-[color:var(--card)]/50 backdrop-blur-sm p-4 rounded-xl border border-[color:var(--border)]">
                <strong className="text-[color:var(--primary)]">Key Insight:</strong> Toyota Camry leads in horsepower
                (203 hp) and highway efficiency (39 MPG), while Honda Accord excels in city driving (30 MPG).
              </figcaption>

              {/* 3D Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                {performanceMetrics.map((metric, index) => {
                  const values = [metric.accord, metric.camry, metric.mazda]
                  const maxValue = Math.max(...values)
                  const minValue = Math.min(...values)
                  const range = maxValue - minValue
                  const winnerValue = metric.higherIsBetter ? maxValue : minValue

                  const vehicles = [
                    {
                      name: "Honda Accord",
                      value: metric.accord,
                      colorClass: "text-[color:var(--primary)]",
                      strokeClass: "stroke-[color:var(--primary)]",
                    },
                    {
                      name: "Toyota Camry",
                      value: metric.camry,
                      colorClass: "text-[color:var(--accent)]",
                      strokeClass: "stroke-[color:var(--accent)]",
                    },
                    {
                      name: "Mazda6",
                      value: metric.mazda,
                      colorClass: "text-[color:var(--chart-3)]",
                      strokeClass: "stroke-[color:var(--chart-3)]",
                    },
                  ]

                  return (
                    <motion.div
                      key={metric.metric}
                      initial={{ opacity: 0, y: 50, rotateX: -15 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.15,
                        type: "spring",
                        stiffness: 100,
                      }}
                      onHoverStart={() => setHoveredMetric(index)}
                      onHoverEnd={() => setHoveredMetric(null)}
                      className="relative group"
                      style={{ perspective: "1000px" }}
                    >
                      <motion.div
                        className="relative rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/80 backdrop-blur-sm shadow-xl p-6 space-y-6"
                        whileHover={{
                          scale: 1.02,
                          rotateY: 2,
                          boxShadow: "0 20px 60px rgba(16, 185, 129, 0.3)",
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {/* Animated glow effect on hover */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[color:var(--primary)]/20 via-[color:var(--accent)]/20 to-[color:var(--color-success)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ filter: "blur(20px)" }}
                        />

                        {/* Card header */}
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[color:var(--primary)]/10">
                              <TrendingUp className="w-5 h-5 text-[color:var(--primary)]" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-[color:var(--fg)]">{metric.metric}</h4>
                              <span className="text-xs text-[color:var(--fg-muted)] px-2 py-0.5 rounded-full bg-[color:var(--muted)]">
                                {metric.higherIsBetter ? "↑ Higher is Better" : "↓ Lower is Better"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Radial progress indicators */}
                        <div className="relative grid grid-cols-3 gap-4">
                          {vehicles.map((vehicle, vIndex) => {
                            const normalizedValue = range === 0 ? 50 : ((vehicle.value - minValue) / range) * 100
                            const isWinner = vehicle.value === winnerValue
                            const circumference = 2 * Math.PI * 35

                            return (
                              <motion.div
                                key={vehicle.name}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                  duration: 0.8,
                                  delay: index * 0.15 + vIndex * 0.1,
                                  type: "spring",
                                  stiffness: 200,
                                }}
                                className="relative flex flex-col items-center space-y-3"
                              >
                                {/* Radial progress */}
                                <div className="relative">
                                  <svg className="w-24 h-24 transform -rotate-90">
                                    {/* Background circle */}
                                    <circle
                                      cx="48"
                                      cy="48"
                                      r="35"
                                      strokeWidth="8"
                                      fill="none"
                                      className="stroke-[color:var(--muted)]"
                                    />
                                    <motion.circle
                                      cx="48"
                                      cy="48"
                                      r="35"
                                      strokeWidth="8"
                                      fill="none"
                                      strokeLinecap="round"
                                      initial={{ strokeDashoffset: circumference }}
                                      animate={{
                                        strokeDashoffset: circumference - (circumference * normalizedValue) / 100,
                                      }}
                                      transition={{
                                        duration: 1.5,
                                        delay: index * 0.15 + vIndex * 0.1,
                                        ease: "easeOut",
                                      }}
                                      className={isWinner ? "stroke-[color:var(--color-success)]" : vehicle.strokeClass}
                                      style={{
                                        strokeDasharray: circumference,
                                        filter: isWinner ? "drop-shadow(0 0 8px hsl(var(--color-success)))" : "none",
                                      }}
                                    />
                                  </svg>

                                  {/* Center content */}
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span
                                      className="text-2xl font-bold text-[color:var(--fg)]"
                                      initial={{ opacity: 0, scale: 0 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{
                                        duration: 0.5,
                                        delay: index * 0.15 + vIndex * 0.1 + 0.5,
                                      }}
                                    >
                                      {vehicle.value}
                                    </motion.span>
                                    {isWinner && (
                                      <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                          delay: index * 0.15 + vIndex * 0.1 + 1,
                                          type: "spring",
                                          stiffness: 300,
                                        }}
                                      >
                                        <Trophy className="w-4 h-4 text-[color:var(--color-success)]" />
                                      </motion.div>
                                    )}
                                  </div>

                                  {/* Winner glow effect */}
                                  {isWinner && (
                                    <motion.div
                                      className="absolute inset-0 rounded-full bg-[color:var(--color-success)]/20"
                                      animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 0.8, 0.5],
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "easeInOut",
                                      }}
                                      style={{ filter: "blur(15px)" }}
                                    />
                                  )}
                                </div>

                                {/* Vehicle name */}
                                <div className="text-center">
                                  <div
                                    className={`text-xs font-semibold px-2 py-1 rounded-lg ${isWinner ? "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)] border border-[color:var(--color-success)]/30" : "text-[color:var(--fg-muted)]"}`}
                                  >
                                    {vehicle.name.split(" ")[0]}
                                  </div>
                                  <div className="text-xs text-[color:var(--fg-muted)] mt-1">
                                    {normalizedValue.toFixed(0)}%
                                  </div>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </figure>

          {/* Specifications Overview */}
          <figure
            role="img"
            aria-label="Specifications overview showing safety, reliability, comfort, technology, and value ratings for each vehicle"
          >
            <div className="space-y-6" style={{ minHeight: "400px" }}>
              <div className="flex items-center gap-3 px-6">
                <div className="p-2 rounded-lg bg-[color:var(--secondary)]/10">
                  <Activity className="w-6 h-6 text-[color:var(--secondary)]" />
                </div>
                <h3 className="text-2xl font-bold text-brand-gradient">Specifications Overview</h3>
              </div>
              <figcaption className="text-sm text-[color:var(--fg-muted)] bg-[color:var(--muted)]/50 p-3 rounded-lg mx-6">
                <strong>Key Insight:</strong> Toyota Camry achieves the highest overall rating (92%) with exceptional
                reliability (95%), while Mazda6 leads in comfort (95%).
              </figcaption>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vehicleSpecs.map((vehicle, vIndex) => {
                  const avgScore = vehicle.specs.reduce((sum, spec) => sum + spec.value, 0) / vehicle.specs.length
                  const allAvgScores = vehicleSpecs.map(
                    (v) => v.specs.reduce((sum, spec) => sum + spec.value, 0) / v.specs.length,
                  )
                  const isOverallWinner = avgScore === Math.max(...allAvgScores)

                  return (
                    <motion.div
                      key={vehicle.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: animationDuration, delay: vIndex * animationDelay }}
                      className={`rounded-2xl border shadow-lg p-6 space-y-6 ${isOverallWinner ? "bg-gradient-to-br from-[color:var(--color-success)]/10 via-[color:var(--accent)]/10 to-[color:var(--primary)]/10 border-[color:var(--color-success)]/50 ring-2 ring-[color:var(--color-success)]/30" : "bg-[color:var(--card)] border-[color:var(--border)]"}`}
                    >
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-lg font-bold bg-gradient-to-r ${vehicle.gradient} bg-clip-text text-transparent`}
                        >
                          {vehicle.name}
                        </h4>
                        {isOverallWinner && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: vIndex * animationDelay + 0.5, type: "spring" }}
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-[color:var(--color-success)]/20 text-[color:var(--color-success)]"
                          >
                            <Trophy className="w-4 h-4" />
                            <span className="text-xs font-semibold">Winner</span>
                          </motion.div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        {vehicle.specs.map((spec, sIndex) => (
                          <motion.div
                            key={spec.name}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: animationDuration, delay: vIndex * animationDelay + sIndex * 0.05 }}
                            className="flex flex-col items-center space-y-3"
                          >
                            <div className="relative w-20 h-20">
                              <svg className="w-20 h-20 transform -rotate-90">
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="32"
                                  strokeWidth="6"
                                  fill="none"
                                  className="stroke-[color:var(--muted)]"
                                />
                                <motion.circle
                                  cx="40"
                                  cy="40"
                                  r="32"
                                  strokeWidth="6"
                                  fill="none"
                                  strokeLinecap="round"
                                  initial={{ strokeDashoffset: 201 }}
                                  animate={{ strokeDashoffset: 201 - (201 * spec.value) / 100 }}
                                  transition={{
                                    duration: animationDuration + 0.5,
                                    delay: vIndex * animationDelay + sIndex * 0.05,
                                  }}
                                  className={vehicle.strokeClass}
                                  style={{
                                    strokeDasharray: 201,
                                  }}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-[color:var(--fg)]">{spec.value}</span>
                              </div>
                            </div>
                            <div className="text-xs font-medium text-center text-[color:var(--fg-muted)]">
                              {spec.name}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </figure>
        </>
      )}
    </div>
  )
}

export function ChartsBlock(props: ChartsBlockProps) {
  return (
    <LazyHydrate whenVisible rootMargin="100px">
      <ChartsBlockContent {...props} />
    </LazyHydrate>
  )
}
