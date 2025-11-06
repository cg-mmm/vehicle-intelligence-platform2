export interface LinkingRules {
  maxLinksPerArticle: number
  maxLinksPerWords: number
  minWordsBetweenLinks: number
  forbiddenContexts: string[]
}

export const DEFAULT_LINKING_RULES: LinkingRules = {
  // Maximum 6 internal links per article
  maxLinksPerArticle: 6,

  // Maximum 1 link per 150 words
  maxLinksPerWords: 150,

  // Minimum 100 words between links
  minWordsBetweenLinks: 100,

  // Never insert links inside these contexts
  forbiddenContexts: [
    "h1",
    "h2",
    "h3",
    "a", // No links inside links
    "button",
    "nav",
    "header",
    "footer",
  ],
}

/**
 * Calculate maximum allowed links based on word count
 */
export function calculateMaxLinks(wordCount: number, rules: LinkingRules = DEFAULT_LINKING_RULES): number {
  const maxByWords = Math.floor(wordCount / rules.maxLinksPerWords)
  return Math.min(maxByWords, rules.maxLinksPerArticle)
}

/**
 * Check if a link can be inserted at a given position
 */
export function canInsertLink(
  currentLinkCount: number,
  wordsSinceLastLink: number,
  totalWords: number,
  rules: LinkingRules = DEFAULT_LINKING_RULES,
): boolean {
  // Check if we've exceeded max links
  if (currentLinkCount >= rules.maxLinksPerArticle) {
    return false
  }

  // Check if we've exceeded max links per word count
  const maxAllowed = calculateMaxLinks(totalWords, rules)
  if (currentLinkCount >= maxAllowed) {
    return false
  }

  // Check if enough words have passed since last link
  if (wordsSinceLastLink < rules.minWordsBetweenLinks) {
    return false
  }

  return true
}

/**
 * Validate that a context is safe for link insertion
 */
export function isSafeContext(context: string, rules: LinkingRules = DEFAULT_LINKING_RULES): boolean {
  const lowerContext = context.toLowerCase()
  return !rules.forbiddenContexts.some((forbidden) => lowerContext.includes(forbidden))
}
