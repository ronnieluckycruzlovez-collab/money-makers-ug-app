import { TopBar } from "@/components/top-bar"
import { MemberProfile } from "@/components/member-profile"
import { BalanceSummary } from "@/components/balance-summary"
import { QuickActions } from "@/components/quick-actions"
import { RecentActivity } from "@/components/recent-activity"

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background">
      <TopBar />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-5">
        <MemberProfile />
        <BalanceSummary />
        <QuickActions />
        <RecentActivity />
      </main>
    </div>
  )
}
