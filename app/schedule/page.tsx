"use client"

import { CalendarDays } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { useDemoStore } from "@/components/demo-store"
import { CURRENT_WEEK } from "@/lib/demo-seed"
import { PAYMENT_DAYS, PENALTY_RULE_TEXT } from "@/lib/rules"
import { Card, SectionTitle, StatusBadge } from "@/components/ui-bits"
import { cn } from "@/lib/utils"

export default function SchedulePage() {
  const { me, members, isStaff, weekStatus } = useDemoStore()
  const active = members.filter((m) => m.status === "active")

  return (
    <AppShell title="Weekly Schedule" back={isStaff ? "/admin" : "/member"}>
      <div className="space-y-5">
        <Card className="border-accent/40">
          <div className="flex items-center gap-3">
            <CalendarDays className="size-8 text-accent" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">Your assigned payment day</p>
              <p className="text-xl font-bold">{me.paymentDay}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{PENALTY_RULE_TEXT}</p>
        </Card>

        <section>
          <SectionTitle>This week · {CURRENT_WEEK.label}</SectionTitle>
          <div className="space-y-3">
            {PAYMENT_DAYS.map((day) => {
              const people = active.filter((m) => m.paymentDay === day)
              const isMine = me.paymentDay === day
              return (
                <Card key={day} className={cn("p-3", isMine && "border-accent/60")}>
                  <p className={cn("mb-2 text-sm font-semibold", isMine && "text-accent")}>
                    {day} {isMine && "· your day"}
                  </p>
                  {people.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No members assigned</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {people.map((m) => (
                        <li key={m.id} className="flex items-center justify-between gap-2 text-sm">
                          <span>
                            {m.name} <span className="font-mono text-xs text-muted-foreground">{m.memberId}</span>
                          </span>
                          {(isStaff || m.id === me.id) && <StatusBadge status={weekStatus(m.id, CURRENT_WEEK.id)} />}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              )
            })}
          </div>
          {!isStaff && <p className="mt-3 text-xs text-muted-foreground">For privacy, you only see your own payment status.</p>}
        </section>
      </div>
    </AppShell>
  )
}
