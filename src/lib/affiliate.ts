interface AffiliateContext {
  domain: string
}

interface AffiliateConfig {
  domains: {
    [key: string]: Record<string, string>
  }
}

let affiliateConfig: AffiliateConfig | null = null

async function loadAffiliateConfig(): Promise<AffiliateConfig> {
  if (affiliateConfig) {
    return affiliateConfig
  }

  try {
    const response = await fetch(`${process.env.BASE_URL || "http://localhost:3000"}/tenants/affiliate.pack.json`, {
      cache: "force-cache",
    })
    affiliateConfig = await response.json()
    return affiliateConfig
  } catch {
    return { domains: {} }
  }
}

export async function decorate(url: string, ctx: AffiliateContext): Promise<{ href: string; rel: string }> {
  const config = await loadAffiliateConfig()

  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname

    // Find matching domain config or use default
    const params = config.domains[hostname] || config.domains.default || {}

    // Append affiliate params, preserving existing UTM params
    Object.entries(params).forEach(([key, value]) => {
      if (!urlObj.searchParams.has(key)) {
        urlObj.searchParams.set(key, value)
      }
    })

    return {
      href: urlObj.toString(),
      rel: "sponsored noopener noreferrer",
    }
  } catch {
    // If URL parsing fails, return original
    return {
      href: url,
      rel: "noopener noreferrer",
    }
  }
}
