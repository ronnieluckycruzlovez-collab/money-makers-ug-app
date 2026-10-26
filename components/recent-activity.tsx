import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { formatUGX, recentActivity } from "@/lib/data"

export function RecentActivity() {
  return (
    <section aria-labelledby="activity-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="activity-heading" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Activity
        </h2>
        <button type="button" className="text-sm font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {recentActivity.map((item) => {
          const incoming = item.direction === "in"
          const Icon = incoming ? ArrowDownLeft : ArrowUpRight
          return (
            <li key={item.id} className="flex items-center gap-3 p-3.5">
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                  incoming ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.description}</p>
              </div>
              <div className="text-right">
                <p className={`font-mono text-sm font-semibold ${incoming ? "text-primary" : "text-destructive"}`}>
                  <span className="sr-only">{incoming ? "Received" : "Paid out"} </span>
                  {incoming ? "+" : "−"}
                  {formatUGX(item.amount)}
                </p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
