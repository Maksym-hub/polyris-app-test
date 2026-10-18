import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/config/site"

export function Footer() {
  return (
    <footer className="border-border/40 mt-auto border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Separator className="mb-8" />
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            <span className="text-foreground font-medium">{siteConfig.name}</span> ·{" "}
            <Link
              href="https://github.com/Polyris/polyris/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Apache 2.0
            </Link>
          </p>
          <div className="flex items-center gap-4">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
            Powered by
          </span>
          <Link
            href="https://quintagroup.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-bold tracking-tight transition-opacity hover:opacity-75"
          >
            <span className="text-foreground">Quinta</span>
            <span className="text-orange-600">Group</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
