"use client"

import { useState, useEffect, useRef } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { Zap, ArrowDown, ChevronRight, CheckCircle2, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

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
  "Lambda / Glue / Athena execution time",
  "DynamoDB reads and writes",
]

const doesNotPayFor = [
  "Always-on scheduler process",
  "Metadata database",
  "Idle worker processes",
  "Minimum reserved capacity",
]

export function Features() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ServerlessVisual />
          <div>
            <p className="text-brand mb-3 text-xs font-semibold tracking-widest uppercase">
              Serverless
            </p>
            <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Event-driven from day one.
              <br />
              No always-on anything.
            </h2>
            <p className="text-muted-foreground mb-6 text-base sm:text-lg">
              EventBridge triggers your Step Functions DAG on schedule. Tasks run on Lambda, Glue,
              or Athena — on demand, not continuously. No scheduler process, no metadata DB, no idle
              fleet sitting between runs.
            </p>
            <Link
              href="https://github.com/Polyris/polyris/blob/main/docs/architecture/ARCHITECTURE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-brand inline-flex items-center text-sm font-medium transition-colors"
            >
              How it works <ChevronRight className="ml-1 h-4 w-4" />
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
            Traditional orchestrators keep a scheduler, workers, and a metadata DB running around
            the clock. polyris has none of that — Step Functions charges per state transition.
            Between runs, the cost is zero.
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

        <div className="mt-8 text-center">
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
