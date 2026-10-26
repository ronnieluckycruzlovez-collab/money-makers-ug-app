export const member = {
  name: "Ronald Kato",
  memberId: "MM-0008",
  phone: "+256 772 418 905",
  role: "Treasurer",
  status: "Active" as const,
  avatar: "/images/avatar.png",
  joined: "Mar 2024",
}

export const balance = {
  totalSavings: 2_450_000,
  thisMonth: 150_000,
  monthlyTarget: 200_000,
  groupFund: 18_750_000,
  nextPayout: { date: "15 Nov 2026", amount: 1_200_000 },
}

export type Activity = {
  id: string
  title: string
  description: string
  amount: number
  direction: "in" | "out"
  date: string
}

export const recentActivity: Activity[] = [
  { id: "a1", title: "Monthly contribution", description: "Mobile Money · MTN", amount: 50_000, direction: "in", date: "24 Oct" },
  { id: "a2", title: "Payout to Grace Nambi", description: "Cycle 9 rotation", amount: 1_200_000, direction: "out", date: "20 Oct" },
  { id: "a3", title: "Weekly contribution", description: "Mobile Money · Airtel", amount: 50_000, direction: "in", date: "17 Oct" },
  { id: "a4", title: "Late fee waived", description: "Approved by chairperson", amount: 5_000, direction: "in", date: "12 Oct" },
  { id: "a5", title: "Weekly contribution", description: "Cash · Group meeting", amount: 50_000, direction: "in", date: "10 Oct" },
]

export function formatUGX(amount: number) {
  return `UGX ${amount.toLocaleString("en-US")}`
}
