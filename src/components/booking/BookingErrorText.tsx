import type { HTMLAttributes } from 'react'

type BookingErrorTextProps = HTMLAttributes<HTMLParagraphElement>

export default function BookingErrorText({
  children,
  className,
  ...props
}: BookingErrorTextProps) {
  const base = 'mt-1 text-xs text-danger'

  return (
    <p className={`${base} ${className ?? ''}`.trim()} {...props}>
      {children}
    </p>
  )
}
