import type { ArticleDoc } from "@/lib/contracts"

// Pillar page type
export interface PillarPage {
  slug: string
  title: string
  description: string
  hero: {
    title: string
    subtitle: string
    image: string
  }
  clusters: Array<{
    slug: string
    title: string
    description: string
    articleCount: number
  }>
  featuredArticles: Array<{
    slug: string
    title: string
    description: string
    image: string
  }>
  seo: {
    title: string
    description: string
    canonical: string
    ogImage: string
  }
}

// In-memory storage using Map
const articlesStore = new Map<string, ArticleDoc>()
const pillarsStore = new Map<string, PillarPage>()

// Initialize pillar pages
const mockPillars: PillarPage[] = [
  {
    slug: "sedans",
    title: "Sedans",
    description:
      "Your comprehensive resource for everything sedan-related. From midsize family sedans to luxury performance models, we cover comparisons, reviews, and buying advice to help you find the perfect sedan for your needs and budget.",
    hero: {
      title: "Complete Sedan Guide",
      subtitle: "Expert comparisons, reviews, and buying advice for every sedan segment",
      image: "/sedan-hero.jpg",
    },
    clusters: [
      {
        slug: "midsize-sedans",
        title: "Midsize Sedans",
        description:
          "Comprehensive comparisons of popular midsize sedans including Honda Accord, Toyota Camry, and more",
        articleCount: 2,
      },
      {
        slug: "luxury-sedans",
        title: "Luxury Sedans",
        description: "In-depth reviews and comparisons of premium luxury sedans from BMW, Mercedes, Audi, and more",
        articleCount: 1,
      },
    ],
    featuredArticles: [
      {
        slug: "2026-midsize-sedan-comparison",
        title: "2026 Midsize Sedan Comparison: Honda Accord vs Toyota Camry vs Mazda6",
        description:
          "A detailed comparison of three top midsize sedans, including fuel economy, performance, and value analysis",
        image: "/2026-midsize-sedan-comparison.jpg",
      },
      {
        slug: "luxury-sedan-showdown",
        title: "Luxury Sedan Showdown: BMW 5 Series vs Mercedes E-Class vs Audi A6",
        description:
          "Compare the top luxury sedans and find out which one offers the best combination of performance and prestige",
        image: "/luxury-sedans.jpg",
      },
    ],
    seo: {
      title: "Sedan Guide - Expert Reviews & Comparisons",
      description:
        "Complete sedan guide with expert reviews, comparisons, and advice for midsize, luxury, and family sedans",
      canonical: "https://example.com/topics/sedans",
      ogImage: "/sedan-hero.jpg",
    },
  },
  {
    slug: "suvs",
    title: "SUVs",
    description:
      "Your ultimate destination for SUV comparisons and reviews. Whether you're looking for a compact crossover, electric SUV, or full-size family hauler, we provide detailed analysis, specifications, and expert recommendations to guide your decision.",
    hero: {
      title: "SUV Comparison Hub",
      subtitle: "Find the perfect SUV with our comprehensive comparisons and expert reviews",
      image: "/suv-hero.jpg",
    },
    clusters: [
      {
        slug: "electric-suvs",
        title: "Electric SUVs",
        description: "Comprehensive guides to the latest electric SUVs with range, charging, and performance data",
        articleCount: 1,
      },
      {
        slug: "compact-suvs",
        title: "Compact SUVs",
        description: "Detailed comparisons of popular compact SUVs perfect for families and urban driving",
        articleCount: 1,
      },
    ],
    featuredArticles: [
      {
        slug: "best-electric-suvs-2026",
        title: "Best Electric SUVs for 2026",
        description: "Comprehensive guide to the top electric SUVs hitting the market this year",
        image: "/electric-suvs-2026.jpg",
      },
      {
        slug: "compact-suv-buyers-guide",
        title: "Compact SUV Buyer's Guide",
        description: "Everything you need to know before buying a compact SUV",
        image: "/compact-suvs.jpg",
      },
    ],
    seo: {
      title: "SUV Comparison Hub - Expert Reviews & Buying Guides",
      description:
        "Complete SUV comparison hub with expert reviews, specifications, and buying guides for electric, compact, and full-size SUVs",
      canonical: "https://example.com/topics/suvs",
      ogImage: "/suv-hero.jpg",
    },
  },
]

// Initialize with complete example article including all gadgets, quizzes, calculators, reviews
const mockArticles: ArticleDoc[] = [
  {
    title: "2026 Midsize Sedan Comparison: Honda Accord vs Toyota Camry vs Mazda6",
    slug: "2026-midsize-sedan-comparison",
    description:
      "A detailed comparison and overview of three top midsize sedans, including fuel economy, performance, and value analysis",
    pillar: {
      slug: "sedans",
      title: "Sedans",
    },
    cluster: {
      slug: "midsize-sedans",
      title: "Midsize Sedans",
    },
    pageType: "cluster",
    hero: {
      eyebrow: "Vehicle Intelligence Report",
      title: "2026 Midsize Sedan Comparison",
      subtitle: "Honda Accord vs Toyota Camry vs Mazda6 - Which sedan offers the best value?",
      image: {
        url: "/2026-midsize-sedan-comparison.jpg",
        alt: "2026 Honda Accord, Toyota Camry, and Mazda6 side by side",
      },
      badges: ["Updated 2026", "Expert Analysis", "164+ Data Points"],
      cta: {
        label: "Get Pricing",
        href: "#pricing",
      },
    },
    toc: [
      { id: "introduction", title: "Introduction" },
      { id: "comparison", title: "Side-by-Side Comparison" },
      { id: "specifications", title: "Detailed Specifications" },
      { id: "pros-cons", title: "Pros & Cons" },
      { id: "gallery", title: "Photo Gallery" },
      { id: "faq", title: "Frequently Asked Questions" },
      { id: "deep-dive", title: "Understanding Midsize Sedan Value" },
    ],
    blocks: [
      {
        type: "intro",
        html: "<h2 id='introduction'>Introduction</h2><p>The midsize sedan segment remains one of the most competitive in the automotive market. For 2026, the Honda Accord, Toyota Camry, and Mazda6 continue to set the standard for reliability, comfort, and value.</p><p>In this comprehensive comparison, we'll examine each vehicle's strengths and help you determine which sedan best fits your needs and budget.</p>",
      },
      {
        type: "comparisonTable",
        caption: "Key Specifications Comparison",
        columns: ["Metric", "Honda Accord", "Toyota Camry", "Mazda6"],
        rows: [
          {
            Metric: "Starting Price",
            "Honda Accord": "$28,300",
            "Toyota Camry": "$27,500",
            Mazda6: "$26,800",
          },
          { Metric: "Horsepower", "Honda Accord": "192 hp", "Toyota Camry": "203 hp", Mazda6: "187 hp" },
          { Metric: "City MPG", "Honda Accord": "30", "Toyota Camry": "28", Mazda6: "26" },
          { Metric: "Highway MPG", "Honda Accord": "38", "Toyota Camry": "39", Mazda6: "35" },
          { Metric: "Cargo Space", "Honda Accord": "16.7 cu ft", "Toyota Camry": "15.1 cu ft", Mazda6: "14.7 cu ft" },
          { Metric: "Warranty", "Honda Accord": "3yr/36k mi", "Toyota Camry": "3yr/36k mi", Mazda6: "3yr/36k mi" },
        ],
        highlightRule: "max",
      },
      {
        type: "markdown",
        md: "## Performance & Handling\n\nEach sedan offers a unique driving experience. The **Honda Accord** balances efficiency with responsive handling, while the **Toyota Camry** provides a smooth, comfortable ride. The **Mazda6** stands out with its sporty, engaging dynamics that make every drive enjoyable.",
      },
      {
        type: "specGrid",
        groups: [
          {
            title: "Honda Accord",
            items: [
              { label: "Engine", value: "1.5L Turbo I4" },
              { label: "Transmission", value: "CVT" },
              { label: "Drivetrain", value: "FWD" },
              { label: "Seating", value: "5 passengers" },
              { label: "0-60 mph", value: "7.5 seconds" },
              { label: "Top Speed", value: "125 mph" },
            ],
          },
          {
            title: "Toyota Camry",
            items: [
              { label: "Engine", value: "2.5L I4" },
              { label: "Transmission", value: "8-Speed Auto" },
              { label: "Drivetrain", value: "FWD/AWD" },
              { label: "Seating", value: "5 passengers" },
              { label: "0-60 mph", value: "7.2 seconds" },
              { label: "Top Speed", value: "130 mph" },
            ],
          },
          {
            title: "Mazda6",
            items: [
              { label: "Engine", value: "2.5L I4" },
              { label: "Transmission", value: "6-Speed Auto" },
              { label: "Drivetrain", value: "FWD" },
              { label: "Seating", value: "5 passengers" },
              { label: "0-60 mph", value: "7.8 seconds" },
              { label: "Top Speed", value: "128 mph" },
            ],
          },
        ],
      },
      {
        type: "prosCons",
        pros: [
          "Excellent fuel economy across all models",
          "Spacious and comfortable interiors",
          "Advanced safety features standard",
          "Strong resale values",
          "Reliable powertrains with proven track records",
        ],
        cons: [
          "Premium features can increase price significantly",
          "Some competitors offer more powerful engines",
          "Infotainment systems vary in user-friendliness",
          "Mazda6 lacks all-wheel drive option",
        ],
      },
      {
        type: "gallery",
        images: [
          { url: "/honda-accord-exterior.jpg", alt: "2026 Honda Accord" },
          { url: "/toyota-camry-exterior.png", alt: "2026 Toyota Camry" },
          { url: "/mazda6-exterior.jpg", alt: "2026 Mazda6" },
          {
            url: "/honda-accord-interior.jpg",
            alt: "Honda Accord Interior",
          },
          {
            url: "/toyota-camry-interior.png",
            alt: "Toyota Camry Interior",
          },
          { url: "/mazda6-interior.jpg", alt: "Mazda6 Interior" },
        ],
      },
      {
        type: "lsi_longform",
        heading: "Understanding Midsize Sedan Value in Today's Market",
        content_markdown: `## 🚗 The Evolution of Midsize Sedan Excellence

The midsize sedan segment has undergone a **remarkable transformation** over the past decade. What was once a category dominated by basic transportation has evolved into a showcase of automotive innovation, where manufacturers compete not just on price, but on technology, efficiency, and driving experience.

Today's midsize sedans represent the sweet spot in automotive value—offering near-luxury amenities at accessible price points, combining the efficiency of smaller vehicles with the space and comfort families need. This evolution reflects changing consumer priorities and the industry's response to increasingly sophisticated buyer expectations.

## 💰 Total Cost of Ownership: Beyond the Sticker Price

When evaluating midsize sedans, the purchase price tells only part of the story. **Total cost of ownership** encompasses:

- Fuel costs and efficiency ratings
- Insurance premiums and coverage options  
- Maintenance expenses and service intervals
- Depreciation curves and resale values
- Financing rates and loan terms

Fuel efficiency plays a crucial role in this equation. A vehicle achieving **35 MPG combined** versus 28 MPG can save owners over $500 annually based on 12,000 miles of driving. Over a typical five-year ownership period, that difference compounds to **$2,500 or more**—enough to offset a higher initial purchase price.

### 🔧 Maintenance and Reliability Considerations

Japanese manufacturers like Honda and Toyota have built their reputations on **exceptional reliability**. Their midsize sedans typically require less frequent repairs and experience fewer mechanical issues over their lifespans. This reliability translates directly to:

- Lower maintenance costs over time
- Higher resale values in the used market
- Greater peace of mind for owners
- Reduced unexpected repair expenses

The **warranty coverage** provided by manufacturers offers insight into their confidence in build quality. While most midsize sedans come with similar basic warranties (3 years/36,000 miles), some manufacturers offer extended powertrain coverage that can provide additional peace of mind.

> 💡 **Pro Tip**: Extended warranties can be valuable, but evaluate the actual coverage terms carefully. Many exclude common wear items and have significant deductibles.

## 🛡️ Technology Integration and Safety Systems

Modern midsize sedans serve as technology showcases, featuring advanced driver assistance systems (ADAS) that were exclusive to luxury vehicles just a few years ago. **Standard safety features** now include:

- Adaptive cruise control with stop-and-go capability
- Lane keeping assist and lane departure warning
- Automatic emergency braking with pedestrian detection
- Blind spot monitoring and rear cross-traffic alert
- Forward collision warning with brake assist

These safety technologies don't just provide convenience—they **actively prevent accidents** and can reduce insurance premiums. Many insurers now offer discounts for vehicles equipped with comprehensive safety suites, recognizing their proven effectiveness in reducing collision frequency and severity.

### 📱 Infotainment and Connectivity

The integration of smartphone connectivity through **Apple CarPlay** and **Android Auto** has become essential rather than optional. These systems provide seamless access to:

- Navigation with real-time traffic updates
- Hands-free calling and messaging
- Music streaming and podcast apps
- Voice assistant integration

However, the implementation quality varies significantly between manufacturers. Some systems feature intuitive interfaces with responsive touchscreens, while others frustrate users with complex menu structures and laggy performance. This daily interaction point can significantly impact overall ownership satisfaction.

## 📏 Interior Space and Practical Versatility

Despite their similar exterior dimensions, midsize sedans vary considerably in interior space utilization. **Cargo capacity** ranges from 14 to 17 cubic feet, a difference that matters when transporting:

- Luggage for family vacations
- Sports equipment and gear
- Weekly grocery shopping
- Business materials and samples

Rear seat legroom and headroom determine passenger comfort on longer journeys. Families with teenagers or frequent carpoolers should prioritize models offering generous rear accommodations. The ability to fold rear seats expands versatility, allowing occasional transport of longer items like furniture or sporting equipment.

### 🎨 Material Quality and Comfort

Interior materials and build quality create the daily ownership experience. **Premium features** that elevate the driving experience include:

- Soft-touch surfaces on frequently contacted areas
- Quality upholstery materials (leather, premium cloth)
- Thoughtful ergonomics and control placement
- Ambient lighting and customizable displays
- Dual-zone or tri-zone climate control

Climate control effectiveness, seat comfort during extended drives, and noise insulation all contribute to long-term satisfaction. These factors become increasingly important for commuters spending significant time in their vehicles.

## 📈 Resale Value and Depreciation Patterns

Depreciation represents the **largest ownership cost** for most vehicles. Midsize sedans from manufacturers with strong reliability reputations typically retain value better than competitors. A vehicle retaining 50% of its value after five years versus 40% represents **thousands of dollars** in preserved equity.

**Market demand** influences resale values significantly. Models with strong reputations for:

- Reliability and low maintenance costs
- Fuel efficiency and low operating costs  
- Safety ratings and advanced features
- Brand prestige and customer satisfaction

These vehicles command premium prices in the used market, reflecting buyer confidence in the vehicle's continued performance and reasonable ownership costs.`,
        word_count: 687,
        keywords_used: [
          "midsize sedan",
          "total cost of ownership",
          "fuel efficiency",
          "reliability",
          "safety systems",
          "technology integration",
          "resale value",
          "depreciation",
          "interior space",
          "maintenance costs",
        ],
        semantic_clusters: [
          {
            topic: "Financial Considerations",
            related_terms: [
              "total cost of ownership",
              "depreciation",
              "resale value",
              "insurance premiums",
              "fuel costs",
            ],
          },
          {
            topic: "Safety and Technology",
            related_terms: [
              "ADAS",
              "driver assistance",
              "adaptive cruise control",
              "collision prevention",
              "infotainment",
            ],
          },
          {
            topic: "Practical Value",
            related_terms: ["cargo space", "interior quality", "passenger comfort", "versatility", "daily usability"],
          },
        ],
        style: {
          tone: "expert yet conversational",
          readability: "grade 9-10",
          visual_style: "balanced spacing, clear headings",
        },
      },
      {
        type: "faq",
        items: [
          {
            q: "Which sedan has the best fuel economy?",
            a: "The Honda Accord leads with 30 city / 38 highway MPG, making it the most fuel-efficient option in this comparison.",
          },
          {
            q: "Does the Toyota Camry offer all-wheel drive?",
            a: "Yes, the Toyota Camry is the only sedan in this comparison that offers an available all-wheel drive system, making it ideal for drivers in snowy climates.",
          },
          {
            q: "Which sedan is best for driving enthusiasts?",
            a: "The Mazda6 offers the most engaging driving dynamics with precise steering and responsive handling, making it the top choice for those who enjoy spirited driving.",
          },
          {
            q: "What's the most affordable option?",
            a: "The Mazda6 has the lowest starting price at $26,800, making it the most budget-friendly choice while still offering premium features.",
          },
        ],
      },
      {
        type: "ctaBanner",
        heading: "Ready to Find Your Perfect Sedan?",
        sub: "Compare prices from local dealers and get the best deal",
        href: "#pricing",
        label: "Get Dealer Quotes",
      },
    ],
    enhancements: {
      tldr: {
        type: "tldr",
        content:
          "The 2026 Honda Accord, Toyota Camry, and Mazda6 represent the best midsize sedans on the market. The Accord excels in fuel economy and cargo space, the Camry offers legendary reliability and available AWD, while the Mazda6 provides upscale styling and engaging driving dynamics at the lowest price.",
      },
      keyTakeaways: {
        type: "key_takeaways",
        items: [
          "Honda Accord achieves best-in-class fuel economy with 30/38 MPG",
          "Toyota Camry is the only sedan offering all-wheel drive",
          "Mazda6 has the lowest starting price at $26,800",
          "All three sedans offer excellent reliability and resale value",
          "Standard safety features include adaptive cruise control and lane keeping assist",
        ],
      },
      pullQuote: {
        type: "pull_quote",
        quote:
          "The midsize sedan segment continues to deliver exceptional value, combining efficiency, comfort, and advanced technology at accessible price points.",
        attribution: "Automotive Expert Review",
      },
      mpgCalculator: {
        type: "mpg_calculator",
        label: "Calculate Your Annual Fuel Costs",
        defaults: {
          cityMpg: 30,
          hwyMpg: 38,
          fuelPrice: 3.5,
          miles: 12000,
        },
      },
      reviews: {
        type: "reviews",
        sources: ["Car and Driver", "Motor Trend", "Edmunds", "Consumer Reports"],
        entries: [
          {
            author: "Car and Driver",
            rating: 4.5,
            summary:
              "The Honda Accord continues to set the standard for midsize sedans with its refined powertrain, spacious interior, and excellent fuel economy.",
            pros: ["Best-in-class fuel economy", "Spacious trunk", "Smooth CVT transmission"],
            cons: ["Infotainment could be more intuitive", "Road noise at highway speeds"],
          },
          {
            author: "Motor Trend",
            rating: 4.7,
            summary:
              "The Toyota Camry impresses with its available all-wheel drive, powerful V6 option, and Toyota's legendary reliability.",
            pros: ["Available AWD", "Strong V6 engine", "Excellent reliability record"],
            cons: ["Base engine feels underpowered", "Conservative styling"],
          },
          {
            author: "Edmunds",
            rating: 4.3,
            summary:
              "The Mazda6 stands out with its upscale interior, engaging driving dynamics, and attractive styling that rivals luxury sedans.",
            pros: ["Premium interior quality", "Fun to drive", "Attractive design"],
            cons: ["Smaller cargo space", "No AWD option", "Infotainment learning curve"],
          },
        ],
      },
      quiz: {
        type: "quiz",
        title: "Which Midsize Sedan is Right for You?",
        questions: [
          {
            prompt: "What's your top priority in a midsize sedan?",
            choices: ["Fuel efficiency", "All-weather capability", "Driving enjoyment", "Lowest price"],
            correctIndex: 0,
            explanation:
              "While all factors matter, fuel efficiency typically provides the best long-term value in a midsize sedan, saving you thousands over the vehicle's lifetime.",
          },
          {
            prompt: "How important is cargo space to you?",
            choices: ["Very important", "Somewhat important", "Not important"],
            correctIndex: 0,
            explanation:
              "The Honda Accord offers the most cargo space at 16.7 cubic feet, making it ideal for families or those who frequently transport larger items.",
          },
          {
            prompt: "Do you live in an area with harsh winter weather?",
            choices: ["Yes, snow and ice are common", "Occasional winter weather", "Mild climate year-round"],
            correctIndex: 0,
            explanation:
              "If you experience harsh winters, the Toyota Camry's available all-wheel drive system provides superior traction and confidence in snowy conditions.",
          },
        ],
      },
      dropdown: {
        type: "dropdown",
        title: "Additional Resources",
        body: "For more information about these vehicles, visit the manufacturer websites or schedule test drives at your local dealerships. Remember to compare insurance quotes and financing options before making your final decision.",
      },
    },
    seo: {
      title: "2026 Midsize Sedan Comparison: Accord vs Camry vs Mazda6",
      description:
        "Compare the top midsize sedans of 2026 including Honda Accord, Toyota Camry, and Mazda6 with detailed specs, pricing, and expert analysis.",
      canonical: "https://example.com/articles/2026-midsize-sedan-comparison",
      ogImage: "/2026-midsize-sedan-comparison.jpg",
    },
    publishedAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    title: "Best Electric SUVs for 2026",
    slug: "best-electric-suvs-2026",
    description:
      "Comprehensive guide to the top electric SUVs hitting the market this year with range, charging, and performance analysis",
    pillar: {
      slug: "suvs",
      title: "SUVs",
    },
    cluster: {
      slug: "electric-suvs",
      title: "Electric SUVs",
    },
    pageType: "cluster",
    hero: {
      eyebrow: "Electric Vehicle Guide",
      title: "Best Electric SUVs for 2026",
      subtitle:
        "Tesla Model Y vs Ford Mustang Mach-E vs Hyundai Ioniq 5 - Top electric SUVs combining range, performance, and practicality",
      image: {
        url: "/electric-suvs-2026.jpg",
        alt: "2026 Electric SUVs lineup",
      },
      badges: ["Updated 2026", "EV Guide", "Range Tested"],
      cta: {
        label: "Compare Prices",
        href: "#pricing",
      },
    },
    toc: [
      { id: "introduction", title: "Introduction" },
      { id: "comparison", title: "Side-by-Side Comparison" },
      { id: "specifications", title: "Detailed Specifications" },
      { id: "pros-cons", title: "Pros & Cons" },
      { id: "gallery", title: "Photo Gallery" },
      { id: "faq", title: "Frequently Asked Questions" },
      { id: "deep-dive", title: "Understanding Electric SUV Value" },
    ],
    blocks: [
      {
        type: "intro",
        html: "<h2 id='introduction'>Introduction</h2><p>The electric SUV segment has exploded in popularity, offering families the perfect combination of zero-emission driving, impressive range, and SUV versatility. For 2026, the Tesla Model Y, Ford Mustang Mach-E, and Hyundai Ioniq 5 represent the best options in this rapidly evolving market.</p><p>In this comprehensive comparison, we'll examine range, charging speed, performance, and value to help you choose the perfect electric SUV for your lifestyle.</p>",
      },
      {
        type: "comparisonTable",
        caption: "Key Specifications Comparison",
        columns: ["Metric", "Tesla Model Y", "Ford Mach-E", "Hyundai Ioniq 5"],
        rows: [
          {
            Metric: "Starting Price",
            "Tesla Model Y": "$47,740",
            "Ford Mach-E": "$42,995",
            "Hyundai Ioniq 5": "$41,450",
          },
          {
            Metric: "Range (EPA)",
            "Tesla Model Y": "330 miles",
            "Ford Mach-E": "312 miles",
            "Hyundai Ioniq 5": "303 miles",
          },
          { Metric: "Horsepower", "Tesla Model Y": "384 hp", "Ford Mach-E": "346 hp", "Hyundai Ioniq 5": "320 hp" },
          { Metric: "0-60 mph", "Tesla Model Y": "4.8 sec", "Ford Mach-E": "5.2 sec", "Hyundai Ioniq 5": "5.1 sec" },
          { Metric: "Charging Speed", "Tesla Model Y": "250 kW", "Ford Mach-E": "150 kW", "Hyundai Ioniq 5": "350 kW" },
          {
            Metric: "Cargo Space",
            "Tesla Model Y": "76 cu ft",
            "Ford Mach-E": "59.7 cu ft",
            "Hyundai Ioniq 5": "59.3 cu ft",
          },
        ],
        highlightRule: "max",
      },
      {
        type: "markdown",
        md: "## Performance & Range\n\nEach electric SUV offers impressive performance with instant torque delivery. The **Tesla Model Y** leads in range and cargo space, while the **Hyundai Ioniq 5** features the fastest charging capability at 350 kW. The **Ford Mustang Mach-E** provides the most affordable entry point with strong performance.",
      },
      {
        type: "specGrid",
        groups: [
          {
            title: "Tesla Model Y",
            items: [
              { label: "Battery", value: "75 kWh" },
              { label: "Motors", value: "Dual Motor AWD" },
              { label: "Drivetrain", value: "AWD" },
              { label: "Seating", value: "5-7 passengers" },
              { label: "Towing", value: "3,500 lbs" },
              { label: "Supercharging", value: "250 kW max" },
            ],
          },
          {
            title: "Ford Mustang Mach-E",
            items: [
              { label: "Battery", value: "91 kWh" },
              { label: "Motors", value: "Dual Motor AWD" },
              { label: "Drivetrain", value: "RWD/AWD" },
              { label: "Seating", value: "5 passengers" },
              { label: "Towing", value: "Not rated" },
              { label: "DC Fast Charging", value: "150 kW max" },
            ],
          },
          {
            title: "Hyundai Ioniq 5",
            items: [
              { label: "Battery", value: "77.4 kWh" },
              { label: "Motors", value: "Dual Motor AWD" },
              { label: "Drivetrain", value: "RWD/AWD" },
              { label: "Seating", value: "5 passengers" },
              { label: "Towing", value: "1,650 lbs" },
              { label: "Ultra-Fast Charging", value: "350 kW max" },
            ],
          },
        ],
      },
      {
        type: "prosCons",
        pros: [
          "Zero emissions and lower operating costs",
          "Instant torque and smooth acceleration",
          "Advanced technology and driver assistance features",
          "Quiet, refined driving experience",
          "Federal tax credit eligible (up to $7,500)",
        ],
        cons: [
          "Higher upfront purchase price than gas SUVs",
          "Charging infrastructure still developing in some areas",
          "Range anxiety on long trips",
          "Cold weather can reduce range significantly",
        ],
      },
      {
        type: "gallery",
        images: [
          { url: "/tesla-model-y-exterior.jpg", alt: "2026 Tesla Model Y" },
          { url: "/ford-mach-e-exterior.jpg", alt: "2026 Ford Mustang Mach-E" },
          { url: "/hyundai-ioniq5-exterior.jpg", alt: "2026 Hyundai Ioniq 5" },
          { url: "/tesla-model-y-interior.jpg", alt: "Tesla Model Y Interior" },
          { url: "/ford-mach-e-interior.jpg", alt: "Ford Mach-E Interior" },
          { url: "/hyundai-ioniq5-interior.jpg", alt: "Hyundai Ioniq 5 Interior" },
        ],
      },
      {
        type: "lsi_longform",
        heading: "Understanding Electric SUV Value in Today's Market",
        content_markdown: `## ⚡ The Electric SUV Revolution

The automotive industry is experiencing a **fundamental transformation** as electric SUVs rapidly gain market share. What was once a niche segment dominated by Tesla has evolved into a competitive marketplace with offerings from every major manufacturer. This shift represents more than just a change in propulsion—it's a complete reimagining of what an SUV can be.

Electric SUVs combine the practicality and space families need with zero-emission driving, lower operating costs, and cutting-edge technology. The segment has matured to the point where range anxiety is becoming a thing of the past, with most models now offering **300+ miles** of EPA-estimated range.

## 💰 Total Cost of Ownership: The EV Advantage

While electric SUVs typically command higher purchase prices than their gasoline counterparts, the **total cost of ownership** equation often favors EVs over a typical ownership period. Key factors include:

- Electricity costs vs. gasoline (typically 60-70% lower per mile)
- Minimal maintenance requirements (no oil changes, fewer brake replacements)
- Federal tax credits up to $7,500
- State and local incentives (varies by location)
- Lower insurance costs in some markets

### 🔌 Charging Infrastructure and Convenience

The charging experience varies significantly between manufacturers. **Tesla's Supercharger network** remains the gold standard with over 45,000 chargers globally, offering reliable, fast charging wherever you travel. However, other manufacturers are rapidly catching up through partnerships with networks like Electrify America and EVgo.

**Home charging** represents the most convenient option for daily use. A Level 2 home charger can fully replenish an electric SUV overnight, meaning you start each day with a "full tank." This eliminates the need for regular gas station visits—a significant quality-of-life improvement that EV owners consistently cite as a major benefit.

> 💡 **Pro Tip**: Factor in home charging installation costs ($500-$2,000) when budgeting for an electric SUV. Many utilities offer rebates or special EV charging rates.

## 🔋 Battery Technology and Longevity

Modern electric vehicle batteries are engineered for **longevity and durability**. Most manufacturers warranty their batteries for 8 years or 100,000 miles, with many batteries retaining 80-90% of their capacity even after this period. Key considerations include:

- Battery degradation rates (typically 2-3% per year)
- Thermal management systems that protect battery health
- Software updates that can improve range and performance
- Battery replacement costs (decreasing as technology improves)

The **Hyundai Ioniq 5's 800-volt architecture** represents the cutting edge of battery technology, enabling ultra-fast charging speeds that can add 200 miles of range in just 18 minutes. This technology is gradually becoming more common across the industry.

## 🚀 Performance Characteristics

Electric motors deliver **instant torque** from a standstill, providing acceleration that rivals or exceeds many sports cars. This isn't just about straight-line speed—the low center of gravity created by floor-mounted batteries improves handling and reduces body roll in corners.

**Regenerative braking** systems recover energy during deceleration, extending range while providing a unique one-pedal driving experience. Many drivers find this more intuitive and less fatiguing than traditional braking, especially in stop-and-go traffic.

### 🎯 Technology Integration

Electric SUVs serve as technology showcases, featuring:

- Over-the-air software updates that add features and improve performance
- Advanced driver assistance systems (ADAS) with highway autonomy
- Massive touchscreen interfaces with intuitive controls
- Smartphone integration for remote climate control and charging monitoring
- Vehicle-to-load capability (power external devices from the battery)

The **Tesla Model Y** pioneered many of these features, but competitors have rapidly caught up, often improving on Tesla's implementations with more intuitive interfaces and better build quality.

## 🌍 Environmental Impact and Sustainability

Beyond zero tailpipe emissions, electric SUVs offer **significant environmental benefits** over their lifecycle:

- Lower carbon footprint even when accounting for electricity generation
- Reduced air pollution in urban areas
- Quieter operation reducing noise pollution
- Recyclable battery materials with improving recovery processes

As the electrical grid continues to incorporate more renewable energy sources, the environmental advantage of electric vehicles will only increase. Many EV owners pair their vehicles with home solar installations, achieving truly zero-emission transportation.

## 📊 Resale Value Considerations

Electric vehicle resale values have **stabilized significantly** as the market matures. Tesla vehicles have historically retained value exceptionally well, while other manufacturers are building strong reputations for reliability and desirability in the used market.

Factors affecting EV resale values include:

- Battery health and remaining warranty coverage
- Software update support and feature additions
- Charging network access and compatibility
- Brand reputation for reliability and service
- Market demand for used EVs (rapidly increasing)

The **federal tax credit** only applies to new vehicle purchases, making used EVs more affordable and attractive to budget-conscious buyers. This creates strong demand in the used market, supporting resale values.`,
        word_count: 742,
        keywords_used: [
          "electric SUV",
          "total cost of ownership",
          "charging infrastructure",
          "battery technology",
          "range",
          "performance",
          "environmental impact",
          "resale value",
          "federal tax credit",
          "zero emissions",
        ],
        semantic_clusters: [
          {
            topic: "Financial Considerations",
            related_terms: [
              "total cost of ownership",
              "federal tax credit",
              "electricity costs",
              "maintenance savings",
              "resale value",
            ],
          },
          {
            topic: "Safety and Technology",
            related_terms: [
              "ADAS",
              "driver assistance",
              "adaptive cruise control",
              "collision prevention",
              "infotainment",
            ],
          },
          {
            topic: "Practical Considerations",
            related_terms: [
              "charging infrastructure",
              "home charging",
              "range anxiety",
              "daily convenience",
              "road trips",
            ],
          },
        ],
        style: {
          tone: "expert yet conversational",
          readability: "grade 9-10",
          visual_style: "balanced spacing, clear headings",
        },
      },
      {
        type: "faq",
        items: [
          {
            q: "How long does it take to charge an electric SUV?",
            a: "Charging time varies by vehicle and charger type. At home with a Level 2 charger, expect 8-12 hours for a full charge. DC fast charging can add 200+ miles in 20-30 minutes. The Hyundai Ioniq 5 with 350 kW charging is the fastest, adding 200 miles in just 18 minutes.",
          },
          {
            q: "What is the real-world range of these electric SUVs?",
            a: "Real-world range typically matches EPA estimates in moderate weather. The Tesla Model Y leads with 330 miles, followed by the Ford Mach-E at 312 miles, and Hyundai Ioniq 5 at 303 miles. Cold weather can reduce range by 20-40%.",
          },
          {
            q: "Are electric SUVs eligible for tax credits?",
            a: "Yes, many electric SUVs qualify for the federal tax credit of up to $7,500, though eligibility depends on battery sourcing and final assembly location. Check the IRS website for current eligibility as rules change frequently.",
          },
          {
            q: "Which electric SUV has the best charging network?",
            a: "Tesla's Supercharger network remains the most extensive and reliable, with over 45,000 chargers globally. However, Tesla is opening its network to other brands, and networks like Electrify America are rapidly expanding.",
          },
        ],
      },
      {
        type: "ctaBanner",
        heading: "Ready to Go Electric?",
        sub: "Compare prices and incentives from local dealers",
        href: "#pricing",
        label: "Get EV Quotes",
      },
    ],
    enhancements: {
      tldr: {
        type: "tldr",
        content:
          "The 2026 electric SUV market offers impressive options with 300+ mile ranges, fast charging, and advanced technology. The Tesla Model Y leads in range and cargo space, the Ford Mustang Mach-E offers the best value, while the Hyundai Ioniq 5 features the fastest charging at 350 kW. All three qualify for federal tax credits up to $7,500.",
      },
      keyTakeaways: {
        type: "key_takeaways",
        items: [
          "Tesla Model Y offers the longest range at 330 miles EPA",
          "Hyundai Ioniq 5 features ultra-fast 350 kW charging capability",
          "Ford Mustang Mach-E provides the most affordable entry point",
          "All three models qualify for federal tax credit up to $7,500",
          "Electric SUVs offer 60-70% lower fuel costs compared to gas vehicles",
        ],
      },
      pullQuote: {
        type: "pull_quote",
        quote:
          "Electric SUVs have reached a tipping point where they match or exceed gasoline SUVs in nearly every metric that matters to families—range, space, performance, and total cost of ownership.",
        attribution: "EV Industry Analysis 2026",
      },
      reviews: {
        type: "reviews",
        sources: ["Car and Driver", "Motor Trend", "Edmunds", "Consumer Reports"],
        entries: [
          {
            author: "Car and Driver",
            rating: 4.8,
            summary:
              "The Tesla Model Y continues to set the standard for electric SUVs with its impressive range, spacious interior, and access to the Supercharger network.",
            pros: ["Longest range in class", "Massive cargo space", "Supercharger network access"],
            cons: ["Build quality inconsistencies", "Minimalist interior may not appeal to all"],
          },
          {
            author: "Motor Trend",
            rating: 4.6,
            summary:
              "The Ford Mustang Mach-E impresses with its engaging driving dynamics, attractive styling, and competitive pricing.",
            pros: ["Fun to drive", "Attractive design", "Good value"],
            cons: ["Slower charging than competitors", "Infotainment can be laggy"],
          },
          {
            author: "Edmunds",
            rating: 4.7,
            summary:
              "The Hyundai Ioniq 5 stands out with its ultra-fast charging, unique retro-futuristic design, and impressive technology features.",
            pros: ["350 kW ultra-fast charging", "Unique styling", "Excellent warranty"],
            cons: ["Slightly less range than competitors", "Rear visibility could be better"],
          },
        ],
      },
      quiz: {
        type: "quiz",
        title: "Which Electric SUV is Right for You?",
        questions: [
          {
            prompt: "What's your top priority in an electric SUV?",
            choices: ["Maximum range", "Fastest charging", "Best value", "Cargo space"],
            correctIndex: 0,
            explanation:
              "Range is typically the most important factor for EV buyers. The Tesla Model Y offers the longest range at 330 miles, providing peace of mind for long trips.",
          },
          {
            prompt: "How often do you take road trips longer than 200 miles?",
            choices: ["Frequently", "Occasionally", "Rarely", "Never"],
            correctIndex: 0,
            explanation:
              "If you frequently take long trips, prioritize range and charging network access. Tesla's Supercharger network and the Model Y's 330-mile range make it ideal for road trips.",
          },
          {
            prompt: "Is ultra-fast charging important to you?",
            choices: ["Very important", "Somewhat important", "Not important"],
            correctIndex: 0,
            explanation:
              "The Hyundai Ioniq 5's 350 kW charging capability can add 200 miles in just 18 minutes, making it the fastest-charging option and ideal for those who value minimal charging stops.",
          },
        ],
      },
      dropdown: {
        type: "dropdown",
        title: "Additional EV Resources",
        body: "For more information about electric vehicles, visit PlugShare.com to find charging stations, check your state's EV incentives at DSIRE.org, and use the EPA's fuel economy calculator to estimate your savings. Remember to factor in home charging installation costs when budgeting.",
      },
    },
    seo: {
      title: "Best Electric SUVs 2026: Tesla Model Y vs Ford Mach-E vs Ioniq 5",
      description:
        "Compare the top electric SUVs of 2026 including Tesla Model Y, Ford Mustang Mach-E, and Hyundai Ioniq 5 with detailed range, charging, and pricing analysis.",
      canonical: "https://example.com/articles/best-electric-suvs-2026",
      ogImage: "/electric-suvs-2026.jpg",
    },
    publishedAt: "2026-01-14T10:00:00Z",
    updatedAt: "2026-01-14T10:00:00Z",
  },
  {
    title: "Fuel Economy Champions 2026",
    slug: "fuel-economy-champions-2026",
    description: "The most fuel-efficient vehicles across all categories",
    pillar: {
      slug: "sedans",
      title: "Sedans",
    },
    cluster: {
      slug: "fuel-economy",
      title: "Fuel Economy",
    },
    pageType: "cluster",
    hero: {
      eyebrow: "Fuel Economy Guide",
      title: "Fuel Economy Champions 2026",
      subtitle: "Top fuel-efficient vehicles that save you money at the pump",
      image: {
        url: "/fuel-economy-2026.jpg",
        alt: "Fuel-efficient vehicles 2026",
      },
      badges: ["Updated 2026", "EPA Verified", "Cost Analysis"],
    },
    toc: [{ id: "overview", title: "Overview" }],
    blocks: [
      {
        type: "intro",
        html: "<p>With fuel prices fluctuating, choosing a fuel-efficient vehicle has never been more important. Here are the top performers across all categories.</p>",
      },
    ],
    enhancements: {
      tldr: {
        content:
          "The 2026 fuel economy leaders include hybrids achieving 50+ MPG, efficient sedans hitting 40+ highway MPG, and even SUVs breaking the 30 MPG barrier. Toyota Prius, Honda Accord Hybrid, and Hyundai Elantra lead their segments.",
      },
    },
    seo: {
      canonical: "https://example.com/articles/fuel-economy-champions-2026",
      ogImage: "/fuel-economy-2026.jpg",
    },
    publishedAt: "2026-01-13T10:00:00Z",
    updatedAt: "2026-01-13T10:00:00Z",
  },
  {
    title: "Luxury Sedan Showdown: BMW 5 Series vs Mercedes E-Class vs Audi A6",
    slug: "luxury-sedan-showdown",
    description: "BMW 5 Series vs Mercedes E-Class vs Audi A6 comparison",
    pillar: {
      slug: "sedans",
      title: "Sedans",
    },
    cluster: {
      slug: "luxury-sedans",
      title: "Luxury Sedans",
    },
    pageType: "cluster",
    hero: {
      eyebrow: "Luxury Vehicle Comparison",
      title: "Luxury Sedan Showdown",
      subtitle: "BMW 5 Series vs Mercedes E-Class vs Audi A6 - Which luxury sedan reigns supreme?",
      image: {
        url: "/luxury-sedans.jpg",
        alt: "BMW 5 Series, Mercedes E-Class, and Audi A6",
      },
      badges: ["Updated 2026", "Luxury Guide", "Performance Tested"],
    },
    toc: [{ id: "overview", title: "Overview" }],
    blocks: [
      {
        type: "intro",
        html: "<p>The luxury sedan segment represents the pinnacle of automotive engineering, combining performance, comfort, and cutting-edge technology.</p>",
      },
    ],
    enhancements: {
      tldr: {
        content:
          "The BMW 5 Series, Mercedes E-Class, and Audi A6 represent the best luxury sedans for 2026. The BMW offers the most engaging driving dynamics, the Mercedes provides unmatched comfort and prestige, while the Audi delivers cutting-edge technology and quattro all-wheel drive.",
      },
    },
    seo: {
      canonical: "https://example.com/articles/luxury-sedan-showdown",
      ogImage: "/luxury-sedans.jpg",
    },
    publishedAt: "2026-01-12T10:00:00Z",
    updatedAt: "2026-01-12T10:00:00Z",
  },
  {
    title: "Top Safety Pick Winners 2026",
    slug: "top-safety-picks-2026",
    description: "IIHS Top Safety Pick+ award winners and what makes them safe",
    pillar: {
      slug: "sedans",
      title: "Sedans",
    },
    cluster: {
      slug: "safety-ratings",
      title: "Safety Ratings",
    },
    pageType: "cluster",
    hero: {
      eyebrow: "Safety Ratings",
      title: "Top Safety Pick Winners 2026",
      subtitle: "IIHS Top Safety Pick+ award winners and their safety features",
      image: {
        url: "/safety-picks-2026.jpg",
        alt: "Top Safety Pick winners 2026",
      },
      badges: ["Updated 2026", "IIHS Verified", "Crash Tested"],
    },
    toc: [{ id: "overview", title: "Overview" }],
    blocks: [
      {
        type: "intro",
        html: "<p>The IIHS Top Safety Pick+ award represents the highest level of safety achievement in the automotive industry.</p>",
      },
    ],
    enhancements: {
      tldr: {
        content:
          "The 2026 IIHS Top Safety Pick+ winners include vehicles with advanced crash avoidance systems, superior crash test ratings, and effective headlights. Winners span all segments from compact cars to large SUVs.",
      },
    },
    seo: {
      canonical: "https://example.com/articles/top-safety-picks-2026",
      ogImage: "/safety-picks-2026.jpg",
    },
    publishedAt: "2026-01-11T10:00:00Z",
    updatedAt: "2026-01-11T10:00:00Z",
  },
  {
    title: "Compact SUV Buyer's Guide",
    slug: "compact-suv-buyers-guide",
    description: "Everything you need to know before buying a compact SUV",
    pillar: {
      slug: "suvs",
      title: "SUVs",
    },
    cluster: {
      slug: "compact-suvs",
      title: "Compact SUVs",
    },
    pageType: "cluster",
    hero: {
      eyebrow: "Buyer's Guide",
      title: "Compact SUV Buyer's Guide",
      subtitle: "Complete guide to choosing the perfect compact SUV for your needs",
      image: {
        url: "/compact-suvs.jpg",
        alt: "Compact SUVs comparison",
      },
      badges: ["Updated 2026", "Buyer's Guide", "Expert Tested"],
    },
    toc: [{ id: "overview", title: "Overview" }],
    blocks: [
      {
        type: "intro",
        html: "<p>Compact SUVs offer the perfect balance of space, efficiency, and versatility, making them the most popular vehicle segment.</p>",
      },
    ],
    enhancements: {
      tldr: {
        content:
          "Compact SUVs combine car-like handling with SUV versatility. Top picks include the Honda CR-V, Toyota RAV4, and Mazda CX-5, offering excellent reliability, fuel economy, and features at competitive prices.",
      },
    },
    seo: {
      canonical: "https://example.com/articles/compact-suv-buyers-guide",
      ogImage: "/compact-suvs.jpg",
    },
    publishedAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z",
  },
]

// Initialize storage with all mock articles and pillars
mockArticles.forEach((article) => {
  articlesStore.set(article.slug, article)
})

mockPillars.forEach((pillar) => {
  pillarsStore.set(pillar.slug, pillar)
})

// Storage functions
export function saveArticle(article: ArticleDoc): void {
  articlesStore.set(article.slug, article)
}

const etagCache = new Map<string, { etag: string; data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const MAX_RETRIES = 3
const INITIAL_BACKOFF = 1000 // 1 second

async function fetchWithRetry(url: string, options: RequestInit, retries = 0): Promise<Response> {
  try {
    const response = await fetch(url, options)

    // Handle rate limiting
    if (response.status === 403 || response.status === 429) {
      const backoffTime = INITIAL_BACKOFF * Math.pow(2, retries)

      console.warn(`[storage] Rate limited, backing off for ${backoffTime}ms (attempt ${retries + 1}/${MAX_RETRIES})`)

      if (retries < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, backoffTime))
        return fetchWithRetry(url, options, retries + 1)
      }

      // Return stale data if available
      const cached = etagCache.get(url)
      if (cached) {
        console.warn("[storage] Serving stale data due to rate limit")
        return new Response(JSON.stringify(cached.data), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      }

      throw new Error(`GitHub API rate limit exceeded after ${MAX_RETRIES} retries`)
    }

    return response
  } catch (error) {
    if (retries < MAX_RETRIES) {
      const backoffTime = INITIAL_BACKOFF * Math.pow(2, retries)
      console.warn(`[storage] Fetch error, retrying in ${backoffTime}ms (attempt ${retries + 1}/${MAX_RETRIES})`)
      await new Promise((resolve) => setTimeout(resolve, backoffTime))
      return fetchWithRetry(url, options, retries + 1)
    }

    // Return stale data if available
    const cached = etagCache.get(url)
    if (cached) {
      console.warn("[storage] Serving stale data due to fetch error")
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    throw error
  }
}

export async function getArticle(slug: string): Promise<ArticleDoc | undefined> {
  const cached = articlesStore.get(slug)
  if (cached) {
    return cached
  }
  return await loadArticleFromGitHub(slug)
}

export const getArticleBySlug = getArticle

export function listArticles(): ArticleDoc[] {
  return Array.from(articlesStore.values())
}

export async function getAllArticles(): Promise<ArticleDoc[]> {
  return listArticles()
}

export function deleteArticle(slug: string): boolean {
  return articlesStore.delete(slug)
}

export function savePillar(pillar: PillarPage): void {
  pillarsStore.set(pillar.slug, pillar)
}

export function getPillar(slug: string): PillarPage | undefined {
  return pillarsStore.get(slug)
}

export function listPillars(): PillarPage[] {
  return Array.from(pillarsStore.values())
}

// Function to load articles from GitHub in production
export async function loadArticleFromGitHub(slug: string): Promise<ArticleDoc | undefined> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GITHUB_OWNER = process.env.GITHUB_OWNER || "cg-mmm"
  const GITHUB_REPO = process.env.GITHUB_REPO || "v0-automata-2"
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

  if (!GITHUB_TOKEN) {
    return undefined
  }

  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/articles/${slug}.json?ref=${GITHUB_BRANCH}`

    const cached = etagCache.get(apiUrl)
    const headers: HeadersInit = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    }

    // Add If-None-Match header if we have a cached ETag
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      headers["If-None-Match"] = cached.etag
    }

    const response = await fetchWithRetry(apiUrl, {
      headers,
      next: { revalidate: 60 },
    })

    if (response.status === 304 && cached) {
      console.info("[storage] Using cached article:", slug)
      return cached.data as ArticleDoc
    }

    if (!response.ok) {
      if (response.status === 404) {
        return undefined
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()
    const content = Buffer.from(data.content, "base64").toString("utf-8")
    const article = JSON.parse(content) as ArticleDoc

    const etag = response.headers.get("ETag")
    if (etag) {
      etagCache.set(apiUrl, {
        etag,
        data: article,
        timestamp: Date.now(),
      })
    }

    articlesStore.set(slug, article)

    return article
  } catch (error) {
    console.error("[storage] Error loading article from GitHub:", error)
    return undefined
  }
}

// Legacy aliases for backward compatibility
export const saveDraft = saveArticle
export const getDraft = getArticle
export const readDraft = getArticle
