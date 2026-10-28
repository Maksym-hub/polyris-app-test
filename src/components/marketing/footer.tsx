import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site"

const footerLinks = {
  Product: [
    { label: "Quickstart", href: siteConfig.quickstart },
    { label: "Docs", href: siteConfig.docs },
    { label: "GitHub", href: siteConfig.github },
  ],
  Legal: [
    {
      label: "Apache 2.0",
      href: "https://github.com/Polyris/polyris/blob/main/LICENSE",
    },
  ],
}

export function Footer() {
  return (
    <footer className="border-border/40 mt-auto border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/logo-icon.png" alt="" width={26} height={26} className="rounded-[7px]" />
              <span className="text-foreground font-semibold">{siteConfig.name}</span>
            </Link>
            <p className="text-muted-foreground mt-3 max-w-xs text-sm">
              Open-source data pipeline orchestration for AWS teams, developed with ❤️{" "}
              <Link
                href="https://quintagroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center align-middle transition-opacity hover:opacity-75"
              >
                <Image
                  src="/quinta-group.png"
                  alt="QuintaGroup"
                  width={63}
                  height={18}
                  className="dark:invert"
                />
              </Link>
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
                {group}
              </p>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border/40 mt-10 border-t pt-6">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Quintagroup. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
