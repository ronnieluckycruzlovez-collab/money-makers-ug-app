import Image from "next/image"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WeekStatus } from "@/components/demo-store"

export function Avatar({ name, src, size = 56, className }: { name: string; src: string | null; size?: number; className?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  if (src) {
    return (
      <Image
        src={src}
        alt={`Profile photo of ${name}`}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover ring-2 ring-accent", className)}
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      role="img"
      aria-label={`${name} initials`}
      className={cn("flex shrink-0 items-center justify-center rounded-full bg-card-elevated font-semibold text-accent ring-2 ring-accent/60", className)}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  )
}

const STATUS_STYLE: Record<WeekStatus | "pending" | "accepted" | "scheduled" | "paid" | "active" | "inactive", { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "bg-success-soft text-success-soft-foreground" },
  submitted: { label: "Awaiting confirmation", className: "bg-warning/15 text-warning" },
  rejected: { label: "Not confirmed", className: "bg-destructive/15 text-destructive" },
  missed: { label: "Missed · penalty", className: "bg-destructive/15 text-destructive" },
  due: { label: "Due this week", className: "bg-accent/15 text-accent" },
  pending: { label: "Pending", className: "bg-warning/15 text-warning" },
  accepted: { label: "Accepted", className: "bg-success-soft text-success-soft-foreground" },
  scheduled: { label: "Scheduled", className: "bg-accent/15 text-accent" },
  paid: { label: "Paid", className: "bg-success-soft text-success-soft-foreground" },
  active: { label: "Active", className: "bg-success-soft text-success-soft-foreground" },
  inactive: { label: "Inactive", className: "bg-muted-foreground/15 text-muted-foreground" },
}

export function StatusBadge({ status, label }: { status: keyof typeof STATUS_STYLE; label?: string }) {
  const s = STATUS_STYLE[status]
  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold", s.className)}>
      {label ?? s.label}
    </span>
  )
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-border bg-card p-4", className)}>{children}</div>
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-base font-semibold text-foreground">{children}</h2>
      {action}
    </div>
  )
}

export function Stat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "gold" | "danger" | "success" }) {
  return (
    <div className="rounded-xl border border-border bg-card-elevated p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-lg font-bold tabular-nums",
          tone === "gold" && "text-accent",
          tone === "danger" && "text-destructive",
          tone === "success" && "text-primary",
        )}
      >
        {value}
      </p>
    </div>
  )
}

export type ActionItem = { href: string; label: string; hint: string; icon: LucideIcon; badge?: number }

export function ActionGrid({ items }: { items: ActionItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {items.map(({ href, label, hint, icon: Icon, badge }) => (
        <li key={href}>
          <Link
            href={href}
            className="relative flex h-full min-h-28 flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-accent/50 active:bg-card-elevated focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">{label}</span>
              <span className="block text-xs text-muted-foreground">{hint}</span>
            </span>
            {badge ? (
              <span className="absolute right-3 top-3 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                {badge}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function LinkRow({ href, icon: Icon, label, hint }: { href: string; icon: LucideIcon; label: string; hint?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl px-1 py-3 hover:bg-card-elevated">
      <Icon className="size-5 text-accent" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
      </span>
      <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
    </Link>
  )
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "gold" | "outline" | "danger" }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "gold" && "bg-accent text-accent-foreground hover:bg-accent/90",
        variant === "outline" && "border border-border bg-card-elevated text-foreground hover:border-accent/50",
        variant === "danger" && "border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20",
        className,
      )}
    />
  )
}

export const inputClass =
  "min-h-12 w-full rounded-xl border border-border bg-card-elevated px-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
