import type { Metadata } from "next"
import localFont from "next/font/local"
import { Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { siteConfig } from "@/config/site"
import "./globals.css"

const fixelText = localFont({
  src: [
    { path: "../../public/fonts/FixelText-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/FixelText-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/FixelText-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-fixel-text",
})

const fixelDisplay = localFont({
  src: [
    { path: "../../public/fonts/FixelDisplay-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/FixelDisplay-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/FixelDisplay-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-fixel-display",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Polyris — Data pipeline orchestration for AWS",
    template: `%s | Polyris`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Polyris — Data pipeline orchestration for AWS",
    description: siteConfig.description,
    siteName: "Polyris",
  },
  twitter: {
    card: "summary_large_image",
    title: "Polyris — Data pipeline orchestration for AWS",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fixelText.variable} ${fixelDisplay.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
