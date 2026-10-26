"use client"

import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { useDemoStore } from "@/components/demo-store"
import { WEEKS } from "@/lib/demo-seed"
import { MISSED_PAYMENT_PENALTY, WEEKLY_CONTRIBUTION, formatUGX } from "@/lib/rules"
import { Card, Stat, StatusBadge } from "@/components/ui-bits"
import { cn } from "@/lib/utils"

export default function ContributionsPage() {
  const { me, contributions, weekStatus, memberSummary, isStaff } = useDemoStore()
  const summary = memberSummary(me.id)
  const weeks = [...WEEKS].reverse()

  return (
    <AppShell title="My Contributions" back={isStaff ? "/admin" : "/member"}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Confirmed savings" value={formatUGX(summary.savings)} tone="gold" />
          <Stat label="Penalties" value={formatUGX(summary.penalties)} tone={summary.penalties ? "danger" : "default"} />
        </div>

        <ul className="space-y-3">
          {weeks.map((w) => {
            const status = weekStatus(me.id, w.id)
            const record = contributions
              .filter((c) => c.memberId === me.id && c.weekId === w.id)
              .sort((a, b) => (a.status === "confirmed" ? -1 : b.status === "confirmed" ? 1 : 0))[0]
            const confirmed = status === "confirmed"
            return (
              <li key={w.id}>
                <div
                  className={cn(
                    "rounded-2xl border p-4",
                    confirmed ? "border-transparent bg-success-soft text-success-soft-foreground" : "border-border bg-card",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{w.label}</p>
                    <StatusBadge status={status} />
                  </div>
                  <div className={cn("mt-1 flex justify-between text-sm", confirmed ? "opacity-80" : "text-muted-foreground")}>
                    <span>{record ? `${record.method} · ${record.reference}` : "No payment received"}</span>
                    <span className="font-semibold tabular-nums">
                      {status === "missed" ? `+${formatUGX(MISSED_PAYMENT_PENALTY)} penalty` : formatUGX(WEEKLY_CONTRIBUTION)}
                    </span>
                  </div>
                  {status === "rejected" && record?.note && <p className="mt-1 text-xs text-destructive">Reason: {record.note}</p>}
                </div>
              </li>
            )
          })}
        </ul>

        {summary.outstanding > 0 && (
          <Card className="flex items-center justify-between gap-3">
            <p className="text-sm">
              Outstanding: <strong className="text-accent">{formatUGX(summary.outstanding)}</strong>
            </p>
            <Link href="/contribute" className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
              Pay now
            </Link>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
