export const siteConfig = {
  name: "polyris",
  description:
    "Data pipelines that pause for you instead of failing on you. Serverless orchestration on AWS Step Functions.",
  url: "https://polyris.dev",
  github: "https://github.com/Polyris/polyris",
  docs: "https://github.com/Polyris/polyris/tree/main/docs",
  quickstart: "https://github.com/Polyris/polyris/blob/main/docs/getting-started/QUICKSTART.md",
  install:
    "curl -fsSL https://github.com/Polyris/polyris/releases/latest/download/install.sh | bash",
  nav: [
    { label: "Docs", href: "https://github.com/Polyris/polyris/tree/main/docs" },
    { label: "GitHub", href: "https://github.com/Polyris/polyris" },
  ],
} as const
