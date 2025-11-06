import { ImageResponse } from "next/og"
import { getArticle } from "@/lib/storage"
import brandPack from "@/tenants/brand.pack.json"

export const runtime = "edge"

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) {
    return new Response("Article not found", { status: 404 })
  }

  const keyStats = article.enhancements?.keyTakeaways?.items?.[0] || "Expert automotive analysis"

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        background: `linear-gradient(135deg, ${brandPack.colors.primary} 0%, ${brandPack.colors.secondary} 100%)`,
        padding: "60px 80px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.9)",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          {article.pillar.title}
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          {article.title}
        </div>

        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.85)",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          {keyStats}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "white",
          }}
        >
          {brandPack.siteName}
        </div>

        {article.hero.badges && (
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            {article.hero.badges.slice(0, 3).map((badge, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
