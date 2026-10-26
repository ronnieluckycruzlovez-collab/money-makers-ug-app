import Image from "next/image"
import { cn } from "@/lib/utils"

export function BrandMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
      priority
    />
  )
}

export function BrandHeading({ large = false }: { large?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", large && "flex-col text-center")}>
      <BrandMark size={large ? 96 : 36} />
      <div className="leading-tight">
        <p className={cn("font-extrabold tracking-wide text-accent", large ? "text-3xl" : "text-base")}>MONEY MAKERS</p>
        <p className={cn("text-muted-foreground", large ? "mt-1 text-base" : "text-xs")}>Group Savings &amp; Management</p>
      </div>
    </div>
  )
}
