"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldCheck, Smartphone, UserRound } from "lucide-react"
import { BrandHeading } from "@/components/brand"
import { useDemoStore } from "@/components/demo-store"

export default function HomePage() {
  const { switchUser } = useDemoStore()
  const router = useRouter()

  function open(memberId: string, href: string) {
    switchUser(memberId)
    router.push(href)
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pb-10 pt-[max(3rem,env(safe-area-inset-top))]">
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <BrandHeading large />

        <div className="w-full space-y-3">
          <div className="rounded-xl border border-accent/40 bg-accent/10 p-3 text-center text-sm text-accent">
            <strong>Demo preview.</strong> Sign-in is not connected yet. Choose a test account below. All data is test data and nothing is saved.
          </div>
          <button
            type="button"
            onClick={() => open("u8", "/member")}
            className="flex min-h-16 w-full items-center gap-4 rounded-2xl bg-primary px-5 text-left text-primary-foreground"
          >
            <UserRound className="size-6" aria-hidden="true" />
            <span>
              <span className="block font-semibold">Member dashboard</span>
              <span className="block text-sm opacity-85">Test as Ronald Kato · MM-0008</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => open("u1", "/admin")}
            className="flex min-h-16 w-full items-center gap-4 rounded-2xl border border-accent/50 bg-card px-5 text-left"
          >
            <ShieldCheck className="size-6 text-accent" aria-hidden="true" />
            <span>
              <span className="block font-semibold">Admin dashboard</span>
              <span className="block text-sm text-muted-foreground">Test as Sarah Namubiru · Administrator</span>
            </span>
          </button>
        </div>
      </div>

      <Link href="/install" className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-accent">
        <Smartphone className="size-4" aria-hidden="true" />
        How to install on your Android phone
      </Link>
    </main>
  )
}
