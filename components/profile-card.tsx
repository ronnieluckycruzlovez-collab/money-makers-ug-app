"use client"

import { Phone, ShieldCheck } from "lucide-react"
import type { Member } from "@/lib/demo-seed"
import { ROLE_LABEL } from "@/lib/rules"
import { Avatar, Card, StatusBadge } from "@/components/ui-bits"

export function ProfileCard({ member }: { member: Member }) {
  return (
    <Card className="flex items-center gap-4 bg-gradient-to-br from-card-elevated to-card">
      <Avatar name={member.name} src={member.avatar} size={68} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-lg font-bold">{member.name}</h2>
          <StatusBadge status={member.status} />
        </div>
        <dl className="mt-1.5 space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Member ID</dt>
            <dd className="font-mono font-semibold tracking-wide text-accent">{member.memberId}</dd>
            <dt className="sr-only">Role</dt>
            <dd className="inline-flex items-center gap-1">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              {ROLE_LABEL[member.role]}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>
              <Phone className="size-3.5" aria-hidden="true" />
              <span className="sr-only">Phone number</span>
            </dt>
            <dd className="font-mono text-xs">{member.phone ?? "No phone"}</dd>
          </div>
        </dl>
      </div>
    </Card>
  )
}
