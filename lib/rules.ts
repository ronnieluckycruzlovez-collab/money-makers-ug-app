export const WEEKLY_CONTRIBUTION = 3_000
export const MISSED_PAYMENT_PENALTY = 2_500
export const PAYMENT_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const

export type PaymentDay = (typeof PAYMENT_DAYS)[number]
export type Role = "admin" | "cashier" | "member"

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrator",
  cashier: "Cashier",
  member: "Member",
}

export function canConfirmPayments(role: Role) {
  return role === "admin" || role === "cashier"
}

export function canManageGroup(role: Role) {
  return role === "admin"
}

export function formatUGX(amount: number) {
  return `UGX ${amount.toLocaleString("en-US")}`
}

export const PENALTY_RULE_TEXT =
  "Each member pays UGX 3,000 every week. Payment is due between Monday and Friday, on or before your assigned day. If no payment is received by Friday, a UGX 2,500 penalty is added."
