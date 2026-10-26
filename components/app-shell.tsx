"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft, Bell, Home, ReceiptText, Settings, CalendarClock, Users } from "lucide-react"
import { BrandMark } from "@/components/brand"
import { useDemoStore } from "@/components/demo-store"
import { ROLE_LABEL } from "@/lib/rules"
import { cn } from "@/lib/utils"

export function AppShell({
  title,
  back,
  staffOnly,
  adminOnly,
  children,
}: {
  title?: string
  back?: string
  staffOnly?: boolean
  adminOnly?: boolean
  children: React.ReactNode
}) {
  const { unreadCount, isStaff, isAdmin } = useDemoStore()
  const blocked = (staffOnly && !isStaff) || (adminOnly && !isAdmin)

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 items-center gap-3 px-4">
          {back ? (
            <Link href={back} aria-label="Go back" className="-ml-2 flex size-10 items-center justify-center rounded-full hover:bg-card">
              <ArrowLeft className="size-5" aria-hidden="true" />
            </Link>
          ) : (
            <BrandMark size={32} />
          )}
          <div className="min-w-0 flex-1 leading-tight">
            {title ? (
              <h1 className="truncate text-base font-semibold">{title}</h1>
            ) : (
              <>
                <h1 className="text-base font-extrabold tracking-wide text-accent">MONEY MAKERS</h1>
                <p className="text-xs text-muted-foreground">Group Savings &amp; Management</p>
              </>
            )}
          </div>
          <Link
            href="/notifications"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            className="relative flex size-10 items-center justify-center rounded-full border border-border bg-card"
          >
            <Bell className="size-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
        <DemoBanner />
      </header>

      <main className="flex-1 px-4 pb-28 pt-4">
        {blocked ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="font-semibold">This page is for {adminOnly ? "administrators" : "administrators and cashiers"} only.</p>
            <p className="mt-1 text-sm text-muted-foreground">Your account does not have permission to open it.</p>
          </div>
        ) : (
          children
        )}
      </main>

      <BottomNav />
    </div>
  )
}

function DemoBanner() {
  const { me, members, switchUser } = useDemoStore()
  const router = useRouter()
  const testers = members.filter((m) => ["u1", "u2", "u8"].includes(m.id) || m.id === me.id)
  return (
    <div className="flex items-center gap-2 border-t border-accent/30 bg-accent/10 px-4 py-1.5 text-xs">
      <span className="rounded bg-accent px-1.5 py-0.5 font-bold text-accent-foreground">DEMO</span>
      <span className="text-accent">Test data · not saved</span>
      <label htmlFor="demo-user" className="sr-only">
        View the app as
      </label>
      <select
        id="demo-user"
        value={me.id}
        onChange={(e) => {
          const next = members.find((m) => m.id === e.target.value)
          switchUser(e.target.value)
          router.push(next && next.role !== "member" ? "/admin" : "/member")
        }}
        className="ml-auto min-h-8 rounded-md border border-accent/40 bg-background px-2 text-xs text-foreground"
      >
        {testers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name.split(" ")[0]} · {ROLE_LABEL[m.role]}
          </option>
        ))}
      </select>
    </div>
  )
}

function BottomNav() {
  const pathname = usePathname()
  const { isStaff } = useDemoStore()
  const home = isStaff ? "/admin" : "/member"
  const items = [
    { href: home, label: "Home", icon: Home },
    isStaff
      ? { href: "/admin/confirm", label: "Confirm", icon: ReceiptText }
      : { href: "/contributions", label: "Payments", icon: ReceiptText },
    { href: "/payouts", label: "Payouts", icon: CalendarClock },
    { href: "/members", label: "Members", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ]
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md border-t border-border bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={label}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                  active ? "text-accent" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
