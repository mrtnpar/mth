import type { ReactNode } from 'react'
import { BookingProvider } from '@/contexts/BookingContext'

export default function BookingLayout({ children }: { children: ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>
}
