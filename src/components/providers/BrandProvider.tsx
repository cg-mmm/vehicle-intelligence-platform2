"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { BrandPack } from "@/lib/packs/brand"

const BrandContext = createContext<BrandPack | null>(null)

export function BrandProvider({
  brand,
  children,
}: {
  brand: BrandPack
  children: ReactNode
}) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
}

export function useBrand(): BrandPack {
  const brand = useContext(BrandContext)
  if (!brand) {
    throw new Error("useBrand must be used within BrandProvider")
  }
  return brand
}
