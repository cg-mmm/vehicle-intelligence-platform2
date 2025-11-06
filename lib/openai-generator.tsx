import type { Article } from "@/lib/articleSchema"
import { slugify } from "@/lib/slugify"

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0
}

interface GenerationRequest {
  title: string
  models?: Array<{ name: string; hp?: number; mpg?: number; price?: number; [key: string]: any }>
  customInstructions?: {
    tldr?: string
    keyTakeaways?: string[]
    quizInstructions?: string
    calculatorInstructions?: string
    pullQuote?: string
    pullQuoteAttribution?: string
    dropdownTitle?: string
    dropdownBody?: string
    reviewsInstructions?: string
  }
}

export async function generateArticleWithOpenAI(request: GenerationRequest): Promise<Article> {
  const { title, models = [], customInstructions = {} } = request

  if (!isOpenAIConfigured()) {
    throw new Error("OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.")
  }

  const vehicleNames = extractVehicleNames(title, models)

  const systemPrompt = `You are an expert automotive content generator. Generate comprehensive, accurate vehicle comparison articles in JSON format.

The article must include:
1. Hero section with headline, subheadline, and badges
2. Table of contents
3. Comparison table with all vehicles
4. Detailed spec grids
5. Pros & Cons
6. FAQ section
7. AI-enhanced modules (TL;DR, Key Takeaways, Quiz, Calculator, Pull Quote, Dropdown, Reviews)

Return ONLY valid JSON matching the schema. No markdown, no explanations.`

  const userPrompt = buildUserPrompt(title, models, customInstructions, vehicleNames)

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    })

    const responseText = await response.text()

    if (!response.ok) {
      let errorMessage = `OpenAI API error: ${response.status} ${response.statusText}`
      try {
        const errorData = JSON.parse(responseText)
        if (errorData.error?.message) {
          errorMessage = errorData.error.message
        }
      } catch {
        errorMessage = responseText || errorMessage
      }

      throw new Error(errorMessage)
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      throw new Error(
        `Invalid JSON response from OpenAI: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
      )
    }

    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error("No content returned from OpenAI")
    }

    let article
    try {
      article = JSON.parse(content)
    } catch (parseError) {
      throw new Error(
        `Invalid article JSON from OpenAI: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
      )
    }

    if (!article.slug) {
      article.slug = slugify(title)
    }

    return article as Article
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("401") || error.message.includes("Incorrect API key")) {
        throw new Error("Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.")
      }
      if (error.message.includes("429") || error.message.includes("Rate limit")) {
        throw new Error("OpenAI rate limit exceeded. Please try again in a few moments.")
      }
      if (error.message.includes("timeout")) {
        throw new Error("OpenAI request timed out. Please try again.")
      }
    }

    throw error
  }
}

function extractVehicleNames(title: string, models: any[]): string[] {
  if (models.length > 0 && models[0].name) {
    return models.map((m) => m.name)
  }

  const vsPattern = /(?:vs\.?|versus)\s+/gi
  const andPattern = /,?\s+and\s+/gi

  let names: string[] = []

  if (title.match(vsPattern)) {
    names = title
      .split(vsPattern)
      .map((part) => {
        return part
          .replace(/^\d{4}\s+/, "")
          .replace(/\s+comparison.*/i, "")
          .replace(/:\s*/, "")
          .trim()
      })
      .filter((name) => name.length > 0 && name.length < 50)
  }

  if (names.length === 0) {
    const parts = title.split(andPattern)
    if (parts.length > 1) {
      names = parts
        .map((part) =>
          part
            .replace(/^\d{4}\s+/, "")
            .replace(/\s+comparison.*/i, "")
            .trim(),
        )
        .filter((name) => name.length > 0 && name.length < 50)
    }
  }

  if (names.length === 0) {
    return ["Vehicle 1", "Vehicle 2", "Vehicle 3"]
  }

  return names
}

function buildUserPrompt(
  title: string,
  models: any[],
  customInstructions: GenerationRequest["customInstructions"],
  vehicleNames: string[],
): string {
  let prompt = `Generate a comprehensive vehicle comparison article with the title: "${title}"\n\n`

  prompt += `Vehicles being compared: ${vehicleNames.join(", ")}\n\n`

  if (models.length > 0) {
    prompt += `Vehicle data:\n${JSON.stringify(models, null, 2)}\n\n`
  }

  const columnNames = ["Metric", ...vehicleNames]
  const rowExample: Record<string, string> = { Metric: "Starting Price" }
  vehicleNames.forEach((name, i) => {
    rowExample[name] = `$${27000 + i * 500}`
  })

  prompt += `{
  "title": "${title}",
  "slug": "${slugify(title)}",
  "description": "A comprehensive comparison of ${vehicleNames.join(", ")} covering performance, fuel economy, features, and value",
  "hero": {
    "eyebrow": "Vehicle Intelligence Report",
    "headline": "${title}",
    "subheadline": "Detailed comparison to help you choose the right vehicle",
    "image": {
      "url": "/placeholder.svg?height=600&width=1200",
      "alt": "${vehicleNames.join(", ")} comparison"
    },
    "badges": [
      { "label": "Updated 2026" },
      { "label": "Expert Analysis" }
    ],
    "cta": {
      "label": "Get Pricing",
      "href": "#pricing"
    }
  },
  "toc": [
    { "id": "overview", "label": "Overview" },
    { "id": "performance", "label": "Performance" },
    { "id": "fuel-economy", "label": "Fuel Economy" },
    { "id": "specs", "label": "Specifications" },
    { "id": "pros-cons", "label": "Pros & Cons" },
    { "id": "faq", "label": "FAQ" }
  ],
  "blocks": [
    {
      "type": "intro",
      "html": "<p>Write a compelling 2-3 paragraph introduction that:</p><ul><li>Introduces the ${vehicleNames.join(", ")} and their market segment</li><li>Highlights what makes each vehicle unique</li><li>Sets up the comparison and what readers will learn</li></ul><p>Make it engaging and informative, not generic placeholder text.</p>"
    },
    {
      "type": "comparisonTable",
      "caption": "Key Specifications Comparison",
      "columns": ${JSON.stringify(columnNames)},
      "rows": [
        ${JSON.stringify(rowExample)},
        { "Metric": "Horsepower", ${vehicleNames.map((name, i) => `"${name}": "${190 + i * 10} hp"`).join(", ")} },
        { "Metric": "City MPG", ${vehicleNames.map((name, i) => `"${name}": "${28 + i}"`).join(", ")} },
        { "Metric": "Highway MPG", ${vehicleNames.map((name, i) => `"${name}": "${36 + i}"`).join(", ")} }
      ],
      "highlightRule": "max"
    },
    {
      "type": "specGrid",
      "groups": [
        {
          "title": "Performance",
          "items": [
            { "label": "Engine", "value": "2.5L 4-Cylinder" },
            { "label": "Horsepower", "value": "192 hp @ 6,500 rpm" },
            { "label": "Torque", "value": "192 lb-ft @ 3,500 rpm" }
          ]
        },
        {
          "title": "Fuel Economy",
          "items": [
            { "label": "City", "value": "30 MPG" },
            { "label": "Highway", "value": "38 MPG" },
            { "label": "Combined", "value": "33 MPG" }
          ]
        }
      ]
    },
    {
      "type": "prosCons",
      "pros": [
        "Excellent fuel economy",
        "Spacious interior",
        "Advanced safety features"
      ],
      "cons": [
        "CVT transmission may feel less engaging",
        "Base models lack premium features"
      ]
    },
    {
      "type": "faq",
      "items": [
        {
          "q": "Which vehicle has the best fuel economy?",
          "a": "Provide specific answer with actual MPG numbers for each vehicle."
        },
        {
          "q": "Are these vehicles reliable?",
          "a": "Discuss reliability ratings and history for each vehicle."
        }
      ]
    }
  ],
  "modules": [
    {
      "type": "tldr",
      "content": "${customInstructions?.tldr || `Write a compelling 2-3 sentence summary highlighting the key differences between ${vehicleNames.join(", ")} and which vehicle is best for different buyer types.`}"
    },
    {
      "type": "key_takeaways",
      "items": [
        "Specific takeaway about ${vehicleNames[0]}",
        "Specific takeaway about ${vehicleNames[1]}",
        "Specific takeaway about ${vehicleNames[2] || "the third vehicle"}",
        "Overall comparison insight"
      ]
    },
    {
      "type": "quiz",
      "title": "Which Vehicle Is Right For You?",
      "questions": [
        {
          "prompt": "What's your top priority?",
          "choices": ["Fuel economy", "Cargo space", "Lowest price", "Performance"],
          "correctIndex": 0,
          "explanation": "Provide specific recommendation based on the actual vehicles being compared."
        },
        {
          "prompt": "How important is cargo space?",
          "choices": ["Very important", "Somewhat important", "Not important", "Maximum space needed"],
          "correctIndex": 3,
          "explanation": "Reference actual cargo space numbers from the comparison."
        }
      ]
    },
    {
      "type": "mpg_calculator",
      "label": "Calculate Your Fuel Costs",
      "defaults": {
        "cityMpg": 30,
        "hwyMpg": 38,
        "fuelPrice": 3.5,
        "miles": 12000
      }
    },
    {
      "type": "pull_quote",
      "quote": "${customInstructions?.pullQuote || `Create an impactful quote about one of the vehicles (${vehicleNames.join(", ")}) that highlights a key strength or insight.`}",
      "attribution": "${customInstructions?.pullQuoteAttribution || "Car and Driver, 2026 Review"}"
    },
    {
      "type": "dropdown",
      "title": "${customInstructions?.dropdownTitle || "Understanding Key Features"}",
      "body": "${customInstructions?.dropdownBody || "Write 2-3 paragraphs explaining a relevant technical topic or feature that applies to these vehicles."}"
    },
    {
      "type": "reviews",
      "sources": ["Car and Driver", "Motor Trend", "Edmunds"],
      "entries": [
        {
          "author": "Car and Driver",
          "rating": 4.5,
          "summary": "Write a realistic review summary for one of the vehicles with specific pros and cons.",
          "pros": ["Specific pro 1", "Specific pro 2"],
          "cons": ["Specific con 1"]
        }
      ]
    }
  ],
  "seo": {
    "canonical": "https://example.com/articles/${slugify(title)}",
    "ogImage": "/placeholder.svg?height=630&width=1200"
  },
  "publishedAt": "${new Date().toISOString()}",
  "updatedAt": "${new Date().toISOString()}"
}\n\n`

  prompt += `CRITICAL REQUIREMENTS:\n`
  prompt += `1. comparisonTable.columns MUST be exactly: ${JSON.stringify(columnNames)}\n`
  prompt += `2. comparisonTable.rows MUST use these exact column names as keys\n`
  prompt += `3. The intro block MUST contain actual introduction content, NOT placeholder text\n`
  prompt += `4. Write compelling, specific content for ${vehicleNames.join(", ")} - no generic placeholders\n`
  prompt += `5. All content should be factual and realistic for these specific vehicles\n`
  prompt += `6. specGrid.groups MUST have an "items" array with {label, value} objects\n`
  prompt += `7. quiz.questions MUST have "prompt" (string), "choices" (array of strings), "correctIndex" (number), and optional "explanation" (string)\n`
  prompt += `8. Return ONLY the JSON object, no markdown formatting, no explanations\n\n`

  if (customInstructions?.tldr) {
    prompt += `Use this for TL;DR: ${customInstructions.tldr}\n`
  }
  if (customInstructions?.keyTakeaways && customInstructions.keyTakeaways.length > 0) {
    prompt += `Use these for Key Takeaways: ${JSON.stringify(customInstructions.keyTakeaways)}\n`
  }
  if (customInstructions?.quizInstructions) {
    prompt += `Quiz instructions: ${customInstructions.quizInstructions}\n`
  }
  if (customInstructions?.reviewsInstructions) {
    prompt += `Reviews instructions: ${customInstructions.reviewsInstructions}\n`
  }

  return prompt
}
