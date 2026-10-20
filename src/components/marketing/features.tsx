"use client"

import { useState, useEffect, useRef } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import {
  Zap,
  ArrowDown,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { siteConfig } from "@/config/site"

const ANIM_STEPS = 5
const STEP_MS = 1400

function DiagramNode({
  label,
  sub,
  accent,
  isActive,
  children,
}: {
  label: string
  sub?: string
  accent?: string
  isActive?: boolean
  children?: ReactNode
}) {
  return (
    <div
      className={`rounded-sm border px-3 py-2 transition-colors duration-500 ${
        isActive ? "border-brand/50 bg-brand/5" : "border-border bg-card"
      } ${accent ? `border-l-2 ${accent}` : ""}`}
    >
      <p className="text-foreground font-mono text-xs font-semibold">{label}</p>
      {sub && <p className="text-muted-foreground mt-0.5 font-mono text-[10px]">{sub}</p>}
      {children}
    </div>
  )
}

function DiagramArrow({ isActive }: { isActive?: boolean }) {
  return (
    <div className="flex justify-center py-0.5">
      <ArrowDown
        className={`h-4 w-4 transition-colors duration-500 ${isActive ? "text-brand animate-bounce" : "text-muted-foreground/50"}`}
      />
    </div>
  )
}

function ServerlessVisual() {
  const [step, setStep] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => setStep((s) => (s + 1) % ANIM_STEPS), STEP_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <Card className="gap-0 overflow-hidden border py-0">
      <div className="border-border/40 bg-muted/30 border-b px-4 py-3">
        <span className="text-foreground text-sm font-medium">How a pipeline runs</span>
      </div>

      <div className="p-5">
        <DiagramNode
          label="EventBridge Schedule"
          sub="cron trigger  →  fires on schedule, no always-on process"
          accent="border-l-yellow-500/70"
          isActive={step === 0}
        >
          <div className="mt-1.5 flex items-center gap-1">
            <Zap className="h-3 w-3 text-yellow-500" />
            <span className="text-muted-foreground font-mono text-[10px]">aws:scheduler</span>
          </div>
        </DiagramNode>

        <DiagramArrow isActive={step === 1} />

        <DiagramNode
          label="Pipeline Step Function"
          sub="runs tasks in DAG order  ·  checks trigger rules  ·  manages tokens"
          accent="border-l-brand"
          isActive={step === 1}
        />

        <DiagramArrow isActive={step === 2} />

        <DiagramNode label="run_task helper SFN  (one per task)" isActive={step === 2}>
          <p className="text-muted-foreground mt-1 font-mono text-[10px]">dispatches to →</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {[
              { l: "Lambda", c: "text-blue-400" },
              { l: "Glue", c: "text-teal-400" },
              { l: "Athena", c: "text-purple-400" },
              { l: "ECS", c: "text-orange-400" },
              { l: "Batch", c: "text-pink-400" },
              { l: "EMR", c: "text-yellow-500" },
            ].map(({ l, c }) => (
              <span key={l} className={`font-mono text-[10px] font-semibold ${c}`}>
                {l}
              </span>
            ))}
          </div>
        </DiagramNode>

        <div className="my-1 flex justify-center gap-12 py-0.5">
          <ArrowDown
            className={`h-4 w-4 transition-colors duration-500 ${step === 3 ? "animate-bounce text-green-500" : "text-green-500/60"}`}
          />
          <ArrowDown
            className={`h-4 w-4 transition-colors duration-500 ${step === 4 ? "animate-bounce text-yellow-500" : "text-yellow-500/60"}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div
            className={`rounded-sm border border-l-2 px-3 py-2 transition-colors duration-500 ${
              step === 3
                ? "border-border border-l-green-500 bg-green-500/15"
                : "border-border border-l-green-500/60 bg-green-500/5"
            }`}
          >
            <p className="text-foreground font-mono text-[10px] font-semibold">ON SUCCESS</p>
            <p className="text-muted-foreground mt-0.5 font-mono text-[10px]">
              notify deps → next task
            </p>
          </div>
          <div
            className={`rounded-sm border border-l-2 px-3 py-2 transition-colors duration-500 ${
              step === 4
                ? "border-border border-l-yellow-500 bg-yellow-500/15"
                : "border-border border-l-yellow-500/60 bg-yellow-500/5"
            }`}
          >
            <p className="text-foreground font-mono text-[10px] font-semibold">ON FAILURE</p>
            <p className="text-muted-foreground mt-0.5 font-mono text-[10px]">
              pause · wait for decision
            </p>
          </div>
        </div>

        <p className="text-muted-foreground/60 mt-4 font-mono text-[10px]">
          # scales to zero between runs — no idle processes
        </p>
      </div>
    </Card>
  )
}

const paysFor = [
  "Step Functions state transitions",
  "AWS task execution and service usage",
  "DynamoDB reads, writes, and storage",
]

const doesNotPayFor = [
  "Always-on orchestration scheduler processes",
  "Idle orchestration workers",
  "Provisioned metadata database servers",
  "Reserved orchestration compute capacity",
]

export function Features() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ServerlessVisual />
          <div>
            <p className="text-brand mb-3 text-xs font-semibold tracking-widest uppercase">
              Why Polyris
            </p>
            <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Less infrastructure to maintain.
            </h2>
            <p className="text-muted-foreground mb-6 text-base sm:text-lg">
              AWS handles execution. Polyris gives your team the Python workflow, scheduling, and
              tools to operate it—without an orchestration server to run.
            </p>
            <div className="mb-6 space-y-4">
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">Bring your AWS jobs together.</strong>{" "}
                Coordinate Lambda, Glue, Athena, ECS, Batch, EMR, and nested Step Functions with
                Python dependencies and trigger rules.
              </p>
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">Validate before you deploy.</strong> Check your
                workflow and preview the generated Step Functions definition locally, before
                deploying to AWS.
              </p>
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">Keep execution visible.</strong> Your workflows
                run as Step Functions in your AWS account, with execution history you can inspect
                and a console to manage your pipelines.
              </p>
            </div>
            <Link
              href="https://github.com/Polyris/polyris/blob/main/docs/architecture/ARCHITECTURE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-brand inline-flex items-center text-sm font-medium transition-colors"
            >
              Architecture <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CostSection() {
  return (
    <section className="border-border/40 bg-muted/30 border-t">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-brand mb-3 text-xs font-semibold tracking-widest uppercase">Cost</p>
          <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Pay for runs, not for uptime.
          </h2>
          <p className="text-muted-foreground mb-12 text-base sm:text-lg">
            Traditional orchestrators keep a scheduler, workers, and a database server running
            around the clock. Polyris coordinates workflows on demand with Step Functions, so you
            don&apos;t reserve orchestration compute for the hours between runs. Put your budget
            into processing data and give your team fewer servers to maintain.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-widest uppercase">
              You pay for
            </p>
            <ul className="space-y-3">
              {paysFor.map((item) => (
                <li key={item} className="text-foreground flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-widest uppercase">
              You don&apos;t pay for
            </p>
            <ul className="space-y-3">
              {doesNotPayFor.map((item) => (
                <li key={item} className="text-muted-foreground flex items-start gap-2.5 text-sm">
                  <XCircle className="text-muted-foreground/40 mt-0.5 h-4 w-4 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <p className="text-muted-foreground/60 mt-6 text-center text-xs">
          Storage, logs, console usage, and other AWS service charges still apply. Your total cost
          depends on your workloads and configuration.
        </p>

        <div className="mt-6 text-center">
          <Link
            href="https://github.com/Polyris/polyris/blob/main/docs/architecture/ARCHITECTURE.md#cost-model"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-brand inline-flex items-center text-sm font-medium transition-colors"
          >
            See full cost breakdown <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function GetStartedSection() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Start with a Python file.
          </h2>
          <p className="text-muted-foreground mb-8 text-base sm:text-lg">
            Explore the DSL, validate a pipeline, and preview its execution graph locally. When you
            are ready, deploy Polyris to your AWS account and connect your jobs.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              render={<Link href={siteConfig.tryItNow} target="_blank" rel="noopener noreferrer" />}
            >
              Try locally
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              render={
                <Link href={siteConfig.quickstart} target="_blank" rel="noopener noreferrer" />
              }
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Deploy to AWS
            </Button>
          </div>
          <p className="text-muted-foreground mt-4 text-sm">
            Local exploration needs Python 3.11+, with no AWS account required. Allow about 30–45
            minutes for first-time AWS setup.
          </p>
        </div>
      </div>
    </section>
  )
}
