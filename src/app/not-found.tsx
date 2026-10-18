import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold">Page not found</h2>
      <Button variant="outline" render={<Link href="/" />}>
        Go home
      </Button>
    </main>
  )
}
