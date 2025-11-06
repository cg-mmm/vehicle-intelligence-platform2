"use client"

import { motion } from "framer-motion"

export function LiquidBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/30 to-[color:var(--gradient-end)]/30" />

      <motion.div
        className="absolute w-[1000px] h-[1000px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gradient-start) 45%, transparent 55%), transparent 70%)",
          top: "5%",
          left: "15%",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 48%, transparent 52%), transparent 70%)",
          bottom: "10%",
          right: "10%",
        }}
        animate={{
          x: [0, -45, 0],
          y: [0, 30, 0],
          scale: [1, 1.25, 1],
          rotate: [0, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gradient-end) 42%, transparent 58%), transparent 70%)",
          top: "45%",
          left: "45%",
        }}
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.5, 0.7, 0.5],
          rotate: [0, 25, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[650px] h-[650px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gradient-start) 40%, transparent 60%), transparent 70%)",
          top: "60%",
          left: "10%",
        }}
        animate={{
          x: [0, 25, 0],
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 44%, transparent 56%), transparent 70%)",
          top: "20%",
          right: "20%",
        }}
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 9,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[750px] h-[750px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gradient-end) 46%, transparent 54%), transparent 70%)",
          top: "30%",
          right: "5%",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -25, 0],
          scale: [1, 1.18, 1],
          rotate: [0, -12, 0],
        }}
        transition={{
          duration: 11,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gradient-start) 38%, transparent 62%), transparent 70%)",
          bottom: "25%",
          left: "30%",
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, 15, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[850px] h-[850px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 50%, transparent 50%), transparent 70%)",
          top: "70%",
          right: "35%",
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.3, 1],
          rotate: [0, 18, 0],
        }}
        transition={{
          duration: 13,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[550px] h-[550px] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gradient-end) 43%, transparent 57%), transparent 70%)",
          top: "15%",
          left: "50%",
        }}
        animate={{
          x: [0, -35, 0],
          y: [0, 20, 0],
          scale: [1, 1.22, 1],
        }}
        transition={{
          duration: 9.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[720px] h-[720px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gradient-start) 47%, transparent 53%), transparent 70%)",
          bottom: "40%",
          right: "25%",
        }}
        animate={{
          x: [0, 28, 0],
          y: [0, -22, 0],
          scale: [1, 1.16, 1],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 10.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[680px] h-[680px] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 41%, transparent 59%), transparent 70%)",
          top: "50%",
          left: "5%",
        }}
        animate={{
          x: [0, 32, 0],
          y: [0, 18, 0],
          scale: [1, 1.19, 1],
        }}
        transition={{
          duration: 8.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[620px] h-[620px] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gradient-end) 44%, transparent 56%), transparent 70%)",
          bottom: "15%",
          left: "60%",
        }}
        animate={{
          x: [0, -26, 0],
          y: [0, 24, 0],
          scale: [1, 1.14, 1],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 11.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[780px] h-[780px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gradient-start) 49%, transparent 51%), transparent 70%)",
          top: "35%",
          left: "70%",
        }}
        animate={{
          x: [0, -38, 0],
          y: [0, -28, 0],
          scale: [1, 1.28, 1],
          rotate: [0, -22, 0],
        }}
        transition={{
          duration: 12.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[640px] h-[640px] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 46%, transparent 54%), transparent 70%)",
          bottom: "50%",
          right: "45%",
        }}
        animate={{
          x: [0, 22, 0],
          y: [0, -18, 0],
          scale: [1, 1.17, 1],
        }}
        transition={{
          duration: 9.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[580px] h-[580px] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gradient-end) 40%, transparent 60%), transparent 70%)",
          top: "80%",
          left: "40%",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 16, 0],
          scale: [1, 1.13, 1],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 7.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[color:var(--accent)]/30 via-transparent to-transparent" />
      <div className="absolute inset-0 opacity-65 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[color:var(--gradient-end)]/25 via-transparent to-transparent" />

      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--gradient-start) 70%, transparent 30%), transparent)",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  )
}
