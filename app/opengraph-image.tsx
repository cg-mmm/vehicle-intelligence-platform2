import { ImageResponse } from "next/og"
import { getBrand } from "@/lib/siteConfig"

export const runtime = "edge"
export const alt = "Vehicle Intelligence Platform"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  const brand = getBrand()

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "64px",
            fontWeight: "bold",
            color: "white",
            boxShadow: "0 20px 60px rgba(59, 130, 246, 0.4)",
          }}
        >
          V
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {brand.siteName}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            color: "#cbd5e1",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Data-driven vehicle comparisons and expert insights
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "32px",
          }}
        >
          {["Expert Reviews", "Data Visualizations", "Side-by-Side Comparisons"].map((feature, index) => (
            <div
              key={index}
              style={{
                padding: "12px 24px",
                background: "rgba(59, 130, 246, 0.1)",
                borderRadius: "12px",
                border: "2px solid rgba(59, 130, 246, 0.3)",
                fontSize: "20px",
                fontWeight: "600",
                color: "#60a5fa",
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
