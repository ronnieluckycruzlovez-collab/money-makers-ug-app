"use client"

import Link from "next/link"
import { CalendarDays, CalendarClock, HandCoins, ListChecks, PartyPopper, Users, X } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { ActivityList } from "@/components/activity-list"
import { ProfileCard } from "@/components/profile-card"
import { useDemoStore } from "@/components/demo-store"
import { CURRENT_WEEK } from "@/lib/demo-seed"
import { WEEKLY_CONTRIBUTION, formatUGX } from "@/lib/rules"
import { ActionGrid, Card, SectionTitle, Stat, StatusBadge } from "@/components/ui-bits"

export default function MemberDashboard() {
  const { me, memberSummary, weekStatus, justJoined, dismissWelcome, payouts } = useDemoStore()
  const summary = memberSummary(me.id)
  const thisWeek = weekStatus(me.id, CURRENT_WEEK.id)
  const myPayout = payouts.find((p) => p.recipientId === me.id && p.status !== "paid")

  return (
    <AppShell>
      <div className="space-y-5">
        {justJoined && (
          <div role="status" className="relative rounded-2xl border border-primary/50 bg-primary/15 p-4 pr-12">
            <PartyPopper className="mb-2 size-6 text-accent" aria-hidden="true" />
            <p className="font-semibold">Welcome to MONEY MAKERS, {me.name.split(" ")[0]}!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your member ID is <span className="font-mono text-accent">{me.memberId}</span>. Pay {formatUGX(WEEKLY_CONTRIBUTION)} every
              week, Monday to Friday.
            </p>
            <button type="button" onClick={dismissWelcome} aria-label="Close welcome message" className="absolute right-3 top-3 p-1">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        )}

        <ProfileCard member={me} />

        <Card className="border-accent/40 bg-gradient-to-br from-[#14301f] to-card">
          <p className="text-sm text-muted-foreground">My confirmed savings</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-accent">{formatUGX(summary.savings)}</p>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-background/50 p-3">
            <div>
              <p className="text-xs text-muted-foreground">This week · {CURRENT_WEEK.label}</p>
              <p className="text-sm font-semibold">Pay by {me.paymentDay}</p>
            </div>
            <StatusBadge status={thisWeek} />
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Confirmed payments" value={String(summary.confirmedCount)} tone="success" />
          <Stat label="Awaiting confirmation" value={String(summary.pendingCount)} />
          <Stat label="Outstanding dues" value={formatUGX(summary.outstanding)} tone={summary.outstanding ? "gold" : "default"} />
          <Stat label="Penalties" value={formatUGX(summary.penalties)} tone={summary.penalties ? "danger" : "default"} />
        </div>

        {myPayout && (
          <Link href="/payouts" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <CalendarClock className="size-6 text-accent" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Your payout: {myPayout.month}</p>
              <p className="text-xs text-muted-foreground">
                {formatUGX(myPayout.amount)} · {myPayout.date}
              </p>
            </div>
            <StatusBadge status={myPayout.status === "confirmed" ? "confirmed" : "scheduled"} />
          </Link>
        )}

        <section aria-labelledby="actions-title">
          <SectionTitle>
            <span id="actions-title">Quick actions</span>
          </SectionTitle>
          <ActionGrid
            items={[
              { href: "/contribute", label: "Make Contribution", hint: "Submit a payment", icon: HandCoins },
              { href: "/contributions", label: "My Contributions", hint: "Status & history", icon: ListChecks },
              { href: "/schedule", label: "Weekly Schedule", hint: "Your payment day", icon: CalendarDays },
              { href: "/payouts", label: "Payout Schedule", hint: "Monthly rotation", icon: CalendarClock },
              { href: "/members", label: "Group Members", hint: "Who is in the group", icon: Users },
            ]}
          />
        </section>

        <ActivityList />
      </div>
    </AppShell>
  )
}
