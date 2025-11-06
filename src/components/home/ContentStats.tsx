"use client"

import { motion } from "framer-motion"
import { FileText, Video, FolderTree, Tag, TrendingUp, Clock } from "lucide-react"

interface ContentStatsProps {
  totalArticles: number
  totalVideos: number
  totalCategories: number
  totalClusters: number
  articlesThisWeek: number
  avgReadTime: number
}

export function ContentStats({
  totalArticles,
  totalVideos,
  totalCategories,
  totalClusters,
  articlesThisWeek,
  avgReadTime,
}: ContentStatsProps) {
  const stats = [
    {
      icon: FileText,
      label: "Total Articles",
      value: totalArticles,
      gradient: "from-primary to-accent",
      glow: "primary",
    },
    {
      icon: Video,
      label: "Total Videos",
      value: totalVideos,
      gradient: "from-secondary to-accent",
      glow: "secondary",
    },
    {
      icon: FolderTree,
      label: "Categories",
      value: totalCategories,
      gradient: "from-accent to-primary",
      glow: "accent",
    },
    {
      icon: Tag,
      label: "Topics",
      value: totalClusters,
      gradient: "from-warning to-primary",
      glow: "warning",
    },
    {
      icon: TrendingUp,
      label: "This Week",
      value: articlesThisWeek,
      gradient: "from-primary to-secondary",
      glow: "primary",
    },
    {
      icon: Clock,
      label: "Avg Read Time",
      value: `${avgReadTime}m`,
      gradient: "from-secondary to-primary",
      glow: "secondary",
    },
  ]

  return (
    <section className="relative py-16 bg-bg">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-bg to-bg" />
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-fg mb-4">Growing Content Library</h2>
          <p className="text-xl text-fg-muted">Comprehensive coverage across all topics, updated daily</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 rounded-2xl`}
              />

              {/* Card */}
              <div className="relative bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-6 h-6 text-[color:var(--fg-contrast)]" />
                </div>
                <div className="text-3xl font-bold text-fg mb-1">{stat.value}</div>
                <div className="text-sm text-fg-muted">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
