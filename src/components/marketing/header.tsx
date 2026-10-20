import Image from "next/image"
import Link from "next/link"
import { ContactDialog } from "@/components/marketing/contact-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { siteConfig } from "@/config/site"

export function Header() {
  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={120}
            height={50}
            className="dark:hidden"
            priority
          />
          <Image
            src="/logo-dark.png"
            alt={siteConfig.name}
            width={120}
            height={50}
            className="hidden dark:block"
            priority
          />
        </Link>
        <nav className="flex items-center gap-1">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <ContactDialog />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
