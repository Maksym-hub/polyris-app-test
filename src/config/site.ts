export const siteConfig = {
  name: "Polyris",
  description:
    "Open-source data pipeline orchestration for AWS teams. Define workflows in Python, run them on Step Functions in your own account, and monitor runs in one console.",
  url: "https://polyris.dev",
  github: "https://github.com/Polyris/polyris",
  docs: "https://github.com/Polyris/polyris/tree/main/docs",
  quickstart: "https://github.com/Polyris/polyris/blob/main/docs/getting-started/QUICKSTART.md",
  tryItNow: "https://github.com/Polyris/polyris#try-it-now",
  install:
    "curl -fsSL https://github.com/Polyris/polyris/releases/latest/download/install.sh | bash",
  nav: [
    { label: "Docs", href: "https://github.com/Polyris/polyris/tree/main/docs" },
    { label: "GitHub", href: "https://github.com/Polyris/polyris" },
  ],
} as const
