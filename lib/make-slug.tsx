export function makeSlug(title: string): string {
  if (!title || typeof title !== "string") {
    return ""
  }

  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
