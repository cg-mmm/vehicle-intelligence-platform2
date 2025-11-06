import "server-only"

export interface TenantConfig {
  brandFile: string
  contentFile: string
}

const domainMap: Record<string, TenantConfig> = {
  // Production domains
  "v0-automata-2.vercel.app": {
    brandFile: "tenants/brand.pack.json",
    contentFile: "content/packs/default.content.json",
  },
  // Development/localhost
  localhost: {
    brandFile: "tenants/brand.pack.json",
    contentFile: "content/packs/default.content.json",
  },
  "127.0.0.1": {
    brandFile: "tenants/brand.pack.json",
    contentFile: "content/packs/default.content.json",
  },
  // Add more domains here as needed
  // "example.com": {
  //   brandFile: "tenants/example.brand.json",
  //   contentFile: "content/packs/example.content.json",
  // },
}

export function getTenantConfig(hostname: string): TenantConfig {
  // Remove port if present
  const cleanHostname = hostname.split(":")[0]

  // Check if we have a mapping for this hostname
  if (domainMap[cleanHostname]) {
    return domainMap[cleanHostname]
  }

  // Default fallback
  return {
    brandFile: "tenants/brand.pack.json",
    contentFile: "content/packs/default.content.json",
  }
}

export function getHostnameFromRequest(req?: Request): string {
  if (!req) {
    return "localhost"
  }

  // Try to get hostname from headers
  const host = req.headers.get("host") || req.headers.get("x-forwarded-host")

  if (host) {
    return host
  }

  // Fallback to localhost
  return "localhost"
}
