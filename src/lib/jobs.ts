interface Job<T = any> {
  id: string
  type: string
  status: "queued" | "processing" | "completed" | "failed"
  payload: T
  createdAt: string
  updatedAt: string
}

// In-memory job store (will be replaced with database in Cursor)
const jobs: Map<string, Job> = new Map()

export function enqueueJob<T = any>(type: string, payload: T): { id: string; status: "queued" } {
  const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  const job: Job<T> = {
    id,
    type,
    status: "queued",
    payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  jobs.set(id, job)

  console.log(`[v0] Enqueued ${type} job:`, id)

  return { id, status: "queued" }
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id)
}

export function getAllJobs(): Job[] {
  return Array.from(jobs.values())
}

export function updateJobStatus(id: string, status: Job["status"]): void {
  const job = jobs.get(id)
  if (job) {
    job.status = status
    job.updatedAt = new Date().toISOString()
    jobs.set(id, job)
  }
}
