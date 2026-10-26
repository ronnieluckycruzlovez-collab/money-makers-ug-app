import { WEEKLY_CONTRIBUTION, type PaymentDay, type Role } from "./rules"

// Everything in this file is DEMO DATA for testing the design. It is not real group records.

export type Member = {
  id: string
  memberId: string
  name: string
  phone: string | null
  role: Role
  status: "active" | "inactive"
  avatar: string | null
  paymentDay: PaymentDay
  joined: string
}

export type Week = { id: string; label: string; start: string; current?: boolean }

export type ContributionStatus = "submitted" | "confirmed" | "rejected"

export type Contribution = {
  id: string
  memberId: string
  weekId: string
  amount: number
  method: "MTN Mobile Money" | "Airtel Money" | "Cash"
  reference: string
  status: ContributionStatus
  submittedOn: string
  reviewedBy?: string
  note?: string
}

export type Payout = {
  id: string
  month: string
  recipientId: string
  amount: number
  status: "scheduled" | "confirmed" | "paid"
  date: string
}

export type Invite = {
  id: string
  code: string
  name: string
  phone: string | null
  status: "pending" | "accepted"
  createdOn: string
  acceptedMemberId?: string
}

export type Audience = "all" | "staff" | string

export type AppNotification = {
  id: string
  to: Audience
  title: string
  body: string
  date: string
  readBy: string[]
}

export type Activity = {
  id: string
  to: Audience
  title: string
  detail: string
  amount?: number
  direction?: "in" | "out"
  date: string
}

export const WEEKS: Week[] = [
  { id: "2026-W41", label: "5 – 9 Oct", start: "2026-10-05" },
  { id: "2026-W42", label: "12 – 16 Oct", start: "2026-10-12" },
  { id: "2026-W43", label: "19 – 23 Oct", start: "2026-10-19" },
  { id: "2026-W44", label: "26 – 30 Oct", start: "2026-10-26", current: true },
]

export const CURRENT_WEEK = WEEKS[WEEKS.length - 1]

export const seedMembers: Member[] = [
  { id: "u1", memberId: "MM-0001", name: "Sarah Namubiru", phone: "+256 700 000 101", role: "admin", status: "active", avatar: null, paymentDay: "Monday", joined: "Jan 2024" },
  { id: "u2", memberId: "MM-0002", name: "David Okello", phone: "+256 700 000 102", role: "cashier", status: "active", avatar: null, paymentDay: "Tuesday", joined: "Jan 2024" },
  { id: "u3", memberId: "MM-0003", name: "Grace Nambi", phone: "+256 700 000 103", role: "member", status: "active", avatar: null, paymentDay: "Wednesday", joined: "Feb 2024" },
  { id: "u4", memberId: "MM-0004", name: "Peter Ssemwanga", phone: "+256 700 000 104", role: "member", status: "active", avatar: null, paymentDay: "Thursday", joined: "Feb 2024" },
  { id: "u5", memberId: "MM-0005", name: "Agnes Achieng", phone: null, role: "member", status: "active", avatar: null, paymentDay: "Friday", joined: "Mar 2024" },
  { id: "u6", memberId: "MM-0006", name: "Joseph Mugisha", phone: "+256 700 000 106", role: "member", status: "inactive", avatar: null, paymentDay: "Monday", joined: "Mar 2024" },
  { id: "u8", memberId: "MM-0008", name: "Ronald Kato", phone: "+256 700 000 108", role: "member", status: "active", avatar: "/images/avatar.png", paymentDay: "Wednesday", joined: "Mar 2024" },
]

function c(id: string, memberId: string, weekId: string, status: ContributionStatus, method: Contribution["method"], reference: string, submittedOn: string, reviewedBy?: string): Contribution {
  return { id, memberId, weekId, amount: WEEKLY_CONTRIBUTION, method, reference, status, submittedOn, reviewedBy }
}

export const seedContributions: Contribution[] = [
  c("c1", "u1", "2026-W41", "confirmed", "MTN Mobile Money", "MP2610051", "5 Oct", "u2"),
  c("c2", "u2", "2026-W41", "confirmed", "Airtel Money", "AT2610061", "6 Oct", "u1"),
  c("c3", "u3", "2026-W41", "confirmed", "Cash", "CASH-0041", "7 Oct", "u2"),
  c("c4", "u4", "2026-W41", "confirmed", "MTN Mobile Money", "MP2610081", "8 Oct", "u2"),
  c("c5", "u8", "2026-W41", "confirmed", "MTN Mobile Money", "MP2610071", "7 Oct", "u2"),
  c("c6", "u1", "2026-W42", "confirmed", "MTN Mobile Money", "MP2610121", "12 Oct", "u2"),
  c("c7", "u2", "2026-W42", "confirmed", "Airtel Money", "AT2610131", "13 Oct", "u1"),
  c("c8", "u3", "2026-W42", "confirmed", "Cash", "CASH-0042", "14 Oct", "u2"),
  c("c9", "u5", "2026-W42", "confirmed", "Cash", "CASH-0043", "16 Oct", "u2"),
  c("c10", "u1", "2026-W43", "confirmed", "MTN Mobile Money", "MP2610191", "19 Oct", "u2"),
  c("c11", "u2", "2026-W43", "confirmed", "Airtel Money", "AT2610201", "20 Oct", "u1"),
  c("c12", "u4", "2026-W43", "confirmed", "MTN Mobile Money", "MP2610221", "22 Oct", "u2"),
  c("c13", "u5", "2026-W43", "confirmed", "Cash", "CASH-0044", "23 Oct", "u2"),
  c("c14", "u8", "2026-W43", "confirmed", "MTN Mobile Money", "MP2610211", "21 Oct", "u2"),
  c("c15", "u1", "2026-W44", "confirmed", "MTN Mobile Money", "MP2610261", "26 Oct", "u2"),
  c("c16", "u3", "2026-W44", "submitted", "Airtel Money", "AT2610262", "26 Oct"),
]

export const seedPayouts: Payout[] = [
  { id: "p1", month: "August 2026", recipientId: "u3", amount: 72_000, status: "paid", date: "28 Aug 2026" },
  { id: "p2", month: "September 2026", recipientId: "u4", amount: 72_000, status: "paid", date: "25 Sep 2026" },
  { id: "p3", month: "October 2026", recipientId: "u2", amount: 72_000, status: "confirmed", date: "30 Oct 2026" },
  { id: "p4", month: "November 2026", recipientId: "u8", amount: 72_000, status: "scheduled", date: "27 Nov 2026" },
  { id: "p5", month: "December 2026", recipientId: "u5", amount: 72_000, status: "scheduled", date: "18 Dec 2026" },
]

export const seedInvites: Invite[] = [
  { id: "i1", code: "DEMO7K3QX2", name: "Brenda Atim", phone: "+256 700 000 109", status: "pending", createdOn: "24 Oct" },
  { id: "i2", code: "DEMOR8M4ZP", name: "Agnes Achieng", phone: null, status: "accepted", createdOn: "2 Mar", acceptedMemberId: "u5" },
]

export const seedNotifications: AppNotification[] = [
  { id: "n1", to: "all", title: "Weekly contribution due", body: "This week's UGX 3,000 is due by Friday 30 Oct.", date: "26 Oct", readBy: [] },
  { id: "n2", to: "u8", title: "Payment confirmed", body: "Your UGX 3,000 for 19 – 23 Oct was confirmed by the cashier.", date: "21 Oct", readBy: [] },
  { id: "n3", to: "u8", title: "Penalty added", body: "No payment was received for 12 – 16 Oct. A UGX 2,500 penalty was added.", date: "17 Oct", readBy: ["u8"] },
  { id: "n4", to: "staff", title: "Payment waiting for confirmation", body: "Grace Nambi submitted reference AT2610262.", date: "26 Oct", readBy: [] },
  { id: "n5", to: "all", title: "Payout schedule updated", body: "November payout is scheduled for 27 Nov 2026.", date: "20 Oct", readBy: [] },
]

export const seedActivity: Activity[] = [
  { id: "a1", to: "staff", title: "Payment submitted", detail: "Grace Nambi · AT2610262", amount: 3_000, direction: "in", date: "26 Oct" },
  { id: "a2", to: "u1", title: "Contribution confirmed", detail: "26 – 30 Oct · MTN Mobile Money", amount: 3_000, direction: "in", date: "26 Oct" },
  { id: "a3", to: "all", title: "October payout confirmed", detail: "Scheduled for 30 Oct 2026", amount: 72_000, direction: "out", date: "25 Oct" },
  { id: "a4", to: "u8", title: "Contribution confirmed", detail: "19 – 23 Oct · MTN Mobile Money", amount: 3_000, direction: "in", date: "21 Oct" },
  { id: "a5", to: "u8", title: "Penalty added", detail: "Missed 12 – 16 Oct", amount: 2_500, direction: "out", date: "17 Oct" },
  { id: "a6", to: "staff", title: "Invitation sent", detail: "Brenda Atim", date: "24 Oct" },
]
