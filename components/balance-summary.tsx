"use client"

import { useState } from "react"
import { CalendarClock, Eye, EyeOff, Landmark } from "lucide-react"
import { balance, formatUGX } from "@/lib/data"

const HIDDEN = "UGX ••••••"

export function BalanceSummary() {
  const [visible, setVisible] = useState(true)
  const show = (amount: number) => (visible ? formatUGX(amount) : HIDDEN)
  const progress = Math.min(100, Math.round((balance.thisMonth / balance.monthlyTarget) * 100))

  return (
    <section
      aria-labelledby="balance-heading"
      className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-[#14513a] via-[#0f3a2a] to-[#0c2a1f] p-5"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-accent/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between">
        <h2 id="balance-heading" className="text-sm font-medium text-muted-foreground">
          My Total Savings
        </h2>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={!visible}
          aria-label={visible ? "Hide balances" : "Show balances"}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
        >
          {visible ? <Eye className="size-4" aria-hidden="true" /> : <EyeOff className="size-4" aria-hidden="true" />}
        </button>
      </div>

      <p className="relative mt-1 font-mono text-3xl font-semibold tracking-tight text-foreground" aria-live="polite">
        {show(balance.totalSavings)}
      </p>

      <div className="relative mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">This month</span>
          <span className="font-mono text-foreground">
            {show(balance.thisMonth)}{" "}
            <span className="text-muted-foreground">/ {visible ? balance.monthlyTarget.toLocaleString("en-US") : "••••"}</span>
          </span>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/30"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Monthly contribution target progress"
        >
          <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <dl className="relative mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-black/20 p-3">
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Landmark className="size-3.5" aria-hidden="true" />
            Group Fund
          </dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-foreground">{show(balance.groupFund)}</dd>
        </div>
        <div className="rounded-2xl bg-black/20 p-3">
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            Next Payout
          </dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-accent">{balance.nextPayout.date}</dd>
        </div>
      </dl>
    </section>
  )
}
