import { Header } from "@/components/marketing/header"
import { Hero } from "@/components/marketing/hero"
import { Features } from "@/components/marketing/features"
import { Footer } from "@/components/marketing/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  )
}
