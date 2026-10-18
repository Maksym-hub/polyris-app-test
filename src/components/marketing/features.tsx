import Link from "next/link"
import { AlertTriangle, HelpCircle, ArrowRight, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { siteConfig } from "@/config/site"

function TaskNode({
  name,
  type,
  typeClass,
  status,
}: {
  name: string
  type: string
  typeClass: string
  status: "success" | "waiting" | "pending"
}) {
  return (
    <div
      className={`flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-xs ${
        status === "waiting"
          ? "border-yellow-500/40 bg-yellow-500/5 ring-1 ring-yellow-500/20"
          : status === "success"
            ? "border-border bg-card"
            : "border-border/50 bg-muted/30 opacity-40"
      }`}
    >
      <div
        className={`h-2 w-2 shrink-0 rounded-full ${
          status === "success"
            ? "bg-green-500"
            : status === "waiting"
              ? "bg-yellow-500"
              : "bg-muted-foreground/30"
        }`}
      />
      <span
        className={`font-medium ${status === "pending" ? "text-muted-foreground" : "text-foreground"}`}
      >
        {name}
      </span>
      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${typeClass}`}>{type}</span>
    </div>
  )
}

const decisionActions = [
  {
    label: "Skip Task",
    sub: "Mark as complete, trigger dependents",
    cls: "border-border bg-card/50 text-foreground",
  },
  {
    label: "Mark Failed",
    sub: "Fail this task and pipeline",
    cls: "border-destructive/20 bg-destructive/5 text-destructive",
  },
  {
    label: "Mark Successful",
    sub: "Force complete if work done",
    cls: "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400",
  },
]

function PipelineVisual() {
  return (
    <Card className="overflow-hidden border">
      <div className="border-border/40 bg-muted/30 flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-foreground text-sm font-medium">orders-etl</span>
          <span className="text-muted-foreground text-xs">· daily @ 05:00</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-500">
          <AlertTriangle className="h-3 w-3" />
          Needs Decision
        </span>
      </div>

      <div className="border-border/40 bg-background/50 flex items-center gap-2 overflow-x-auto border-b px-4 py-4">
        <TaskNode
          name="ingest"
          type="LAMBDA"
          typeClass="bg-blue-500/15 text-blue-400"
          status="success"
        />
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-green-500" />
        <TaskNode
          name="clean"
          type="GLUE"
          typeClass="bg-teal-500/15 text-teal-400"
          status="waiting"
        />
        <span className="text-muted-foreground/30 shrink-0 font-mono">···</span>
        <TaskNode
          name="aggregate"
          type="ATHENA"
          typeClass="bg-purple-500/15 text-purple-400"
          status="pending"
        />
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-yellow-500" />
          <span className="text-foreground text-sm font-semibold">clean</span>
          <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-500">
            waiting_decision
          </span>
        </div>

        <div className="mb-3 flex items-start gap-2.5 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2.5">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-500" />
          <div>
            <p className="text-foreground text-xs font-semibold">Decision required</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              This task is waiting for a manual decision. Go to Actions to proceed.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          {decisionActions.map(({ label, sub, cls }) => (
            <div key={label} className={`flex flex-col rounded-md border px-3 py-2 ${cls}`}>
              <span className="text-xs font-medium">{label}</span>
              <span className="text-muted-foreground text-[10px]">{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function DeployVisual() {
  return (
    <Card className="overflow-hidden border">
      <div className="border-border/40 flex items-center gap-1.5 border-b bg-[#282c34] px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-[#abb2bf]">terminal</span>
      </div>
      <div className="bg-[#282c34] p-4 font-mono text-xs leading-relaxed text-[#abb2bf]">
        <div>
          <span className="text-brand">$</span> cd pipelines/orders-etl
        </div>
        <div className="mt-1">
          <span className="text-brand">$</span> polyris-deploy --stage prod
        </div>
        <div className="mt-3 border-t border-white/10 pt-3 opacity-60">
          ── Deploy target ─────────────────────────────────────────────
        </div>
        <div className="opacity-80">{"   dag:            "}orders-etl</div>
        <div className="opacity-80">{"   stage:          "}prod</div>
        <div className="opacity-80">
          {"   sam stack:      "}acme-prod{"    ← reads CFN outputs"}
        </div>
        <div className="opacity-80">{"   region:         "}us-east-1</div>
        <div className="mt-0.5 opacity-60">
          ─────────────────────────────────────────────────────────────
        </div>
        <div className="mt-3 opacity-70">
          Reading SAM stack outputs from &apos;acme-prod&apos;...
        </div>
        <div className="opacity-70">Generating CloudFormation template for: orders-etl</div>
        <div className="opacity-70">Deploying stack: acme-prod-polyris-orders-etl</div>
        <div className="mt-2 text-green-400">
          {"  CREATE_COMPLETE          "}AWS::StepFunctions::StateMachine
        </div>
        <div className="text-green-400">
          {"  CREATE_COMPLETE          "}AWS::Scheduler::Schedule
        </div>
        <div className="mt-2 text-green-400">✅ Pipeline deployed successfully!</div>
        <div className="text-green-400">
          {"   SFN ARN: "}arn:aws:states:us-east-1:123:stateMachine:acme-prod-polyris-orders-etl
        </div>
      </div>
    </Card>
  )
}

const costItems = [
  { label: "Step Functions transitions", cost: "$2.50" },
  { label: "Lambda invocations", cost: "$0.40" },
  { label: "Glue job (10 min/day)", cost: "$4.80" },
  { label: "DynamoDB storage", cost: "$0.30" },
]

function CostVisual() {
  return (
    <Card className="overflow-hidden border">
      <div className="p-6">
        <div className="mb-6">
          <span className="text-foreground text-5xl font-bold tracking-tight">~$8</span>
          <p className="text-muted-foreground mt-1 text-sm">
            per month · 1,000 daily runs · 10 tasks each
          </p>
        </div>
        <div className="space-y-3">
          {costItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">{item.label}</span>
              <span className="text-foreground font-mono text-sm">{item.cost}</span>
            </div>
          ))}
          <div className="border-border flex items-center justify-between border-t pt-3">
            <span className="text-foreground text-sm font-medium">Total</span>
            <span className="text-foreground font-mono text-sm font-semibold">$8.00 / mo</span>
          </div>
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          Compare: Amazon MWAA starts at ~$350/month minimum.
        </p>
      </div>
    </Card>
  )
}

export function Features() {
  return (
    <>
      <section className="border-border/40 border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
                Failure handling
              </p>
              <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                When a task fails,
                <br />
                polyris waits.
              </h2>
              <p className="text-muted-foreground mb-6 text-base sm:text-lg">
                Instead of nuking the run, polyris pauses the Step Function and surfaces the error.
                Retry, skip, or abort — from Slack, email, or the console. Successful upstream tasks
                never re-run.
              </p>
              <Link
                href={siteConfig.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-brand inline-flex items-center text-sm font-medium transition-colors"
              >
                Read the docs <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <PipelineVisual />
          </div>
        </div>
      </section>

      <section className="border-border/40 border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="lg:order-last">
              <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
                Deployment
              </p>
              <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Define in Python.
                <br />
                Deploy in one command.
              </h2>
              <p className="text-muted-foreground mb-6 text-base sm:text-lg">
                Decorate functions with task types, connect them with{" "}
                <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                  &gt;&gt;
                </code>
                , then run{" "}
                <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                  polyris-deploy
                </code>
                . Your pipeline compiles to a Step Functions state machine in seconds.
              </p>
              <Link
                href={siteConfig.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-brand inline-flex items-center text-sm font-medium transition-colors"
              >
                See all task types <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <DeployVisual />
          </div>
        </div>
      </section>

      <section className="border-border/40 border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
                Cost
              </p>
              <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                ~$8/month for
                <br />
                real orchestration.
              </h2>
              <p className="text-muted-foreground mb-6 text-base sm:text-lg">
                No always-on scheduler, no Postgres metadata DB, no idle EC2 fleet. Step Functions
                charges per state transition. You pay only for what actually runs.
              </p>
              <Link
                href={siteConfig.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-brand inline-flex items-center text-sm font-medium transition-colors"
              >
                How pricing works <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <CostVisual />
          </div>
        </div>
      </section>
    </>
  )
}
