"use client"

import Link from "next/link"
import { CalendarClock, CalendarDays, MailPlus, ReceiptText, Users, Bell, ChevronRight } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { ActivityList } from "@/components/activity-list"
import { ProfileCard } from "@/components/profile-card"
import { useDemoStore } from "@/components/demo-store"
import { formatUGX } from "@/lib/rules"
import { ActionGrid, Card, SectionTitle, Stat } from "@/components/ui-bits"

export default function AdminDashboard() {
  const { me, groupSummary, invites, isAdmin } = useDemoStore()
  const pendingInvites = invites.filter((i) => i.status === "pending").length

  return (
    <AppShell staffOnly>
      <div className="space-y-5">
        <ProfileCard member={me} />

        <Card className="border-accent/40 bg-gradient-to-br from-[#14301f] to-card">
          <p className="text-sm text-muted-foreground">Total group savings (confirmed)</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-accent">{formatUGX(groupSummary.savings)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{groupSummary.activeMembers} active members</p>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Confirmed contributions" value={String(groupSummary.confirmedCount)} tone="success" />
          <Stat label="Awaiting confirmation" value={String(groupSummary.awaitingCount)} tone={groupSummary.awaitingCount ? "gold" : "default"} />
          <Stat label="Outstanding dues" value={formatUGX(groupSummary.outstanding)} tone="gold" />
          <Stat label="Penalties" value={formatUGX(groupSummary.penalties)} tone="danger" />
        </div>

        {groupSummary.awaitingCount > 0 && (
          <Link href="/admin/confirm" className="flex items-center gap-3 rounded-2xl bg-accent p-4 text-accent-foreground">
            <ReceiptText className="size-6" aria-hidden="true" />
            <span className="flex-1">
              <span className="block font-semibold">{groupSummary.awaitingCount} payment(s) to confirm</span>
              <span className="block text-sm opacity-80">Check each reference before confirming</span>
            </span>
            <ChevronRight className="size-5" aria-hidden="true" />
          </Link>
        )}

        <section aria-labelledby="admin-actions">
          <SectionTitle>
            <span id="admin-actions">Manage group</span>
          </SectionTitle>
          <ActionGrid
            items={[
              { href: "/admin/confirm", label: "Confirm Payments", hint: "Review references", icon: ReceiptText, badge: groupSummary.awaitingCount },
              ...(isAdmin
                ? [{ href: "/admin/invites", label: "Invitations", hint: `${pendingInvites} pending`, icon: MailPlus, badge: pendingInvites }]
                : []),
              { href: "/payouts", label: "Payout Schedule", hint: isAdmin ? "Confirm monthly payouts" : "Monthly rotation", icon: CalendarClock },
              { href: "/schedule", label: "Weekly Schedule", hint: "Assigned payment days", icon: CalendarDays },
              { href: "/members", label: "Group Members", hint: "Contacts & status", icon: Users },
              { href: "/notifications", label: "Notifications", hint: "Group alerts", icon: Bell },
            ]}
          />
        </section>

        <ActivityList limit={6} />
      </div>
    </AppShell>
  )
}
