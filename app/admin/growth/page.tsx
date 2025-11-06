"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import type { Graph } from "@/lib/contracts/graph"
import type { Direction } from "@/lib/contracts/direction"
import type { PlannerResponse } from "@/lib/contracts/planner"

export default function GrowthDashboard() {
  const [graph, setGraph] = useState<Graph | null>(null)
  const [direction, setDirection] = useState<Direction | null>(null)
  const [picks, setPicks] = useState<PlannerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [graphRes, directionRes, picksRes] = await Promise.all([
        fetch("/api/graph"),
        fetch("/api/direction"),
        fetch("/api/planner/peek?n=10"),
      ])

      if (!graphRes.ok || !directionRes.ok || !picksRes.ok) {
        throw new Error("Failed to load data")
      }

      const [graphData, directionData, picksData] = await Promise.all([
        graphRes.json(),
        directionRes.json(),
        picksRes.json(),
      ])

      setGraph(graphData)
      setDirection(directionData)
      setPicks(picksData)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!graph || !direction || !picks) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Failed to load dashboard data</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const pillarCoverage = direction.pillars.map((p) => ({
    ...p,
    current: graph.counts.byPillar[p.id] || 0,
    coverage: ((graph.counts.byPillar[p.id] || 0) / p.target_quota) * 100,
  }))

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Growth Dashboard</h1>
          <p className="text-muted-foreground">Content coverage and planning control center</p>
        </div>
        <Button onClick={loadData}>Refresh</Button>
      </div>

      {/* Summary Banner */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{graph.counts.articles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pillars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{graph.counts.pillars}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{graph.counts.clusters}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Publish Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{direction.publish_per_day}/day</div>
          </CardContent>
        </Card>
      </div>

      {/* Pillar Coverage */}
      <Card>
        <CardHeader>
          <CardTitle>Pillar Coverage</CardTitle>
          <CardDescription>Progress toward target quotas by pillar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pillarCoverage.map((pillar) => (
              <div key={pillar.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{pillar.id}</span>
                    <Badge variant={pillar.freeze ? "secondary" : "default"}>Priority: {pillar.priority}</Badge>
                    {pillar.freeze && <Badge variant="outline">Frozen</Badge>}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {pillar.current} / {pillar.target_quota} ({Math.round(pillar.coverage)}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, pillar.coverage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Picks */}
      <Card>
        <CardHeader>
          <CardTitle>Next Picks</CardTitle>
          <CardDescription>Planner suggestions for upcoming articles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {picks.picks.map((pick, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{pick.slug}</h4>
                    <p className="text-sm text-muted-foreground">{pick.reason}</p>
                  </div>
                  <Badge>{pick.cluster}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span>Links: </span>
                  {pick.link_targets.parent && <span className="mr-2">Parent: {pick.link_targets.parent}</span>}
                  {pick.link_targets.siblings.length > 0 && (
                    <span className="mr-2">Siblings: {pick.link_targets.siblings.length}</span>
                  )}
                  {pick.link_targets.crosslinks.length > 0 && (
                    <span>Crosslinks: {pick.link_targets.crosslinks.length}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
