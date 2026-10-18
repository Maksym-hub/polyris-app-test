"use client"

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react"
import type { ReactNode, CSSProperties } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

const NODE_W = 145
const NODE_H = 56
const CY = 95
const SVG_FONT = "ui-sans-serif, system-ui, sans-serif"

type DagNodeDef = {
  id: string
  label: string
  service: string
  badgeClass: string
  badgeWidth: number
  left: number
  top: number
  duration: string
}

const dagNodes: DagNodeDef[] = [
  {
    id: "ingest",
    label: "ingest",
    service: "LAMBDA",
    badgeClass: "fill-orange-500",
    badgeWidth: 44,
    left: 0,
    top: CY - NODE_H / 2,
    duration: "1s",
  },
  {
    id: "clean",
    label: "clean",
    service: "GLUE",
    badgeClass: "fill-violet-600",
    badgeWidth: 30,
    left: 245,
    top: CY - NODE_H / 2,
    duration: "2m 52s",
  },
  {
    id: "aggregate",
    label: "aggregate",
    service: "ATHENA",
    badgeClass: "fill-violet-600",
    badgeWidth: 42,
    left: 490,
    top: CY - NODE_H / 2,
    duration: "55s",
  },
]

const dagArrows: [number, number, number, number][] = [
  [145, CY, 245, CY],
  [390, CY, 490, CY],
]

function DagFlowDiagram() {
  return (
    <svg viewBox="0 0 635 185" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker
          id="dag-arr"
          viewBox="0 0 10 7"
          refX="10"
          refY="3.5"
          markerWidth="10"
          markerHeight="7"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L0,7 L10,3.5 Z" className="fill-green-500" />
        </marker>
      </defs>

      {dagArrows.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className="stroke-green-500"
          strokeWidth="2"
          strokeDasharray="5,4"
          markerEnd="url(#dag-arr)"
        />
      ))}

      {dagNodes.map((node) => (
        <g key={node.id} transform={`translate(${node.left}, ${node.top})`}>
          <rect
            x="0"
            y="0"
            width={NODE_W}
            height={NODE_H}
            rx="10"
            ry="10"
            strokeWidth="2"
            className="fill-green-50 stroke-green-300 dark:fill-green-950 dark:stroke-green-600"
          />
          <circle
            cx="14"
            cy="19"
            r="5.5"
            className="fill-none stroke-green-500"
            strokeWidth="1.5"
          />
          <path
            d="M11.5,19 L13.5,21.5 L17,16.5"
            className="fill-none stroke-green-500"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="26"
            y="23"
            fontFamily={SVG_FONT}
            fontSize="10"
            fontWeight="600"
            className="fill-gray-800 dark:fill-gray-100"
          >
            {node.label}
          </text>
          <rect
            x={NODE_W - 6 - node.badgeWidth}
            y="9"
            width={node.badgeWidth}
            height="14"
            rx="3"
            className={node.badgeClass}
          />
          <text
            x={NODE_W - 6 - node.badgeWidth / 2}
            y="20"
            fontFamily={SVG_FONT}
            fontSize="8"
            fontWeight="700"
            className="fill-white"
            textAnchor="middle"
          >
            {node.service}
          </text>
          <text x="26" y="42" fontFamily={SVG_FONT} fontSize="9" className="fill-gray-400">
            {node.duration}
          </text>
        </g>
      ))}
    </svg>
  )
}

const TABS = ["code", "deploy", "console"] as const
type Tab = (typeof TABS)[number]

const DURATION = 6000

const TAB_LABELS: Record<Tab, string> = {
  code: "Python DSL",
  deploy: "Deploy",
  console: "Console",
}

function TabPanel({
  label,
  heading,
  body,
  link,
  linkLabel,
  visual,
}: {
  label: string
  heading: ReactNode
  body: ReactNode
  link: string
  linkLabel: string
  visual: ReactNode
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="text-brand mb-3 text-xs font-semibold tracking-widest uppercase">{label}</p>
        <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {heading}
        </h2>
        <p className="text-muted-foreground mb-6 text-base sm:text-lg">{body}</p>
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-brand inline-flex items-center text-sm font-medium transition-colors"
        >
          {linkLabel} <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      {visual}
    </div>
  )
}

const FADE_OUT_MS = 140

type AnimPhase = "idle" | "out" | "in-from" | "in-to"

function phaseStyle(phase: AnimPhase): CSSProperties {
  switch (phase) {
    case "out":
      return {
        opacity: 0,
        transform: "scale(0.97)",
        transition: `opacity ${FADE_OUT_MS}ms ease-in, transform ${FADE_OUT_MS}ms ease-in`,
      }
    case "in-from":
      return { opacity: 0, transform: "scale(0.97)", transition: "none" }
    case "in-to":
      return {
        opacity: 1,
        transform: "scale(1)",
        transition: "opacity 260ms ease-out, transform 260ms ease-out",
      }
    default:
      return { opacity: 1, transform: "scale(1)" }
  }
}

export function FeaturesShowcase({ highlighted }: { highlighted: string }) {
  const [active, setActive] = useState<Tab>("code")
  const [displayTab, setDisplayTab] = useState<Tab>("code")
  const [progressKey, setProgressKey] = useState(0)
  const [phase, setPhase] = useState<AnimPhase>("idle")
  const activeRef = useRef<Tab>("code")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  const switchTo = useCallback((next: Tab) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    activeRef.current = next
    setActive(next)
    setProgressKey((k) => k + 1)
    setPhase("out")
    timeoutRef.current = setTimeout(() => {
      setDisplayTab(next)
      setPhase("in-from")
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase("in-to")))
    }, FADE_OUT_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useLayoutEffect(() => {
    const inner = innerRef.current
    const wrapper = wrapperRef.current
    if (!inner || !wrapper) return
    wrapper.style.height = `${inner.scrollHeight}px`
  }, [displayTab])

  useEffect(() => {
    const inner = innerRef.current
    const wrapper = wrapperRef.current
    if (!inner || !wrapper) return
    const ro = new ResizeObserver(() => {
      if (inner && wrapper) wrapper.style.height = `${inner.scrollHeight}px`
    })
    ro.observe(inner)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const next = TABS[(TABS.indexOf(activeRef.current) + 1) % TABS.length]
      switchTo(next)
    }, DURATION)
    return () => clearInterval(timer)
  }, [progressKey, switchTo])

  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="relative mb-12 flex gap-8">
          <div className="bg-border absolute right-0 bottom-0 left-0 h-px" />
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => switchTo(tab)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                active === tab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/70"
              }`}
            >
              {TAB_LABELS[tab]}
              {active === tab && (
                <span
                  key={progressKey}
                  className="bg-foreground absolute bottom-0 left-0 h-px"
                  style={{ animation: `tab-fill ${DURATION}ms linear forwards` }}
                />
              )}
            </button>
          ))}
        </div>

        <div
          ref={wrapperRef}
          className="overflow-hidden transition-[height] duration-300 ease-in-out"
        >
          <div ref={innerRef}>
            {displayTab === "code" && (
              <div style={phaseStyle(phase)}>
                <TabPanel
                  label="Python DSL"
                  heading={
                    <>
                      A pipeline is a Python file.
                      <br />
                      The DAG builds itself.
                    </>
                  }
                  body={
                    <>
                      Annotate functions with task decorators — Lambda, Glue, Athena, Batch, and
                      more. Chain them with{" "}
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                        &gt;&gt;
                      </code>
                      . polyris reads the graph and generates the state machine automatically.
                    </>
                  }
                  link="https://github.com/Polyris/polyris/blob/main/docs/features/DSL.md"
                  linkLabel="Read the DSL docs"
                  visual={
                    <Card className="min-w-0 gap-0 overflow-hidden border py-0">
                      <div className="border-border/40 flex items-center gap-1.5 border-b bg-[#282c34] px-4 py-3">
                        <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                        <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                        <span className="ml-2 font-mono text-xs text-[#abb2bf]">
                          daily-analytics/dag.py
                        </span>
                      </div>
                      <div
                        className="text-[13px] [&>pre]:overflow-hidden [&>pre]:p-4 [&>pre]:leading-[1.45]"
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                      />
                    </Card>
                  }
                />
              </div>
            )}

            {displayTab === "deploy" && (
              <div style={phaseStyle(phase)}>
                <TabPanel
                  label="Deploy"
                  heading={
                    <>
                      One command.
                      <br />
                      Pipeline live in seconds.
                    </>
                  }
                  body={
                    <>
                      Run{" "}
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                        polyris-deploy
                      </code>{" "}
                      and it reads your DAG, generates a CloudFormation template, and deploys the
                      Step Functions state machine. No ASL, no JSON, no manual stack management.
                    </>
                  }
                  link="https://github.com/Polyris/polyris/blob/main/docs/features/DSL.md#task-types"
                  linkLabel="See supported task types"
                  visual={
                    <Card className="gap-0 overflow-hidden border py-0">
                      <div className="border-border/40 flex items-center gap-1.5 border-b bg-[#282c34] px-4 py-3">
                        <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                        <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                        <span className="ml-2 font-mono text-xs text-[#abb2bf]">terminal</span>
                      </div>
                      <div className="bg-[#282c34] p-4 font-mono text-xs leading-relaxed text-[#abb2bf]">
                        <div>
                          <span className="text-brand">$</span> cd pipelines/daily-analytics
                        </div>
                        <div className="mt-1">
                          <span className="text-brand">$</span> polyris-deploy --stage prod
                        </div>
                        <div className="mt-3 border-t border-white/10 pt-3 opacity-60">
                          ── Deploy target ─────────────────────────────────────────────
                        </div>
                        <div className="opacity-80">{"   dag:            "}daily-analytics</div>
                        <div className="opacity-80">{"   stage:          "}prod</div>
                        <div className="mt-3 opacity-70">
                          Reading SAM stack outputs from &apos;acme-prod&apos;...
                        </div>
                        <div className="opacity-70">
                          Generating CloudFormation template for: daily-analytics
                        </div>
                        <div className="opacity-70">
                          Deploying stack: acme-prod-polyris-daily-analytics
                        </div>
                        <div className="mt-2 text-green-400">
                          {"  CREATE_COMPLETE          "}AWS::StepFunctions::StateMachine
                        </div>
                        <div className="text-green-400">
                          {"  CREATE_COMPLETE          "}AWS::Scheduler::Schedule
                        </div>
                        <div className="mt-2 text-green-400">
                          ✅ Pipeline deployed successfully!
                        </div>
                      </div>
                    </Card>
                  }
                />
              </div>
            )}

            {displayTab === "console" && (
              <div style={phaseStyle(phase)}>
                <TabPanel
                  label="Console"
                  heading={<>See it run.</>}
                  body="The polyris console shows every pipeline as a live DAG — tasks, statuses, and run history in one view."
                  link="https://github.com/Polyris/polyris"
                  linkLabel="View on GitHub"
                  visual={
                    <Card className="gap-0 overflow-hidden border py-0">
                      <div className="border-border/40 bg-muted/30 flex items-center justify-between border-b px-4 py-3">
                        <span className="text-foreground text-sm font-medium">daily-analytics</span>
                        <span className="flex items-center gap-1.5 font-mono text-xs text-green-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          RUNNING
                        </span>
                      </div>
                      <div className="border-border/40 border-b p-2 sm:p-3">
                        <DagFlowDiagram />
                      </div>
                      <div className="divide-border/40 divide-y">
                        {[
                          {
                            id: "f4-84db-59735cfd4c0c",
                            status: "SUCCESS",
                            date: "10/18 · 10:05 AM · Scheduled",
                          },
                          {
                            id: "71-9ea5-d64bfd38ffd6",
                            status: "FAILED",
                            date: "10/17 · 09:05 AM · Scheduled",
                          },
                          {
                            id: "cfc961c7-2026-10-18b",
                            status: "ABORTED",
                            date: "10/17 · 08:05 AM · Manual",
                          },
                        ].map((run, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-[54px_1fr_220px] items-center gap-x-2 px-4 py-2"
                          >
                            <span
                              className={`rounded px-1.5 py-0.5 text-center font-mono text-[9px] font-semibold ${
                                run.status === "SUCCESS"
                                  ? "bg-green-500/10 text-green-500"
                                  : run.status === "FAILED"
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-orange-500/10 text-orange-400"
                              }`}
                            >
                              {run.status}
                            </span>
                            <span className="text-foreground truncate font-mono text-[10px]">
                              {run.id}…
                            </span>
                            <span className="text-muted-foreground font-mono text-[10px] whitespace-nowrap">
                              {run.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
