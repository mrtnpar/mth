import type { ReactNode } from 'react'

type BookingCardProps = {
  children: ReactNode
  className?: string
}

export default function BookingCard({ children, className }: BookingCardProps) {
  const base =
    'rounded-2xl border border-border bg-surface shadow-card'

  return <div className={`${base} ${className ?? ''}`.trim()}>{children}</div>
}
