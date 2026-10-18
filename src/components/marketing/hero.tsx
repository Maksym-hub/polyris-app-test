import Link from "next/link"
import { ArrowRight, ExternalLink, Zap, Cloud, GitBranch } from "lucide-react"
import { codeToHtml } from "shiki"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { siteConfig } from "@/config/site"

const code = `from polyris import DAG, task

with DAG("orders-etl", schedule="@daily") as dag:

    @task.glue_job(job_name="extract-orders")
    def extract(): ...

    @task.sfn(arn="arn:aws:...transform", retries=2)
    def transform(): ...

    @task.lambda_function(function_name="load-orders")
    def load(): ...

    extract() >> transform() >> load()`

const stats = [
  { icon: Zap, label: "Serverless" },
  { icon: Cloud, label: "AWS Step Functions" },
  { icon: GitBranch, label: "Python 3.11+" },
]

export async function Hero() {
  const highlighted = await codeToHtml(code, {
    lang: "python",
    theme: "one-dark-pro",
  })

  return (
    <section className="relative overflow-hidden">
      <div
        className="dot-grid pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <Badge
              variant="secondary"
              className="border-brand/25 bg-brand/10 text-brand w-fit rounded-full border px-3 py-1 text-xs font-medium"
            >
              Open source · Apache 2.0
            </Badge>

            <h1 className="text-foreground text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Data pipelines that pause for you instead of failing on you.
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl">
              Serverless orchestration on AWS Step Functions. When a task fails, polyris waits for a
              human decision instead of nuking the run.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {stats.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="text-muted-foreground flex items-center gap-1.5 text-sm"
                >
                  <Icon className="text-brand h-4 w-4" />
                  {label}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                render={<Link href={siteConfig.docs} target="_blank" rel="noopener noreferrer" />}
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={<Link href={siteConfig.github} target="_blank" rel="noopener noreferrer" />}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </div>

            <div className="bg-muted/50 border-border w-full rounded-lg border px-4 py-3">
              <p className="text-muted-foreground mb-1.5 text-xs">Quick install</p>
              <code className="text-foreground/90 font-mono text-sm break-all">
                curl -fsSL https://github.com/Polyris/polyris/releases/latest/download/install.sh |
                bash
              </code>
            </div>
          </div>

          {/* Right column — code */}
          <Card className="min-w-0 overflow-hidden border">
            <div className="border-border/40 flex items-center gap-1.5 border-b bg-[#282c34] px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-xs text-[#abb2bf]">dag.py</span>
            </div>
            <div
              className="overflow-x-auto text-sm [&>pre]:overflow-x-auto [&>pre]:p-4 [&>pre]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </Card>
        </div>
      </div>
    </section>
  )
}
