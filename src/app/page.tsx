import { codeToHtml } from "shiki"
import { heroCode } from "@/lib/dag-code"
import { siteConfig } from "@/config/site"
import { Header } from "@/components/marketing/header"
import { Hero } from "@/components/marketing/hero"
import { Features, CostSection, GetStartedSection } from "@/components/marketing/features"
import { FeaturesShowcase } from "@/components/marketing/features-showcase"
import { Footer } from "@/components/marketing/footer"

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: "Polyris",
      description: siteConfig.description,
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: "Quintagroup",
      url: "https://quintagroup.com",
      sameAs: ["https://github.com/Polyris"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.url}/#software`,
      name: "Polyris",
      description: siteConfig.description,
      applicationCategory: "DeveloperApplication",
      url: siteConfig.url,
      downloadUrl: "https://github.com/Polyris/polyris/releases",
      license: "https://github.com/Polyris/polyris/blob/main/LICENSE",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
  ],
}

export default async function Home() {
  const highlighted = await codeToHtml(heroCode, { lang: "python", theme: "one-dark-pro" })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <FeaturesShowcase highlighted={highlighted} />
        <CostSection />
        <GetStartedSection />
      </main>
      <Footer />
    </>
  )
}
