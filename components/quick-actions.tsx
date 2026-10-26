import { CalendarClock, ChevronRight, HandCoins, ReceiptText, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Action = {
  label: string
  description: string
  icon: LucideIcon
  featured?: boolean
}

const actions: Action[] = [
  { label: "Make Contribution", description: "Pay via Mobile Money", icon: HandCoins, featured: true },
  { label: "My Contributions", description: "History & statements", icon: ReceiptText },
  { label: "Payout Schedule", description: "Rotation calendar", icon: CalendarClock },
  { label: "Group Members", description: "24 active members", icon: Users },
]

export function QuickActions() {
  const [featured, ...rest] = actions

  return (
    <section aria-labelledby="quick-actions-heading">
      <h2 id="quick-actions-heading" className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Quick Actions
      </h2>

      <button
        type="button"
        className="group flex w-full items-center gap-4 rounded-2xl bg-accent p-4 text-left text-accent-foreground transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-foreground/10">
          <featured.icon className="size-6" aria-hidden="true" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold">{featured.label}</span>
          <span className="block text-sm opacity-75">{featured.description}</span>
        </span>
        <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </button>

      <ul className="mt-3 grid grid-cols-3 gap-3">
        {rest.map(({ label, description, icon: Icon }) => (
          <li key={label}>
            <button
              type="button"
              className="flex h-full w-full flex-col items-start gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-card-elevated active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-medium leading-tight text-foreground">{label}</span>
                <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">{description}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
