import type { ReactNode } from 'react'

type BookingSectionTitleProps = {
  children: ReactNode
  className?: string
}

export default function BookingSectionTitle({
  children,
  className,
}: BookingSectionTitleProps) {
  const base = 'text-body font-semibold text-ink'

  return <p className={`${base} ${className ?? ''}`.trim()}>{children}</p>
}
