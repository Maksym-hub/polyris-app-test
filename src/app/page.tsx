"use cache"
import { codeToHtml } from "shiki"
import { heroCode } from "@/lib/dag-code"
import { Header } from "@/components/marketing/header"
import { Hero } from "@/components/marketing/hero"
import { Features, CostSection, GetStartedSection } from "@/components/marketing/features"
import { FeaturesShowcase } from "@/components/marketing/features-showcase"
import { Footer } from "@/components/marketing/footer"

export default async function Home() {
  const highlighted = await codeToHtml(heroCode, { lang: "python", theme: "one-dark-pro" })

  return (
    <>
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
