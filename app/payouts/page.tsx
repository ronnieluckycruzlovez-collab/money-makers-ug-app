"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { useDemoStore } from "@/components/demo-store"
import { formatUGX } from "@/lib/rules"
import { Button, Card, SectionTitle, StatusBadge } from "@/components/ui-bits"
import { cn } from "@/lib/utils"

export default function PayoutsPage() {
  const { payouts, memberById, isAdmin, isStaff, me, confirmPayout } = useDemoStore()
  const [message, setMessage] = useState<string | null>(null)
  const upcoming = payouts.filter((p) => p.status !== "paid")
  const history = payouts.filter((p) => p.status === "paid")

  return (
    <AppShell title="Payout Schedule" back={isStaff ? "/admin" : "/member"}>
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Each month one member receives the group payout. {isAdmin ? "Confirm each month once the date and amount are agreed." : "The administrator confirms each month."}
        </p>

        {message && (
          <p role="status" className="rounded-xl bg-success-soft p-3 text-sm font-medium text-success-soft-foreground">
            {message}
          </p>
        )}

        <section>
          <SectionTitle>Upcoming payouts</SectionTitle>
          <ul className="space-y-3">
            {upcoming.map((p) => {
              const r = memberById(p.recipientId)
              const mine = p.recipientId === me.id
              return (
                <li key={p.id}>
                  <Card className={cn(p.status === "confirmed" && "border-transparent bg-success-soft text-success-soft-foreground", mine && p.status !== "confirmed" && "border-accent/60")}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{p.month}</p>
                        <p className={cn("text-sm", p.status === "confirmed" ? "opacity-80" : "text-muted-foreground")}>
                          {r?.name ?? "Member"} {mine && "(you)"} · {p.date}
                        </p>
                      </div>
                      <StatusBadge status={p.status === "confirmed" ? "confirmed" : "scheduled"} />
                    </div>
                    <p className="mt-2 text-lg font-bold tabular-nums">{formatUGX(p.amount)}</p>
                    {isAdmin && p.status === "scheduled" && (
                      <Button
                        variant="gold"
                        className="mt-3 w-full"
                        onClick={() => {
                          const res = confirmPayout(p.id)
                          setMessage(res.ok ? `${p.month} payout confirmed (demo).` : res.error)
                        }}
                      >
                        Confirm {p.month} payout
                      </Button>
                    )}
                  </Card>
                </li>
              )
            })}
          </ul>
        </section>

        <section>
          <SectionTitle>Payout history</SectionTitle>
          <Card className="p-0">
            <ul className="divide-y divide-border">
              {history.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 p-4">
                  <div>
                    <p className="text-sm font-medium">{p.month}</p>
                    <p className="text-xs text-muted-foreground">
                      {memberById(p.recipientId)?.name} · {p.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">{formatUGX(p.amount)}</p>
                    <StatusBadge status="paid" />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </AppShell>
  )
}
