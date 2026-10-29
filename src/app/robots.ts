import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

const TRAINING_CRAWLERS = [
  "GPTBot", // OpenAI
  "anthropic-ai", // Anthropic
  "Google-Extended", // Google AI (separate from Googlebot search)
  "CCBot", // Common Crawl — used by many open-source models
  "cohere-ai", // Cohere
  "Applebot-Extended", // Apple AI
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...TRAINING_CRAWLERS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
