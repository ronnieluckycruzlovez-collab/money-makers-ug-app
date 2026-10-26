"use client"

import { ArrowDownLeft, ArrowUpRight, Info } from "lucide-react"
import { useDemoStore } from "@/components/demo-store"
import { formatUGX } from "@/lib/rules"
import { Card, SectionTitle } from "@/components/ui-bits"

export function ActivityList({ limit = 5 }: { limit?: number }) {
  const { myActivity } = useDemoStore()
  const items = myActivity.slice(0, limit)
  return (
    <section aria-labelledby="activity-title">
      <SectionTitle>
        <span id="activity-title">Recent activity</span>
      </SectionTitle>
      <Card className="p-0">
        {items.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((a) => {
              const Icon = a.direction === "in" ? ArrowDownLeft : a.direction === "out" ? ArrowUpRight : Info
              return (
                <li key={a.id} className="flex items-center gap-3 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card-elevated text-accent">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.detail} · {a.date}
                    </p>
                  </div>
                  {a.amount ? (
                    <span className={`text-sm font-semibold tabular-nums ${a.direction === "in" ? "text-primary" : "text-foreground"}`}>
                      {formatUGX(a.amount)}
                    </span>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </section>
  )
}
