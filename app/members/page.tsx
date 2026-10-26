"use client"

import Link from "next/link"
import { MailPlus } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { useDemoStore } from "@/components/demo-store"
import { CURRENT_WEEK } from "@/lib/demo-seed"
import { ROLE_LABEL } from "@/lib/rules"
import { Avatar, Card, StatusBadge } from "@/components/ui-bits"

export default function MembersPage() {
  const { members, me, isStaff, isAdmin, weekStatus } = useDemoStore()

  return (
    <AppShell title="Group Members" back={isStaff ? "/admin" : "/member"}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{members.filter((m) => m.status === "active").length} active members</p>
          {isAdmin && (
            <Link href="/admin/invites" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-foreground">
              <MailPlus className="size-4" aria-hidden="true" />
              Invite
            </Link>
          )}
        </div>

        <Card className="p-0">
          <ul className="divide-y divide-border">
            {members.map((m) => {
              const canSeePrivate = isStaff || m.id === me.id
              return (
                <li key={m.id} className="flex items-center gap-3 p-4">
                  <Avatar name={m.name} src={m.avatar} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {m.name} {m.id === me.id && <span className="text-xs text-accent">(you)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono">{m.memberId}</span> · {ROLE_LABEL[m.role]} · {m.paymentDay}
                    </p>
                    {canSeePrivate && <p className="font-mono text-xs text-muted-foreground">{m.phone ?? "No phone"}</p>}
                  </div>
                  {canSeePrivate && m.status === "active" ? (
                    <StatusBadge status={weekStatus(m.id, CURRENT_WEEK.id)} />
                  ) : (
                    <StatusBadge status={m.status} />
                  )}
                </li>
              )
            })}
          </ul>
        </Card>
        {!isStaff && (
          <p className="text-xs text-muted-foreground">
            For privacy, phone numbers and payment status of other members are only visible to administrators and cashiers.
          </p>
        )}
      </div>
    </AppShell>
  )
}
