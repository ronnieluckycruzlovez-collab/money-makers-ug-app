"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import {
  CURRENT_WEEK,
  WEEKS,
  seedActivity,
  seedContributions,
  seedInvites,
  seedMembers,
  seedNotifications,
  seedPayouts,
  type Activity,
  type AppNotification,
  type Audience,
  type Contribution,
  type Invite,
  type Member,
  type Payout,
} from "@/lib/demo-seed"
import { MISSED_PAYMENT_PENALTY, WEEKLY_CONTRIBUTION, canConfirmPayments, canManageGroup, formatUGX } from "@/lib/rules"

export type WeekStatus = "confirmed" | "submitted" | "rejected" | "missed" | "due"

type Result<T = undefined> = { ok: true; value?: T } | { ok: false; error: string }

type State = {
  currentMemberId: string
  justJoined: boolean
  members: Member[]
  contributions: Contribution[]
  payouts: Payout[]
  invites: Invite[]
  notifications: AppNotification[]
  activity: Activity[]
}

const initialState: State = {
  currentMemberId: "u8",
  justJoined: false,
  members: seedMembers,
  contributions: seedContributions,
  payouts: seedPayouts,
  invites: seedInvites,
  notifications: seedNotifications,
  activity: seedActivity,
}

function today() {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
function generateInviteCode() {
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("")
}

function weekStatusFor(contributions: Contribution[], memberId: string, weekId: string): WeekStatus {
  const records = contributions.filter((c) => c.memberId === memberId && c.weekId === weekId)
  if (records.some((r) => r.status === "confirmed")) return "confirmed"
  if (records.some((r) => r.status === "submitted")) return "submitted"
  const isCurrent = weekId === CURRENT_WEEK.id
  if (records.some((r) => r.status === "rejected")) return isCurrent ? "rejected" : "missed"
  return isCurrent ? "due" : "missed"
}

function isVisibleTo(to: Audience, member: Member) {
  if (to === "all") return true
  if (to === "staff") return canConfirmPayments(member.role)
  return to === member.id
}

function useDemoStoreValue() {
  const [state, setState] = useState<State>(initialState)

  const me = state.members.find((m) => m.id === state.currentMemberId) ?? state.members[0]
  const isStaff = canConfirmPayments(me.role)
  const isAdmin = canManageGroup(me.role)

  const memberById = useCallback((id: string) => state.members.find((m) => m.id === id), [state.members])

  const weekStatus = useCallback(
    (memberId: string, weekId: string) => weekStatusFor(state.contributions, memberId, weekId),
    [state.contributions],
  )

  const memberSummary = useCallback(
    (memberId: string) => {
      const confirmed = state.contributions.filter((c) => c.memberId === memberId && c.status === "confirmed")
      const statuses = WEEKS.map((w) => weekStatusFor(state.contributions, memberId, w.id))
      const missed = statuses.filter((s) => s === "missed").length
      const dueNow = statuses.filter((s) => s === "due" || s === "rejected").length
      return {
        savings: confirmed.reduce((sum, c) => sum + c.amount, 0),
        confirmedCount: confirmed.length,
        pendingCount: statuses.filter((s) => s === "submitted").length,
        outstanding: (missed + dueNow) * WEEKLY_CONTRIBUTION,
        penalties: missed * MISSED_PAYMENT_PENALTY,
        missed,
      }
    },
    [state.contributions],
  )

  const groupSummary = useMemo(() => {
    const active = state.members.filter((m) => m.status === "active")
    const totals = active.map((m) => memberSummary(m.id))
    return {
      activeMembers: active.length,
      savings: state.contributions.filter((c) => c.status === "confirmed").reduce((s, c) => s + c.amount, 0),
      confirmedCount: state.contributions.filter((c) => c.status === "confirmed").length,
      awaitingCount: state.contributions.filter((c) => c.status === "submitted").length,
      outstanding: totals.reduce((s, t) => s + t.outstanding, 0),
      penalties: totals.reduce((s, t) => s + t.penalties, 0),
    }
  }, [state.members, state.contributions, memberSummary])

  const myNotifications = useMemo(
    () => state.notifications.filter((n) => isVisibleTo(n.to, me)),
    [state.notifications, me],
  )
  const myActivity = useMemo(() => state.activity.filter((a) => isVisibleTo(a.to, me)), [state.activity, me])
  const unreadCount = myNotifications.filter((n) => !n.readBy.includes(me.id)).length

  const switchUser = useCallback((memberId: string) => {
    setState((s) => ({ ...s, currentMemberId: memberId, justJoined: false }))
  }, [])

  const dismissWelcome = useCallback(() => setState((s) => ({ ...s, justJoined: false })), [])

  const submitContribution = useCallback(
    (input: { weekIds: string[]; method: Contribution["method"]; reference: string }): Result => {
      const reference = input.reference.trim().toUpperCase()
      if (input.weekIds.length === 0) return { ok: false, error: "Choose at least one week to pay for." }
      if (reference.length < 4 || reference.length > 30 || !/^[A-Z0-9-]+$/.test(reference)) {
        return { ok: false, error: "Enter the transaction reference from your payment message (letters and numbers only)." }
      }
      const date = today()
      setState((s) => {
        const blocked = input.weekIds.filter((w) => {
          const st = weekStatusFor(s.contributions, s.currentMemberId, w)
          return st === "confirmed" || st === "submitted"
        })
        const weekIds = input.weekIds.filter((w) => !blocked.includes(w))
        const self = s.members.find((m) => m.id === s.currentMemberId)!
        const records: Contribution[] = weekIds.map((weekId) => ({
          id: newId("c"),
          memberId: s.currentMemberId,
          weekId,
          amount: WEEKLY_CONTRIBUTION,
          method: input.method,
          reference,
          status: "submitted",
          submittedOn: date,
        }))
        return {
          ...s,
          contributions: [...s.contributions, ...records],
          activity: [
            { id: newId("a"), to: s.currentMemberId, title: "Payment submitted", detail: `${reference} · awaiting confirmation`, amount: records.length * WEEKLY_CONTRIBUTION, direction: "in", date },
            { id: newId("a"), to: "staff", title: "Payment submitted", detail: `${self.name} · ${reference}`, amount: records.length * WEEKLY_CONTRIBUTION, direction: "in", date },
            ...s.activity,
          ],
          notifications: [
            { id: newId("n"), to: "staff", title: "Payment waiting for confirmation", body: `${self.name} submitted reference ${reference} for ${formatUGX(records.length * WEEKLY_CONTRIBUTION)}.`, date, readBy: [] },
            ...s.notifications,
          ],
        }
      })
      return { ok: true }
    },
    [],
  )

  const reviewContribution = useCallback(
    (contributionId: string, decision: "confirmed" | "rejected", note?: string): Result => {
      const record = state.contributions.find((c) => c.id === contributionId)
      if (!record) return { ok: false, error: "Payment not found." }
      if (!canConfirmPayments(me.role)) return { ok: false, error: "Only administrators and cashiers can confirm payments." }
      if (record.memberId === me.id) return { ok: false, error: "You cannot confirm your own payment. Ask another administrator or cashier." }
      if (record.status !== "submitted") return { ok: false, error: "This payment has already been reviewed." }
      const date = today()
      const week = WEEKS.find((w) => w.id === record.weekId)?.label ?? record.weekId
      setState((s) => ({
        ...s,
        contributions: s.contributions.map((c) => (c.id === contributionId ? { ...c, status: decision, reviewedBy: me.id, note } : c)),
        activity: [
          { id: newId("a"), to: record.memberId, title: decision === "confirmed" ? "Contribution confirmed" : "Payment not confirmed", detail: `${week} · ${record.reference}`, amount: record.amount, direction: "in", date },
          ...s.activity,
        ],
        notifications: [
          {
            id: newId("n"),
            to: record.memberId,
            title: decision === "confirmed" ? "Payment confirmed" : "Payment not confirmed",
            body:
              decision === "confirmed"
                ? `Your ${formatUGX(record.amount)} for ${week} was confirmed.`
                : `Your payment ${record.reference} for ${week} could not be confirmed.${note ? ` Reason: ${note}` : ""} Please check and submit again.`,
            date,
            readBy: [],
          },
          ...s.notifications,
        ],
      }))
      return { ok: true }
    },
    [state.contributions, me],
  )

  const createInvite = useCallback(
    (input: { name: string; phone: string | null }): Result<Invite> => {
      if (!canManageGroup(me.role)) return { ok: false, error: "Only administrators can invite members." }
      const name = input.name.trim().replace(/\s+/g, " ")
      if (name.length < 2 || name.length > 60) return { ok: false, error: "Enter the member's full name." }
      let phone: string | null = null
      if (input.phone !== null) {
        const digits = input.phone.replace(/\D/g, "")
        const local = digits.startsWith("256") ? digits.slice(3) : digits.replace(/^0/, "")
        if (!/^7\d{8}$/.test(local)) return { ok: false, error: "Enter a valid Ugandan phone number, e.g. 0772 123 456." }
        phone = `+256 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`
      }
      const invite: Invite = { id: newId("i"), code: generateInviteCode(), name, phone, status: "pending", createdOn: today() }
      setState((s) => ({
        ...s,
        invites: [invite, ...s.invites],
        activity: [{ id: newId("a"), to: "staff", title: "Invitation created", detail: name, date: invite.createdOn }, ...s.activity],
      }))
      return { ok: true, value: invite }
    },
    [me.role],
  )

  const findInvite = useCallback((code: string) => state.invites.find((i) => i.code === code.toUpperCase()), [state.invites])

  const acceptInvite = useCallback(
    (code: string, input: { name: string; phone: string | null }): Result<Member> => {
      const invite = state.invites.find((i) => i.code === code.toUpperCase())
      if (!invite) return { ok: false, error: "This invitation link is not valid." }
      if (invite.status !== "pending") return { ok: false, error: "This invitation has already been used." }
      const name = input.name.trim().replace(/\s+/g, " ")
      if (name.length < 2) return { ok: false, error: "Enter your full name." }
      const nextNumber = Math.max(...state.members.map((m) => Number(m.memberId.slice(3)))) + 1
      const member: Member = {
        id: newId("u"),
        memberId: `MM-${String(nextNumber).padStart(4, "0")}`,
        name,
        phone: input.phone ?? invite.phone,
        role: "member",
        status: "active",
        avatar: null,
        paymentDay: "Friday",
        joined: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      }
      const date = today()
      setState((s) => ({
        ...s,
        currentMemberId: member.id,
        justJoined: true,
        members: [...s.members, member],
        invites: s.invites.map((i) => (i.id === invite.id ? { ...i, status: "accepted", acceptedMemberId: member.id } : i)),
        activity: [{ id: newId("a"), to: "staff", title: "Invitation accepted", detail: `${name} joined as ${member.memberId}`, date }, ...s.activity],
        notifications: [
          { id: newId("n"), to: member.id, title: "Welcome to MONEY MAKERS", body: `Your member ID is ${member.memberId}. Your weekly contribution is UGX 3,000, due Monday to Friday.`, date, readBy: [] },
          { id: newId("n"), to: "staff", title: "New member joined", body: `${name} accepted their invitation.`, date, readBy: [] },
          ...s.notifications,
        ],
      }))
      return { ok: true, value: member }
    },
    [state.invites, state.members],
  )

  const confirmPayout = useCallback(
    (payoutId: string): Result => {
      if (!canManageGroup(me.role)) return { ok: false, error: "Only administrators can confirm payouts." }
      const payout = state.payouts.find((p) => p.id === payoutId)
      if (!payout || payout.status !== "scheduled") return { ok: false, error: "This payout cannot be confirmed." }
      const date = today()
      setState((s) => ({
        ...s,
        payouts: s.payouts.map((p) => (p.id === payoutId ? { ...p, status: "confirmed" } : p)),
        activity: [{ id: newId("a"), to: "all", title: `${payout.month} payout confirmed`, detail: `Scheduled for ${payout.date}`, amount: payout.amount, direction: "out", date }, ...s.activity],
        notifications: [{ id: newId("n"), to: payout.recipientId, title: "Your payout is confirmed", body: `${formatUGX(payout.amount)} is confirmed for ${payout.date}.`, date, readBy: [] }, ...s.notifications],
      }))
      return { ok: true }
    },
    [me.role, state.payouts],
  )

  const markAllRead = useCallback(() => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.readBy.includes(s.currentMemberId) ? n : { ...n, readBy: [...n.readBy, s.currentMemberId] })),
    }))
  }, [])

  return {
    ...state,
    me,
    isStaff,
    isAdmin,
    memberById,
    weekStatus,
    memberSummary,
    groupSummary,
    myNotifications,
    myActivity,
    unreadCount,
    switchUser,
    dismissWelcome,
    submitContribution,
    reviewContribution,
    createInvite,
    findInvite,
    acceptInvite,
    confirmPayout,
    markAllRead,
  }
}

type DemoStore = ReturnType<typeof useDemoStoreValue>

const DemoStoreContext = createContext<DemoStore | null>(null)

export function DemoStoreProvider({ children }: { children: React.ReactNode }) {
  const value = useDemoStoreValue()
  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext)
  if (!ctx) throw new Error("useDemoStore must be used inside DemoStoreProvider")
  return ctx
}
