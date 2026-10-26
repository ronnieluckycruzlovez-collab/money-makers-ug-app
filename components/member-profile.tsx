import Image from "next/image"
import { Phone, ShieldCheck } from "lucide-react"
import { member } from "@/lib/data"

export function MemberProfile() {
  return (
    <section aria-labelledby="member-name" className="flex items-center gap-4">
      <div className="relative shrink-0">
        <Image
          src={member.avatar}
          alt={`Profile photo of ${member.name}`}
          width={72}
          height={72}
          className="size-18 rounded-full object-cover ring-2 ring-primary ring-offset-2 ring-offset-background"
          priority
        />
        <span
          className="absolute bottom-0.5 right-0.5 size-4 rounded-full bg-primary ring-2 ring-background"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="member-name" className="truncate text-lg font-semibold text-foreground">
            {member.name}
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            {member.status}
          </span>
        </div>

        <dl className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
          <div className="flex items-center">
            <dt className="sr-only">Member ID</dt>
            <dd className="font-mono text-xs tracking-wide text-accent">{member.memberId}</dd>
          </div>
          <div className="flex items-center">
            <dt className="sr-only">Role</dt>
            <dd className="inline-flex items-center gap-1">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              {member.role}
            </dd>
          </div>
          <div className="flex basis-full items-center gap-1.5">
            <dt>
              <Phone className="size-3.5" aria-hidden="true" />
              <span className="sr-only">Phone number</span>
            </dt>
            <dd className="font-mono text-xs">{member.phone}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
