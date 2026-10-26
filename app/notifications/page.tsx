"use client"

import { BellRing } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { useDemoStore } from "@/components/demo-store"
import { Button, Card } from "@/components/ui-bits"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const { myNotifications, me, markAllRead, unreadCount, isStaff } = useDemoStore()

  return (
    <AppShell title="Notifications" back={isStaff ? "/admin" : "/member"}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
          <Button variant="outline" className="min-h-10" onClick={markAllRead} disabled={unreadCount === 0}>
            Mark all as read
          </Button>
        </div>
        <ul className="space-y-2">
          {myNotifications.map((n) => {
            const unread = !n.readBy.includes(me.id)
            return (
              <li key={n.id}>
                <Card className={cn("flex gap-3", unread && "border-accent/50")}>
                  <BellRing className={cn("mt-0.5 size-5 shrink-0", unread ? "text-accent" : "text-muted-foreground")} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {n.title}
                        {unread && <span className="sr-only"> (unread)</span>}
                      </p>
                      <span className="shrink-0 text-xs text-muted-foreground">{n.date}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
        <p className="text-xs text-muted-foreground">
          These are in-app notifications. SMS alerts are not connected yet (see Settings for cost details).
        </p>
      </div>
    </AppShell>
  )
}
