import Image from "next/image"
import { Bell } from "lucide-react"

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <Image src="/icon-192.png" alt="" width={32} height={32} className="rounded-lg" priority />
          <h1 className="text-base font-bold tracking-[0.18em] text-foreground">
            MONEY <span className="text-accent">MAKERS</span>
          </h1>
        </div>
        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          aria-label="Notifications, 2 unread"
        >
          <Bell className="size-5" aria-hidden="true" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent ring-2 ring-background" />
        </button>
      </div>
    </header>
  )
}
