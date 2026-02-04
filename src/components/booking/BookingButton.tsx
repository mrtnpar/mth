import type { ButtonHTMLAttributes, ReactNode } from 'react'

type BookingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export default function BookingButton({
  children,
  className,
  type = 'button',
  ...props
}: BookingButtonProps) {
  const base =
    'rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-primary/70 disabled:opacity-60 disabled:shadow-none disabled:hover:bg-primary/70'

  return (
    <button type={type} className={`${base} ${className ?? ''}`.trim()} {...props}>
      {children}
    </button>
  )
}
