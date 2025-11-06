import "server-only"
import { loadBrand, type BrandPack } from "./packs/brand"
import { loadContentPack, type ContentPack } from "./packs/content"
import { getTenantConfig, getHostnameFromRequest } from "./domainTenant"

const brandCache = new Map<string, BrandPack>()
const contentCache = new Map<string, ContentPack>()

export function getBrand(req?: Request): BrandPack {
  const hostname = getHostnameFromRequest(req)
  const config = getTenantConfig(hostname)

  // Check cache first
  if (brandCache.has(config.brandFile)) {
    return brandCache.get(config.brandFile)!
  }

  // Load and cache
  const brand = loadBrand(config.brandFile)
  brandCache.set(config.brandFile, brand)
  return brand
}

export function getContentPack(req?: Request): ContentPack {
  const hostname = getHostnameFromRequest(req)
  const config = getTenantConfig(hostname)

  // Check cache first
  if (contentCache.has(config.contentFile)) {
    return contentCache.get(config.contentFile)!
  }

  // Load and cache
  const content = loadContentPack(config.contentFile)
  contentCache.set(config.contentFile, content)
  return content
}

export function clearPackCache() {
  brandCache.clear()
  contentCache.clear()
}
