"use client"

import { useState, useEffect, useRef, type ElementType } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ExternalLink,
  Zap,
  Cloud,
  GitBranch,
  FileCode2,
  Rocket,
  Network,
  Sparkles,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

const stats = [
  { icon: Zap, label: "No idle compute" },
  { icon: Cloud, label: "AWS Step Functions" },
  { icon: GitBranch, label: "Python 3.11+" },
]

type StepStatus = "done" | "active" | "pending"

function StepItem({
  icon: Icon,
  label,
  status,
}: {
  icon: ElementType<{ className?: string }>
  label: string
  status: StepStatus
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {status === "done" && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 ring-2 ring-green-500">
          <Icon className="h-6 w-6 text-green-400" />
        </div>
      )}
      {status === "active" && (
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border-2 border-[#3e4451] border-t-[#60a5fa]"
            style={{ animation: "spin 1.4s linear infinite" }}
          />
          <Icon className="h-6 w-6 text-[#60a5fa]" />
        </div>
      )}
      {status === "pending" && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#3e4451]">
          <Icon className="h-6 w-6 text-[#4b5263]" />
        </div>
      )}
      <span
        className={`text-xs ${
          status === "done"
            ? "text-green-400"
            : status === "active"
              ? "text-[#abb2bf]"
              : "text-[#4b5263]"
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function Connector({ done }: { done?: boolean }) {
  return (
    <div
      className={`mt-7 h-px flex-1 transition-colors duration-500 ${done ? "bg-green-500/40" : "bg-white/10"}`}
    />
  )
}

function Spinner() {
  return (
    <span
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-[#60a5fa] border-t-transparent"
      style={{ animation: "spin 0.8s linear infinite" }}
    />
  )
}

type Stage = "deploying" | "executing" | "complete"
const STAGES: Stage[] = ["deploying", "executing", "complete"]
const STAGE_MS: Record<Stage, number> = { deploying: 3200, executing: 3500, complete: 2500 }

function PipelineFlow() {
  const [stage, setStage] = useState<Stage>("deploying")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setStage((s) => STAGES[(STAGES.indexOf(s) + 1) % STAGES.length])
    }, STAGE_MS[stage])
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [stage])

  const deployDone = stage !== "deploying"
  const executeDone = stage === "complete"

  return (
    <div className="rounded-xl border border-[#3e4451] bg-[#282c34] shadow-2xl">
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-start">
          <StepItem icon={FileCode2} label="Write DAG" status="done" />
          <Connector done />
          <StepItem icon={Rocket} label="Deploy" status={deployDone ? "done" : "active"} />
          <Connector done={deployDone} />
          <StepItem
            icon={Network}
            label="Execute"
            status={executeDone ? "done" : stage === "executing" ? "active" : "pending"}
          />
          <Connector done={executeDone} />
          <StepItem icon={Sparkles} label="Complete" status={executeDone ? "done" : "pending"} />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-1.5 font-mono text-xs text-[#5c6370]">terminal</span>
        </div>
        <div className="min-h-[88px] px-5 py-4 font-mono text-xs leading-relaxed text-[#abb2bf]">
          <div>
            <span className="text-[#60a5fa]">$</span> polyris-deploy --stage prod
          </div>

          {stage === "deploying" && (
            <>
              <div className="mt-1 text-green-400">
                <Check className="mr-1 inline h-3 w-3" />
                Generating CloudFormation template
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <Spinner />
                Deploying stack acme-prod-polyris-daily-analytics
              </div>
            </>
          )}

          {stage === "executing" && (
            <>
              <div className="mt-1 text-green-400">
                <Check className="mr-1 inline h-3 w-3" />
                Deployed in 11s
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <Spinner />
                ingest (Lambda) · running
              </div>
            </>
          )}

          {stage === "complete" && (
            <>
              <div className="mt-1 text-green-400">
                <Check className="mr-1 inline h-3 w-3" />
                Deployed in 11s
              </div>
              <div className="text-green-400">
                <Check className="mr-1 inline h-3 w-3" />
                ingest · 1s &nbsp;·&nbsp; clean · 2m 52s &nbsp;·&nbsp; aggregate · 55s
              </div>
              <div className="mt-0.5 font-medium text-green-400">
                <Check className="mr-1 inline h-3 w-3" />
                Pipeline completed · 3m 48s
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="dot-grid pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <p className="text-muted-foreground text-sm font-medium">
              Open source ·{" "}
              <Link
                href="https://github.com/Polyris/polyris/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Apache 2.0
              </Link>
            </p>

            <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Define pipelines in Python. <span className="text-brand">AWS Step Functions</span>{" "}
              does the rest.
            </h1>

            <p className="text-muted-foreground text-lg">
              Write familiar Python, deploy to AWS Step Functions in one command. No always-on
              scheduler, no Postgres DB, no idle workers.
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
                render={
                  <Link href={siteConfig.quickstart} target="_blank" rel="noopener noreferrer" />
                }
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
          </div>

          <div className="hidden lg:block">
            <PipelineFlow />
          </div>
        </div>
      </div>
    </section>
  )
}
