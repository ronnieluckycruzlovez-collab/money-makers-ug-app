"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, Info } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { useDemoStore } from "@/components/demo-store"
import { WEEKS, type Contribution } from "@/lib/demo-seed"
import { MISSED_PAYMENT_PENALTY, WEEKLY_CONTRIBUTION, formatUGX } from "@/lib/rules"
import { Button, Card, StatusBadge, inputClass } from "@/components/ui-bits"
import { cn } from "@/lib/utils"

const METHODS: Contribution["method"][] = ["MTN Mobile Money", "Airtel Money", "Cash"]

export default function ContributePage() {
  const { me, weekStatus, submitContribution, isStaff } = useDemoStore()
  const payable = WEEKS.filter((w) => ["due", "missed", "rejected"].includes(weekStatus(me.id, w.id)))
  const [selected, setSelected] = useState<string[]>(() => payable.slice(-1).map((w) => w.id))
  const [method, setMethod] = useState<Contribution["method"]>("MTN Mobile Money")
  const [reference, setReference] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const total = selected.length * WEEKLY_CONTRIBUTION

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = submitContribution({ weekIds: selected, method, reference })
    if (!res.ok) return setError(res.error)
    setError(null)
    setDone(true)
  }

  if (done) {
    return (
      <AppShell title="Make Contribution" back={isStaff ? "/admin" : "/member"}>
        <Card className="space-y-3 text-center">
          <CheckCircle2 className="mx-auto size-12 text-accent" aria-hidden="true" />
          <h2 className="text-lg font-bold">Payment submitted</h2>
          <p className="text-sm text-muted-foreground">
            Your reference has been sent to the cashier. Your payment shows as <strong className="text-warning">Awaiting confirmation</strong> until
            an administrator or cashier checks it. You cannot confirm your own payment.
          </p>
          <Link href="/contributions" className="block rounded-xl bg-primary py-3 font-semibold text-primary-foreground">
            View my contributions
          </Link>
        </Card>
      </AppShell>
    )
  }

  return (
    <AppShell title="Make Contribution" back={isStaff ? "/admin" : "/member"}>
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Card className="flex gap-3 border-accent/30 bg-accent/5 text-sm">
          <Info className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          <p className="text-muted-foreground">
            1. Pay {formatUGX(WEEKLY_CONTRIBUTION)} per week to the group cashier. 2. Enter the transaction reference from your payment message
            below. 3. The cashier confirms it.
          </p>
        </Card>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Which week(s) are you paying for?</legend>
          {payable.length === 0 ? (
            <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              You have no unpaid weeks. Thank you!
            </p>
          ) : (
            <ul className="space-y-2">
              {payable.map((w) => {
                const status = weekStatus(me.id, w.id)
                const checked = selected.includes(w.id)
                return (
                  <li key={w.id}>
                    <label
                      className={cn(
                        "flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border bg-card px-4",
                        checked ? "border-accent" : "border-border",
                      )}
                    >
                      <input type="checkbox" checked={checked} onChange={() => toggle(w.id)} className="size-5 accent-[#d4a937]" />
                      <span className="flex-1 text-sm font-medium">{w.label}</span>
                      <StatusBadge status={status} />
                    </label>
                  </li>
                )
              })}
            </ul>
          )}
          {payable.some((w) => weekStatus(me.id, w.id) === "missed") && (
            <p className="mt-2 text-xs text-muted-foreground">
              Missed weeks also carry a {formatUGX(MISSED_PAYMENT_PENALTY)} penalty each, settled with the cashier.
            </p>
          )}
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">How did you pay?</legend>
          <div className="grid grid-cols-3 gap-2">
            {METHODS.map((m) => (
              <label
                key={m}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center justify-center rounded-xl border px-2 text-center text-xs font-semibold",
                  method === m ? "border-accent bg-accent/10 text-accent" : "border-border bg-card",
                )}
              >
                <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} className="sr-only" />
                {m}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="reference" className="mb-2 block text-sm font-semibold">
            Transaction reference
          </label>
          <input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder={method === "Cash" ? "Receipt number from cashier" : "e.g. MP261026ABC1"}
            autoComplete="off"
            autoCapitalize="characters"
            maxLength={30}
            className={cn(inputClass, "font-mono uppercase")}
            aria-describedby={error ? "contribute-error" : undefined}
          />
        </div>

        {error && (
          <p id="contribute-error" role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" variant="gold" className="w-full text-base" disabled={selected.length === 0}>
          Submit {formatUGX(total)} for confirmation
        </Button>
      </form>
    </AppShell>
  )
}
